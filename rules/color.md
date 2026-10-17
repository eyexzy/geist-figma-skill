# Color: which variable for what, and how Light and Dark work

Source: the `↳ Colors` page of the Figma file, the descriptions of the `ds/*` variables, the Geist page `vercel.com/geist/colors`, and the colors the library's own components bind (rows marked **[component]**).

## Contents
- The model
- Pick by job
- Gray or gray-alpha
- Hover and active fills
- Text
- Status colors
- Light and Dark
- What not to use

## The model

Ten scales: `backgrounds`, `gray`, `gray-alpha`, `blue`, `red`, `amber`, `green`, `teal`, `purple`, `pink`. Every colored scale has the steps 100 to 1000, and each step has the same job in every hue.

| Step | Job | Gray, Light / Dark |
|---|---|---|
| 100 | default background | `#f2f2f2` / `#1a1a1a` |
| 200 | hover background | `#ebebeb` / `#1f1f1f` |
| 300 | active background | `#e6e6e6` / `#292929` |
| 400 | default border | `#ebebeb` / `#2e2e2e` |
| 500 | hover border | `#c9c9c9` / `#454545` |
| 600 | active border | `#a8a8a8` / `#878787` |
| 700 | high-contrast background | `#8f8f8f` / `#8f8f8f` |
| 800 | hover high-contrast background | `#7d7d7d` / `#7d7d7d` |
| 900 | secondary text and icons | `#4c4c4c` / `#a1a1a1` |
| 1000 | primary text and icons | `#171717` / `#ededed` |

Variable names are `ds/<hue>/<step>` (`ds/gray/400`, `ds/red/900`) and `ds/gray/alpha/<step>` for the translucent twin. Two backgrounds: `ds/background/100` (white / `#0a0a0a`, the default element and page background) and `ds/background/200` (`#fafafa` / `#000000`, secondary background).

`node scripts/lookup.mjs ramp <hue>` prints the exact values of any hue.

## Pick by job

| Need | Variable |
|---|---|
| Page, card, panel, control background | `ds/background/100`. Background 2 only sparingly, when a subtle difference is needed. |
| Fill of a component (default / hover / active) | `ds/gray/100` / `200` / `300` (see "Hover and active fills") |
| Border (default / hover / active) | `ds/gray/400` / `500` / `600` |
| Strong solid fill | `ds/gray/1000` with text `ds/background/100` (Button `default`), or the high-contrast background of a hue: step 700, hover 800 |
| Primary text and icons | `ds/gray/1000` |
| Secondary text and icons | `ds/gray/900` |
| Placeholder and muted icons **[component]** | `ds/gray/700` (Input and Textarea placeholder, Select chevron, disabled Menu rows) |
| Disabled controls **[component]** | the colors differ between components; use the component's own disabled state |
| Focus ring color | `ds/focus/color` (`ds/blue/700` Light, `ds/blue/900` Dark); the ring styles are in `materials-and-elevation.md` |
| Behind a modal, drawer or sheet | `ds/overlay/backdrop/color` at the opacity `ds/overlay/backdrop/opacity` (80%) |

## Gray or gray-alpha

- Gray for text, icons, fills, borders and dividers by default.
- Gray-alpha only when the background should show through: shadows, overlays, and a border that must blend with the surface behind it. The form rings use it (`ring/gray-alpha-400`).
- Draw each border once. Keep a divider inside the border; overlapping alpha borders make intersections stand out.
- Keep shadows translucent. An opaque shadow leaves a gray halo.

## Hover and active fills

The default component background steps are Color 1 (100), Color 2 (200) and Color 3 (300) for default, hover and active. If the component's default background is Background 1, use Color 1 as the hover fill and Color 2 as the active fill. On small elements such as badges Color 2 or Color 3 can be the resting background.

Borders: use the solid gray step by default (400, 500, 600) and the matching alpha step only when the edge must blend with its surface.

## Text

- Primary text and icons: `ds/gray/1000`. Secondary: `ds/gray/900`. Strong and Subtle runs are in `typography.md`.
- Text on a solid fill: `ds/background/100` on `ds/gray/1000`; `ds/contrast/fg` (white in both themes) on solid hue fills, for example Toast `success` on `ds/blue/700` and `error` on `ds/red/800`, or the component token (`components/button/error/fg`). Toast `warning` is `ds/amber/800` with `ds/gray/1000` text.
- The Tooltip reads the opposite theme: a dark body in Light and a light body in Dark (`components/tooltip/bg` and `components/tooltip/fg`). It is the only surface that does this.

## Status colors

| Meaning | Color | Where the library does this |
|---|---|---|
| Error, destructive | `red` (800 solid fill; 900 for text, icon and label) | Button `error` (800 fill), Note `error`, Badge `red`, Error (icon, label and message in `ds/red/900`) |
| Warning | `amber` | Button `warning`, Note `warning`, Badge `amber`, Gauge from 33% (`ds/amber/700`) |
| Informational, selected, `success` | `blue` | `success` of Note, Toast, Snippet, Progress and Project Banner; Choicebox checked; Feedback pressed emoji; Toggle checked (`legacy/success`) |
| Healthy, positive | `green` | Badge `green` (healthy), Gauge from 66% (`ds/green/700`), the Feedback confirmation checkmark (`ds/green/900`) |
| Decorative, categories | `purple`, `teal`, `pink`, `blue` | Note `violet` (purple) and `cyan` (teal); Badge colors |
| Neutral | `gray` | everything else |

`success` is blue in five components (Note, Toast, Snippet, Progress, Project Banner), while the Feedback confirmation is green. Follow the component you place; when you build something new, pick one and keep it consistent on that screen.

## Light and Dark

- The color variables live in `DS / Core Colors`, with the modes `Dark` (default) and `Light`; only the Snippet adds its own (`Snippet / Theme`). Components bind variables, so they follow the mode.
- The default mode of `DS / Core Colors` is `Dark`: a frame with no mode set shows Dark. Set the mode on the root frame of a screen (`geistTheme(frame, 'Light')` or `geistFrame` with `theme`) and everything inside follows. To show both themes, build with Light set, clone the frame and set `Dark` on the clone.
- Steps 700 and 800 have the same value in both modes in every hue except `ds/red/800` (`#da2f35` Light, `#d93036` Dark). Every other step changes between Light and Dark.
- Shadows are variables too (`shadow/color/*`), so effect styles follow the mode.
- Modes that belong to one component: `Snippet / Theme` (Default, Success, Error, Warning, Dark), `Table / Body`, `File Tree / Card`. Set them on the instance.

## What not to use

- No hex values and no `rgb()` for anything the library already names.
- `legacy/*` (46 variables) and `accents/*` (8) are older Geist names. Use `ds/*` in new work. A few components still bind them (disabled text of Input and Textarea uses `accents/3`; Collapse borders and the Tabs row line use `accents/2`); leave those alone.
- `components/<name>/...` colors are for rebuilding a component's internals; they are already bound inside the component.
