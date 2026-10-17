// Helpers for use_figma. Do not paste this whole file: run `node scripts/lookup.mjs helpers <names>` to print only the functions you need, with their dependencies.
// Resolution is by name. In the library file everything is read locally. In a file that uses the published library, components and styles are imported by the
// keys in GEIST_KEYS (print them with `node scripts/lookup.mjs keys ...`) and variables are found by name through figma.teamLibrary.

// Hidden layers of an instance (the panel and backdrop of a closed overlay, the list of a closed menu) are skipped unless this is off: read and edit them.
figma.skipInvisibleInstanceChildren = false;

const geistCache = { sets: new Map(), icons: null, vars: new Map(), local: null, library: new Map(), styles: new Map() };
const geistKeys = typeof GEIST_KEYS === 'undefined' ? { sets: {}, icons: {}, styles: {} } : GEIST_KEYS;
const geistRadius = { 0: 'none', 1: '1', 2: 'xs', 4: 'sm', 5: '5', 6: 'md', 8: 'lg', 10: '10', 12: 'xl', 14: '14', 16: '2xl', 24: '3xl', 9999: 'full' };

// Component set by name. Library file: found on its page. Elsewhere: imported by key from GEIST_KEYS.sets.
async function geistSet(name) {
  if (geistCache.sets.has(name)) return geistCache.sets.get(name);
  const ref = geistKeys.sets[name];
  if (!ref) throw new Error(`No reference for set "${name}". Run: node scripts/lookup.mjs keys set:${name}`);
  let set = null;
  const page = figma.root.children.find(p => p.name === ref.page);
  if (page) {
    await page.loadAsync();
    set = page.findAllWithCriteria({ types: ['COMPONENT_SET'] }).find(s => s.name === name) || null;
  }
  if (!set) set = await figma.importComponentSetByKeyAsync(ref.key);
  geistCache.sets.set(name, set);
  return set;
}

// Icon component by name.
async function geistIcon(name) {
  if (!geistCache.icons) {
    const page = figma.root.children.find(p => p.name === '↳ Icons');
    geistCache.icons = new Map();
    if (page) {
      await page.loadAsync();
      for (const c of page.findAllWithCriteria({ types: ['COMPONENT'] })) geistCache.icons.set(c.name, c);
    }
  }
  if (geistCache.icons.has(name)) return geistCache.icons.get(name);
  const key = geistKeys.icons[name];
  if (!key) throw new Error(`No key for icon "${name}". Look it up with: node scripts/lookup.mjs icon <word>, then run: node scripts/lookup.mjs keys icon:${name}`);
  const c = await figma.importComponentByKeyAsync(key);
  geistCache.icons.set(name, c);
  return c;
}

// Set properties by plain name (without the #id suffix). Variant: one of its options. Boolean and text: a value. Instance swap: an icon name.
async function geistSetProps(inst, props) {
  const main = await inst.getMainComponentAsync();
  const set = main.parent && main.parent.type === 'COMPONENT_SET' ? main.parent : main;
  const defs = set.componentPropertyDefinitions;
  const byName = {};
  for (const key of Object.keys(defs)) byName[key.split('#')[0]] = key;
  const todo = {};
  for (const [name, value] of Object.entries(props)) {
    const key = byName[name];
    if (!key) throw new Error(`"${set.name}" has no property "${name}". Properties: ${Object.keys(byName).join(', ')}`);
    const def = defs[key];
    if (def.type === 'VARIANT' && !def.variantOptions.includes(String(value))) throw new Error(`"${name}" of "${set.name}" accepts ${def.variantOptions.join(' | ')}, got "${value}"`);
    todo[key] = def.type === 'INSTANCE_SWAP' && typeof value === 'string' ? (await geistIcon(value)).id : def.type === 'VARIANT' ? String(value) : value;
  }
  inst.setProperties(todo);
  return inst;
}

// Instance of the default variant of a set, with properties applied by name.
async function geistInstance(set, props = {}) {
  const inst = set.defaultVariant.createInstance();
  if (Object.keys(props).length) await geistSetProps(inst, props);
  return inst;
}

