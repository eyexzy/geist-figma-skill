# Label

Accessible text label for form controls.

Best Practices: written by the author of this library from the Geist code; the site page https://vercel.com/geist/label has none.

Contents: Best Practices, Figma Guidelines, Anatomy, Label properties, Assembly, Tokens, Behavior in Code, Props in code

## Best Practices

- Use `<Label>` to name a form control. Pass the control’s `id` as `id`; the label renders it as `htmlFor`, so a click on the text focuses the control.
- Pass the text as `value`. `children` render inside the `<label>` after the text, so a control placed there is labelled without an `id`.
- Labels render in Title Case through `capitalize`: `email address` shows as `Email Address`. Set `bypassCasing` when the text must keep its own casing; without it `iOS app` renders as `IOS App`.
- `withInput` is on by default and gives the text a text cursor (`cursor-text`). Set `withInput={false}` when the label names a control that isn’t a text field: a switch, a select.
- The text carries its own 8px below (`mb-2`). Don’t add another gap between the label and the control; it doubles the space.

## Figma Guidelines

### Anatomy

- `Label` — `<Label>`: `Text`, the `value` inside a `<label>`. The control is a separate layer below it.

### Label properties

- `value` — the text. With `bypassCasing=false` `Text` applies Title Case, the `capitalize` of code; `true` shows it as typed.

### Assembly

- The component ends at the text; the parent frame adds the 8px gap below it.
- The text wraps at the instance width.

### Tokens

- `Text` is hardcoded Geist Regular 13px/19.5px in `ds/gray/900`.

## Behavior in Code

### Props in code

- `withInput` lives only in code; it sets `cursor-text` on the text.
- `<Label>` is a block that spans its container, `max-w-full`.
