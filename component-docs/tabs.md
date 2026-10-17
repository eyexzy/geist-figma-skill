# Tabs

Display tab content.

Source of the Best Practices: https://vercel.com/geist/tabs

Contents: Best Practices, When to use, Behavior, Content, Accessibility, Figma Guidelines, Anatomy, Tabs properties, _Tab properties, Assembly, Layout, Motion, Tokens, Behavior in Code, Props in code, Best Practices vs code

## Best Practices

### When to use

- Use Tabs to switch between sibling views inside a single page (`Overview`, `Logs`, `Settings`).
- For navigation between unrelated pages, use a sub-menu, not Tabs. Tabs imply the views share scope, URL parent, and data model.
- Cap a Tabs row at 5–7 entries on desktop and 3–4 on mobile. Past that, consolidate or move secondary views behind a **Menu**.

### Behavior

- Selecting a tab is instant; don’t trigger network confirmation or toast on tab change.
- Reflect the active tab in the URL (query param or path) so deep-links and refresh restore state.
- Disable individual tabs only for permission or empty-state reasons; pair the disabled tab with a `tooltip` that names the constraint.

### Content

- `tabs[].title` is Title Case, 1–2 words, and names the destination noun (`Overview`, `Logs`, `Settings`). Verbs belong on buttons; `View Logs` is wrong on a tab.
- `tabs[].tooltip` is sentence case and explains the constraint (`Only visible to project owners.`), not the tab’s purpose.
- Don’t append a count to the title (`Logs (12)`); use a badge slot instead and drop the badge at zero.

### Accessibility

- Keep Left/Right arrows moving focus across tabs and Enter/Space activating; don’t hijack with global shortcuts.
- Label the tablist with `aria-label` when no visible heading sits above it (`aria-label="Sections"`).
- Maintain a visible focus ring on the active tab; don’t suppress focus styles for visual polish.

## Figma Guidelines

### Anatomy

- `Tabs` — `<Tabs>`: a row of up to five `_Tab` instances, `Tab 1` to `Tab 5`, each in a `Tab N Slot`.
- `Border` — the row line under `variant=primary`; in code `border={false}` removes it.
- `_Tab` — one tab: an optional `Icon`, then the `Title`. In code each `tabs` entry renders a `<button role="tab">`.
- In code the row is a horizontal `div role="tablist"`.

### Tabs properties

- `variant` — `primary` or `secondary`. `primary` underlines the selected tab; `secondary` fills it.
- `active` — 1 to 5: the selected tab. In code `selected` is the `value` of a tab and `setSelected` changes it.
- `showTab2` to `showTab5` — the tabs after the first. The set has five.
- Each nested `_Tab` is exposed on the instance with `label`, `showIcon`, `icon`, and `state`.
- In code Left and Right move focus to the neighbor and focus selects it; a disabled neighbor stops the move.

### _Tab properties

- `label` — the `title` of a `tabs` entry. `showIcon` and `icon` — its `icon`.
- `state` — `default`, `hover`, or `disabled`. `disabled` is `disabled: true` on a tab in code.
- `active` — `true` or `false`: the selected look, `aria-selected` in code.
- `variant` — `primary` or `secondary`, set by `Tabs`.

### Assembly

- Select a tab with `active` on `Tabs`. An `active` override on a nested `_Tab` survives later changes and leaves two tabs selected.
- Disable a tab with `state=disabled` on its `Tab N`; set it on every tab for `disabled` on `<Tabs>`.
- To drop the row line, hide `Border` on the instance.

### Layout

- `primary` tab — 50px tall: 14px above and below the text plus a 2px underline.
- `primary` tab — 2px padding left and right, tabs 24px apart.
- `secondary` tab — 32px tall, 12px side padding, radius 6px; tabs touch each other.
- Icon — 16px at `primary` and 14px at `secondary`, with 6px before the title.
- Text — Geist Regular 14px, line height 20px, at `primary`; `Label/13` at `secondary`. In code `text-sm` and `text-label-13`.
- Row line — 1px at the bottom edge; in code an inset shadow.
- At `secondary` the set adds 12px below the row.

### Motion

- Hover and click are `Change to`, `Instant`.
- Hover on a `_Tab` switches to its `hover` variant.
- Click on a `Tab N Slot` switches `Tabs` to `active=N`.
- Code changes tab color and fill at once.

### Tokens

- Text — `ds/gray/900`; hover and selected `ds/gray/1000`.
- Underline — `ds/gray/1000`, 2. Row line — `accents/2`.
- `secondary` selected and disabled fill — `ds/gray/200`, radius `tailwind/radius/md`.
- `primary` tab padding `tailwind/space/14` above, `tailwind/space/16` below, `tailwind/space/2` at the sides; tab gap `tailwind/space/24`.
- `secondary` side padding `tailwind/space/12`, also below the row; icon gap `tailwind/space/6`.
- In code keyboard focus shows `--ds-focus-ring` around the tab.

## Behavior in Code

### Props in code

- `tabs` takes any number.
- `disabled` on `<Tabs>` disables every tab, and each tab can carry a `tooltip` shown below it on hover.
- A `tabs` entry takes `title`, `value`, `icon`, `tooltip` and `disabled`.
- `variant` defaults to `primary` and `border` to `true`; `selected` with `setSelected` makes it controlled.
- The selected tab has `tabIndex` 0 and the others -1.

### Best Practices vs code

- Best Practices mention a badge slot; a `tabs` entry offers `icon` and `title`.
