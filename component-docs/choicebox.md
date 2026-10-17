# Choicebox

A larger form of Radio or Checkbox, where the user has a larger tap target and more details.

Source of the Best Practices: https://vercel.com/geist/choicebox

Contents: Best Practices, When to use, Behavior, Content, Accessibility, Figma Guidelines, Anatomy, Choicebox Group properties, _Choicebox Group Item properties, Prototyping, Assembly, Layout, Motion, Tokens, Behavior in Code, Props in code, Accessibility in code, Motion in code

## Best Practices

### When to use

- A choice that benefits from a larger tap target plus a description or icon, like a framework picker, plan comparison, or deployment region with latency.
- Single-select for mutually exclusive choices, multi-select for additive ones. Don’t mix the two within one group.
- Cap at 4–6 tiles. Past that, switch to **Select** or **Combobox** so the page doesn’t scroll for a single field. For plain text labels with no description, use **Radio**.

### Behavior

- The whole tile is the click and focus target; tapping anywhere inside selects it. Don’t place nested buttons or links inside a tile that would steal the click.
- Selected state shows a check or filled dot in the corner. The border highlight alone isn’t enough on low-contrast screens.
- Disabled tiles need a Tooltip naming why (`Available on Pro`). A faded tile with no reason reads as broken.

### Content

- Titles are parallel: one Title Case title plus one sentence-case description per tile, ending in a period.
- Don’t restate the title in the description. The description adds the differentiator (`$20/mo · 100 GB bandwidth`), not a synonym.
- Icons are decorative when paired with a title; if the icon is the only label, give the tile an `aria-label` naming the choice.

### Accessibility

- Tiles render as radios or checkboxes under the hood, so keep them inside a `<fieldset>` with a `<legend>` so screen readers announce the group.
- Arrow keys move within a single-select group, Space toggles in multi-select. Don’t override those keys with custom handlers.
- Color is not the selection signal. Pair the highlight border with the corner check so colorblind users still see what’s active.

## Figma Guidelines

### Anatomy

- `Choicebox Group` — `<ChoiceboxGroup>`: an optional `Label`, then a row of six slots, `Item 1 Slot` to `Item 6 Slot`, each holding a `_Choicebox Group Item`.
- `_Choicebox Group Item` — `<ChoiceboxGroupItem>`: `Row` with the title, the description and `Indicator`, a `_Radio Group Item` or a `_Checkbox Item`; then `Custom Content`.

### Choicebox Group properties

- `type` — `radio` or `checkbox`, the `type` of `<ChoiceboxGroup>`; it switches every tile and the group role, `radiogroup` or `group`.
- `checked` — `1` to `6` selects one tile in a `radio` group; `none` leaves all empty.
- In code `checked` is `value`.
- A `checkbox` group stays at `none`, and each tile sets its own `checked`.
- `disabled` — `true` disables every tile, as the group `disabled` prop. A single tile disables through its own `state`, as `disabled` on `<ChoiceboxGroupItem>`.
- `showLabel` shows `Label` above the row.
- `showItem3` – `showItem6` add tiles three to six to the two that are always shown.
- `Label` and the visible tiles are exposed on the instance.

### _Choicebox Group Item properties

- Code hides an empty `description`, as `showDescription=false` does here.
- `showCustomContent` is the item's `children`; it shows on a checked, enabled tile, and its `Badge` is editable on the instance.
- A disabled tile's Tooltip comes from `disabledReason` in code.

### Prototyping

- Clicking an unchecked tile of a `radio` group sets the group's `checked` to that tile.
- A checked tile stays as it is.
- Tiles in a `checkbox` group toggle themselves on click, so any number can be checked.
- Hover runs inside each `_Choicebox Group Item`; `disabled` tiles stay static.

### Assembly

- Keep `checked` on a visible tile: `checked=4` with `showItem4` off selects a hidden tile.
- Select through the group's `checked` in a `radio` group. A tile's own `checked` override survives switching the group variant and leaves two tiles checked.
- In a `radio` group the checked tile sets the height and the others fill it.
- A filled tile stops at that height and clips longer text; set such a tile to `Hug contents`.
- In a `checkbox` group set the shorter tiles to `Fill container` by hand.
- Resize the group for width; the tiles share it equally.

### Layout

- Group — the set is 960px wide so six tiles keep one-line text.
- Tiles sit 12px apart (`gap-3`), `Label` 8px above the row.
- Tile — 70px tall: 1px border, 12px padding (`p-3`).
- Title and description are 14px/20px and 4px apart; the indicator sits 24px after the text (`gap-6`).
- Custom content adds 41px: a 1px border and 40px of content with 8px padding.

### Motion

- Hover: `Smart Animate`, bezier `0.4, 0, 1, 1`, `150ms`.
- Clicks switch instantly: a cross-fade between variants with different nested instances flickers.

### Tokens

- Tile — border `ds/gray/400`, hover `ds/gray/500` with a `ds/gray/100` fill; checked border `ds/blue/600`, fill `ds/blue/100`, `ds/blue/200` on hover; radius `tailwind/radius/md`.
- Text — title `ds/gray/1000` in Medium 14px, description `ds/gray/900` in Regular 14px; both have a 20px line height.
- Both texts use `ds/blue/900` when checked and `ds/gray/800` when disabled.
- Indicator — `ds/gray/500`, `ds/gray/700` on hover, `ds/blue/900` when checked; disabled checked radio `ds/gray/900`, checkbox `ds/gray/600`.

## Behavior in Code

### Props in code

- Code renders any number of `<ChoiceboxGroupItem>`.
- `<ChoiceboxGroup>` fills its container; `<ChoiceboxGroupItem>` tiles in a `radio` group stretch with `items-stretch` and `flex-1`.
- `controlPosition` defaults to `end`; `start` puts the indicator before the text.
- `required` sets `aria-required` on the group, and a `checkbox` group sets `aria-multiselectable`.

### Accessibility in code

- The same `label` string becomes the group’s `aria-label` while `showLabel` is off.

### Motion in code

- Hover colors transition with `transition-colors duration-150 ease-in`.
