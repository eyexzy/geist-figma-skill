# Input

Retrieve text input from a user.

Source of the Best Practices: https://vercel.com/geist/input

Contents: Best Practices, When to use, Behavior, Content, Accessibility, Figma Guidelines, Anatomy, Input properties, _Input Prefix properties, _Input Suffix properties, _Input Text properties, Assembly, Layout, Motion, Tokens, Behavior in Code, Props in code, Runtime in code, Best Practices vs code

## Best Practices

### When to use

- Pick `<Input>` for a single line of free-form text such as names, domains, or tokens.
- Switch to **Textarea** the moment content can wrap to multiple lines.
- Use **Combobox** when the value comes from a known list the user filters by typing.
- For an inline search box, set the `search` variant with a scoped placeholder like `Search projects`; don’t embed a `<SearchInput>` inside an unrelated form.

### Behavior

- Validate on blur, not on every keystroke; surface the message by passing a string to `error`.
- Trim leading and trailing whitespace before submit so ` example.com` and `example.com` resolve to one value.
- Keep the field focusable while saving; pair `disabled` with a spinner only when input is impossible.
- Don’t wrap a labelled `<Input>` in a **Tooltip**; put the explainer on a sibling icon button so the label stays announced.

### Content

- Labels are short Title Case nouns: `Project Name`, `Domain`, `Environment Variable Name`.
- Placeholders show an example value (`my-awesome-project`, `example.com`), never instructions like `Enter your project name`.
- Helper text is sentence case, one sentence with a trailing period, on a sibling element wired through `aria-describedby`.
- Validation names the field and the constraint, ends in a period, and skips `please` (`Project name is required.`, `Code must be 6 digits.`).

### Accessibility

- Passing a string to `label` requires `id`; the `InputPropsWithStringLabelAndId` union won’t compile without it and screen readers lose the association.
- For icon-only affordances inside a row of inputs, use `<Button shape="circle" svgOnly aria-label="…">` rather than an unlabeled icon.
- A `SearchInput` placeholder names the scope (`Search projects`) so the role is clear without sighted context.

## Figma Guidelines

### Anatomy

- `Input` — `<Input>`: `Label` above the field and `Error` below it. The field holds `Prefix`, `Text Input` and `Suffix`.
- `_Input Prefix` — the `prefix` of code: an icon or a string before the text.
- `_Input Text` — the placeholder or typed value inside `Text Input`.
- `_Input Suffix` — the `suffix` of code: an icon, a string or a keyboard hint after the text.

### Input properties

- `size` — `small`, `medium` or `large`. `large` also raises the text to 16px and the radius to 8px.
- `state` — `default`, `hover`, `active`, `error`, `error-hover`, `error-active` or `disabled`. `active` is the focused field.
- `rounded` — `true` turns the field into a pill.
- `showLabel` — shows `Label`, the `label` of code.
- `showPrefix` and `showSuffix` — show `Prefix` and `Suffix`, the `prefix` and `suffix` of code.
- `Error` appears in the three `error` states; its `message` is the string passed to `error` in code.
- `Label`, `Prefix`, `Text`, `Suffix` and `Error` are exposed on the instance with their own properties.

### _Input Prefix properties

- `type` — `icon` or `text`. `icon` swaps the icon and `prefix` sets the string.
- `prefixStyling` — `true` puts the content in its own box with a divider.
- `prefixStyling=false` leaves the content on the field fill.
- `size` — `small`, `medium` or `large`, the size of the field it sits in.

### _Input Suffix properties

- `type` — `icon`, `text` or `kbd`. `icon` swaps the icon and `suffix` sets the string.
- `kbd` — the `⌘` `K` hint of `<SearchInput cmdk />`; it comes with `suffixStyling` `false` only.
- `suffixStyling` — `true` puts the content in its own box with a divider.
- `suffixStyling=false` leaves the content on the field fill.
- `size` — `small`, `medium` or `large`, the size of the field it sits in.

### _Input Text properties

- `type` — `placeholder`, `value` or `disabled`; `text` holds the string.
- `size` — `medium` is 14px/20px and `large` is 16px/24px; `small` fields use `medium`.

### Assembly

