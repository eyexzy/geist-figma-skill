# Radio

Provides single user input from a selection of options.

Source of the Best Practices: https://vercel.com/geist/radio

Contents: Best Practices, When to use, Behavior, Content, Accessibility, Figma Guidelines, Anatomy, Radio Group properties, Radio properties, _Radio Group Item properties, Assembly, Layout, Motion, Tokens, Behavior in Code, Props in code, Accessibility in code, Motion in code

## Best Practices

### When to use

- A single choice from 2–6 mutually exclusive options where seeing every option matters (deploy regions, plan tiers, billing cycle).
- Past 6 options, switch to **Select** or **Combobox** so the list doesn’t dominate the form.
- For binary on/off, use **Toggle**. For richer per-option content (icon, description, badge), use **Choicebox**.

### Behavior

- Pre-select the safest default so the field reads as configured, never as required-but-empty. Skip the default only when the choice has real consequences and you want a deliberate pick.
- Required state goes on the `RadioGroup`, not on individual options. Required-against-a-single-radio is meaningless.
- Arrow keys move selection within the group and skip disabled options. Tab moves to the next field, not the next radio.

### Content

- Group label is a Title Case noun like `Deployment Region` or `Billing Cycle`. Render it via `<legend>` or a sibling label tied with `aria-labelledby`.
- Option labels are parallel: same part of speech, same length range, same register. `Monthly` / `Yearly`, not `Monthly` / `Pay yearly`.
- Disabled options need a Tooltip naming why (`Available on Pro and Enterprise`). A greyed-out radio with no reason reads as broken.

### Accessibility

- Wrap related radios in `<fieldset>` + `<legend>` so screen readers announce the group name before each option.
- The standalone unlabeled radio (custom UI) needs an `aria-label` describing the choice. Never ship a radio with no accessible name.
- Don’t replace the native focus ring with a CSS hack that drops outline-offset; keyboard users lose track of which option is focused.

## Figma Guidelines

### Anatomy

- `Radio Group` — `<RadioGroup>`: six layers, `Item 1` to `Item 6`, each an instance of `_Radio Group Item`, stacked vertically.
- `Radio` — `<Radio>`: one `_Radio Group Item` outside a group.
- `_Radio Group Item` — `<RadioGroupItem>`: `Ring` with a `Dot`, then `Label`.

### Radio Group properties

- `checked` — `1` to `6`, the selected item. Hidden items keep their numbers.
- `disabled` — `true` sets every item to `disabled` and keeps the selection, as `disabled` on `<RadioGroup>` does.
- `showItem3` – `showItem6` — show or hide items 3 to 6; items 1 and 2 are always shown. The set holds six.

### Radio properties

- `checked` — `false`, `true`.
- The nested `Control` is exposed on the instance, so `showLabel`, `label` and `state` are set there.
- Both variants start with `showLabel` off, the unlabeled `<Radio>`.

### _Radio Group Item properties

- `checked` — `false`, `true`; `true` shows the `Dot`.
- `state` — `default`, `hover`, `active`, `disabled`.
- `hover` tints an unselected ring and leaves a selected one unchanged; `active` is the pressed look.
- `showLabel` — `false` hides `Label`; the ring alone is the unlabeled `<Radio>` and the `component` returned by `useRadio`.

### Assembly

- Select with `checked` on `Radio Group`. A `checked` override on a nested `Item N` survives later changes and leaves two radios selected.
- Edit option text through `label` on each `Item N` layer; it survives `checked` changes on `Radio Group`.
- Disable one option with `state=disabled` on its `Item N`.
- In the prototype the click reaction sits on the `Item N Slot` frame, so a disabled option still switches the group.
- Use `Radio` for a radio outside a group, such as custom UI. `On click` sets `checked=true`; once selected it stays selected, as a native radio does.

### Layout

- `Ring` 16px × 16px with a 1px border and a full radius; `Dot` 8px × 8px, centred.
- `Label` 8px after the ring, 13px with a 19.5px line, which makes the item 20px tall.
- Items stack 24px apart.

### Motion

- Hover: `Smart Animate`, bezier `0.4, 0, 1, 1`, 200ms.
- `On click` on an unselected `Item N Slot` runs `Change to` the variant with that `checked`.
- `On click` on an unchecked `Radio` runs `Change to` `checked=true`.
- Both click reactions are `Instant`.
- Hover reactions sit on the `default` variants of `_Radio Group Item` only; `active` is static and `disabled` ignores hover.

### Tokens

- Ring — `ds/background/100` fill, `ds/gray/700` border of `border/width/default`, radius `tailwind/radius/full`.
- Hover, unselected — fill `ds/gray/200`, border `ds/gray/900`.
- Selected — border and `Dot` `ds/gray/1000`. Active — border and `Dot` `ds/gray/600`.
- Disabled — border, selected `Dot` and `Label` `ds/gray/500` on the `ds/background/100` fill.
- `Label` `ds/gray/1000`; ring-to-label gap `geist/gap/quarter`, item stack `tailwind/space/24`.

## Behavior in Code

### Props in code

- `<RadioGroup>` takes any number of items.
- `<RadioGroup>` takes `value`, `onChange`, `name`, `required`, `disabled` and `label`, and leaves the gap between items to its parent.
- `<RadioGroupItem>` takes `fullWidth` and `noMarginLeft`; `label={false}` renders the bare radio.

### Accessibility in code

- `label` is `sr-only` text and `required` sets `aria-required`; both are accessibility-only, so the set leaves them out.

### Motion in code

- Border color and background transition with `duration-200 ease-in`.
- The dot scales in over 150ms with `ease-in`.
