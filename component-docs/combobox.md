# Combobox

Filters large lists to selectable options based on the matching query.

Source of the Best Practices: https://vercel.com/geist/combobox

Contents: Best Practices, When to use, Behavior, Content, Accessibility, Figma Guidelines, Anatomy, Combobox properties, _Combobox Input properties, _Combobox List properties, _Combobox Option properties, Assembly, Layout, Motion, Tokens, Behavior in Code, Props in code, Runtime in code, Responsive in code, Motion in code, Best Practices vs code

## Best Practices

### When to use

- Pick `<Combobox>` when users type to filter a known list of values (regions, frameworks, env-var names).
- For short, fixed lists where typing adds nothing, switch to **Select**.
- When more than one value can be chosen at once, use **MultiSelect**.
- For free-form filter strings that don’t resolve to a single option, drop in **Input** with the `search` variant.

### Behavior

- Show a loading state for async results; don’t collapse the list while the request is in flight.
- Render a custom empty state of the form `No {items} match "{query}"` rather than a bare `No results`.
- Inside a **Modal**, Geist switches to a Dialog on mobile automatically; don’t layer a second portal.
- Keep arrow-key navigation through `<Combobox.Option>` items; don’t hijack Enter to submit the surrounding form while the list is open.

### Content

- Visible label is a short Title Case noun (`Region`, `Environment Variable Name`).
- Placeholder is the inline hint: `Search regions`, `DATABASE_URL`. Never bare `Search…` and never the label restated.
- Option text is Title Case for short values and matches canonical branding (`Next.js`, not `NextJS`); same register across the list.
- Validation names the field and constraint, sentence case with a period (`Select a region.`).

### Accessibility

- `<Combobox>` has no `label` prop; pair a sibling `<Label htmlFor>` with the root `id`, or set `aria-label` on the root for icon-only triggers.
- The root accepts `aria-label` only; there is no `aria-labelledby` prop, so the sibling-label path is the way to reference visible text.
- Trap focus inside the popover when nested in a **Modal** so Tab cycles options instead of the page behind it.

## Figma Guidelines

### Anatomy

- `Combobox` — `<Combobox>`: the field and its list, joined by reactions.
- `Trigger` — the field row: `Input` with `Trigger Hit` and `Clear Hit` above it.
- `Trigger Hit` — a transparent frame over the field that sets its state and opens the list.
- `Clear Hit` — a transparent frame over the clear control that empties the field.
- `_Combobox Input` — `<ComboboxInput>`: the field on its own, with its own hover and click states.
- `List` — an instance of `_Combobox List` placed 8px below the field.
- `_Combobox List` — `<ComboboxList>`: the popover; its `children` slot holds the options.
- `_Combobox Option` — `<ComboboxOption>`: one row of the list.

### Combobox properties

- `size` — `small`, `medium`, or `large`: field height 32px, 36px, or 40px; `Input`, `Clear Hit`, and `List` follow it.
- `disabled` — `false`, `true`.
- `errored` — `false`, `true`; `disabled` wins when both are `true`.
- A `disabled` variant sets `Input` to `disabled` and omits `Trigger Hit`, `Clear Hit`, and `List`.

### _Combobox Input properties

- `size` — `small`, `medium`, or `large`: height 32px, 36px, or 40px; `large` text is 16px/24px.
- `state` — `default`, `hover`, `active`, `error`, `error-hover`, `error-active`, or `disabled`.
- `clearable` — `false` shows `placeholder` and a chevron; `true` shows `value` and a clear control.
- `showPrefix` with the `prefix` swap — the leading icon.

### _Combobox List properties

- `variant` — `default` shows the `children` slot; `empty` shows `emptyMessage`.
- `emptyMessage` — the text of the `empty` variant.
- `children` — a slot for `_Combobox Option` rows.

### _Combobox Option properties

