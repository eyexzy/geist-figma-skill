# Checkbox

A control that toggles between two options, checked or unchecked.

Source of the Best Practices: https://vercel.com/geist/checkbox

Contents: Best Practices, When to use, Behavior, Content, Accessibility, Figma Guidelines, Anatomy, Checkbox properties, _Checkbox Item properties, Assembly, Layout, Motion, Tokens, Behavior in Code, Props in code, Runtime in code

## Best Practices

### When to use

- Multi-select inside a list, like table-row pickers, multi-pick filters, and opt-in preference groups.
- Acknowledgments where the user must affirm a specific statement (terms of service, irreversible export).
- For a single boolean setting like dark mode or password protection, use **Toggle**. The on/off mechanic is clearer there than a lone checkbox.

### Behavior

- Indeterminate is a visual state, not a third value. Drive it from a parent that knows partial selection, and clear it as soon as every child is fully checked or unchecked.
- Validation on a required acknowledgment fires on submit, not on blur, so checking and unchecking shouldn’t flash an error.
- Disabled checkboxes still need a Tooltip naming the reason; a greyed box with no explanation reads as a bug.

### Content

- Group label above a `<fieldset>` is a Title Case noun like `Notifications` or `Required Permissions`. No trailing colon.
- Acknowledgment label is a full sentence ending in a period: `I agree to the Terms of Service.`
- Indeterminate copy names the partial count next to the group label (`3 of 5 selected`). Never leave the dash state unlabeled.

### Accessibility

- Wrap related checkboxes in `<fieldset>` with a `<legend>` so screen readers announce the group name before each option.
- Row-select checkbox in a table has no visible label. Set `aria-label="Select {row name}"` so the row stays identifiable out of context.
- The click target already extends to the label. Don’t override the `<label>/htmlFor` association with a custom wrapper that breaks the click region.

## Figma Guidelines

### Anatomy

- `Checkbox` — `<Checkbox>`: one `_Checkbox Item` with the click built in.
- `_Checkbox Item` — `Box` with two marks, `Check` and `Dash`, then `Label`. The variant shows one mark at a time.

### Checkbox properties

- The nested `Control` is exposed on the instance, so `showLabel`, `label` and `state` are set there.

### _Checkbox Item properties

- `state=hover` tints unchecked and `indeterminate` boxes.
- A `true` box looks the same in `default` and `hover`.

### Assembly

- Stack a group with 16px between rows (`gap-4`).
- Use `showLabel=false` on the nested `Control` for a table row-select checkbox; the instance shrinks to the 16px box.
- For a group with a description per option, use **Choicebox** with `type="checkbox"`.
- `disabled` on `Checkbox` shows `Control` as `disabled` and removes the click reaction.

### Layout

- `Box` 16px × 16px, radius 4px (`rounded-sm`).
- Marks stroke 1.6px, the 2 units of a 20-unit viewBox drawn at 16px.
- `Label` 8px after the box (`ml-2`), 13px with 19.5px line height, so the row is 20px tall.

### Motion

- Hover: `Smart Animate`, bezier `0.4, 0, 0.2, 1`, `200ms`.
- Click: `On click` on `Checkbox` runs `Change to` the other `checked`, `false` to `true` and back, `Instant`.
- `indeterminate` stays put on click until the parent clears it.
- `disabled` stays static.

### Tokens

- Box — `ds/background/100` with a `ds/gray/700` border; `true` fills box and border with `ds/gray/1000`, the check is `legacy/background`.
- Dash `ds/gray/700`; hover fill `ds/gray/200`.
- Disabled — `ds/gray/100` box with a `ds/gray/500` border, `ds/gray/600` when checked; dash and label `ds/gray/500`.
- Label `ds/gray/1000`.

## Behavior in Code

### Props in code

- `indeterminate` is a separate prop and wins over `checked`: the dash shows whatever `checked` holds.
- `fullWidth` stretches the label row to `w-full`.
- `inverted` fills the box with `ds/gray/1000`.

### Runtime in code

- Keyboard focus adds `--ds-focus-ring` and tints an unchecked box with `ds/gray/200`.
- The box animates with `transition-all duration-200` on Tailwind's default easing.
- `peer-disabled` blocks the hover tint on the box.
