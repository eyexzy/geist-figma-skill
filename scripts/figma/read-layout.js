// Read-only: exact layout of a component variant, for use_figma. Set PAGE to the component page ('↳ Fieldset'), SET to the component set and VARIANT to a variant name, or '' for the default variant. Changes nothing.
// Prints each layer with its size, auto layout, padding and gap, and the variables, styles, radius and effects bound to it. Use it when the guidelines do not give a size or a binding.
figma.skipInvisibleInstanceChildren = false;
const PAGE = '↳ Button';
const SET = 'Button';
const VARIANT = '';
const MAX_DEPTH = 6;
const MAX_LINES = 140;

const page = figma.root.children.find(p => p.name === PAGE);
if (!page) throw new Error(`Page "${PAGE}" not found.`);
await page.loadAsync();
const set = page.findAllWithCriteria({ types: ['COMPONENT_SET'] }).find(s => s.name === SET);
if (!set) throw new Error(`Set "${SET}" not found on "${PAGE}". Sets: ${page.findAllWithCriteria({ types: ['COMPONENT_SET'] }).map(s => s.name).join(', ')}`);
const variant = VARIANT ? set.children.find(c => c.name === VARIANT) : set.defaultVariant;
if (!variant) throw new Error(`Variant "${VARIANT}" not found. Variants: ${set.children.slice(0, 12).map(c => c.name).join(' | ')} ...`);

const names = new Map();
const vname = async alias => { if (!alias) return null; if (!names.has(alias.id)) { const v = await figma.variables.getVariableByIdAsync(alias.id); names.set(alias.id, v ? v.name : alias.id); } return names.get(alias.id); };
const lines = [];

async function paintBindings(paints, label) {
  if (!Array.isArray(paints)) return '';
  const out = [];
  for (const p of paints) {
    if (p.visible === false) continue;
    const b = p.boundVariables && p.boundVariables.color;
    out.push(b ? `${label} ${await vname(b)}` : p.type === 'SOLID' ? `${label} RAW` : `${label} ${p.type}`);
  }
  return out.join(', ');
}

async function line(n, depth) {
  if (lines.length >= MAX_LINES || depth > MAX_DEPTH) return;
  const parts = [`${'  '.repeat(depth)}${n.name} [${n.type}] ${Math.round(n.width)}x${Math.round(n.height)}`];
  if ('layoutMode' in n && n.layoutMode !== 'NONE') {
    parts.push(`${n.layoutMode} ${n.primaryAxisAlignItems}/${n.counterAxisAlignItems}`);
    const bv = n.boundVariables || {};
    const num = async (f, label) => { const v = n[f]; if (typeof v === 'number' && v > 0) parts.push(`${label} ${v}${bv[f] ? ' <- ' + await vname(bv[f]) : ''}`); };
    await num('itemSpacing', 'gap');
    for (const [f, l] of [['paddingLeft', 'padL'], ['paddingTop', 'padT'], ['paddingRight', 'padR'], ['paddingBottom', 'padB']]) await num(f, l);
  }
  if ('layoutSizingHorizontal' in n && n.parent && n.parent.type !== 'PAGE') parts.push(`size ${n.layoutSizingHorizontal}/${n.layoutSizingVertical}`);
  if (n.layoutPositioning === 'ABSOLUTE') parts.push('ABSOLUTE');
  if ('clipsContent' in n && n.clipsContent) parts.push('clip');
  if ('cornerRadius' in n && n.cornerRadius !== 0) { const b = n.boundVariables && n.boundVariables.topLeftRadius; parts.push(`radius ${n.cornerRadius === figma.mixed ? 'mixed' : n.cornerRadius}${b ? ' <- ' + await vname(b) : ''}`); }
  const f = await paintBindings(n.fills, 'fill'); if (f && n.type !== 'TEXT') parts.push(f);
  const s = await paintBindings(n.strokes, 'stroke'); if (s) parts.push(s);
  if ('effectStyleId' in n && n.effectStyleId) { const st = await figma.getStyleByIdAsync(n.effectStyleId); parts.push(`effect ${st ? st.name : n.effectStyleId}`); }
  else if (Array.isArray(n.effects) && n.effects.length) parts.push(`effects ${n.effects.map(e => e.type).join('+')} (no style)`);
  if (n.type === 'TEXT') {
    const ts = n.textStyleId && n.textStyleId !== figma.mixed ? await figma.getStyleByIdAsync(n.textStyleId) : null;
    parts.push(`text ${ts ? ts.name : 'no style'}`);
    const c = await paintBindings(n.fills, 'color'); if (c) parts.push(c);
  }
  lines.push(parts.join(' | '));
  if ('children' in n) for (const c of n.children) await line(c, depth + 1);
}
await line(variant, 0);
const text = lines.join('\n');
return `${SET} / ${variant.name} (${variant.id}) on ${PAGE}\n${text}${lines.length >= MAX_LINES ? '\n… more layers: raise MAX_LINES or MAX_DEPTH' : ''}`;
