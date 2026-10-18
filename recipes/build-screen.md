# Recipe: build a screen or a block from library components

Use this when the user asks for a page, a dialog, a card, a settings screen or any layout made with the library. The library already has the parts, so the job is to choose, assemble and configure them, not to draw.

Load the official `figma-use` skill first. It holds the runtime rules: return the ids of what you create, work in small calls, one page switch per call, a 20 KB limit on what a script returns. The components, variables and styles are already known here, so resolve them with the helpers instead of the discovery step of `figma-generate-design`.

## Per script

1. Print the helpers the script needs and paste them first: `node scripts/lookup.mjs helpers geistFrame geistText geistSet geistInstance`. The command adds their dependencies; `--comments` keeps the comment lines, `helpers` alone lists them all. Each `use_figma` call starts empty, so paste the helpers into every call that uses them.
2. Paste `GEIST_KEYS` for what the script uses above the helpers: `node scripts/lookup.mjs keys set:Button set:Input icon:Trash style:Heading/20`. Sets always need their line (it holds the page in the library file). In the library file or a copy of it the line is complete as printed. In a file that uses the published library an import key is needed for each set, icon and style: the command prints the `search_design_system` call that returns them, and you fill them in (`keys from <file>` does it from a saved result).
3. Return the ids of what you created, take a screenshot and run `scripts/figma/audit.js` on the result.

## Steps

1. Break the request into parts. Name each part in plain words ("confirmation dialog", "project name field", "danger button", "status dot", "empty list").
2. Match every part to a component. `node scripts/lookup.mjs find <words>` for each part, and `choose <words>` when two components could fit; pick the public set, not a `_` helper. If nothing matches, say so and build the part from library components and plain frames with tokens, never a look-alike made of rectangles. When the file has the component pages (the library file or a copy of it) and the page has an Examples frame, its configuration is correct, so build from it what your task needs, above all the variables an example uses: `node scripts/lookup.mjs example <slug>` and `scripts/figma/read-examples.js`.
3. Read each component you will use with `brief <slug>`: properties and defaults, when to use it, its Content rules and its Assembly (width, slots, stacking). Write the plan as one line per instance and validate it: `node scripts/lookup.mjs check "Fieldset: title=\"Project Name\" showContent=true" "Input > Label: value=Name"`. Placing and setting an instance is in `configure-components.md`; overlays in `interactive-overlays.md`.
4. Build the structure with auto layout and name each frame after what it is ("Actions", "Create project"). `geistFrame(name, { dir, gap, pad, radius, fill, effect, parent, w })` makes an auto layout frame, binds spacing, radius and fill to variables and applies the effect style. Spacing numbers are steps of `tailwind/space`; a number that is not a step throws, so the script cannot drift off the scale. A frame without an effect style does not clip its content: the borders and rings of library components are drawn outside their edge and a clipping frame cuts them (`rules/materials-and-elevation.md`, Clipping). A frame with an effect style clips, because a material border is drawn only while Clip content is on; keep its padding at least 4px. Pass `clip: true` or `clip: false` to override.
5. Place the instances (`configure-components.md`).
6. Bind what is yours: frame fills and strokes, radius, spacing, effect style, text style and text color (see below).
7. Theme. Set the mode on the root frame of the screen (Light and Dark, below).
8. Wire interactions only if the user asked for a prototype.
9. Check. Compare the screenshot with the request and fix. Run `scripts/figma/audit.js` to catch unbound colors, text without a style, off-scale spacing and frames that clip a component's border, and review the empty, loading, error and Dark versions (`rules/review-geist.md`).

## Bind variables and styles

Never type a hex value or a bare pixel number for something the library already names. Which variable or style fits which job is in `rules/color.md`, `typography.md`, `materials-and-elevation.md` and `spacing-and-layout.md`; find one by words with `node scripts/lookup.mjs token <words>`, `style <words>` or `use <words>`.

```js
await geistFill(frame, 'ds/background/100');
await geistStroke(frame, 'ds/gray/alpha/400');
await geistNumber(frame, 'cornerRadius', 'tailwind/radius/xl');
await geistNumber(frame, 'paddingLeft', 'tailwind/space/16');
await geistEffectStyle(frame, 'ds/shadow/menu');
await geistGrid(frame, 'Layout/Page 1200');
const title = await geistText(frame, 'Settings', { style: 'Heading/24', color: 'ds/gray/1000' });
```

The 1px border of a material is part of its effect style; the radius is not, so bind it with `tailwind/radius/*`. `geistText` binds `ds/gray/1000` unless you pass `color`; a text layer made another way is black until a color is bound.

## Light and Dark

The color collection `DS / Core Colors` has the modes `Dark` and `Light`, and `Dark` is the default. A frame with no mode set shows Dark, so a screen meant for Light needs the mode set explicitly. Set the mode on the root frame and everything inside follows:

```js
const screen = await geistFrame('Settings', { theme: 'Light', w: 1200, fill: 'ds/background/100' });   // or: await geistTheme(frame, 'Light')
```

To show both themes, build the frame once, clone it and set the other mode on the clone; the clone is wired to the same variables, so in Present an overlay opened on one screen is open on the other. Look at a screenshot of each: a frame that stays dark when it should be light has no mode set.

Some collections are modes of one component, set on the instance as an explicit variable mode: `Table / Body` (striped, bordered, compact), `File Tree / Card` (Default or Card), `Snippet / Theme` (Default, Success, Error, Warning, Dark), `Prototyping / Toasts` (which toasts are shown). The component's guidelines say when to use them.

## Worked example: confirmation card

```js
const card = await geistFrame('Delete project', { gap: 16, pad: 24, radius: 12, fill: 'ds/background/100', effect: 'ds/shadow/border' });
await geistText(card, 'Delete Project', { style: 'Heading/20' });
await geistText(card, 'This project and all its deployments will be permanently deleted.', { style: 'Copy/14', color: 'ds/gray/900', w: 'fill' });
const actions = await geistFrame('Actions', { dir: 'HORIZONTAL', gap: 8, parent: card });
const button = await geistSet('Button');
actions.appendChild(await geistInstance(button, { variant: 'secondary', label: 'Cancel' }));
actions.appendChild(await geistInstance(button, { variant: 'error', label: 'Delete Project', showPrefix: true, prefix: 'Trash' }));
return { card: card.id };
```

For a real confirmation dialog use the Modal set, or the Destructive Action Modal composition: they bring the backdrop, panel, header and actions. See `interactive-overlays.md`.
