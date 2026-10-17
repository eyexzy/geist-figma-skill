# Select

Display a dropdown list of items.

Source of the Best Practices: https://vercel.com/geist/select

Contents: Best Practices, Figma Guidelines, Anatomy, Select properties, Assembly, Layout, Motion, Tokens, Behavior in Code, Props in code

## Best Practices

- Pick `<Select>` for short, fixed lists (under ~10 items) where typing adds nothing; switch to **Combobox** once filtering helps.
- Use **MultiSelect** when more than one value can be chosen at once; use **Switch** for a 2–3 option segmented choice.
- Group options past ~10 items with native `<optgroup>`; Geist `<Select>` has no `.Group` static.
- Options are Title Case when short and match canonical branding (`Next.js`, not `NextJS`); keep the same register across the list.
- Label is a short Title Case noun (`Framework`, `Region`); accept the prop directly on `<Select>`.
- Placeholder is action-oriented (`Select a framework`), never `Choose one…`, `Pick`, or the label restated.
- Validate on blur and pass a string to `error`; messages name the field and end in a period (`Select a framework.`).
- Don’t wrap a labelled `<Select>` in a **Tooltip**; put the hint on a sibling icon button so the label stays announced.

## Figma Guidelines

### Anatomy

- `Select` — `<Select>`: `Label` above the field and `Error` below it. The field holds `Prefix`, `Text` and `Chevron` or `Suffix`.
- In code the field is a native `<select>` with `<option>` children in a `div` with `data-geist-select`.
- The set draws the closed field; the open list is the browser’s own menu.

### Select properties

- `size` — `small`, `medium` or `large`. `large` also raises the text to 16px and the radius to 8px.
- `state` — `default`, `hover`, `active`, `error`, `error-hover`, `error-active` or `disabled`. `active` is the focused field.
- `error-hover` and `error-active` keep the `error` ring, as code does on hover and focus.
- `ghost-default`, `ghost-hover` and `ghost-active` — the borderless look of `type="secondary"` in code.
- `placeholder` — the text in the field: the `placeholder` of code before a choice, the chosen option after it.
- `showLabel` — shows `Label`, the `label` of code.
- `showPrefix` and `prefix` — show the leading icon and swap it, as `prefix` does in code.
- `showSuffix` — `true` replaces the chevron with the icon in `suffix`, as `suffix` does in code.
- `showError` — shows `Error` in the `error` states; its `message` is the string passed to `error` in code.
- `Label` and `Error` are exposed on the instance with their own properties.

### Assembly

- Show a chosen option by writing it in `placeholder`.
- Set `state` to `error` and write the message in `message` on the exposed `Error`.
- Move a borderless instance 12px left to align its text with the content around it. Code does this with `-translate-x-3`.
- Set the instance to `Fill container` for the width; code fills its container (`w-full`).

### Layout

- The field is 32px, 36px and 40px high at `small`, `medium` and `large`.
- Text sits 12px from the left and 36px from the right, leaving room for the icon (`px-3 pr-9`).
- With `prefix` the text starts 40px from the left (`pl-10`).
- Text is 14px with 21px line height at `small`, 14px with 20px at `medium` and 16px with 24px at `large`.
- Icons sit 12px from the left and right edges.
- The chevron is 14px; the `prefix` and `suffix` icons are 16px.
- The 1px border is an outside ring (`box-shadow`) that keeps the height unchanged.
- `Label` sits 8px above the field (`mb-2`) and `Error` sits 8px below it.
- `Error` is 13px/20px at `small` and `medium` and 16px/24px at `large`.

### Motion

- Hover, focus and error rings: `Smart Animate`, bezier `0.4, 0, 0.2, 1`, `200 ms` — code `transition-[box-shadow,color] duration-200`, whose default easing is that bezier.
- `Mouse enter` in `default`, `error` and `ghost-default` runs `Change to` their `hover` variant; `Mouse leave` returns.
- `On click` in a `hover` variant runs `Change to` its `active` variant, and `On click` in `active` returns to `hover`.
- `disabled` keeps its ring on hover, as in code.

### Tokens

- Field — `ds/background/100` fill, `ds/gray/100` in `disabled`.
- Radius — `tailwind/radius/md`, `tailwind/radius/lg` at `large`.
- Ring — `ring/gray-alpha-400` in `default` and `disabled`, `ring/gray-alpha-500` in `hover` and `ghost-hover`, `ds/focus/border` in `active` and `ghost-active`.
- Error ring — `ring/error` in all three `error` states.
- `Text` — `ds/gray/1000`, `ds/gray/700` in `disabled`; borderless, `ds/gray/900` at rest and `ds/gray/1000` on hover and active.
- `Prefix` icon — `ds/gray/900`, `ds/gray/1000` on hover and active, `accents/3` in `disabled`.
- `Chevron` and `Suffix` icon — `ds/gray/700`, `legacy/foreground` on hover and active.
- Gap between `Label`, field and `Error` — `tailwind/space/8`.

## Behavior in Code

### Props in code

- The error ring is `legacy/error` with a 4px `ds/red/900` halo at 16%.
- A controlled `value` equal to `placeholder` is `ds/gray/700`.
- `<Select>` passes `small` or `large` to `Error`; `medium` leaves the default size of `Error`.
- `placeholder` renders a disabled `<option>` that is also the `defaultValue`.
- `suffix={null}` removes the chevron; with `type="secondary"` the suffix moves to `right-[15px]`.
