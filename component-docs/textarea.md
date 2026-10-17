# Textarea

Retrieve multi-line user input.

Source of the Best Practices: https://vercel.com/geist/textarea

Contents: Best Practices, Figma Guidelines, Anatomy, Textarea properties, _Textarea Text properties, Assembly, Layout, Motion, Tokens, Behavior in Code, Props in code

## Best Practices

- Pick `<Textarea>` for content that wraps to multiple lines (commit messages, descriptions, notes); use **Input** for a single value like a name or domain.
- Set a generous default `rows` and grow only when the surface has vertical room; don’t let the field push primary actions below the fold.
- Validate on blur and pass a string to `error` to render the inline message; the validation replaces helper text on failure.
- Trim leading and trailing whitespace on submit so empty newlines don’t pass a `required` check.
- Labels are short Title Case nouns (`Description`, `Release Notes`); placeholders show an example value, not instructions like `Enter a description`.
- Validation names the field and constraint, ends in a period, and skips `please` (`Description is required.`, `Release notes can’t exceed 500 characters.`).
- Render helper text as a sibling `<p>` linked through `aria-describedby`; sentence case, one sentence, with a period.

## Figma Guidelines

### Anatomy

- `Textarea` — `<Textarea>`: `Label` above `Wrapper`, which holds `Text`, and `Error` below it.
- `_Textarea Text` — the placeholder, value or disabled text inside `Wrapper`.
- In code the field is a `<textarea>` in a `div` with `data-geist-textarea-wrapper`.
- Ring, radius and text size come from the same variants as `<Input>` (`inputVariants`).

### Textarea properties

- `size` — `small`, `medium` or `large`. `large` also raises the text to 16px and the radius to 8px.
- `state` — `default`, `hover`, `active`, `error`, `error-hover`, `error-active` or `disabled`. `active` is the focused field.
- `showLabel` — shows `Label`, the `label` of code.
- `Error` appears in the three `error` states; its `message` is the string passed to `error` in code.
- `Label`, `Text` and `Error` are exposed on the instance with their own properties.

### _Textarea Text properties

- `type` — `placeholder`, `value` or `disabled`; `text` holds the string.
- `size` — `medium` is 14px/20px and `large` is 16px/24px; `small` fields use `medium`.
- `disabled` colors both the placeholder and the value, as `disabled` does in code.

### Assembly

- Set the height by resizing the instance: `Wrapper` fills it, at least 100px high. Code gives `rows` lines, two by default.
- Set the instance to `Fill container` for the width; code fills its container (`w-full`).
- Show typed text by setting `type` to `value` on the exposed `Text`; the field starts as a `placeholder`.
- In `disabled` keep `Text` on `disabled`; it carries the disabled color.
- Set `state` to `error` and write the message in `message` on the exposed `Error`.

### Layout

- Text sits 10px from the top and bottom and 12px from the sides (`py-2.5 px-3`).
- Text is 14px/20px at `small` and `medium` and 16px/24px at `large`.
- Height is the rows times the line height plus 20px: `rows={5}` is 120px at `medium`.
- The 1px border is an outside ring (`box-shadow`), so the height is unchanged.
- The drag handle is hidden by `resize-none`; the `resize` prop turns it on.
- `Label` sits 8px above the field (`mb-2`).
- `Error` sits 8px below the field.
- `Error` is 13px/20px at `small` and `medium` and 16px/24px at `large`.

### Motion

- Hover, focus and error rings: `Smart Animate`, bezier `0.4, 0, 0.2, 1`, `150 ms` — code `transition-all duration-150`, whose default easing is that bezier.
- `Mouse enter` in `default` runs `Change to` `hover`. In `hover`, `Mouse leave` returns and `On click` runs `Change to` `active`.
- `On click` in `active` returns to `hover`. `error` follows the same chain through `error-hover` and `error-active`.
- `disabled` keeps its ring on hover, as in code.

### Tokens

- Field — `ds/background/100` fill, `ds/gray/100` in `disabled`.
- Radius — `tailwind/radius/md`, `tailwind/radius/lg` at `large`.
- Ring — `ring/gray-alpha-400` in `default` and `disabled`, `ring/gray-alpha-500` in `hover`, `ds/focus/border` in `active`.
- Error ring — `ring/error` in `error` and `error-active`, `ring/error-hover` in `error-hover`.
- `Text` — `ds/gray/700` as `placeholder`, `ds/gray/1000` as `value`, `accents/3` as `disabled`.
- Padding — `tailwind/space/10` above and below, `tailwind/space/12` at the sides.
- Gap between `Label`, field and `Error` — `tailwind/space/8`.

## Behavior in Code

### Props in code

- `resize` sets the `resize` style of the `<textarea>`, and `width` sets the width of the field and `Error`.
- `spellCheck` defaults to `false`; `autoCapitalize`, `autoComplete` and `autoCorrect` default to `off`.
- `Error` is `small` at `small` and `medium`, and `large` at `large`.