// Properties of a nested part that the component exposes, for example geistNested(input, 'Label', { value: 'Email' }).
async function geistNested(inst, name, props) {
  const target = (inst.exposedInstances || []).find(n => n.name === name) || inst.findOne(n => n.type === 'INSTANCE' && n.name === name);
  if (!target) throw new Error(`No nested instance "${name}" in "${inst.name}". Exposed: ${(inst.exposedInstances || []).map(n => n.name).join(', ')}`);
  return await geistSetProps(target, props);
}

// Slot of an instance by name (children, content, rows, cells...). Drop layers into it with slot.appendChild; without a name, the first slot.
function geistSlot(inst, name) {
  const slots = [];
  const walk = n => { if (n.type === 'SLOT') slots.push(n); if ('children' in n) n.children.forEach(walk); };
  inst.children.forEach(walk);
  const slot = slots.find(n => !name || n.name === name);
  if (!slot) throw new Error(`No slot${name ? ` "${name}"` : ''} in "${inst.name}". Slots: ${slots.map(n => n.name).join(', ') || 'none'}`);
  return slot;
}

// Variable by name. The library file reads its own variables. Other files import from the published library.
async function geistVar(name, collection) {
  const cacheKey = (collection || '') + '|' + name;
  if (geistCache.vars.has(cacheKey)) return geistCache.vars.get(cacheKey);
  if (!geistCache.local) {
    const cols = await figma.variables.getLocalVariableCollectionsAsync();
    const colName = Object.fromEntries(cols.map(c => [c.id, c.name]));
    geistCache.local = new Map();
    for (const v of await figma.variables.getLocalVariablesAsync()) {
      const list = geistCache.local.get(v.name) || [];
      list.push({ v, collection: colName[v.variableCollectionId] });
      geistCache.local.set(v.name, list);
    }
  }
  let found = null;
  const local = (geistCache.local.get(name) || []).filter(x => !collection || x.collection === collection);
  if (local.length) {
    const pick = local.find(x => x.collection.startsWith('DS / Core')) || local[0];
    if (local.length > 1 && !collection && !pick.collection.startsWith('DS / Core')) throw new Error(`Variable "${name}" exists in ${local.map(x => x.collection).join(', ')}. Pass the collection as the second argument.`);
    found = pick.v;
  } else if (figma.teamLibrary) {
    const libs = (await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()).filter(c => !collection || c.name === collection);
    const hits = [];
    for (const lib of libs) {
      if (!geistCache.library.has(lib.key)) geistCache.library.set(lib.key, await figma.teamLibrary.getVariablesInLibraryCollectionAsync(lib.key));
      const hit = geistCache.library.get(lib.key).find(v => v.name === name);
      if (hit) hits.push({ hit, collection: lib.name });
    }
    const pick = hits.find(x => x.collection.startsWith('DS / Core')) || hits[0];
    if (hits.length > 1 && !collection && !pick.collection.startsWith('DS / Core')) throw new Error(`Variable "${name}" exists in ${hits.map(x => x.collection).join(', ')}. Pass the collection as the second argument.`);
    if (pick) found = await figma.variables.importVariableByKeyAsync(pick.hit.key);
  }
  if (!found) throw new Error(`Variable "${name}" not found${collection ? ` in "${collection}"` : ''}. Look it up with: node scripts/lookup.mjs token <words>. In a file that uses the library, the library must be enabled for the file.`);
  geistCache.vars.set(cacheKey, found);
  return found;
}

// Solid fill bound to a color variable, for example geistFill(frame, 'ds/background/100'). Works on text layers too.
async function geistFill(node, varName) {
  const v = await geistVar(varName);
  node.fills = [figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }, 'color', v)];
}

// Stroke bound to a color variable.
async function geistStroke(node, varName, weight = 1) {
  const v = await geistVar(varName);
  node.strokes = [figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }, 'color', v)];
  node.strokeWeight = weight;
}

