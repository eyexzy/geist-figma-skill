// Read-only audit of a frame, a section or an instance against the Geist library rules, for use_figma. Print it with ROOT_ID set: node scripts/lookup.mjs audit <node id>. Changes nothing.
// Returns the checks that found something, grouped as errors (very likely wrong), warnings (look at it) and info, each with a count and the first examples. A check that is absent found nothing. toTryInPresent lists the interactions of the design that only a pointer can test.
const ROOT_ID = '0:0';
const MAX = 5;
const started = Date.now();
figma.skipInvisibleInstanceChildren = false;

const SPACE_STEPS = new Set([0, 2, 3, 4, 5, 6, 8, 10, 12, 14, 16, 20, 23, 24, 26, 28, 32, 34, 36, 40, 48, 64, 80]);
const RADIUS_STEPS = new Set([0, 1, 2, 4, 5, 6, 8, 10, 12, 14, 16, 24, 9999]);
const GEIST_FONTS = new Set(['Geist', 'Geist Mono']);
const RING = 4;
const DEFAULT_TEXT = /^(Label|Value|Text|Title|Heading|Description|Placeholder|Item \d+|Lorem ipsum.*|Button|Name)$/;
const ACTION_ICON = /^(Trash|Delete|Plus|Minus|Cross|Close|Copy|Edit|Pencil|Download|Upload|Share|Search|Refresh|Settings|More|Dots|Filter|Sort|Check)/i;
const DEFAULT_NAME =/^(Frame|Rectangle|Group|Ellipse|Line|Vector|Text|Section|Polygon|Star) ?\d*$/;
const APPEARANCE = new Set(['fills', 'strokes', 'effects', 'cornerRadius', 'topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius', 'strokeWeight', 'fillStyleId', 'strokeStyleId', 'effectStyleId', 'textStyleId', 'fontName', 'fontSize', 'lineHeight', 'letterSpacing', 'clipsContent']);
// Sets whose property active, open or show opens an overlay over the screen (the same property selects a tab in Tabs and Switch).
const OVERLAY_SETS = new Set(['Modal', 'Command Menu', 'Sheet', 'Drawer']);
// Names of the library's public component sets.
const libNames = new Set(['Avatar', 'Avatar Group', 'Badge', 'Banner', 'Book', 'Breadcrumb', 'Browser', 'Button', 'Calendar', 'Calendar with Presets', 'Checkbox', 'Choicebox Group', 'Code Block', 'Collapse', 'Collapse Group', 'Combobox', 'Command Menu', 'Context Card', 'Copy Button', 'Description', 'Dots Menu', 'Drawer', 'Empty State', 'Error', 'Error Card', 'Feedback', 'Feedback Inline', 'Fieldset', 'Gauge', 'Input', 'Kbd', 'Kbd Group', 'Label', 'Load More Button', 'Loading Dots', 'Menu', 'Modal', 'Multi Select', 'Note', 'Pagination', 'Pill', 'Progress', 'Project Banner', 'Radio', 'Radio Group', 'Relative Time Card', 'Secret Value', 'Select', 'Separator', 'Sheet', 'Show More', 'Skeleton', 'Slider', 'Snippet', 'Spinner', 'Split Button', 'Status Dot', 'Switch', 'Table', 'Tabs', 'Textarea', 'Theme Switcher', 'Toast', 'Toasts', 'Toggle', 'Tooltip', 'Tree', 'Video']);

const root = await figma.getNodeByIdAsync(ROOT_ID);
if (!root || !('children' in root || root.type === 'INSTANCE')) throw new Error('ROOT_ID must be a frame, group, section or instance');

