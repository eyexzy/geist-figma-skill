# Switch

Choose between a set of options.

Source of the Best Practices: https://vercel.com/geist/switch

Contents: Best Practices, Figma Guidelines, Anatomy, Switch properties, _Switch Control properties, Assembly, Layout, Motion, Tokens, Behavior in Code, Props in code, Best Practices vs code

## Best Practices

- Use Switch as a segmented selector for 2–3 mutually exclusive options that show different views of the same surface, like `Source` vs `Output`.
- For a boolean on/off setting, use **Toggle**. Switch implements radio semantics, so two options stay mutually exclusive rather than reading as a checkbox.
- Past 3 options or when labels grow beyond a couple of words, switch to **Tabs** or a **Select**.
- Pass a `name` so the underlying radios are grouped; without it, more than one option can appear selected at once.
- Set `defaultChecked` (or controlled `checked`) on exactly one `Switch.Control` so the group has a defined initial state.
- Pad each `Switch.Control` so the widest label fits without the active pill resizing on selection. Test with the longest copy in the set.
- Title Case each `Switch.Control` label. Keep labels to one or two words and parallel: `Source` / `Output`, not `Source` / `Show output`.
- Always provide a `label` on every `Switch.Control`, even when an `icon` carries the meaning, so screen readers announce the option. The component renders it as `geist-sr-only` for icon-only controls.
- Pair an icon-only Switch with a **Tooltip** on each control so sighted users get the same label assistive tech receives.

## Figma Guidelines

### Anatomy

- `Switch` — `<Switch>`: the container that groups the options.
- `_Switch Control` — `<SwitchControl>`: one option, nested as `Item 1` to `Item 5`.
- `Item 1 Slot` to `Item 5 Slot` wrap the options. Each unselected slot carries an `On click` reaction that sets `active` to its number.
- `Border` — the 1px border around the container.

### Switch properties

- `size` — `small`, `medium`, or `large`. The options, their text, and the container radius scale with it.
- `content` — `text` shows labels; `icon` shows icons.
- `active` — `1` to `5`. Selects the highlighted option.
- `fullWidth` — `true` makes the options share the instance width equally, like `width: 100%` on `<Switch>`.
- `showBorder` — `false` hides the 1px border around the container, like `hideBorder` in code.
- `showItem3`, `showItem4`, and `showItem5` — show the third to fifth option. Options 1 and 2 are always shown.
- The set holds five options.

### _Switch Control properties

- `label` and `icon` — the text and the icon of one option, exposed on the `Switch` instance for each option.
- `state` — `default`, `hover`, or `disabled`. `disabled` applies to a single option, like `disabled` on `<SwitchControl>`.
- `selected` — `true` or `false`. The `active` value of `Switch` sets it on each option.

### Assembly

- Select an option with `active` on `Switch`. Setting `selected` on an option marks a second option as selected.
- Change `size` and `content` on `Switch`. An option with its own `size` changes width and text size; the container height stays.
- Resize an instance with `fullWidth` `true`. The options split the new width equally.
- Edit `label` and `icon` on the exposed options. The edits stay when `active` changes.

### Layout

- `small`: container 32px tall, options 24px tall, label 14px, option padding 12px.
- `medium`: container 36px tall, options 28px tall, label 14px, option padding 12px.
- `large`: container 40px tall, options 32px tall, label 16px, option padding 16px.
- Icon options: 16px icon and 32px width in `small` and `medium`; 20px icon and 44px width in `large`.
- The container has 4px padding and a 0px gap between options.

### Motion

- Hovering an unselected option changes the color of its text or icon.
- Selecting an option changes the pill fill and the text color.
- In code, hover and selection transitions run over 150ms with `cubic-bezier(.4, 0, .2, 1)`.
- Hover reactions use `Dissolve`, `150 ms`, and the custom bezier `.4, 0, .2, 1`.

### Tokens

- Container: fill `ds/background/100`; `Border` effect style `ring/gray-alpha-400`.
- Selected option: fill `ds/gray/100`, text and icon `ds/gray/1000`.
- Unselected option: text and icon `ds/gray/900`, `ds/gray/1000` on hover.
- Disabled option: text and icon `ds/gray/800`.
- Container radius: `tailwind/radius/md` (6px), `tailwind/radius/lg` (8px) for `large`.
- Selected pill radius: `tailwind/radius/sm` (4px), `tailwind/radius/md` (6px) for `large`.

## Behavior in Code

### Props in code

- Code accepts any number of `SwitchControl` children.
- `<Switch>` takes `name`, `size`, `checkedColor` and `hideBorder`, and passes `name`, `size` and `checkedColor` to each child.
- `<SwitchControl>` takes `icon`, `label`, `checked`, `disabled` and `innerDivClassName`; `checkedColor` defaults to `--ds-gray-100`.

### Best Practices vs code

- Best Practices name `Switch.Control` and `geist-sr-only`. The examples import `SwitchControl` and the component renders `sr-only`; the set follows that code.