// Number variable on a field: 'cornerRadius' (all corners), 'itemSpacing', 'paddingLeft' and so on.
async function geistNumber(node, field, varName) {
  const v = await geistVar(varName);
  const fields = field === 'cornerRadius' ? ['topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius'] : [field];
  for (const f of fields) node.setBoundVariable(f, v);
}

// Text, effect, paint or grid style by name: local in the library file, imported by key elsewhere.
async function geistStyle(kind, name) {
  const cacheKey = kind + '|' + name;
  if (geistCache.styles.has(cacheKey)) return geistCache.styles.get(cacheKey);
  const list = kind === 'text' ? await figma.getLocalTextStylesAsync() : kind === 'effect' ? await figma.getLocalEffectStylesAsync() : kind === 'grid' ? await figma.getLocalGridStylesAsync() : await figma.getLocalPaintStylesAsync();
  let style = list.find(s => s.name === name) || null;
  if (!style && geistKeys.styles[name]) style = await figma.importStyleByKeyAsync(geistKeys.styles[name]);
  if (!style) throw new Error(`${kind} style "${name}" not found. Look it up with: node scripts/lookup.mjs style <words>, then run: node scripts/lookup.mjs keys style:${name}`);
  geistCache.styles.set(cacheKey, style);
  return style;
}

// Text style by name; loads the font first.
async function geistTextStyle(textNode, name) {
  const style = await geistStyle('text', name);
  await figma.loadFontAsync(style.fontName);
  await textNode.setTextStyleIdAsync(style.id);
}

// Effect style by name, for example 'ds/shadow/menu'.
async function geistEffectStyle(node, name) {
  const style = await geistStyle('effect', name);
  await node.setEffectStyleIdAsync(style.id);
}

// Layout grid style by name, for example 'Layout/Page 1200'.
async function geistGrid(frame, name) {
  const style = await geistStyle('grid', name);
  await frame.setGridStyleIdAsync(style.id);
}

// Light or Dark for a frame and everything inside it.
async function geistTheme(frame, mode) {
  const sample = await geistVar('ds/background/100');
  const col = await figma.variables.getVariableCollectionByIdAsync(sample.variableCollectionId);
  const m = col.modes.find(x => x.name === mode);
  if (!m) throw new Error(`Mode "${mode}" not found in "${col.name}" (modes: ${col.modes.map(x => x.name).join(', ')}).`);
  frame.setExplicitVariableModeForCollection(col, m.modeId);
}

// Auto layout frame with bound tokens. Numbers are steps of tailwind/space; radius is a name (xl) or a number (12) from the ladder.
// Options: dir, gap, pad, padX, padY, fill, stroke, radius, effect, w and h ('fill' or a number), parent, clip, theme ('Light' or 'Dark'). Without fill the frame is transparent.
// A frame without theme follows the default mode of DS / Core Colors, which is Dark: pass theme: 'Light' on the root frame of a screen to get Light.
// Clip content is off unless clip is true or the frame carries an effect style: a material border (ds/shadow/*) is drawn only while Clip content is on, so keep the padding at least 4px there. The borders and rings of library components are effects drawn outside their edge, and a clipping frame cuts them.
async function geistFrame(name, o = {}) {
  const f = figma.createAutoLayout(o.dir || 'VERTICAL');
  f.name = name;
  f.fills = [];
  f.clipsContent = o.clip === true || (o.clip === undefined && !!o.effect);
  if (o.parent) o.parent.appendChild(f);
  const space = async (field, v) => {
    if (v === undefined) return;
    if (v === 0) { f[field] = 0; return; }
    await geistNumber(f, field, typeof v === 'number' ? `tailwind/space/${v}` : v);
  };
  await space('itemSpacing', o.gap);
  await space('paddingTop', o.padY ?? o.pad);
  await space('paddingBottom', o.padY ?? o.pad);
  await space('paddingLeft', o.padX ?? o.pad);
  await space('paddingRight', o.padX ?? o.pad);
  if (o.fill) await geistFill(f, o.fill);
  if (o.stroke) await geistStroke(f, o.stroke);
  if (o.radius !== undefined) {
    const r = typeof o.radius === 'number' ? geistRadius[o.radius] : o.radius;
    if (!r) throw new Error(`Radius ${o.radius} is not on the ladder: ${Object.keys(geistRadius).join(', ')}`);
    await geistNumber(f, 'cornerRadius', r.startsWith('tailwind/') ? r : `tailwind/radius/${r}`);
  }
  if (o.effect) await geistEffectStyle(f, o.effect);
  if (o.theme) await geistTheme(f, o.theme);
  if (typeof o.w === 'number') f.resize(o.w, f.height);
  if (typeof o.h === 'number') f.resize(f.width, o.h);
  if (o.parent) {
    if (o.w === 'fill') f.layoutSizingHorizontal = 'FILL';
    if (o.h === 'fill') f.layoutSizingVertical = 'FILL';
  }
  return f;
}

