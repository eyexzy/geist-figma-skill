# Materials: radius, border and shadow for a surface

Source: the `↳ Materials` page of the Figma file (the material table and its Best Practices), the 32 effect styles and their descriptions, and the effect styles the library's components bind. The Geist page is `vercel.com/geist/materials`.

## Contents
- What a material is
- The eight materials
- How to choose
- Rules
- Focus rings and form rings
- Clipping

## What a material is

A material is a preset for the radius, fill, border and shadow of a surface. Pick it by where the element sits in the layered hierarchy; the name encodes the elevation role. In the Figma file the shadow and the 1px border are one effect style (`ds/shadow/...`). The radius is not part of the style, so bind it with a `tailwind/radius/*` variable. A material draws its border with the effect style, not with a stroke.

## The eight materials

Surfaces (on the page):

| Material | Effect style | Radius | Use |
|---|---|---|---|
| `material-base` | `ds/shadow/border` | 6 (`tailwind/radius/md`) | everyday resting card or panel |
| `material-small` | `ds/shadow/border-small` | 6 | slightly raised |
| `material-medium` | `ds/shadow/border-medium` | 12 (`tailwind/radius/xl`) | further raised |
| `material-large` | `ds/shadow/border-large` | 12 | further raised than medium: same radius, deeper shadow |

Floating (above the page):

| Material | Effect style | Radius | Use |
|---|---|---|---|
| `material-tooltip` | `ds/shadow/tooltip` | 6 | lightest floating shadow. The Geist page says tooltips are the only floating element with a triangular stem. |
| `material-menu` | `ds/shadow/menu` | 12 | lifted from the page: dropdowns, popovers, context menus |
| `material-modal` | `ds/shadow/modal` | 12 | further lift: dialogs. Stacked above another modal: `ds/shadow/modal-elevated`. |
| `material-fullscreen` | `ds/shadow/fullscreen` | 16 (`tailwind/radius/2xl`) | biggest lift: full-screen takeovers |

Three library components follow the Geist code instead of this table: Modal and Sheet use `ds/shadow/modal-elevated`, the Drawer uses `ds/shadow/menu`. The Tooltip component has no effect style; its body is the fill `components/tooltip/bg` with radius 8. Leave these as they are when you place the components.

Other effect styles: plain shadows `ds/shadow/2xs` to `ds/shadow/2xl` (`small`, `medium` and `large` are the shadow layers of the matching materials) and the edges `border-base`, `border-inset` and `background-border` that the materials compose. The `ring/*` styles are 1px rings taken from the inline shadows of components, not Geist tokens; `ring/gray-400` is the resting border of form controls.

## How to choose

1. Is it a resting surface on the page? Use `base`. If it must read as raised, step up to `small`, `medium` or `large`.
2. Does it float above the page and go away? A hint: `tooltip`. A list of options or a popover: `menu`. A blocking dialog: `modal`. A takeover: `fullscreen`.
3. Do not stack two materials on one element. If a child needs more elevation, lift it into its own surface with a higher material.
4. Use the lowest elevation that still reads as raised against its background. Over-elevating is a common source of visual noise.
5. Match the material to the layer order: a `tooltip` surface never sits visually below a `base` card.
6. Let the material set the chrome and use layout spacing for layout. Do not override shadows on the same element.
7. Test in Light and Dark. Shadow contrast is weaker on dark backgrounds; confirm the separation still reads.
8. A material is decoration. The role lives on the wrapper (a dialog on a modal). In design, say so in the layer name and in handoff notes.
9. Do not rely on shadow alone to show elevation; keep the focus ring on focusable children inside.
10. A child radius does not exceed the parent radius and is concentric, so the curves line up (Web Interface Guidelines).

Steps 1 to 9 are the Best Practices of the `↳ Materials` page.

## Rules

- The radius ladder is available as variables: `tailwind/radius/xs` 2, `sm` 4, `md` 6, `lg` 8, `xl` 12, `2xl` 16, `3xl` 24, `full` 9999, plus a few literals (`1`, `5`, `10`, `14`). `geist/radius` is 6 and `geist/marketing/radius` is 8.
- Never type a radius number. Bind the variable: `geistNumber(frame, 'cornerRadius', 'tailwind/radius/xl')`, or `radius: 12` in `geistFrame`.
- The library's radii grow with the surface: controls 6 (8 at `large`), Kbd and the Checkbox box 4, resting materials 6 or 12, floating panels and modals 12, full-screen 16. Pills and avatars use `full`.

## Focus rings and form rings

- Keyboard focus ring: effect style `ds/focus/ring`, a 2px gap in `ds/background/100` plus a 2px ring in `ds/focus/color`. In code it appears on `focus-visible`; no component of the library binds this style.
- Text fields (Input, Select, Textarea, Combobox) show focus with `ds/focus/border` in the `active` state. Input and Textarea show an error with `ring/error`, `ring/error-hover` on hover; Select uses `ring/error` in all three `error` states.
- Hover, focus and error rings animate with Smart Animate on the curve `0.4, 0, 0.2, 1`: 150 ms in Input and Textarea, 200 ms in Select. Do not rebuild these; set the component `state` or leave the default reactions.

## Clipping

- The 1px border of a material is a shadow with 1px spread, drawn outside the edge of the layer. A frame that carries a `ds/shadow/*` style shows the border only while its Clip content is on, so such a frame clips and needs padding of at least 4px. The error ring of Input and Textarea (`ring/error`) and the focus ring (`ds/focus/ring`) reach 4px outside.
- A new frame in Figma has `Clip content` on, and a frame that clips cuts everything outside its own edge. A component placed against the edge of such a frame (padding 0, or `Fill container` without padding) loses its border on that side, and an error ring loses up to 4px.
- On a frame that holds components turn `Clip content` off, or keep the padding at least as wide as the ring (4px). `geistFrame` leaves clipping off unless `clip: true` or the frame carries an effect style; `scripts/figma/audit.js` reports clipping frames with components at their edge.
- Library components clip too: the root of `Table`, its `Table Body` and the footer of a `Fieldset` have Clip content on, so a menu that opens out of a Table cell is cut unless Clip content is turned off there (`recipes/interactive-overlays.md`, A menu inside a Table cell).
- Clip only when the frame must cut something on purpose: a scrolling list, rounded corners over an image, a card that crops its content.