const R = {};
const toTry = [];
let theme = null;
const flag = (id, sev, what, n, extra) => {
  const c = R[id] || (R[id] = { sev, what, count: 0, examples: [] });
  c.count++;
  if (c.examples.length < MAX) c.examples.push((n ? n.id + ' ' + n.name : '') + (extra ? (n ? ' | ' : '') + extra : ''));
};
const vcache = new Map();
const getV = async id => { if (!vcache.has(id)) vcache.set(id, await figma.variables.getVariableByIdAsync(id)); return vcache.get(id); };
// A variable drives an overlay when it is yours or a Prototyping / library variable; a mode variable of a component (Table / Body: table/bordered) only switches a look.
const driverCache = new Map();
const isDriver = async id => {
  if (driverCache.has(id)) return driverCache.get(id);
  const v = await getV(id);
  let r = !!v;
  if (v && v.remote) { const c = await figma.variables.getVariableCollectionByIdAsync(v.variableCollectionId); r = !!c && /^Prototyping \//.test(c.name); }
  driverCache.set(id, r);
  return r;
};
// A frame with a scroll direction shows part of its content on purpose: what lies beyond its edge is reached by scrolling.
const scrolls = n => !!(n.overflowDirection && n.overflowDirection !== 'NONE');
const inScroll = n => { for (let p = n.parent; p && p.type !== 'PAGE'; p = p.parent) if (scrolls(p)) return true; return false; };
const inFlow = n => !!(n.parent && n.parent.layoutMode && n.parent.layoutMode !== 'NONE' && n.layoutPositioning !== 'ABSOLUTE');
const setNameOf = async inst => { const m = await inst.getMainComponentAsync(); return m ? (m.parent && m.parent.type === 'COMPONENT_SET' ? m.parent.name : m.name) : ''; };
const hex = c => '#' + [c.r, c.g, c.b].map(x => Math.round(x * 255).toString(16).padStart(2, '0')).join('');
const frac = v => Math.abs(v - Math.round(v)) > 0.01;
const bound = (n, f) => n.boundVariables && n.boundVariables[f];
const visiblePaint = p => p.visible !== false && (p.opacity === undefined || p.opacity > 0);
const hasFill = n => Array.isArray(n.fills) && n.fills.some(visiblePaint);
const opaque = p => p.visible !== false && (p.opacity === undefined || p.opacity === 1);
// The actions of a reaction, with the branches of a condition (If / Else) unfolded.
const rxActions = r => { const list = []; const add = x => { if (!x) return; if (x.type === 'CONDITIONAL') for (const bl of x.conditionalBlocks || []) (bl.actions || []).forEach(add); else list.push(x); }; (r.actions || (r.action ? [r.action] : [])).forEach(add); return list; };
const inter = (a, b) => Math.max(0, Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x)) * Math.max(0, Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y));
const draws = n => n.visible !== false && (n.type === 'TEXT' || hasFill(n) || (Array.isArray(n.strokes) && n.strokes.some(visiblePaint)) || ('children' in n && n.children.some(draws)));

// Collect every node once. own: a layer of the design (not a part of a library component; the content of a slot is the designer's own).
const all = [];
const collect = (n, inside, ancVis) => {
  all.push({ n, own: !inside && n.type !== 'SECTION', inside, ancVis });
  if ('children' in n) for (const c of n.children) collect(c, n.type === 'SLOT' ? false : inside || n.type === 'INSTANCE', ancVis && n.visible !== false);
};
collect(root, false, true);
const screens = root.type === 'SECTION' ? root.children.filter(c => c.type === 'FRAME' || c.type === 'INSTANCE') : [root];
const screenOf = n => { for (let p = n; p; p = p.parent) if (screens.includes(p)) return p; return root; };
const counts = { nodes: all.length, instances: all.filter(x => x.n.type === 'INSTANCE').length, text: 0 };

// Colors bound on own layers: names for the semantic checks, ids to find the color collection in a file that uses the published library.
const colorVarIds = new Set();
const resolveColor = async (consumer, paint) => {
  try {
    if (paint.boundVariables && paint.boundVariables.color) { const v = await getV(paint.boundVariables.color.id); const r = v.resolveForConsumer(consumer); return r && r.value && typeof r.value === 'object' ? r.value : null; }
    return paint.color;
  } catch (e) { return null; }
};
const lum = c => { const f = x => (x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4)); return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };

