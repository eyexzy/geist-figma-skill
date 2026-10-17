# Motion and prototyping

Source: the motion variables (`ds/motion/*`), the prototype reactions of every component set read from the Figma file (`node scripts/lookup.mjs motion <slug>`), the "Motion" and "Prototyping" sections of the Figma Guidelines, and Vercel's Web Interface Guidelines (MIT). The mechanics of wiring variables to open and close things are in `recipes/interactive-overlays.md`.

## Contents
- What Geist motion looks like
- Reactions of the library's components
- When to animate
- In Figma
- Limits

## What Geist motion looks like

- One curve in Geist: `ds/motion/timing/swift`, `cubic-bezier(.175, .885, .32, 1.1)`, a small overshoot. In code, Modal and Drawer transitions use it for 300 ms (`ds/motion/overlay/duration`) with an enter and exit scale of 0.96 (`ds/motion/overlay/scale`); Popover, Menu and Select transitions use it for 200 ms (`ds/motion/popover/duration`). In the Figma file, Modal and Command Menu close on this curve in 300 ms.
- Everyday state changes (hover, focus, toggles) use `0.4, 0, 0.2, 1` for 150 to 200 ms. Exceptions are in the table below and in `motion <slug>`.
- Menus, tabs and similar list controls react instantly on hover.
- The longest reaction in the file is the bottom Drawer at 500 ms, then the `Toasts` stack at 350 ms; every other reaction is 300 ms or less.

## Reactions of the library's components

Read from the Figma file. "Smart Animate" is the transition type between two variants of one component.

| Component | Trigger | Transition | Time and curve |
|---|---|---|---|
| Button, Note, Banner, Fieldset, Load More Button, Context Card | hover | Smart Animate | 150 ms, `0.4, 0, 0.2, 1` |
| Input, Textarea, Show More | hover, click | Smart Animate | 150 ms (Show More click 200 ms), `0.4, 0, 0.2, 1` |
| Toggle | click | Smart Animate | 150 ms, `0.4, 0, 0.2, 1` |
| Select, Combobox field | hover, click | Smart Animate | 200 ms, `0.4, 0, 0.2, 1` |
| Collapse | click | Smart Animate | 200 ms, `0.4, 0, 0.2, 1` |
| Pagination | hover | Smart Animate | 200 ms, `0.4, 0, 0.2, 1` |
| Switch | hover | Dissolve | 150 ms, `0.4, 0, 0.2, 1`; the click is instant |
| Checkbox | hover | Smart Animate | 200 ms, `0.4, 0, 0.2, 1`; the click is instant |
| Radio | hover | Smart Animate | 200 ms, `0.4, 0, 1, 1`; the click is instant |
| Choicebox | hover | Smart Animate | 150 ms, `0.4, 0, 1, 1`; the click is instant |
| Modal, Command Menu | backdrop click closes | Smart Animate | 300 ms, `0.175, 0.885, 0.32, 1.1` |
| Drawer (bottom sheet) | backdrop click closes | Smart Animate | 500 ms, `0.32, 0.72, 0, 1` |
| Sheet (side panel) | backdrop click closes | Smart Animate | 200 ms, `0.4, 0, 0.2, 1` |
| Feedback | hover, click, Esc | Smart Animate | 150 or 200 ms, `0.4, 0, 0.2, 1` and `0, 0, 0.2, 1`; the confirmation resets after 4 s |
| Toast | the `Toasts` stack on hover | Smart Animate | 350 ms, `0.25, 0.75, 0.6, 0.98`; a single toast on hover is 150 ms with `0.4, 0, 0.2, 1` |
| Copy Button, Snippet, Code Block copy | hover, click, back after 1 s | Smart Animate | 150 ms on hover, 200 ms on click and on the return |
| Table rows, Split Button | hover | Smart Animate | 150 ms, `0.4, 0, 0.2, 1` |
| Badge, Breadcrumbs | hover | Smart Animate, Dissolve on breadcrumb items | 200 ms, ease out |
| Code Block lines | hover | Smart Animate | 125 ms, ease out |
| Slider thumb | press | Smart Animate | 100 ms, `0.4, 0, 0.2, 1` |
| Menu, Tabs, Theme Switcher, Project Banner, File Tree, Calendar days | hover, click | instant | none |
| Tooltip, Relative Time Card | none in Figma | show and hide with a variable | in code the tooltip fades in over 100 ms after a 400 ms delay |
| Spinner, Loading Dots, Skeleton | loop | keyframes in the file, not reactions | Spinner 1000 ms for the small sizes, 1200 ms for the middle, 1300 ms for the largest, linear; Loading Dots 1.4 s; Skeleton shimmer 1.5 s, ease in and out |

`motion <slug>` prints every reaction of one component, with counts.

Do not rebuild these reactions. Set the component's own properties and its reactions stay. Where an overlay opens from your trigger, follow `interactive-overlays.md`: a boolean variable on the trigger and a variable-bound property on the overlay.

## When to animate

Rules from the Web Interface Guidelines that a designer decides:

- Animate only to clarify cause and effect, or for deliberate delight.
- Every animation has a reduced-motion version, or none; name it in the handoff.
- Motion can be interrupted by user input and starts where it physically comes from: a popover grows from its trigger.
- Delay the first tooltip in a group and show the following ones without delay.
- Avoid autoplay except muted, non-essential loops. Motion longer than 5 seconds next to other content needs pause, stop or hide controls.

## In Figma

- Use the transition the library uses for the same kind of change: Smart Animate for the hover of most controls and for overlays; Instant for menu rows, tabs and the click of Checkbox, Radio, Choicebox and Switch; Dissolve only on Switch, Error, Error Link and Breadcrumb items.
- For a reaction of your own, take the curve and time of the closest component from the table or from `motion <slug>`.
- Looping animations (Spinner, Loading Dots, Skeleton) play in Present mode. Set the timeline `Duration` of the top-level frame as the component's Motion section says (Loading Dots 1.4 s, Spinner 78 s, Skeleton 30 s).

## Limits

- The bundled data has the reactions of every component but not the keyframes of the loops. For the exact tracks of Spinner, Skeleton or Loading Dots, run `guide <slug> Motion` or open the component.
- The curves in a "Motion" section describe the Figma reactions. The code sometimes differs; for example the Sheet opens with a fade only. Each component's "Behavior in Code" says how.