- Show typed text by setting `type` to `value` on the exposed `Text` and writing `text`. The field starts as a `placeholder`.
- In `disabled` keep `Text` on `disabled`; it carries the disabled color.
- Set `state` to `error` and write the message in `message` on the exposed `Error`.
- Build the look of `<SearchInput>` from a search icon in `Prefix` with `prefixStyling` `false`. Set `suffixStyling` to `false` on `Suffix`, then `type` to `kbd` for the shortcut hint.
- Build the look of `<ClearableInput>` from `kbd` in `Suffix`: turn off `showKbd2` and `showKbd3` on `Keybind`, then turn off `meta`, turn on `showLabel` and write `Esc` in `label` on `Kbd 1`.
- Set the instance to `Fill container` to follow its parent.

### Layout

- The field is 32px, 36px and 40px high at `small`, `medium` and `large`.
- Text sits 12px from each side of the field.
- Text is 14px/20px at `small` and `medium` and 16px/24px at `large`.
- The 1px border is a ring drawn outside the field, so the height stays 32px, 36px and 40px.
- A styled `Prefix` or `Suffix` box has 12px of padding on each side, 8px at `small`.
- The 1px divider of a styled box sits on its inner edge.
- Icons are 14px at every size.
- With `prefixStyling` `false` the `Prefix` has 12px on its left, 8px at `small`, and ends at the content.
- With `suffixStyling` `false` an icon or text `Suffix` keeps its 12px of padding on both sides, 8px at `small`.
- `kbd` keys are 20px squares 6px apart, ending 10px from the right edge.
- `Label` sits 8px above the field and `Error` sits 8px below it.
- `Error` is 13px/20px at `small` and `medium` and 16px/24px at `large`.

### Motion

- Hover, focus and error rings use `Smart Animate`, bezier `0.4, 0, 0.2, 1`, 150ms.
- `Mouse enter` in `default` runs `Change to` `hover`. In `hover`, `Mouse leave` returns and `On click` runs `Change to` `active`.
- `On click` in `active` returns to `hover`. `error` follows the same chain through `error-hover` and `error-active`.
- `disabled` keeps its ring on hover.

### Tokens

- Field — `ds/background/100` fill, `ds/gray/100` in `disabled`.
- Radius — `tailwind/radius/md`, `tailwind/radius/lg` at `large`, `tailwind/radius/full` with `rounded`.
- Ring — `ring/gray-alpha-400` in `default` and `disabled`, `ring/gray-alpha-500` in `hover`, `ds/focus/border` in `active`.
- Error ring — `ring/error` in `error` and `error-active`, `ring/error-hover` in `error-hover`.
- `Text` — `ds/gray/700` as `placeholder`, `ds/gray/1000` as `value`, `accents/3` as `disabled`.
- Text — 14px with 20px line height at `small` and `medium`, 16px with 24px at `large`.
- Styled box — `ds/background/200` fill and `ds/gray/alpha/400` divider; unstyled, the field fill shows.
- `Prefix` content — `ds/gray/700`. `Suffix` content — `ds/gray/1000`.
- Box text — 14px at `small` and `medium`, 16px at `large`.
- Padding — `tailwind/space/12`, `tailwind/space/8` in a `small` box and `tailwind/space/10` right of `kbd`.
- Gap between `Label`, field and `Error` — `tailwind/space/8`.

## Behavior in Code

### Props in code

- `rounded` adds a 12px top margin (`mt-3`) to the field.
- `typeName` defaults to `text`, `autoComplete` to `off`, `autoCorrect` to `off`, `autoCapitalize` to `none`.
- `spellCheck` defaults to `false`, and `showErrorMessage` defaults to `true`.
- `width` sets the field width, and the field is capped at `max-w-full`.

### Runtime in code

- The field is an `<input>` in a `div` with `data-geist-input-wrapper`.
- Prefix and suffix are `<label>` elements tied to the input with `htmlFor`, so a click on either focuses the field.
- With `prefixStyling={false}` the input is pulled back with `-mr-3`.
- `medium` uses the `small` `Error` size.
- Rings transition with `transition-all duration-150`.
- `disabled` keeps its ring on hover.
- `aria-invalid` follows `error`, and `aria-describedby` points to the `Error` id.
- `<SearchInput>` and `<ClearableInput>` show the `Esc` key in the suffix while the field holds a value. The key clears the field; `<ClearableInput>` also clears it on Escape.

### Best Practices vs code

- Best Practices name a `search` variant. The published `<Input>` has none: search is the separate `<SearchInput>`, and the set follows that code.