// Text layer with a library text style and a bound color. Options: style, color, w ('fill' wraps text to the parent width), align.
async function geistText(parent, characters, o = {}) {
  const t = figma.createText();
  parent.appendChild(t);
  await geistTextStyle(t, o.style || 'Copy/14');
  t.characters = characters;
  await geistFill(t, o.color || 'ds/gray/1000');
  if (o.align) t.textAlignHorizontal = o.align;
  if (o.w === 'fill') { t.layoutSizingHorizontal = 'FILL'; t.textAutoResize = 'HEIGHT'; }
  return t;
}

// Create your own variable of a type (BOOLEAN or STRING) in a collection of yours. Returns the existing one when the name is taken.
async function geistCreateVar(varName, type, collectionName, initial) {
  let col = (await figma.variables.getLocalVariableCollectionsAsync()).find(c => c.name === collectionName);
  if (!col) col = figma.variables.createVariableCollection(collectionName);
  const existing = (await figma.variables.getLocalVariablesAsync()).find(v => v.name === varName && v.variableCollectionId === col.id);
  if (existing) return existing;
  const v = figma.variables.createVariable(varName, col, type);
  v.setValueForMode(col.defaultModeId, initial);
  geistCache.local = null;
  geistCache.vars.clear();
  return v;
}

// Create your own boolean variable for a prototype state. One per overlay, otherwise instances open together.
async function geistBoolean(varName, collectionName = 'Prototyping / My prototype', initial = false) {
  return await geistCreateVar(varName, 'BOOLEAN', collectionName, initial);
}

// Create your own string variable, for example the state of a Command Menu item ('default' or 'selected').
async function geistString(varName, collectionName = 'Prototyping / My prototype', initial = '') {
  return await geistCreateVar(varName, 'STRING', collectionName, initial);
}

// Show or hide a layer from a boolean variable. Pass the collection when the name exists in several (state/menu/open).
async function geistBindVisible(node, varName, collection) {
  node.setBoundVariable('visible', await geistVar(varName, collection));
}

// Bind a component property (Modal active, Drawer show, Sheet open, Command Menu open) to a boolean variable.
async function geistBindProp(inst, propName, varName, collection) {
  const main = await inst.getMainComponentAsync();
  const set = main.parent && main.parent.type === 'COMPONENT_SET' ? main.parent : main;
  const key = Object.keys(set.componentPropertyDefinitions).find(k => k.split('#')[0] === propName);
  if (!key) throw new Error(`"${set.name}" has no property "${propName}".`);
  const v = await geistVar(varName, collection);
  inst.setProperties({ [key]: { type: 'VARIABLE_ALIAS', id: v.id } });
}

// Action that sets a variable to true, false or a string.
async function geistSetVarAction(varName, value, collection) {
  const v = await geistVar(varName, collection);
  const type = typeof value === 'string' ? 'STRING' : 'BOOLEAN';
  return { type: 'SET_VARIABLE', variableId: v.id, variableValue: { type, resolvedType: type, value } };
}

// Action that flips a boolean variable (the NOT of itself): one click opens, the next closes.
async function geistToggleVarAction(varName, collection) {
  const v = await geistVar(varName, collection);
  const self = { type: 'VARIABLE_ALIAS', resolvedType: 'BOOLEAN', value: { type: 'VARIABLE_ALIAS', id: v.id } };
  return { type: 'SET_VARIABLE', variableId: v.id, variableValue: { type: 'EXPRESSION', resolvedType: 'BOOLEAN', value: { expressionFunction: 'NOT', expressionArguments: [self] } } };
}

