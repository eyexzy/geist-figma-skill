// Read-only freshness fingerprint for use_figma. Returns one JSON string under 20 KB; compare it with `node scripts/lookup.mjs fresh compare <file>`.
// MODE 'quick': library file, variables, styles and page names (seconds). MODE 'full': also every component page, set keys, icon keys and documentation text.
// MODE 'consumer': a file that uses the published library; reads variable collections through figma.teamLibrary (names and types, not values).
// Leave MODE_SETTING as 'auto' to get 'quick' in the library file (it has pages named "↳ ...") and 'consumer' in any other file; set 'full' when the answer rests on the written guidelines.
const MODE_SETTING = 'auto';
const MODE = MODE_SETTING !== 'auto' ? MODE_SETTING : (figma.root.children.some(p => p.name.startsWith('↳ ')) ? 'quick' : 'consumer');

const fnv = s => { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return h.toString(16).padStart(8, '0'); };
const hx = c => { const t = x => Math.round(x * 255).toString(16).padStart(2, '0'); return '#' + t(c.r) + t(c.g) + t(c.b) + (c.a !== undefined && c.a < 1 ? t(c.a) : ''); };
const byName = (a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0);
const pairs = list => fnv(list.slice().sort(byName).map(x => x[0] + '=' + x[1]).join('\n'));

if (MODE === 'consumer') {
  const libs = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();
  const collections = {};
  for (const c of libs) {
    const vars = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(c.key);
    collections[c.name] = { library: c.libraryName, count: vars.length, hash: fnv(vars.map(v => v.name + '|' + v.resolvedType).sort().join('\n')) };
  }
  return JSON.stringify({ mode: 'consumer', collections });
}

const skip = ['↳ Colors', '↳ Typography', '↳ Materials', '↳ Icons'];
const pages = figma.root.children.filter(p => p.name.startsWith('↳ ') && !skip.includes(p.name));
const docs = {};
if (MODE === 'full') {
  // Only text outside instances is hashed: the text inside nested instances changes with the run, the guidelines themselves do not.
  const ownText = (n, list) => {
    if (n.type === 'TEXT') list.push(n.characters);
    else if ('children' in n && n.type !== 'INSTANCE') for (const c of n.children) ownText(c, list);
    return list;
  };
  for (const p of pages) await p.loadAsync();
  for (const p of pages) {
    const d = p.children.find(c => c.name === 'Documentation');
    if (d) docs[p.name.slice(2)] = fnv(ownText(d, []).join('\n'));
  }
}

const cols = await figma.variables.getLocalVariableCollectionsAsync();
const vlist = await figma.variables.getLocalVariablesAsync();
const vname = Object.fromEntries(vlist.map(v => [v.id, v.name]));
const vrows = [];
for (const c of cols) for (const id of c.variableIds) {
  const v = vlist.find(x => x.id === id) || await figma.variables.getVariableByIdAsync(id);
  const modes = c.modes.map(m => { const x = v.valuesByMode[m.modeId]; const s = x && typeof x === 'object' ? (x.type === 'VARIABLE_ALIAS' ? '>' + (vname[x.id] || x.id) : hx(x)) : String(x); return m.name + '=' + s; }).sort().join(';');
  vrows.push(c.name + '|' + v.name + '|' + v.resolvedType + '|' + modes + '|' + (v.description || ''));
}
vrows.sort();
const text = await figma.getLocalTextStylesAsync(), eff = await figma.getLocalEffectStylesAsync(), paint = await figma.getLocalPaintStylesAsync(), grid = await figma.getLocalGridStylesAsync();
const srows = [...text.map(s => 'T|' + s.name + '|' + s.fontSize + '|' + (s.description || '')), ...eff.map(s => 'E|' + s.name + '|' + (s.description || '')), ...paint.map(s => 'P|' + s.name + '|' + (s.description || '')), ...grid.map(s => 'G|' + s.name + '|' + (s.description || ''))].sort();
// Only the pages that hold library content count; a working page such as a scratch or cover page does not make the data stale.
const pageNames = figma.root.children.map(p => p.name).filter(n => n.startsWith('↳ '));

const out = {
  mode: MODE,
  counts: { variables: vlist.length, collections: cols.length, textStyles: text.length, effectStyles: eff.length, paintStyles: paint.length, gridStyles: grid.length, pages: pageNames.length },
  hash: {
    variables: fnv(vrows.join('\n')),
    styles: fnv(srows.join('\n')),
    pages: fnv(pageNames.join('\n')),
    styleKeys: fnv([text, eff, paint, grid].map(l => pairs(l.map(s => [s.name, s.key]))).join('|')),
  },
};

if (MODE === 'full') {
  let sets = 0, variants = 0;
  const setRows = [], setKeys = [];
  for (const p of pages) {
    const documented = docs[p.name.slice(2)] !== undefined;
    for (const s of p.findAllWithCriteria({ types: ['COMPONENT_SET'] })) {
      sets++;
      variants += s.children.length;
      setRows.push(p.name + '|' + s.name + '|' + s.children.length + '|' + Object.keys(s.componentPropertyDefinitions).map(k => k.split('#')[0]).sort().join(','));
      if (documented) setKeys.push([s.name, s.key]);
    }
  }
  const iconPage = figma.root.children.find(p => p.name === '↳ Icons');
  await iconPage.loadAsync();
  const icons = iconPage.findAllWithCriteria({ types: ['COMPONENT'] }).map(c => [c.name, c.key]);
  out.counts.componentPages = pages.length;
  out.counts.componentSets = sets;
  out.counts.variants = variants;
  out.counts.icons = icons.length;
  out.hash.sets = fnv(setRows.sort().join('\n'));
  out.hash.setKeys = pairs(setKeys);
  out.hash.iconKeys = pairs(icons);
  out.hash.docs = fnv(Object.keys(docs).sort().map(k => k + docs[k]).join('\n'));
  out.docsByPage = docs;
}
return JSON.stringify(out);