- `label` — the row text, truncated at the row width.
- `showPrefix` with the `prefix` swap — the leading icon; `showSuffix` with the `suffix` swap — the trailing element.
- `suffixType` — `check` ends the row with the selection mark shown by `showCheck`; `custom` ends it with the `suffix`.
- `suffixText` — a slot beside the icon for text, shown by `showSuffixText`.
- `state` — `default` or `hover`.

### Assembly

- Resize the `Combobox` instance to the width the layout needs; the field fills it and `List` stretches with it.
- Select `Input` inside `Trigger` to change `placeholder` and the prefix.
- Change `size` on `Combobox` rather than on `Input`; `List` and `Clear Hit` follow only `Combobox`.
- `List` is hidden until `state/list/open` from `Prototyping / Combobox` is `true`; turn it on to edit the list.
- Add options to the `children` slot of `List`; rows stack from the top with 0px between them.
- To add option `<N>`, duplicate an option and bind its `state` to `item/<N>/highlight` and `showCheck` to `item/<N>/selected`.
- Option N writes `item/N/highlight` on hover and `item/N/selected` on click.
- The slot supports ten options, one for each `item/N/highlight` and `item/N/selected`.
- Give each option a `label` and write the same text in the `input/value` action of its click reaction.
- `Trigger Hit` sets `input/field-state` on mouse enter and leave, and toggles `state/list/open` on click.
- Opening the list also sets `item/1/highlight` to `"hover"` and the other `item/N/highlight` to `"default"`.
- An option sets `input/value` to its text, `input/has-value` to `true`, `state/list/open` to `false`, and `input/field-state` to `"default"`.
- An option sets its own `item/N/selected` to `true` and the other options to `false`.
- `Clear Hit` sets `input/value` to an empty string, `input/has-value` to `false`, `state/list/open` to `false`, and `input/field-state` to `"default"`.
- `Clear Hit` also sets every `item/N/selected` to `false`.
- `input/field-state` drives `state` of `Input`, `input/has-value` drives its `clearable`, and `input/value` drives its `value`.
- In `errored`, `input/field-state-errored` drives `state` of `Input`: `error`, `error-hover`, `error-active`.
- An `errored` variant keeps `Trigger Hit`, `Clear Hit`, and `List` and shares the other variables.
- An option sets `input/field-state-errored` to `"default"`, and `Clear Hit` sets it to `"error-hover"`.
- Unbind `clearable` or `value` on `Input` to set them by hand. Use `disabled` or `errored` on `Combobox` for those states.
- `state/list/open` shows `List`, and `input/has-value` shows `Clear Hit`.
- To run another Combobox independently, create its own `state/list/open`, `input/field-state`, `input/has-value`, and `input/value`, then rebind the bindings and reactions.

### Layout

- The field has 10px left padding and a 6px radius; prefix, text, and suffix are 10px apart.
- The suffix is 26px wide with 12px right padding, so the text area ends 36px from the right edge.
- `List` has 6px padding and a 12px radius; options are 36px high with 8px padding and a 6px radius.
- `List` grows up to 210px and scrolls beyond it.
- `List` keeps 6px below the last option while it scrolls.
- Field text and option text are Geist Regular 14px/20px.

### Motion

- Field state changes use `Smart Animate`, `200 ms`, and a custom bezier of `0.4, 0, 0.2, 1`.
- Option hover switches `state` instantly.

### Tokens

- The field is `ds/background/100` with `ring/gray-alpha-400`, `ring/gray-alpha-500` on hover, and `ds/focus/border` when active.
- `error` and `error-hover` use `ring/error` with `ds/red/800` value text; `error-active` uses `ds/focus/border`.
- `disabled` uses the `ds/gray/100` fill.
- `placeholder` and the default icons are `ds/gray/700`; `value` is `ds/gray/1000`.
- `List` is `ds/background/100` with `ds/shadow/border-large`; a hovered option is `ds/gray/alpha/100`.
- `Empty Message` is `ds/gray/900`.

