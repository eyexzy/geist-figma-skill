# Spacing, sizing and page layout

Source: the variables in `DS / Core Numbers`, the five grid styles in the file, the geometry of the default variants, the Geist `Grid` page, Vercel's Web Interface Guidelines for layout, and Vercel's report-site guidance (`vercel.com/design.md`) for restraint. Geist defines no spacing scale and no radius scale (the variable descriptions say so); the library exposes Tailwind steps and a few Geist tokens.

## Contents
- Spacing steps
- Control sizes
- Page layout and grids
- Layout rules
- Responsive check

## Spacing steps

Bind padding and gaps to `tailwind/space/<px>` variables: `2, 3, 4, 5, 6, 8, 10, 12, 14, 16, 20, 24, 28, 32, 36, 40, 48, 64, 80`, plus `23`, `26` and `34`, which exist for single components. Geist tokens: `geist/space` 4, `geist/space/2x` 8, `3x` 12, `4x` 16, `geist/space/gap` 24 (it defines the page margin and the Geist gap), `gap/half` 12, `gap/quarter` 8.

Pick the nearest step instead of a free number. `geistFrame(name, { gap: 16, pad: 24 })` binds them and fails on a number that is not a step. The spacing inside each component is in its guidelines: `guide <slug> Layout`.

## Control sizes

| Size | Height | Variable | Notes |
|---|---|---|---|
| tiny | 24 | none | Button `tiny` (icon only, radius 4); Kbd cap |
| small | 32 | `ds/size/small` | |
| medium | 36 | `ds/size/medium` | the default of Button, Input, Select, Textarea and Combobox |
| large | 40 | `ds/size/large` | Button, Input and Select: text 16px, radius 8 |

Form controls share these heights, so a Button, Input, Select and Combobox line up in a row.

## Page layout and grids

Five grid layout styles ship with the file. Apply one to a frame with `geistGrid(frame, name)`. The names are exact:

| Style | Use |
|---|---|
| `Layout/Page 1200` | standard page shell: content cap 1200 and a 24px gutter on each side; apply to a frame 1248 wide or more to see both layers |
| `Layout/Page 1400` | wide page shell for the broadest application layouts; frame 1448 or wider |
| `Layout/Page 1200 12 Columns` | 12 columns in 1200, 24px gutter, column 78 |
| `Layout/Page 1400 12 Columns` | 12 columns in 1400, 24px gutter, column 94 (rounded down from 94.67) |
| `Layout/App Shell 1220` | application shell: 260 sidebar and fluid content, capped at 1220 |

Variables: `geist/page/width` 1200, `ds/page/width` 1400, `geist/page/margin` 24.

The page widths and the margin are Geist variables. The 12-column styles are not Geist tokens: the Geist code ships the utilities `grid-cols-1`, `-2`, `-4` and `-12` and no column or gutter variable. The App Shell follows the classes `max-w-[1220px]` and `xl:grid-cols-[260px_1fr]` of the Geist code. The Geist Grid component, with visible guide lines and cells, is for marketing and docs layouts; its page says to use a plain column grid for ordinary card and list layouts.

## Layout rules

- Build every container with auto layout, the Figma counterpart of the flex and grid layout the Web Interface Guidelines prefer. Use absolute positioning only for overlays, tooltips and badges that sit on a corner, and pin overlays with constraints.
- Every element aligns with something on purpose: a grid line, a baseline, an edge or an optical center. Adjust by 1px when perception beats geometry (Web Interface Guidelines).
- When text and an icon sit side by side, balance their weight, size and spacing so one does not overpower the other (Web Interface Guidelines).
- Design for short, average and very long content (Web Interface Guidelines). Truncate with an ellipsis or wrap.
- Do not wrap every section in a card and do not nest cards. Use spacing, alignment and type before borders and boxes. A surface earns its place when it shows selection, interaction, a warning, contrast or a real group that spacing cannot express (`vercel.com/design.md`).

## Responsive check

Check a design at phone, laptop and ultra-wide widths; zoom the canvas out to 50% to imagine ultra-wide (Web Interface Guidelines). For a mobile layout of a dialog, see the Drawer row in `choosing-components.md`.