// On click of a node, set a variable (true, false or a string), or flip a boolean with the value 'toggle'. Adds to an existing click reaction and keeps the other reactions.
async function geistOnClickSet(node, varName, value, collection) {
  const reactions = node.reactions.map(r => ({ ...r }));
  const set = value === 'toggle' ? await geistToggleVarAction(varName, collection) : await geistSetVarAction(varName, value, collection);
  const click = reactions.find(r => r.trigger && r.trigger.type === 'ON_CLICK');
  if (click) click.actions = [...(click.actions || []), set];
  else reactions.push({ trigger: { type: 'ON_CLICK' }, actions: [set] });
  await node.setReactionsAsync(reactions);
}

// Hovering the trigger sets the variable to true, leaving sets it to false. Adds to an existing hover reaction, as the guidelines ask.
async function geistOnHoverShow(trigger, varName, collection) {
  const reactions = trigger.reactions.map(r => ({ ...r }));
  const show = await geistSetVarAction(varName, true, collection);
  const hover = reactions.find(r => r.trigger && r.trigger.type === 'ON_HOVER');
  if (hover) hover.actions = [...(hover.actions || []), show];
  else reactions.push({ trigger: { type: 'ON_HOVER' }, actions: [show] });
  reactions.push({ trigger: { type: 'MOUSE_LEAVE', delay: 0 }, actions: [await geistSetVarAction(varName, false, collection)] });
  await trigger.setReactionsAsync(reactions);
}

// Point every variable action under a node, inside instances too, from one variable to another. Use it when a library overlay is wired to a shared variable (Backdrop, Panel, the buttons that close it) and your screen needs its own.
// Overlay reactions exist only in the open variant: set the open property to true before the call and bind it to the variable after. Returns the number of layers changed.
async function geistRewireReactions(root, fromName, toName, fromCollection, toCollection) {
  const from = await geistVar(fromName, fromCollection);
  const to = await geistVar(toName, toCollection);
  const swap = a => {
    if (!a || a.type !== 'SET_VARIABLE') return a;
    const next = { ...a };
    if (a.variableId === from.id) next.variableId = to.id;
    const value = a.variableValue && a.variableValue.value;
    if (value && value.expressionArguments) {
      const args = value.expressionArguments.map(x => (x.value && x.value.id === from.id ? { ...x, value: { ...x.value, id: to.id } } : x));
      next.variableValue = { ...a.variableValue, value: { ...value, expressionArguments: args } };
    }
    return next;
  };
  const nodes = [];
  const walk = n => { nodes.push(n); if ('children' in n) n.children.forEach(walk); };
  walk(root);
  let changed = 0;
  for (const n of nodes) {
    if (!('reactions' in n) || !n.reactions.length) continue;
    const refers = a => a && a.type === 'SET_VARIABLE' && (a.variableId === from.id || ((a.variableValue && a.variableValue.value && a.variableValue.value.expressionArguments) || []).some(x => x.value && x.value.id === from.id));
    const uses = n.reactions.some(r => (r.actions || (r.action ? [r.action] : [])).some(refers));
    if (!uses) continue;
    // The master also switches the instance to the closed variant (Change to) where it sets the variable. Once the open property is bound to the variable, the variable switches it, so the library's Examples keep the variable action only.
    const next = n.reactions.map(r => {
      const { action, ...rest } = r;
      const acts = r.actions || (action ? [action] : []);
      const own = acts.some(refers) ? acts.filter(a => !(a.type === 'NODE' && a.navigation === 'CHANGE_TO')) : acts;
      return { ...rest, actions: own.map(swap) };
    });
    await n.setReactionsAsync(next);
    // The first call on an instance layer keeps the reaction inherited from the main component next to yours; a second call leaves yours only.
    if (n.reactions.length > next.length) await n.setReactionsAsync(next);
    changed++;
  }
  return changed;
}
