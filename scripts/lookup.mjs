#!/usr/bin/env node
// Offline lookup over the bundled data of the Geist Figma library. No dependencies, no network. Run without arguments for help.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const loadJson = f => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', f), 'utf8'));
const readFile = f => { const p = path.join(ROOT, f); return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null; };
const out = s => console.log(s);
const fail = s => { out(s); process.exit(1); };

const [cmd, ...rest] = process.argv.slice(2);
const q = rest.join(' ').trim();
const words = s => s.toLowerCase().replace(/[^a-z0-9/ ]+/g, ' ').split(/\s+/).filter(Boolean);
const stem = w => w.replace(/(ing|es|s)$/, '');
const STOP = new Set(['vs', 'or', 'and', 'the', 'a', 'for', 'to', 'of', 'in', 'on', 'with']);

const HELP = `Geist Figma library lookup
  find <words>            components for a need ("date picker", "snackbar")
  choose <words>          which component of several similar ones ("modal vs drawer")
  component <slug>        sets, default variant, properties with defaults and values, nesting
  brief <slug>            what a component is for and how to set it up: public sets with properties, Best Practices, Assembly
  guide <slug> [section]  written guidelines of a component (no section: list sections)
  layout <slug>           exact layout, sizes and bindings of a component, read from the Figma file
  motion <slug>           reactions of a component: trigger, transition, time, curve
  example <slug> [name]   how the Examples of a component are set up: their variables, what sets and drives each, and how to copy the setup
  use <words>             which token, text style, material or spacing for a job ("placeholder", "card shadow")
  token <words>           variables by name or purpose
  ramp <hue>              all steps of a color ramp
  collections             variable collections and counts
  style <words>           text, effect, paint and grid styles
  icon <words>            icon names and meanings ("delete", "settings")
  rule [name] [section]   the rules for when to use what; no name: list them
  check "<Set>: k=v ..."  validate a plan before building: set, part ("Input > Label: value=Name"), properties and values
  audit <node id>         scripts/figma/audit.js with ROOT_ID set, ready to paste into use_figma (a frame, a section or an instance)
  helpers [names] [--comments] functions of scripts/figma/helpers.js to paste into use_figma, with dependencies, without comment lines; --comments keeps them
  keys <refs>             what to search for and the GEIST_KEYS to fill in a file that uses the published library (set:Button icon:Trash style:Copy/14)
  keys from <file> [refs] GEIST_KEYS built from a saved search_design_system result
  fresh [compare <file>]  freshness stamp of this data and how to compare it with the live file
  list                    all components by category`;

const components = () => loadJson('components.json').components;

function findComponent(name) {
  const n = name.toLowerCase().trim();
  return components().find(c => c.slug === n)
    || components().find(c => c.name.toLowerCase() === n)
    || components().find(c => c.sets.some(s => s.name.toLowerCase() === n))
    || components().find(c => c.slug.replace(/-/g, ' ') === n)
    || null;
}

function scoreComponents(query) {
  const qw = words(query).filter(w => !STOP.has(w)).map(stem);
  const phrase = query.toLowerCase();
  const result = [];
  for (const c of components()) {
    const name = words(c.name + ' ' + c.slug).map(stem);
    const aliases = words(c.aliases).map(stem);
    const desc = words(c.description).map(stem);
    const setNames = words(c.sets.map(s => s.name).join(' ')).map(stem);
    const card = (readFile(`component-docs/${c.slug}.md`) || '').toLowerCase();
    let score = 0;
    if (c.name.toLowerCase() === phrase || c.slug === phrase.replace(/ /g, '-')) score += 40;
    else if (c.aliases.toLowerCase().includes(phrase)) score += 12;
    for (const w of qw) {
      if (name.includes(w)) score += 8;
      if (setNames.includes(w)) score += 5;
      if (aliases.includes(w)) score += 5;
      if (desc.includes(w)) score += 2;
      score += Math.min(card.split(w).length - 1, 6) * 0.3;
    }
    if (score > 0) result.push({ c, score });
  }
  return result.sort((a, b) => b.score - a.score);
}

