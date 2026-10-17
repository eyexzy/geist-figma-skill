# Collapse

A set of headings, vertically stacked, that each reveal an related section of content. Commonly referred to as an accordion.

Source of the Best Practices: https://vercel.com/geist/collapse

Contents: Best Practices, When to use, Behavior, Content, Accessibility, Figma Guidelines, Anatomy, Collapse properties, Collapse Group properties, Content slot, Prototyping, Assembly, Layout, Motion, Tokens, Behavior in Code, Props in code, Runtime in code, Motion in code

## Best Practices

### When to use

- Use Collapse for optional, advanced, or repetitive content that most users skip on most visits (FAQ, advanced settings, request payload preview).
- For top-level structure that every user reads, use page sections with regular headings; collapsing primary content hides what the page is about.
- Single Collapse for one optional block. `CollapseGroup` for a related set; switch to **Tabs** when the items are sibling views, not optional drill-downs.

### Behavior

- Default state is closed unless the first-time visitor must read the content to act.
- Inside a `CollapseGroup`, allow only one panel open at a time when items are mutually exclusive; allow multiple when items are independent.
- Animate the open/close transition; jump-cuts make the page feel like it teleported.
- Don’t nest Collapse more than one level deep. Two-level nesting hides too much and breaks the keyboard tab path.

### Content

- Heading is Title Case and names the topic, not the action (`Advanced Settings`, not `Show Advanced Settings`).
- Body is sentence case prose with normal section formatting; treat the panel as a small page, not a tooltip.
- Don’t put primary destructive actions inside a closed Collapse; the user has to click twice to reach the warning.

### Accessibility

- The trigger is a `<button>` with `aria-expanded` that flips on toggle and `aria-controls` pointing at the panel id.
- Enter and Space toggle. Don’t bind any other key globally; arrow keys move focus inside the panel content.
- Render the panel content in the DOM when closed (with `hidden` or visibility) so search and find-in-page still hit it; lazy-render only for expensive content.

## Figma Guidelines

### Anatomy

- `Collapse` — `<Collapse>`: `Button`, the trigger row with the title and `Chevron`, above the `content` slot.
- `Collapse Group` — `<CollapseGroup>`: a column of `Item 1` – `Item 6`, each a `Collapse`.

### Collapse properties

- `open` — the panel state.
- `content` — slot for the panel, `children` in code; a `Copy/16` paragraph by default.
- `showBorderTop` — the 1px line above the title. The items in a group hide theirs.

### Collapse Group properties

- `multiple=false` keeps one panel open at a time, the default of `<CollapseGroup>`.
- `multiple=true` lets every item open on its own.
- `expanded` — `none` or `1` – `6`, the open item while `multiple` is `false`. A `multiple` group stays at `none`; each item sets its own `open`.
- `size` — switches every item.
- `showItem3` – `showItem6` add items three to six to the two that are always shown. The items are exposed on the instance.

### Content slot

- Edit the panel text right in the slot by double-clicking the `Paragraph` on the instance.
- Inside a group, double-click into the item first.
- Figma binds component properties outside slots only, so the text is edited in place.
- Hide or delete the `Paragraph` for an empty panel. Add layers below it for richer content, stacked 16px apart.
- Edit on an open item; the closed variant hides the slot. In a `multiple=false` group switch `expanded` to the item rather than its `open`. The content stays through `open`, `expanded` and `size` changes.
- The slot takes any layers: paragraphs, lists, a **Code Block**. The default paragraph is the `text-copy-16 mb-4` of the demos: `Copy/16` with 16px below.
- The slot grows with its content.

### Prototyping

- Only a click on `Button`, the title row, toggles `open`.
- With `multiple=false` a click on item N switches the group to `expanded=N`.
- A click on the open item returns the group to `none`.
- With `multiple=true` each item toggles itself.

### Assembly

- Open items through `expanded` in a `multiple=false` group. An item’s own `open` override survives switching `expanded` and leaves two panels open.
- Keep `expanded` on a visible item: `expanded=4` with `showItem4` off opens a hidden item.
- Resize the group for width; the items fill it.

### Layout

- `medium` — 84px row: 24px above and below (`py-6`) a 24px/36px SemiBold title.
- `small` — 48px row: 12px above and below (`py-3`) a 16px/24px Medium title.
- Title and the 16px chevron sit at opposite ends (`justify-between`); the panel is flush to the sides.

### Motion

- Open and close: `Smart Animate`, bezier `0.4, 0, 0.2, 1`, `200ms`.
- The chevron turns 90° to point down when open (`rotate-90`).

### Tokens

- Borders `accents/2`, the `--accents-2` of code; title and chevron `ds/gray/1000`; default paragraph `Copy/16` in `ds/gray/1000`.
- Titles are set by hand at 24px/36px (`medium`) and 16px/24px (`small`).

## Behavior in Code

### Props in code

- `defaultExpanded` sets the first state, then the trigger toggles it.
- A single `<Collapse>` has the top line; `<CollapseGroup>` draws it itself.
- Code sets `size` on each `<Collapse>`.
- Code renders any number of `<Collapse>`.
- Closed content is `inert`; `unmountContentWhenCollapsed` defaults to `false`.
- In a `<CollapseGroup>`, `onToggle` fires on each trigger click and `onExpand` when a closed item opens.
- `<CollapseGroup>` fills its container.
- Titles use `text-[24px]` and `text-[16px]` with a line height of 1.5 times the font size.

### Runtime in code

- Code caps the panel at 60% of the viewport and scrolls the rest (`max-h-[60vh]`).

### Motion in code

- The panel height and the chevron animate with `duration-200 ease-in-out`.