// @part static
for (const { n, own, inside, ancVis } of all) {
  const vis = ancVis && n.visible !== false;
  if (n.visible === false && own && ancVis) flag('hidden-layer', 'info', 'hidden layers left in the design', n);
  if (n.type === 'SECTION') continue;
  const b = n.absoluteBoundingBox;

  // Geometry
  if (!inside && vis && b && ['FRAME', 'INSTANCE', 'RECTANGLE', 'LINE', 'COMPONENT'].includes(n.type) && (n.type === 'LINE' || Math.min(b.width, b.height) >= 6)) {
    const p = n.parent && n.parent.absoluteBoundingBox;
    const originFrac = (frac(b.x) || frac(b.y)) && !(p && (frac(p.x) || frac(p.y)));
    const sizeFrac = (frac(b.width) || frac(b.height)) && !(p && (frac(p.width) || frac(p.height)));
    if (originFrac || sizeFrac) flag('half-pixel', 'warn', 'position or size on a fraction of a pixel: borders and shadows blur or merge (parity of a centered element and its parent)', n, [b.x, b.y, b.width, b.height].map(v => Math.round(v * 100) / 100).join(', '));
  }
  if (own && vis && b && screens.length) {
    const S = screenOf(n).absoluteBoundingBox;
    if (n !== screenOf(n) && S && (b.x < S.x - 0.5 || b.y < S.y - 0.5 || b.x + b.width > S.x + S.width + 0.5 || b.y + b.height > S.y + S.height + 0.5) && n.layoutPositioning !== 'ABSOLUTE' && !inScroll(n)) flag('beyond-screen', 'warn', 'a visible layer reaches beyond its screen frame', n);
  }

  if (!own) {
    if (n.type === 'TEXT' && vis && DEFAULT_TEXT.test(n.characters.trim())) flag('default-copy', 'warn', 'text left at a component default; write the real copy', n, n.characters);
    if (n.type === 'TEXT' && vis && n.hasMissingFont) flag('missing-font', 'error', 'text with a missing font', n);
    continue;
  }

  // Own layers
  if (['FRAME', 'RECTANGLE', 'GROUP', 'ELLIPSE', 'LINE', 'VECTOR', 'POLYGON', 'STAR'].includes(n.type) && DEFAULT_NAME.test(n.name)) flag('default-name', 'info', 'layers with a default name', n);
  if (n.type === 'FRAME' && n.children.length === 0 && !/spacer|divider|gap/i.test(n.name) && !hasFill(n) && !(Array.isArray(n.strokes) && n.strokes.length) && !(n.effects && n.effects.length)) flag('empty-frame', 'info', 'empty frames', n);
  // Look-alikes of library components, as hints only: the audit cannot know what the layer is for.
  if (n.type === 'INSTANCE' && vis && b && b.width <= 32 && Math.abs(b.width - b.height) < 1 && n.parent && n.parent.type !== 'INSTANCE') {
    const mc = await n.getMainComponentAsync();
    if (mc && mc.parent && mc.parent.type !== 'COMPONENT_SET') {
      const clicks = n.reactions && n.reactions.some(r => r.trigger && r.trigger.type === 'ON_CLICK');
      if (clicks || ACTION_ICON.test(mc.name)) flag('bare-action-icon', 'info', 'an icon instance outside a component, named like an action or with a click: Button has shape square and circle for icon-only controls', n, mc.name + (clicks ? ' | has a click' : ''));
    }
  }
  if (n.type === 'FRAME' && vis && n.layoutMode === 'HORIZONTAL' && b && b.height >= 28 && b.height <= 48 && (hasFill(n) || (Array.isArray(n.strokes) && n.strokes.length) || (n.effects && n.effects.length))) {
    const kids = n.children.filter(c => c.visible !== false);
    let chevron = false;
    for (const c of kids) if (c.type === 'INSTANCE') { const mc = await c.getMainComponentAsync(); if (mc && /chevron|caret|expand/i.test(mc.name)) chevron = true; }
    if (chevron && kids.some(c => c.type === 'TEXT')) flag('select-like', 'info', 'a frame with text and a chevron: Select, Combobox and Menu are the library components that pick a value from a list', n);
  }
  if (n.type === 'FRAME' && vis && b && b.height <= 12 && b.width >= 40) {
    const bars = n.children.filter(c => c.visible !== false && (c.type === 'RECTANGLE' || c.type === 'FRAME'));
    if (bars.length >= 1 && bars.length <= 2 && bars.some(c => c.width < n.width - 1 && Math.abs(c.height - n.height) < 1.5)) flag('progress-like', 'info', 'a thin bar with a shorter bar inside: Progress and Gauge are the library components that show a value', n);
  }
  if ((n.type === 'FRAME' || n.type === 'INSTANCE') && n.opacity < 1 && vis) flag('layer-opacity', 'warn', 'a frame or instance dimmed with opacity (a disabled look is a property of the component)', n, String(n.opacity));
  if (n.type === 'INSTANCE') {
    const mc = await n.getMainComponentAsync();
    if (!mc) flag('detached', 'error', 'instance whose main component is missing', n);
    if (n.overrides && vis) {
      for (const o of n.overrides) {
        const fields = (o.overriddenFields || []).filter(f => APPEARANCE.has(f));
        if (o.id !== n.id) {
          const lay = (o.overriddenFields || []).filter(f => ['visible', 'width', 'height', 'layoutSizingHorizontal', 'layoutSizingVertical', 'layoutPositioning', 'constraints'].includes(f));
          if (lay.length) { const t = await figma.getNodeByIdAsync(o.id); const bindsVisible = t && ((t.componentPropertyReferences && t.componentPropertyReferences.visible) || (t.boundVariables && t.boundVariables.visible)); if (t && !(lay.length === 1 && lay[0] === 'visible' && bindsVisible)) flag('inner-layout-override', 'info', 'a layer inside a library instance has its size, position or visibility set by hand; a property of the component is the way the library expects it to change', n, t.name + ': ' + lay.join(', ')); }
        }
        if (fields.length) { const t = await figma.getNodeByIdAsync(o.id); flag('restyled-instance', 'warn', 'a part of a library instance restyled by hand instead of through its properties (an icon swapped through a property also records a fills override on its vector: that one is not a restyle)', n, (t ? t.name : o.id) + ': ' + fields.join(', ')); }
      }
    }
    if (mc && n.reactions.length && vis) {
      const hov = r => r.trigger && (r.trigger.type === 'ON_HOVER' || r.trigger.type === 'MOUSE_ENTER');
      if (mc.reactions.some(hov) && !n.reactions.some(hov)) {
        let holds = false;
        for (const x of n.findAll(y => y.boundVariables && y.boundVariables.visible && (y.type === 'INSTANCE' || y.type === 'FRAME'))) if (await isDriver(x.boundVariables.visible.id)) { holds = true; break; }
        if (!holds) flag('hover-lost', 'error', 'reactions set on the instance replaced the hover of its component', n);
      }
    }
    const nm = await setNameOf(n);
    if (vis && (nm === 'Button' || nm === 'Select')) {
      const lt = n.findOne(x => x.type === 'TEXT' && x.visible !== false);
      const label = lt ? lt.characters.trim() : '';
      if (nm === 'Button' && /^(give |send )?feedback$/i.test(label)) flag('text-suggests-component', 'info', 'a Button labelled Feedback: Feedback is the library component that asks for an opinion', n, label);
      if (nm === 'Select' && /^(last \d+ \w+|today|yesterday|this (week|month|year)|custom range|date range|time range)$/i.test(label)) flag('text-suggests-component', 'info', 'a Select showing a period: Calendar (with presets) is the library component that picks a date or a range', n, label);
      if (nm === 'Button' && /^(previous|next)$/i.test(label)) flag('text-suggests-component', 'info', 'a Button labelled Previous or Next: Pagination is the library component for neighbouring pages', n, label);
    }
    const ps = n.componentProperties || {};
    const overlaySet = OVERLAY_SETS.has(nm);
    for (const [k, v] of Object.entries(ps)) {
      if (!overlaySet || !/^(active|open|show|visible)(#|$)/.test(k) || !(v.boundVariables && v.boundVariables.value)) continue;
      const sibs = n.parent ? n.parent.children : [];
      const at = sibs.indexOf(n);
      const above = n.parent && n.parent.itemReverseZIndex ? sibs.slice(0, at) : sibs.slice(at + 1);
      const last = above.every(s => s.layoutPositioning === 'ABSOLUTE');
      const auto = n.parent && n.parent.layoutMode && n.parent.layoutMode !== 'NONE';
      if (!last || (auto && n.layoutPositioning !== 'ABSOLUTE')) flag('overlay-placement', 'warn', 'an overlay should be drawn above its siblings (the last child, or the first one when the parent has First on top) and absolute in an auto layout, or it is covered or pushes the layout', n);
    }
  }
  if (n.type === 'FRAME' || n.type === 'COMPONENT') {
    if (n.layoutMode && n.layoutMode !== 'NONE') {
      for (const f of ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'itemSpacing']) {
        const v = n[f];
        if (typeof v === 'number' && v > 0 && !bound(n, f) && !SPACE_STEPS.has(v)) flag('spacing', 'warn', 'padding or gap that is not bound and not on a step', n, f + ' ' + v);
        if (typeof v === 'number' && (v < 0 || frac(v))) flag('spacing-fraction', 'warn', 'negative or fractional padding or gap', n, f + ' ' + v);
      }
    } else if (n.type === 'FRAME' && n.children.filter(c => c.layoutPositioning !== 'ABSOLUTE').length > 1) flag('no-auto-layout', 'warn', 'a frame with several children and no auto layout', n);
    if (libNames.has(n.name) && n.type === 'FRAME') flag('lookalike', 'warn', 'a frame named like a library component but not an instance', n);
    if (n.type === 'FRAME' && n.clipsContent && vis && !scrolls(n)) {
      const close = n.children.filter(c => c.visible !== false && c.type === 'INSTANCE' && c.layoutPositioning !== 'ABSOLUTE' && (c.x < RING || c.y < RING || c.x + c.width > n.width - RING || c.y + c.height > n.height - RING));
      if (close.length) flag('clip-ring', 'warn', 'Clip content is on and a component sits within 4px of the edge: its border or ring is cut', n, close[0].name);
      const cut = b && n.children.filter(c => { const cb = c.absoluteBoundingBox; return c.visible !== false && c.layoutPositioning !== 'ABSOLUTE' && cb && (cb.x < b.x - 0.5 || cb.y < b.y - 0.5 || cb.x + cb.width > b.x + b.width + 0.5 || cb.y + cb.height > b.y + b.height + 0.5); });
      if (cut && cut.length) flag('clip-cut', 'error', 'Clip content cuts a child that extends beyond the frame', n, cut[0].name);
    }
    if (n.effectStyleId && !n.clipsContent) { const es = await figma.getStyleByIdAsync(n.effectStyleId); if (es && /^ds\/shadow\/border/.test(es.name)) flag('material-clip', 'error', 'the border of a material is drawn only while Clip content is on', n, es.name); }
    if ((n.effectStyleId || (n.effects || []).some(e => e.type === 'DROP_SHADOW')) && !hasFill(n) && vis) flag('shadow-no-fill', 'error', 'a drop shadow is not drawn on a frame without a fill', n);
  }
  if (n.type !== 'TEXT' && 'fills' in n && !n.fillStyleId && n.type !== 'INSTANCE') {
    for (const p of (Array.isArray(n.fills) ? n.fills : [])) {
      if (p.visible === false || p.type !== 'SOLID' || p.opacity === 0) continue;
      if (p.boundVariables && p.boundVariables.color) { colorVarIds.add(p.boundVariables.color.id); const v = await getV(p.boundVariables.color.id); if (v && /^(legacy|accents|components)\//.test(v.name)) flag('legacy-token', 'warn', 'a layer bound to a legacy or component-internal variable; use ds/* in new work', n, v.name); continue; }
      flag('unbound-fill', 'error', 'fill that is a hex value, not a variable or style', n, hex(p.color));
    }
  }
  if (n.type !== 'TEXT' && !n.strokeStyleId && Array.isArray(n.strokes)) for (const p of n.strokes) if (p.visible !== false && p.type === 'SOLID' && !(p.boundVariables && p.boundVariables.color)) flag('unbound-stroke', 'error', 'stroke that is a hex value, not a variable or style', n, hex(p.color));
  if ('cornerRadius' in n && typeof n.cornerRadius === 'number' && n.cornerRadius > 0 && !bound(n, 'topLeftRadius')) flag('radius', 'warn', 'corner radius not bound to a variable', n, n.cornerRadius + (RADIUS_STEPS.has(n.cornerRadius) ? ' (on the ladder)' : ' (off the ladder)'));
  if (n.type !== 'INSTANCE' && Array.isArray(n.effects) && n.effects.some(e => e.type === 'DROP_SHADOW' || e.type === 'INNER_SHADOW') && !n.effectStyleId) flag('shadow-no-style', 'warn', 'a shadow without an effect style', n);

  if (n.type === 'TEXT') {
    counts.text++;
    const segs = n.getStyledTextSegments(['textStyleId', 'fontName', 'fills', 'fontSize', 'fontWeight']);
    if (segs.some(s => !s.textStyleId)) {
      if (n.id.includes(';')) flag('text-no-style-in-instance', 'info', 'text without a library text style inside a library instance: most are the default texts of the library, which set their font directly (brief <slug> lists them under Behavior in this file); check the ones you wrote into a slot', n, n.characters.slice(0, 30));
      else flag('text-no-style', 'error', 'text without a library text style', n, n.characters.slice(0, 30));
    }
    for (const s of segs) if (!GEIST_FONTS.has(s.fontName.family)) { flag('font', 'error', 'font that is not Geist', n, s.fontName.family + ' ' + s.fontName.style); break; }
    if (n.hasMissingFont) flag('missing-font', 'error', 'text with a missing font', n);
    if (vis && n.width < 6 && n.characters.trim().length >= 3) flag('text-collapsed', 'error', 'text collapsed to a sliver (Fill container inside a Hug parent)', n, n.characters.slice(0, 24));
    if (vis && n.textAutoResize === 'NONE') flag('text-fixed-box', 'info', 'text in a fixed box: it is cut or overflows when the copy grows', n);
    if (DEFAULT_TEXT.test(n.characters.trim()) && vis) flag('default-copy', 'warn', 'text left at a default; write the real copy', n, n.characters);
    const f0 = Array.isArray(n.fills) ? n.fills[0] : null;
    const paints = segs.map(s => s.fills && s.fills[0]).filter(Boolean);
    if (paints.some(p => p.type === 'SOLID' && !(p.boundVariables && p.boundVariables.color))) flag('unbound-fill', 'error', 'text color that is a hex value, not a variable or style', n, f0 && f0.color ? hex(f0.color) : '');
    for (const p of paints) {
      if (!(p.boundVariables && p.boundVariables.color)) continue;
      colorVarIds.add(p.boundVariables.color.id);
      const v = await getV(p.boundVariables.color.id);
      if (v && /^(legacy|accents|components)\//.test(v.name)) flag('legacy-token', 'warn', 'a layer bound to a legacy or component-internal variable; use ds/* in new work', n, v.name);
      if (v && /^ds\/(background\/\d+|(gray|blue|red|amber|green|teal|purple|pink)\/(alpha\/)?[1-6]00)$/.test(v.name)) flag('text-color-role', 'warn', 'text bound to a background or border step', n, v.name);
    }
    if (vis && f0 && f0.type === 'SOLID' && opaque(f0)) {
      const fg = await resolveColor(n, f0);
      let bg = null;
      for (let p = n.parent; p && !bg; p = p.parent) { const bf = Array.isArray(p.fills) ? p.fills.find(x => x.type === 'SOLID' && opaque(x)) : null; if (bf) bg = await resolveColor(p, bf); if (p.type === 'PAGE') break; }
      if (fg && bg && typeof fg.r === 'number' && typeof bg.r === 'number') {
        const l1 = lum(fg), l2 = lum(bg), ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
        const size = segs[0] ? segs[0].fontSize : 14, need = size >= 24 ? 3 : 4.5;
        if (ratio < need) flag('low-contrast', 'warn', 'text contrast below WCAG 2 (4.5:1, 3:1 from 24px)', n, ratio.toFixed(2) + ':1 on ' + n.characters.slice(0, 20));
      }
    }
  }
}

// @end
// @part overlays
// Overlays: layers shown by a variable and hidden now. Their open geometry is known while hidden.
for (const { n, own, ancVis } of all) {
  if (n.visible !== false || !ancVis || !(n.boundVariables && n.boundVariables.visible) || !['INSTANCE', 'FRAME'].includes(n.type)) continue;
  if (inFlow(n) || !(await isDriver(n.boundVariables.visible.id))) continue;
  const B = n.absoluteBoundingBox; if (!B) continue;
  const scr = screenOf(n), S = scr.absoluteBoundingBox;
  if (S && !inScroll(n) && (B.x < S.x - 0.5 || B.y < S.y - 0.5 || B.x + B.width > S.x + S.width + 0.5 || B.y + B.height > S.y + S.height + 0.5)) flag('overlay-outside-screen', 'error', 'an overlay opens outside the screen frame (use the other side, or leave room)', n, 'by ' + Math.round(Math.max(S.y - B.y, B.y + B.height - S.y - S.height, S.x - B.x, B.x + B.width - S.x - S.width)) + 'px');
  const hov = x => 'reactions' in x && x.reactions.some(r => r.trigger && r.trigger.type === 'ON_HOVER');
  if (n.findOne && n.findOne(hov)) for (let p = n.parent; p && p.type !== 'PAGE'; p = p.parent) if (hov(p)) { flag('hover-in-hover', p.type === 'INSTANCE' ? 'warn' : 'error', 'an overlay whose items react to hover sits inside a layer that also reacts to hover: the items stay in hover after the pointer leaves', n, 'inside the hover of ' + p.name); break; }
  let c = n;
  for (let p = n.parent; p && p.type !== 'PAGE'; c = p, p = p.parent) {
    const A = p.absoluteBoundingBox;
    if (p !== scr && p.clipsContent && A && (B.x < A.x - 0.5 || B.y < A.y - 0.5 || B.x + B.width > A.x + A.width + 0.5 || B.y + B.height > A.y + A.height + 0.5)) flag('overlay-clipped', 'error', 'an overlay is cut by the Clip content of an ancestor', n, 'cut by ' + p.name);
    const ci = p.children.indexOf(c), rev = !!(p.layoutMode && p.layoutMode !== 'NONE' && p.itemReverseZIndex);
    p.children.forEach((s, si) => {
      if (s === c || s.visible === false || !(rev ? si < ci : si > ci)) return;
      const SB = s.absoluteBoundingBox;
      if (SB && inter(B, SB) > 4 && draws(s)) flag('overlay-covered', 'error', 'an overlay opens under later layers (set canvas stacking on the layouts between it and that content)', n, 'covered by ' + s.name + ' in ' + p.name);
    });
    if (p === scr) break;
  }
}

const hiddenOverlays = all.filter(({ n, ancVis }) => n.visible === false && ancVis && n.boundVariables && n.boundVariables.visible && ['INSTANCE', 'FRAME'].includes(n.type) && !inFlow(n));
for (const { n } of hiddenOverlays) flag('overlay-size-unverified', 'info', 'a hidden overlay is measured at the size it had when it was last shown; after its content changed it can be taller: show it open and measure it (recipes/interactive-overlays.md, Show the open state on the canvas)', n);

// @end
// @part prototype
// Prototype wiring
const setTrue = new Map(), setFalse = new Map(), toggled = new Set(), setAny = new Set();
const reads = new Set();
const clickSets = new Map();
const readIds = v => { if (!v) return; if (Array.isArray(v)) v.forEach(readIds); else if (v.id) reads.add(v.id); };
for (const { n, own, inside, ancVis } of all) {
  if (n.boundVariables) for (const k of Object.keys(n.boundVariables)) readIds(n.boundVariables[k]);
  if (n.type === 'INSTANCE' && n.componentProperties) for (const p of Object.values(n.componentProperties)) readIds(p.boundVariables && p.boundVariables.value);
  if (!('reactions' in n) || !n.reactions.length) continue;
  const hovers = n.reactions.filter(r => r.trigger && r.trigger.type === 'ON_HOVER').length;
  if (hovers > 1) flag('duplicate-hover', 'warn', 'two hover reactions on one layer (a hover re-added by a variant change): the first one wins and the state can stick', n);
  if (own && n.reactions.some(r => r.trigger && r.trigger.type === 'ON_CLICK') && Math.min(n.width, n.height) < 24) flag('small-target', 'warn', 'clickable layer smaller than 24px', n, Math.round(n.width) + 'x' + Math.round(n.height));
  if (own && 'findAll' in n && n.reactions.some(r => r.trigger && r.trigger.type === 'ON_CLICK')) {
    const nb = n.absoluteBoundingBox;
    for (const d of n.findAll(x => x.type === 'INSTANCE' && x.visible !== false)) {
      const db = d.absoluteBoundingBox;
      if (!nb || !db || Math.abs(db.width - nb.width) > 2 || Math.abs(db.height - nb.height) > 2) continue;
      const dm = await d.getMainComponentAsync();
      const set = dm && dm.parent && dm.parent.type === 'COMPONENT_SET' ? dm.parent : null;
      if (!set) continue;
      if (!clickSets.has(set.id)) clickSets.set(set.id, set.children.some(v => (v.reactions || []).some(r => r.trigger && r.trigger.type === 'ON_CLICK')));
      if (clickSets.get(set.id)) { flag('click-consumed', 'error', 'a layer with On click wraps a component whose variants have an On click of their own (' + set.name + '): the component takes the click and this layer never receives it; put On click on an absolute layer above the component', n, set.name); break; }
    }
  }
  if (own && toTry.length < 15) {
    const parts = [];
    for (const r of n.reactions) {
      const acts = [];
      for (const a of rxActions(r)) {
        if (a.type === 'SET_VARIABLE') { const v = await getV(a.variableId); const lit = a.variableValue && a.variableValue.value; acts.push('sets ' + (v ? v.name : '?') + (typeof lit === 'boolean' || typeof lit === 'number' ? ' to ' + lit : typeof lit === 'string' ? ' to "' + lit + '"' : ' (toggle)')); }
        else if (a.type === 'NODE') acts.push((a.navigation || 'goes').toLowerCase());
      }
      if (acts.length) parts.push(r.trigger.type.toLowerCase().replace('_', ' ') + ' ' + acts.join(', '));
    }
    if (parts.length) toTry.push(n.name + ': ' + parts.join('; '));
  }
  for (const r of n.reactions) for (const a of rxActions(r)) {
    if (a.type === 'SET_VARIABLE') {
      if (own) setAny.add(a.variableId);
      const v = a.variableValue && a.variableValue.value;
      if (v === true) setTrue.set(a.variableId, n); else if (v === false) setFalse.set(a.variableId, n); else if (v && typeof v === 'object') toggled.add(a.variableId);
      if (!(await getV(a.variableId))) flag('dangling-variable', 'error', 'a reaction sets a variable that no longer exists', n);
    } else if (a.type === 'NODE' && a.destinationId) {
      const d = await figma.getNodeByIdAsync(a.destinationId);
      if (!d) flag('dangling-destination', 'error', 'a reaction points to a layer that no longer exists', n);
      else if (!inside && (r.trigger.type === 'ON_CLICK' || r.trigger.type === 'AFTER_TIMEOUT') && a.navigation === 'CHANGE_TO' && /hover/i.test(d.name) && hovers) flag('stuck-hover', 'warn', 'hover reached by a click or a timer stays after the pointer leaves (use MOUSE_ENTER and MOUSE_LEAVE)', n, d.name);
    }
  }
}
for (const [id, n] of setTrue) { if (!setFalse.has(id) && !toggled.has(id)) { const v = await getV(id); flag('never-closes', 'error', 'a variable is set to true and never to false', n, v ? v.name : id); } }
for (const [id, n] of setFalse) { if (!setTrue.has(id) && !toggled.has(id)) { const v = await getV(id); flag('never-opens', 'warn', 'a variable is set to false and never to true', n, v ? v.name : id); } }
for (const id of setAny) { if (!reads.has(id)) { const v = await getV(id); if (v && /(^|\/)(internal|item\/\d+)\//.test(v.name)) continue; if (v) flag('variable-not-read', 'warn', 'a variable is set by a reaction and nothing is bound to it', null, v.name); } }
const owners = new Map();
for (const { n } of all) {
  if (n.type !== 'INSTANCE' || !n.componentProperties || !OVERLAY_SETS.has(await setNameOf(n))) continue;
  for (const [k, p] of Object.entries(n.componentProperties)) {
    const id = p.boundVariables && p.boundVariables.value && p.boundVariables.value.id;
    if (id && /^(active|open|show|visible)(#|$)/.test(k)) { const l = owners.get(id) || []; l.push(n); owners.set(id, l); }
  }
}
for (const [id, list] of owners) {
  const byScreen = new Map();
  for (const n of list) { const s = screenOf(n).id; byScreen.set(s, [...(byScreen.get(s) || []), n]); }
  for (const l of byScreen.values()) if (l.length > 1) { const v = await getV(id); flag('shared-variable', 'warn', 'several overlays on one screen are bound to one variable and open together', l[0], (v ? v.name : id) + ' x' + l.length); }
}
for (const { n } of all) {
  if (!n.boundVariables || !n.boundVariables.visible || n.type === 'SECTION' || inFlow(n)) continue;
  const v = await getV(n.boundVariables.visible.id);
  try { if (v && v.resolvedType === 'BOOLEAN' && n.visible === true && v.resolveForConsumer(n).value === true && /open|show|visible/.test(v.name)) flag('open-at-start', 'info', 'an overlay variable is true: the overlay is open when the prototype starts', n, v.name); } catch (e) {}
}

// @end
// @part static
// A frame shows the default mode of DS / Core Colors (Dark) unless it or one of its parents sets a mode.
let colorsId = null, colorsModes = null;
const local = (await figma.variables.getLocalVariableCollectionsAsync()).find(c => c.name === 'DS / Core Colors');
if (local) { colorsId = local.id; colorsModes = Object.fromEntries(local.modes.map(m => [m.modeId, m.name])); }
else for (const id of colorVarIds) {
  const v = await getV(id);
  const c = v && await figma.variables.getVariableCollectionByIdAsync(v.variableCollectionId);
  if (c && c.name === 'DS / Core Colors') { colorsId = c.id; colorsModes = Object.fromEntries(c.modes.map(m => [m.modeId, m.name])); break; }
}
if (colorsId && counts.instances) {
  const modeOf = n => { for (let p = n; p && p.type !== 'PAGE'; p = p.parent) if (p.explicitVariableModes && p.explicitVariableModes[colorsId]) return p.explicitVariableModes[colorsId]; return null; };
  const without = screens.filter(s => !modeOf(s)).map(s => s.name);
  if (without.length) theme = 'no mode of DS / Core Colors is set on ' + without.slice(0, MAX).join(', ') + ' or a parent: it shows Dark, the default mode';
  else theme = 'mode set: ' + screens.slice(0, MAX).map(s => s.name + ' ' + (colorsModes[modeOf(s)] || modeOf(s))).join(', ');
} else if (counts.instances) theme = 'not checked: the DS / Core Colors collection was not found (no layer of this frame is bound to it)';

// @end
const out = { errors: {}, warnings: {}, info: {} };
for (const [id, c] of Object.entries(R)) out[c.sev === 'error' ? 'errors' : c.sev === 'warn' ? 'warnings' : 'info'][id] = { count: c.count, what: c.what, examples: c.examples };
return { root: { id: root.id, name: root.name }, ms: Date.now() - started, counts, theme, ...out, toTryInPresent: toTry };