function tableRows(file) {
  const md = readFile(file);
  if (!md) return [];
  const rows = [];
  let section = '';
  for (const line of md.split('\n')) {
    const h = line.match(/^#{2,3} (.*)$/);
    if (h) { section = h[1]; continue; }
    if (line.startsWith('|') && !/^\|[-| ]+\|$/.test(line)) rows.push({ file: path.basename(file, '.md'), section, line });
  }
  return rows;
}

function rankRows(rows, query, limit) {
  const qw = words(query).filter(w => !STOP.has(w)).map(stem);
  if (!qw.length) return [];
  return rows
    .map(r => {
      const text = words(r.line.replace(/[*`]/g, '')).map(stem);
      const sectionWords = words(r.section).map(stem);
      const matched = qw.filter(w => text.includes(w) || sectionWords.includes(w));
      const score = qw.reduce((a, w) => a + (text.includes(w) ? 3 : text.some(x => x.includes(w) && w.length > 3) ? 1 : 0), 0) + (qw.some(w => sectionWords.includes(w)) ? 2 : 0) + (matched.length === qw.length ? 4 : 0);
      return { r, score, full: matched.length === qw.length };
    })
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(x => Object.assign(x.r, { full: x.full }));
}

const USE_FILES = ['color', 'typography', 'materials-and-elevation', 'spacing-and-layout', 'motion-and-prototyping'].map(f => `rules/${f}.md`);

function showUse(query, limit = 7) {
  const hits = rankRows(USE_FILES.flatMap(tableRows), query, limit);
  hits.forEach(r => out(`[${r.file} > ${r.section}] ${r.line}`));
  return hits.length;
}

function sections(md) {
  const lines = md.split('\n');
  const list = [];
  let cur = null;
  lines.forEach((l, i) => {
    const m = l.match(/^(#{2,3}) (.*)$/);
    if (m) { if (cur) cur.end = i; cur = { level: m[1].length, title: m[2], start: i, end: lines.length }; list.push(cur); }
  });
  return { lines, list };
}

function printSection(dir, slug, name) {
  const md = readFile(`${dir}/${slug}.md`);
  if (!md) fail(`No ${dir} file for "${slug}". Run: list`);
  const { lines, list } = sections(md);
  if (!name) {
    out(`${dir}/${slug}.md sections:`);
    list.forEach(s => out(`${'  '.repeat(s.level - 2)}- ${s.title}`));
    out(`\nRun: guide ${slug} "<section>" to print one. A ## title includes its ### subsections.`);
    return;
  }
  const want = name.toLowerCase();
  const hit = list.filter(s => s.title.toLowerCase() === want || s.title.toLowerCase().includes(want));
  if (!hit.length) { out(`No section matching "${name}". Sections:`); list.forEach(s => out('- ' + s.title)); return; }
  for (const s of hit.slice(0, 3)) {
    let end = s.end;
    if (s.level === 2) { const next = list.find(x => x.start > s.start && x.level === 2); end = next ? next.start : lines.length; }
    out(lines.slice(s.start, end).join('\n').trim() + '\n');
  }
}

function propsTable(set) {
  const kind = { VARIANT: 'variant', BOOLEAN: 'boolean', TEXT: 'text', INSTANCE_SWAP: 'swap', SLOT: 'slot' };
  return set.props.map(p => `  ${p.name} [${kind[p.type]}] default: ${p.default}${p.type === 'VARIANT' ? '  values: ' + p.options.join(' | ') : ''}`).join('\n');
}

function showComponent(c) {
  out(`# ${c.name}  (${c.category})`);
  out(c.description);
  out(`Figma page: ${c.page.name}` + (c.vercel ? `\nSite: ${c.vercel}` : ''));
  for (const s of c.sets) {
    out(`\n## Set: ${s.name}${s.helper ? '  [helper set, a part of a bigger component; place the public set]' : ''}`);
    out(`variants: ${s.variants}   default variant: ${s.defaultVariant}`);
    if (s.combos) out(`Not every combination of the variant properties exists (${s.variants} of ${gridSize(s)}); check tells which ones do.`);
    if (s.exposed && s.exposed.length) out(`exposed nested instances (geistNested(inst, "<name>", props)): ${s.exposed.map(e => `${e.name} (${e.set})`).join(', ')}`);
    if (s.contains.length) out(`contains: ${s.contains.join(', ')}`);
    if (s.usedIn.length) out(`used inside: ${s.usedIn.join(', ')}`);
    out('properties (name [type] default):');
    out(propsTable(s));
  }
  if (!c.sets.length) {
    out('\nThis page has no component sets of its own. It documents a composition of other library components. Anatomy and Assembly follow; place those components.\n');
    printSection('component-docs', c.slug, 'Anatomy');
    printSection('component-docs', c.slug, 'Assembly');
  }
  out(`\nMore: guide ${c.slug} | example ${c.slug} | layout ${c.slug} | motion ${c.slug}`);
}

const variables = () => loadJson('variables.json');
const formatValue = v => Object.entries(v.v).map(([m, x]) => `${m}: ${x}`).join('  ');
const HUES = ['gray', 'blue', 'red', 'amber', 'green', 'teal', 'purple', 'pink'];

function scoreVariables(query) {
  const qw = words(query).map(stem);
  const result = [];
  for (const v of variables()) {
    if (v.c === 'Prototyping / Examples') continue;
    const nameWords = words(v.n.replace(/\//g, ' ')).map(stem);
    const first = words(v.d.split(' | ')[0]).map(stem);
    const desc = words(v.d).map(stem);
    let score = 0;
    for (const w of qw) {
      if (nameWords.includes(w)) score += 5; else if (v.n.toLowerCase().includes(w)) score += 2;
      if (first.includes(w)) score += 7; else if (desc.includes(w)) score += 2;
    }
    if (v.n.toLowerCase() === query.toLowerCase()) score += 30;
    const family = v.n.startsWith('ds/') || v.n.startsWith('tailwind/') ? 1.5
      : v.n.startsWith('components/') ? (qw.includes('component') || qw.some(w => w.length > 2 && v.n.startsWith('components/' + w)) ? 1.2 : 0.4)
      : v.n.startsWith('legacy/') ? 0.3 : v.n.startsWith('shadow/') || v.n.startsWith('gradient/') ? 0.7 : 1;
    score *= family;
    if (score > 0) result.push({ v, score });
  }
  return result.sort((a, b) => b.score - a.score || a.v.n.localeCompare(b.v.n));
}

function showTokens(query) {
  const HUE_WORDS = { error: 'red', danger: 'red', destructive: 'red', warning: 'amber', caution: 'amber' };
  const implied = new Set(words(query).map(w => HUE_WORDS[w] || (HUES.includes(w) ? w : null)).filter(Boolean));
  const seen = new Set();
  let shown = 0;
  let best = 0;
  for (const { v, score } of scoreVariables(query)) {
    if (shown >= 12) break;
    best = Math.max(best, score);
    const m = v.n.match(/^ds\/(gray|blue|red|amber|green|teal|purple|pink)\/(alpha\/)?(\d+)$/);
    if (m) {
      if (implied.size && !implied.has(m[1])) continue;
      if (!implied.size) {
        const key = (m[2] ? 'a' : '') + m[3];
        if (seen.has(key)) continue;
        seen.add(key);
        const gray = variables().find(x => x.n === `ds/gray/${m[2] || ''}${m[3]}`) || v;
        out(`${m[2] ? 'ds/gray/alpha/' + m[3] + '  (alpha ramp exists for gray only)' : 'ds/<hue>/' + m[3] + '  same job in every hue: ' + HUES.join(', ')}\n   ${gray.n} -> ${formatValue(gray)}\n   ${gray.d.split(' | ')[0]}   (run: ramp <hue> for the other hues)`);
        shown++;
        continue;
      }
    }
    out(`${v.n}  [${v.c}, ${v.t}]\n   ${formatValue(v)}\n   ${v.d.split(' | ').slice(0, 2).join(' | ')}`);
    shown++;
  }
  return { shown, best };
}

function keyNames() {
  const setPage = Object.fromEntries(components().flatMap(c => c.sets.map(s => [s.name, c.page.name])));
  return { setPage, icons: loadJson('icons.json'), styles: Object.values(loadJson('styles.json')).flat().map(s => s.name) };
}

// The refs of a plan, resolved to exact names. The data holds no import keys (they differ between the original file and its Community copy), so each value is empty.
function resolveKeys(args) {
  const { setPage, icons, styles } = keyNames();
  const result = { sets: {}, icons: {}, styles: {} };
  const names = { set: Object.keys(setPage), icon: icons, style: styles };
  const target = { set: 'sets', icon: 'icons', style: 'styles' };
  const missing = [];
  for (const arg of args) {
    const m = arg.match(/^(set|icon|style):(.*)$/);
    const kinds = m ? [m[1]] : ['set', 'style', 'icon'];
    const name = m ? m[2] : arg;
    let found = false;
    for (const kind of kinds) {
      const exact = names[kind].find(n => n === name) || names[kind].find(n => n.toLowerCase() === name.toLowerCase());
      if (!exact) continue;
      result[target[kind]][exact] = kind === 'set' ? { page: setPage[exact], key: '' } : '';
      found = true;
    }
    if (!found) missing.push(arg);
  }
  return { result, missing };
}

const parseRefs = (q, rest) => /(?:^|\s)(?:set|icon|style):/.test(q) ? q.split(/\s+(?=(?:set|icon|style):)/).map(x => x.replace(/,$/, '').trim()) : q.includes(',') ? q.split(',').map(x => x.trim()) : rest;

// GEIST_KEYS from a saved search_design_system result: the entries of the Geist library, matched to the names of the data.
function keysFromSearch(file, refArgs) {
  let raw;
  try { raw = JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { return { error: 'Cannot read ' + file + ' as JSON: ' + e.message }; }
  const list = Array.isArray(raw) ? raw : raw.results || [raw];
  const entries = list.flatMap(r => [...(r.components || []), ...(r.styles || [])]).filter(x => /^Geist Design System/i.test(x.libraryName || ''));
  const { setPage, icons, styles } = keyNames();
  const iconSet = new Set(icons), styleSet = new Set(styles);
  const result = { sets: {}, icons: {}, styles: {} };
  for (const x of entries) {
    if (x.componentSetKey && setPage[x.name]) result.sets[x.name] = { page: setPage[x.name], key: x.componentSetKey };
    else if (x.componentKey && iconSet.has(x.name)) result.icons[x.name] = x.componentKey;
    else if (x.styleType && x.key && styleSet.has(x.name)) result.styles[x.name] = x.key;
  }
  const libraries = [...new Set(entries.map(x => x.libraryName + ' ' + x.libraryKey))];
  const notFound = [];
  if (refArgs.length) {
    const { result: want, missing } = resolveKeys(refArgs);
    notFound.push(...missing);
    for (const k of ['sets', 'icons', 'styles']) for (const n of Object.keys(want[k])) if (!result[k][n]) notFound.push(k.slice(0, -1) + ':' + n);
    for (const k of ['sets', 'icons', 'styles']) for (const n of Object.keys(result[k])) if (!(n in want[k])) delete result[k][n];
  }
  return { result, libraries, notFound, entries: entries.length };
}

function helperBlocks() {
  const src = readFile('scripts/figma/helpers.js');
  const lines = src.split('\n');
  const starts = [];
  lines.forEach((l, i) => { const m = l.match(/^(?:async )?function (geist\w+)\(/); if (m) starts.push({ name: m[1], fn: i }); });
  const begins = starts.map(s => {
    let b = s.fn;
    while (b > 0 && lines[b - 1].startsWith('//')) b--;
    return b;
  });
  const blocks = starts.map((s, k) => {
    const end = k + 1 < starts.length ? begins[k + 1] : lines.length;
    const text = lines.slice(begins[k], end).join('\n').replace(/\n+$/, '');
    const body = lines.slice(s.fn, end).join('\n');
    return { name: s.name, text, doc: lines[begins[k]].startsWith('//') ? lines[begins[k]].replace(/^\/\/ ?/, '') : '', body };
  });
  const firstFn = starts[0].fn;
  let headEnd = firstFn;
  while (headEnd > 0 && lines[headEnd - 1].startsWith('//')) headEnd--;
  const shared = lines.slice(0, headEnd).filter(l => l.startsWith('const ') || l.startsWith('figma.')).join('\n');
  return { blocks, shared };
}

function showHelpers(args) {
  const keep = args.includes('--comments');
  const names = args.filter(a => a !== '--comments');
  const { blocks, shared } = helperBlocks();
  const byName = new Map(blocks.map(b => [b.name, b]));
  if (!names.length) {
    out('Helpers (run: helpers <names> to print them with their dependencies; helpers all prints everything):');
    blocks.forEach(b => out(`  ${b.name.padEnd(20)} ${b.doc}`));
    return;
  }
  const want = new Set();
  const add = n => {
    const b = byName.get(n);
    if (!b) fail(`Unknown helper "${n}". Run: helpers`);
    if (want.has(n)) return;
    want.add(n);
    for (const m of b.body.matchAll(/geist\w+/g)) if (m[0] !== n && byName.has(m[0])) add(m[0]);
  };
  (names.includes('all') ? blocks.map(b => b.name) : names).forEach(add);
  const code = shared + '\n\n' + blocks.filter(b => want.has(b.name)).map(b => b.text).join('\n\n');
  out(keep ? code : code.split('\n').filter(l => l.trim() && !l.trim().startsWith('//')).join('\n'));
}

function sectionBlock(slug, title) {
  const md = readFile(`component-docs/${slug}.md`);
  if (!md) return [];
  const { lines, list } = sections(md);
  const s = list.find(x => x.title === title);
  if (!s) return [];
  let end = s.end;
  if (s.level === 2) { const next = list.find(x => x.start > s.start && x.level === 2); end = next ? next.start : lines.length; }
  return lines.slice(s.start, end);
}

function showBrief(c) {
  out(`# ${c.name}: ${c.description}`);
  out(`Figma page: ${c.page.name}`);
  const pub = c.sets.filter(s => !s.helper);
  for (const s of pub) {
    out(`\nSet ${s.name}, default ${s.defaultVariant}`);
    out(s.props.map(p => p.type === 'VARIANT' ? `${p.name}=${p.default} (${p.options.join('|')})` : `${p.name}=${p.default} (${p.type.toLowerCase()})`).join('; '));
    if (s.combos) out(`Not every combination of the variant properties exists (${s.variants} of ${gridSize(s)}); check "${s.name}: ..." before you build.`);
    if (s.exposed && s.exposed.length) out(`exposed parts: ${s.exposed.map(e => e.name).join(', ')}`);
  }
  if (!pub.length) out('\nNo set of its own: a composition of other library components (see Assembly).');
  // Accessibility is left out here to keep the brief short; it is one guide call away.
  let skip = false;
  const bp = sectionBlock(c.slug, 'Best Practices').filter(l => { if (/^### /.test(l)) skip = l === '### Accessibility'; return !skip; });
  if (bp.length) out('\n' + bp.join('\n').trim());
  for (const t of ['States', 'Assembly']) { const b = sectionBlock(c.slug, t); if (b.length) out('\n' + b.join('\n').trim()); }
  out(`\nMore: guide ${c.slug} Accessibility | guide ${c.slug} Layout | example ${c.slug} | motion ${c.slug}`);
}

const gridSize = s => s.props.filter(p => p.type === 'VARIANT').reduce((a, p) => a * p.options.length, 1);

function checkSpec(spec, iconNames) {
  const sets = components().flatMap(c => c.sets);
  const byName = n => sets.find(s => s.name.toLowerCase() === n.trim().toLowerCase());
  const m = spec.match(/^\s*([^:>]+?)\s*(?:>\s*([^:]+?)\s*)?:\s*(.*)$/);
  if (!m) return { errs: [`"${spec}": write it as "Set: prop=value prop=value" or "Set > Part: prop=value"`], notes: [] };
  const errs = [], notes = [];
  let set = byName(m[1]);
  if (!set) {
    const r = scoreComponents(m[1]).slice(0, 3).map(x => x.c.sets.filter(s => !s.helper).map(s => s.name).join(', ')).filter(Boolean);
    return { errs: [`no set "${m[1]}"` + (r.length ? `; close: ${r.join('; ')}` : '')], notes };
  }
  if (set.helper && !m[2]) notes.push(`"${set.name}" is a helper set; place the public set that contains it (${set.usedIn.join(', ')})`);
  let label = set.name;
  if (m[2]) {
    const part = (set.exposed || []).find(e => e.name.toLowerCase() === m[2].trim().toLowerCase());
    if (!part) return { errs: [`"${set.name}" exposes no part "${m[2]}". Exposed: ${(set.exposed || []).map(e => e.name).join(', ') || 'none'}`], notes };
    label = `${set.name} > ${part.name}`;
    set = byName(part.set);
  }
  for (const [, k, , quoted, bare] of m[3].matchAll(/([A-Za-z0-9]+)=("([^"]*)"|(\S+))/g)) {
    const v = quoted ?? bare;
    const p = set.props.find(x => x.name === k);
    if (!p) { errs.push(`${label} has no property "${k}". Properties: ${set.props.map(x => x.name).join(', ')}`); continue; }
    if (p.type === 'VARIANT' && !p.options.includes(v)) errs.push(`${label}.${k} accepts ${p.options.join(' | ')}, got "${v}"`);
    if (p.type === 'BOOLEAN' && v !== 'true' && v !== 'false') errs.push(`${label}.${k} is true or false, got "${v}"`);
    if (p.type === 'INSTANCE_SWAP' && !iconNames.has(v)) errs.push(`${label}.${k}: "${v}" is not an icon name; find one with: icon <words>`);
    if (p.type === 'SLOT') errs.push(`${label}.${k} is a slot: drop layers into it, it takes no value`);
  }
  if (set.combos && !errs.length) {
    const want = [...m[3].matchAll(/([A-Za-z0-9]+)=(?:"([^"]*)"|(\S+))/g)].map(x => [x[1], x[2] ?? x[3]]).filter(([k]) => set.props.some(p => p.name === k && p.type === 'VARIANT'));
    const rows = set.combos.map(n => Object.fromEntries(n.split(', ').map(kv => kv.split('='))));
    if (want.length > 1 && !rows.some(r => want.every(([k, v]) => r[k] === v))) {
      const hints = want.map(([k]) => { const others = want.filter(([x]) => x !== k); const ok = [...new Set(rows.filter(r => others.every(([x, v]) => r[x] === v)).map(r => r[k]))]; return ok.length ? `${k} is ${ok.join(' | ')} with ${others.map(([x, v]) => x + '=' + v).join(' ')}` : null; }).filter(Boolean);
      errs.push(`${label}: no variant has ${want.map(([k, v]) => k + '=' + v).join(' ')} together (${set.combos.length} of ${gridSize(set)} combinations exist)` + (hints.length ? '. ' + hints.join('; ') : ''));
    }
  }
  return { errs, notes, label };
}

switch (cmd) {
  case 'find': {
    if (!q) { out(HELP); break; }
    const hits = scoreComponents(q).slice(0, 6);
    const strong = hits.filter(h => h.score >= 5);
    const siteRows = tableRows('rules/choosing-components.md').filter(r => r.section.startsWith('Geist site components'));
    const qw = words(q).filter(w => !STOP.has(w)).map(stem);
    const named = findComponent(q) ? [] : siteRows.filter(r => { const n = words(r.line.split('|')[1].replace(/\(`[^`]*`\)/, '')).map(stem); return qw.length && (qw.every(w => n.includes(w)) || (n.length && n.every(w => qw.includes(w)))); });
    const showSite = rows => { out('Components the Geist site has and this library lacks:'); rows.forEach(r => out(r.line)); };
    if (!strong.length) {
      out(`No component in the library matches "${q}".`);
      const rows = named.length ? named : rankRows(siteRows, q, 3);
      if (rows.length) showSite(rows);
      const guess = hits.slice(0, 2).map(h => h.c.slug);
      if (guess.length) out(`Weak matches: ${guess.join(', ')}. See also: use ${q}`);
      break;
    }
    if (named.length) { showSite(named); out(''); }
    strong.forEach(({ c, score }, i) => out(`${i + 1}. ${c.name} (${c.slug}) [${c.category}] score ${score.toFixed(1)}\n   ${c.description}\n   sets: ${c.sets.filter(s => !s.helper).map(s => s.name).join(', ') || 'none, a composition of other components'}`));
    out(`\nNext: component ${strong[0].c.slug}`);
    break;
  }
  case 'component': {
    const c = findComponent(q);
    if (!c) { const r = scoreComponents(q).slice(0, 3); out(`No component named "${q}".` + (r.length ? ' Did you mean: ' + r.map(x => x.c.slug).join(', ') : '')); break; }
    showComponent(c);
    break;
  }
  case 'brief': {
    const c = findComponent(q);
    if (!c) { const r = scoreComponents(q).slice(0, 3); out(`No component named "${q}".` + (r.length ? ' Did you mean: ' + r.map(x => x.c.slug).join(', ') : '')); break; }
    showBrief(c);
    break;
  }
  case 'audit': {
    if (!/^\d+:\d+$/.test(q)) { out('Usage: audit <node id>, for example audit 123:456'); break; }
    out(readFile('scripts/figma/audit.js').replace("const ROOT_ID = '0:0';", `const ROOT_ID = '${q}';`));
    break;
  }
  case 'check': {
    if (!rest.length) { out('Usage: check "Button: variant=error size=large prefix=Trash label=\\"Delete Project\\"" "Input > Label: value=Name"\nOne quoted argument per instance. Exits with 1 when something is wrong.'); break; }
    const iconNames = new Set(loadJson('icons.json'));
    let bad = 0;
    for (const spec of rest) {
      const { errs, notes, label } = checkSpec(spec, iconNames);
      if (errs.length) { bad++; errs.forEach(e => out('ERROR ' + e)); } else out(`OK ${label}`);
      notes.forEach(n => out('NOTE ' + n));
    }
    if (bad) process.exit(1);
    break;
  }
  case 'guide': { const [slug, ...s] = rest; printSection('component-docs', slug || '', s.join(' ')); break; }
  case 'layout': {
    const c = q ? findComponent(q) : null;
    if (!c) { out('Usage: layout <slug>   e.g. layout fieldset'); break; }
    out(`# Layout of ${c.name}\nThe exact layout, sizes and variable bindings are read from the Figma file, so they are always current. Run scripts/figma/read-layout.js through use_figma with PAGE set to "${c.page.name}", SET to one of the names below and VARIANT to a variant name (empty for the default variant). It reads the component pages, so it works in the library file or a copy of it; a file that only uses the published library has none.`);
    for (const s of c.sets) out(`- SET "${s.name}"${s.helper ? ' (helper)' : ''}: default variant ${s.defaultVariant}, ${s.variants} variants`);
    break;
  }
  case 'motion': {
    const c = findComponent(q);
    if (!c) { out('Usage: motion <component>   e.g. motion modal'); break; }
    const motion = loadJson('motion.json')[c.page.name.replace(/^↳ /, '')] || {};
    out(`# Reactions of ${c.name}, read from the Figma file (the number is how many reactions use it across all variants)`);
    const sets = Object.entries(motion).filter(([, rows]) => rows.length);
    if (!sets.length) out('No prototype reactions. States are shown through properties; loops (Spinner, Loading Dots, Skeleton) are keyframes: run guide ' + c.slug + ' Motion.');
    for (const [set, rows] of sets) { out(`\n## ${set}`); rows.forEach(r => out('- ' + r)); }
    out(`\nWritten motion rules: guide ${c.slug} Motion`);
    break;
  }
  case 'use': {
    if (!q) { out('Usage: use <words>   e.g. use placeholder text | use card shadow | use hover fill | use button height'); break; }
    if (!showUse(q)) out(`Nothing in the rule tables matches "${q}". Try: token ${q} | style ${q} | rule`);
    break;
  }
  case 'token': case 'tokens': case 'variable': {
    if (!q) { out('Give words, e.g. token border | token text secondary | token red text | token radius md | token components/button'); break; }
    const rules = rankRows(USE_FILES.flatMap(tableRows), q, 3).filter(r => r.full);
    if (rules.length) { out('By job (rules):'); rules.forEach(r => out(`[${r.file} > ${r.section}] ${r.line}`)); out(''); }
    const { shown, best } = showTokens(q);
    if (!shown) out(`No variable matches "${q}". Run: use ${q} | collections`);
    else if (best < 8 && !rules.length) { out('\nThe closest rules by job:'); showUse(q, 4); }
    break;
  }
  case 'ramp': {
    const hue = q.toLowerCase();
    const rows = variables().filter(v => v.n.startsWith(`ds/${hue}/`));
    if (!rows.length) { out('Hues: gray, blue, red, amber, green, teal, purple, pink, background.'); break; }
    rows.sort((a, b) => a.n.localeCompare(b.n, undefined, { numeric: true }));
    for (const v of rows) out(`${v.n.padEnd(22)} ${formatValue(v).padEnd(36)} ${v.d.split(' | ')[0]}`);
    break;
  }
  case 'collections': {
    const m = {};
    for (const v of variables()) { const c = m[v.c] || (m[v.c] = { n: 0, modes: Object.keys(v.v) }); c.n++; }
    for (const [k, c] of Object.entries(m)) out(`${k}: ${c.n} variables, modes: ${c.modes.join(', ')}`);
    break;
  }
  case 'style': case 'styles': {
    const styles = loadJson('styles.json');
    const qw = words(q);
    let n = 0;
    for (const kind of ['text', 'effect', 'paint', 'grid']) for (const st of styles[kind]) {
      const hay = (st.name + ' ' + (st.description || '')).toLowerCase();
      if (!qw.length || qw.every(w => hay.includes(w))) {
        const d = (st.description || '').replace(/&quot;/g, '"').replace(/&gt;/g, '>').replace(/&lt;/g, '<').split('\n')[0];
        out(`[${kind}] ${st.name}${st.size ? `  ${st.family} ${st.style} ${st.size}/${st.lineHeight}` : ''}  ${d.slice(0, kind === 'text' ? 400 : 200)}`);
        n++;
      }
    }
    if (!n) { out(`No style name or description contains all of "${q}". The closest rules by job:`); showUse(q, 5); }
    break;
  }
  case 'rule': case 'rules': {
    const dir = path.join(ROOT, 'rules');
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.md')).sort();
    const [topic, ...sec] = rest;
    if (!topic) {
      for (const f of files) out(`${f.replace(/\.md$/, '').padEnd(28)} ${fs.readFileSync(path.join(dir, f), 'utf8').split('\n')[0].replace(/^# /, '')}`);
      out('\nRun: rule <name> [section]');
      break;
    }
    const f = files.find(x => x.replace(/\.md$/, '') === topic.toLowerCase()) || files.find(x => x.includes(topic.toLowerCase()));
    if (!f) { out(`No rule file "${topic}". Run: rule`); break; }
    const md = fs.readFileSync(path.join(dir, f), 'utf8');
    if (!sec.length) { out(md); break; }
    const { lines, list } = sections(md);
    const want = sec.join(' ').toLowerCase();
    const hit = list.filter(s => s.title.toLowerCase().includes(want));
    if (!hit.length) { out(`No section "${sec.join(' ')}" in ${f}. Sections: ` + list.map(s => s.title).join(' | ')); break; }
    for (const s of hit.slice(0, 2)) { const next = list.find(x => x.start > s.start && x.level <= s.level); out(lines.slice(s.start, next ? next.start : lines.length).join('\n').trim() + '\n'); }
    break;
  }
  case 'choose': {
    if (!q) { out('Usage: choose <words>   e.g. choose modal vs drawer | choose boolean setting | choose loading'); break; }
    const hits = rankRows(tableRows('rules/choosing-components.md'), q, 7);
    if (!hits.length) { out(`Nothing in the decision tables matches "${q}". Try: find ${q}`); break; }
    hits.forEach(r => out(`[${r.section}] ${r.line}`));
    out('\nFull tables: rules/choosing-components.md');
    break;
  }
  case 'helpers': showHelpers(rest); break;
  case 'keys': {
    if (!rest.length) { out('Usage: keys <refs>   e.g. keys set:Button set:Input icon:Trash style:Copy/14 style:ds/shadow/menu\n       keys from <file> [refs]   build GEIST_KEYS from a saved search_design_system result\nIn the library file, or in a copy of it, sets, icons and styles are read from the file by name. In a file that uses the published library their import keys are read with search_design_system, because they differ between the original library file and its Community copy.'); break; }
    if (rest[0] === 'from') {
      if (!rest[1]) { out('Usage: keys from <file> [refs]'); process.exit(1); }
      const refArgs = rest.length > 2 ? parseRefs(rest.slice(2).join(' '), rest.slice(2)) : [];
      const r = keysFromSearch(rest[1], refArgs);
      if (r.error) { out(r.error); process.exit(1); }
      if (!r.entries) { out('No entry of a library named "Geist Design System..." in that file. Save the whole response of search_design_system as JSON.'); process.exit(1); }
      const n = Object.values(r.result).reduce((acc, o) => acc + Object.keys(o).length, 0);
      if (r.libraries.length > 1) out('More than one Geist library in the result (' + r.libraries.join('; ') + '). Search again with includeLibraryKeys for the one this file uses.');
      if (r.notFound.length) out('Not in the result: ' + r.notFound.join(', ') + '. Search for them and run again.');
      out(n + ' keys from ' + r.entries + ' entries.');
      out('const GEIST_KEYS = ' + JSON.stringify(r.result) + ';');
      break;
    }
    const { result, missing } = resolveKeys(parseRefs(q, rest));
    if (missing.length) out('Not found: ' + missing.join(', ') + '. Names are exact: component sets (see component <slug>), icons (icon <word>), styles (style <words>).');
    const queries = [...Object.keys(result.sets).map(n => ({ entity: 'component', query: n })), ...Object.keys(result.icons).map(n => ({ entity: 'component', query: n })), ...Object.keys(result.styles).map(n => ({ entity: 'style', query: n }))];
    out('In the library file, or in a copy of it, paste this as it is: sets, icons and styles are found by name.');
    out('const GEIST_KEYS = ' + JSON.stringify(result) + ';');
    out('\nIn a file that uses the published library the import keys come from search_design_system, because the original library file and its Community copy have other keys. Call it with the fileKey of that file and\nqueries = ' + JSON.stringify(queries) + '\nTake the entry whose name is exactly the query and whose libraryName starts with "Geist Design System" (a query also returns neighbors such as "Copy Button" and components of other libraries). Fill the empty strings: componentSetKey of a set into key, componentKey of an icon, key of a style. The first answer carries libraryKey; pass it as includeLibraryKeys in later searches to leave the other libraries out. A large answer can be saved as JSON and turned into the line above: keys from <file> [refs].');
    break;
  }
  case 'fresh': {
    const stamp = JSON.parse(readFile('data/stamp.json'));
    const [sub, arg] = rest;
    if (sub === 'compare') {
      if (!arg) { out('Usage: fresh compare <file with the JSON returned by scripts/figma/fresh-check.js>'); break; }
      const live = JSON.parse((arg.trim().startsWith('{') ? arg : fs.readFileSync(arg, 'utf8')).replace(/^﻿/, ''));
      const diffs = [];
      if (live.mode === 'consumer') {
        const mine = stamp.consumer.collections;
        for (const [name, c] of Object.entries(live.collections || {})) {
          if (!mine[name]) continue;
          if (mine[name].count !== c.count) diffs.push(`collection ${name}: ${mine[name].count} variables in the data, ${c.count} in the library`);
          else if (mine[name].hash !== c.hash) diffs.push(`collection ${name}: variable names changed`);
        }
        for (const name of Object.keys(mine)) if (!live.collections || !live.collections[name]) diffs.push(`collection ${name} is not available in the file (library not enabled?)`);
      } else {
        for (const [k, v] of Object.entries(live.counts || {})) if (stamp.counts[k] !== undefined && stamp.counts[k] !== v) diffs.push(`count ${k}: data ${stamp.counts[k]}, live ${v}`);
        for (const [k, v] of Object.entries(live.hash || {})) if (stamp.hash[k] !== undefined && stamp.hash[k] !== v) diffs.push(`hash ${k}: data ${stamp.hash[k]}, live ${v}`);
        if (live.docsByPage) for (const [k, v] of Object.entries(live.docsByPage)) if (stamp.docsByPage[k] !== v) diffs.push(`documentation changed: ${k}`);
      }
      const community = live.mode === 'consumer' ? [...new Set(Object.values(live.collections || {}).map(c => c.library).filter(n => /\(Community\)\s*$/.test(n || '')))] : [];
      if (!diffs.length) out(`FRESH: the file matches the data taken on ${stamp.takenOn} (${live.mode} check).`);
      else { out(`STALE in ${diffs.length} places (data taken on ${stamp.takenOn}):`); diffs.forEach(d => out('- ' + d)); out('Read the changed parts live with use_figma and tell the user that the offline data is out of date for them.'); }
      if (community.length) out(`
KEYS: the library is the Community copy (${community.join(', ')}). Sets, icons and styles import by key, and the keys of this file are read with search_design_system (lookup.mjs keys). Variables are found by name and need no keys.`);
      break;
    }
    out(`Data stamp (taken ${stamp.takenOn}):`);
    out(JSON.stringify({ counts: stamp.counts, hash: stamp.hash }, null, 1));
    out('\nRun scripts/figma/fresh-check.js through use_figma: it picks the mode from the file: "quick" in the library file (seconds) and "consumer" in a file that uses the published library; set MODE_SETTING to "full" to read every component page. Save the returned JSON to a file, then run: fresh compare <file>');
    break;
  }
  case 'example': case 'examples': {
    const [slug, ...ex] = rest;
    const c = slug ? findComponent(slug) : null;
    if (!c) { out('Usage: example <slug> [example name]   e.g. example modal | example combobox uncontrolled-framework'); break; }
    const vars = variables().filter(v => v.c === 'Prototyping / Examples' && v.n.split('/')[0] === c.slug);
    const parts = d => d.split(' | ');
    // Names that differ only by a number are printed once as a range: item/1/selected to item/7/selected becomes item/#/selected (1 to 7).
    const squash = names => {
      const m = new Map();
      for (const n of names) { const k = n.replace(/\d+/, '#'); const num = (n.match(/\d+/) || [])[0]; const e = m.get(k) || { nums: [] }; if (num) e.nums.push(+num); m.set(k, e); }
      return [...m].map(([k, e]) => e.nums.length > 1 ? `${k} (${Math.min(...e.nums)} to ${Math.max(...e.nums)})` : k.replace('#', e.nums[0] ?? '#'));
    };
    out(`# Examples of ${c.name} on ${c.page.name}`);
    out(`The structure of the examples (properties, nested parts, the frames that carry the clicks) is read live: run scripts/figma/read-examples.js through use_figma with PAGE set to "${c.page.name}". It reads the component pages, so it works in the library file or a copy of it; a file that only uses the published library has none.`);
    if (!vars.length) { out('\nThese examples have no prototype variables; they show combinations of properties.'); break; }
    const groups = {};
    for (const v of vars) (groups[v.n.split('/')[1] || ''] = groups[v.n.split('/')[1] || ''] || []).push(v);
    const want = ex.join(' ').trim().toLowerCase();
    let shown = vars;
    if (!want) {
      out(`\nVariables of the examples (${vars.length}); print one example with: example ${c.slug} <example>`);
      for (const [g, list] of Object.entries(groups)) out(`- ${g}: ${squash(list.map(v => v.n.split('/').slice(2).join('/'))).join(', ')}`);
    } else {
      const hit = Object.entries(groups).filter(([g]) => g.toLowerCase() === want || g.toLowerCase().includes(want));
      if (!hit.length) { out(`No example "${want}". Examples: ${Object.keys(groups).join(', ')}`); break; }
      shown = hit.flatMap(([, list]) => list);
      for (const [g, list] of hit) {
        out(`\n## ${g}`);
        for (const v of list) { const p = parts(v.d); out(`${v.n}  [${v.t}]\n   ${p[0]}\n   ${p.filter(x => /^(Type|Set by|Drives):/.test(x)).join('\n   ')}`); }
      }
    }
    const noteMap = new Map();
    for (const v of shown) for (const x of parts(v.d)) if (/^To set up for your component:/.test(x)) { const k = x.replace(/\d+/g, '#'); const e = noteMap.get(k) || { text: x, n: 0 }; e.n++; noteMap.set(k, e); }
    if (noteMap.size) {
      out('\nTo copy the setup:');
      for (const { text, n } of noteMap.values()) out('- ' + text.replace(/^To set up for your component: /, '') + (n > 1 ? ` (the same for ${n} variables, only the numbers differ)` : ''));
    }
    out('\nThe variables exist only for the examples; create your own variables for your screen (recipes/interactive-overlays.md).');
    break;
  }
  case 'icon': case 'icons': {
    const all = loadJson('icons.json');
    const syn = loadJson('icon-synonyms.json');
    const qw = words(q);
    if (!qw.length) { out(`${all.length} icons. Search by name or meaning: icon <words>`); break; }
    const hit = all.filter(x => qw.every(w => x.toLowerCase().includes(w)));
    let n = hit.length;
    if (hit.length) out(hit.join(', '));
    const meaning = [...new Set(qw.flatMap(w => (syn[w] || '').split(' ').filter(Boolean)))].filter(x => all.includes(x));
    if (meaning.length) { out(`${n ? 'Also, for the meaning' : 'By meaning'} of "${q}": ${meaning.join(', ')}`); n += meaning.length; }
    if (!n) out(`No icon matches "${q}". Try a shorter word or a synonym, or run: icon`);
    break;
  }
  case 'list': {
    const byCategory = {};
    components().forEach(c => (byCategory[c.category] = byCategory[c.category] || []).push(c.slug));
    for (const [k, v] of Object.entries(byCategory)) out(`${k}: ${v.join(', ')}`);
    break;
  }
  default: out(HELP);
}