## Behavior in Code

### Props in code

- `<Combobox>` takes `value`, `onChange`, `onChangeOpen`, `placeholder`, `aria-label`, `id`, `name`, `className`, `width`, `size`, `disabled`, and `errored`.
- It also takes `clearable`, `onClear`, `loading`, `filter`, `noInputPrefix`, `prefixIcon`, `showMenuButton`, and `displaySelectedSuffix`.
- The remaining props are `shouldContinue`, `allowTab`, `noTextSelection`, `noNegativeIndex`, `noRawSelectedValue`, `container`, and `disableMobileDrawer`.
- `size` takes `small` and `large`; the field is 36px high when it is omitted.
- `clearable` and `showMenuButton` default to `true`.
- `value` makes the field controlled; `null` empties it, and `onChange` receives the option value or `null`.
- A ref exposes `setValue`, `setSelectedValue`, `setSelectedIndex`, `getSelectedIndex`, `clear`, and `close`.
- `<ComboboxList>` takes `emptyMessage`, `maxVisibleOptions`, `ListFooterComponent`, `hideOptions`, `hideOnEmpty`, `width`, and `maxWidth`.
- `<ComboboxList>` positions the popover with `side`, `align`, `alignOffset`, `collisionPadding`, `avoidCollisions`, `hideWhenDetached`, and `container`.
- `emptyMessage` defaults to `No results` and `maxVisibleOptions` to `5`.
- `<ComboboxOption>` takes `value`, `label`, `prefix`, `suffix`, `displayValue`, `disabled`, and `ignoreDefaultHeight`.
- `<ComboboxOption>` also takes `truncatePrefix`, `truncateSuffix`, `isMenu`, `displayLast`, and `onCustomSelect`.
- `label` defaults to the string children, or to `value`; filtering matches `value` and `label`.
- `ignoreDefaultHeight` lets multi-line content size the row; the list stays scrollable.
- `isMenu` options skip filtering and render after the filtered results.

### Runtime in code

- The wrapper is `role="combobox"` with `aria-expanded`, `aria-haspopup="listbox"`, and `aria-controls`.
- The input is `role="searchbox"` with `aria-autocomplete="list"`; its `aria-label` is the prop or the placeholder.
- The list is `role="listbox"` and each row is `role="option"` with `aria-selected`.
- A `role="status"` region announces the number of results, or the empty message.
- Opening the list highlights the first option; the pointer moves the highlight.
- Arrow keys, Home, and End move the highlight; Enter selects it, and Escape closes the list.
- Selecting an option writes its label into the field and closes the list.
- The selected option shows a check at the end of its row when the list reopens.
- With text in the field, the clear control replaces the chevron.
- Clear empties the field, calls `onClear` and `onChange(null)`, keeps focus on the input, and closes the list.
- Typing filters the options; an unmatched query shows `emptyMessage` in a 48px list.
- `loading` replaces the prefix icon with a spinner.
- The prefix shows `prefixIcon`, else the selected option’s `prefix`, else the search icon.
- `name` adds a hidden input that carries the selected value.
- The popover renders in a portal at `z-index: 2001`, 8px below the field and as wide as the field.

### Responsive in code

- From 601px the field is an input with a popover list.
- At 600px and below the field is a button that opens a bottom drawer 80% of the viewport high.
- In the drawer the input is 40px high and flat, and options stay 36px high.
- `disableMobileDrawer` keeps the input and the popover at every width.

### Motion in code

- The input animates its shadow and colors over 200ms with `ease-in-out`.
- The chevron flips 180° when the list opens and returns over 150ms when it closes.
- The list height changes over 100ms with `ease-in-out` after the first interaction.
- Option highlight changes instantly.

### Best Practices vs code

- Best Practices advise against a second portal inside a **Modal**; on mobile, `<Combobox>` opens its own nested drawer.
