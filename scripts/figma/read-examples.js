// Read-only: shows how the Examples of a component page are configured, for use_figma. Set PAGE to the page name ('↳ Modal'). Changes nothing.
// For every example it prints the instance, the properties that differ from the default (swap values as names), variables bound to properties and visibility,
// the layout of the frames around slot content, text, the wiring added in the example (clicks that set variables) and what each variable is for.
// Hidden layers of instances are read too (the setting below). If the content of an overlay whose open state is bound to a variable is still missing, read the component guidelines for it. The configuration of an example is a working one: build from it what the task needs, including its variables.
figma.skipInvisibleInstanceChildren = false;
const PAGE = '↳ Button';
const MAX_DEPTH = 7;
const MAX_UNITS = 14;
const MAX_CHARS = 18000;

const page = figma.root.children.find(p => p.name === PAGE);
if (!page) throw new Error(`Page "${PAGE}" not found. Pages: ${figma.root.children.filter(p => p.name.startsWith('↳ ')).map(p => p.name).join(', ')}`);
await page.loadAsync();
const doc = page.children.find(c => c.name === 'Documentation');
const ex = doc && doc.findOne(n => /^examples?$/i.test(n.name));
if (!ex) throw new Error(`No Examples frame on "${PAGE}".`);

const seen = new Map();
const note = v => { if (v && !seen.has(v.name)) seen.set(v.name, v); return v ? v.name : null; };
const varName = async alias => { if (!alias) return null; const v = await figma.variables.getVariableByIdAsync(alias.id); return v ? note(v) : alias.id; };
const setOf = async inst => { const m = await inst.getMainComponentAsync(); return m && m.parent && m.parent.type === 'COMPONENT_SET' ? m.parent : m; };

async function reactionsOf(n) {
  if (!('reactions' in n) || !n.reactions.length) return undefined;
  const out = [];
  for (const r of n.reactions) {
    const acts = [];
    for (const a of r.actions || (r.action ? [r.action] : [])) {
      // Variant changes on hover and click come from the component itself; only the wiring that was added in the example is reported.
      if (a.type === 'SET_VARIABLE') acts.push(`set ${note(await figma.variables.getVariableByIdAsync(a.variableId))}=${a.variableValue && a.variableValue.value}`);
      else if (a.type === 'CONDITIONAL') acts.push('conditional');
      else if (a.type === 'NODE' && a.navigation !== 'CHANGE_TO') acts.push(`${a.navigation || 'NODE'}${a.destinationId ? ' ' + ((await figma.getNodeByIdAsync(a.destinationId)) || {}).name : ''}`);
    }
    if (acts.length) out.push(`${r.trigger && r.trigger.type}: ${acts.join(', ')}`);
  }
  return out.length ? out : undefined;
}

async function propsOf(inst) {
  const set = await setOf(inst);
  const defs = set.componentPropertyDefinitions;
  const props = {};
  const bound = {};
  for (const [k, v] of Object.entries(inst.componentProperties)) {
    const d = defs[k];
    const bv = v.boundVariables && v.boundVariables.value;
    if (bv) bound[k.split('#')[0]] = await varName(bv);
    if (!d || String(v.value) === String(d.defaultValue)) continue;
    let val = v.value;
    if (d.type === 'INSTANCE_SWAP') { const n = await figma.getNodeByIdAsync(val); val = n ? n.name : val; }
    if (d.type === 'SLOT') continue;
    props[k.split('#')[0]] = val;
  }
  return { set: set.name, props, bound };
}

async function describe(n, depth) {
  if (depth > MAX_DEPTH || n.visible === false && !(n.boundVariables && n.boundVariables.visible)) return null;
  const o = { n: n.name };
  const bv = n.boundVariables && n.boundVariables.visible;
  if (bv) o.visibleBy = await varName(bv);
  if (n.type === 'TEXT') { o.text = n.characters.slice(0, 80); return o; }
  if (n.type === 'INSTANCE') {
    const p = await propsOf(n);
    o.set = p.set;
    if (Object.keys(p.props).length) o.props = p.props;
    if (Object.keys(p.bound).length) o.propsBoundTo = p.bound;
    const r = await reactionsOf(n); if (r) o.reactions = r;
    const kids = [];
    for (const c of n.children) {
      if (c.type === 'INSTANCE' || c.type === 'FRAME' || c.type === 'TEXT') {
        const d = await describe(c, depth + 1);
        if (d && (d.set || d.kids || d.text || d.visibleBy || d.reactions)) kids.push(d);
      }
    }
    const meaningful = kids.filter(k => k.props || k.propsBoundTo || k.reactions || k.visibleBy || k.text || k.kids);
    if (meaningful.length) o.kids = meaningful;
    return o;
  }
  if (n.type === 'FRAME' || n.type === 'GROUP' || n.type === 'SECTION' || n.type === 'COMPONENT') {
    if ('layoutMode' in n && n.layoutMode !== 'NONE') { o.layout = `${n.layoutMode} gap ${n.itemSpacing} pad ${n.paddingTop}/${n.paddingRight}/${n.paddingBottom}/${n.paddingLeft}`; }
    const r = await reactionsOf(n); if (r) o.reactions = r;
    const kids = [];
    for (const c of n.children) { const d = await describe(c, depth + 1); if (d) kids.push(d); }
    const meaningful = kids.filter(k => k.set || k.kids || k.text || k.visibleBy || k.reactions);
    if (!meaningful.length) return bv ? o : null;
    o.kids = meaningful;
    return o;
  }
  return null;
}

// Every child of the Examples frame except the header is one example block; frames keep the wiring (triggers, layout), instances keep the properties.
const units = [];
for (const c of ex.children) {
  if (c.name === 'Column Header' || units.length >= MAX_UNITS) continue;
  const d = await describe(c, 0);
  if (d) units.push(d);
}
const headings = ex.findAll(n => n.type === 'TEXT' && n.name === 'Heading').map(t => t.characters);
// What each variable is for, from its description in the file (the API returns descriptions HTML-escaped).
const unescape = t => t.replace(/&quot;/g, '"').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&');
const variables = {};
for (const [name, v] of seen) variables[name] = unescape((v.description || '').split(' | ')[0]);
const text = JSON.stringify({ page: PAGE, examplesFrame: ex.id, headings, units: units.length, variables, examples: units });
return text.length > MAX_CHARS ? text.slice(0, MAX_CHARS) + ' …TRUNCATED: raise MAX_CHARS, lower MAX_DEPTH or read one example by node id' : text;
