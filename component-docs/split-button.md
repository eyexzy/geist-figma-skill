# Split Button

A button that offers a primary interaction coupled with a dropdown menu offering additional actions.

Source of the Best Practices: https://vercel.com/geist/split-button

Contents: Best Practices, Figma Guidelines, Anatomy, Split Button properties, _Split Button Base properties, _Menu Button properties, Assembly, Layout, Motion, Tokens, Behavior in Code, Props in code, Runtime in code, Responsive in code, Motion in code, Accessibility in code, Best Practices vs code

## Best Practices

- Use a Split Button when one action is the clear default and 1–4 close variants belong next to it, like `Deploy` paired with `Deploy to Preview`. For unrelated actions, use a **Menu** instead.
- Mirror the primary action as the first item in the dropdown so keyboard users and screen readers get the same options. The visible button label and the first item must match exactly.
- Restrict the primary `type` to `default` or `secondary`. The API blocks the destructive variants on purpose, since hiding a delete inside a dropdown is a sharp edge.
- Title Case every menu item label and follow `Verb + Noun`: `Deploy to Production`, `Promote to Production`, `Rollback Deployment`. Group destructive items at the bottom with a divider.
- Set `menuButtonLabel` to a screen-reader sentence that names the action set, like `More deploy options`. It becomes the `aria-label` on the dropdown trigger and is the only label a screen reader hears for that button.
- Default `menuAlignment="bottom-start"` aligns the menu under the primary button; switch to `bottom-end` only when the button sits flush with the right edge of its container.

## Figma Guidelines

### Anatomy

- `Split Button` — `<SplitButton>`: `Action`, the `Menu` it opens, and a `Menu Hit` layer over the chevron half.
- `_Split Button Base` — the primary `<Button>` with `Prefix`, `Label`, `Suffix` and a `Separator`, next to the chevron half `_Menu Button`.
- `_Menu Button` — `<MenuButton>`: the chevron half holding a `ChevronDown` icon.
- `Menu` — `<Menu>` filled with `_Menu Item` rows, each a `<SplitButtonMenuItem>` with a title, a description and an optional icon.
- `Menu Hit` — a transparent layer over the chevron half that carries the click reaction.

### Split Button properties

- `size` — `small`, `medium`, or `large`. Height is 32px, 36px, or 40px, and the outer corner radius 6px, 6px, or 8px.
- `menuAlignment` — `bottom-start`, `bottom-end`, `top-start`, or `top-end`. `bottom-*` places `Menu` below the button and `top-*` above it.
- `bottom-end` and `top-end` align the right edge of `Menu` with the right edge of the button.
- `bottom-start` aligns the left edge of `Menu` with the primary half; `top-start` aligns it with the chevron half.
- `disabled` — `false` or `true`. `true` shows both halves in the disabled look and hides `Menu`.
- `disabled` `true` switches `Action` to `state` `disabled` and removes the reactions of both halves and of `Menu Hit`.
- `Action` is exposed on the instance, so `label`, `variant`, `showPrefix`, `prefix`, `showSuffix` and `suffix` are set there.
- `label` is the `children` of `<SplitButton>`; `variant`, `prefix` and `suffix` are props of `buttonProps`.
- `Menu` is exposed too, and its `children` slot holds the rows, the `menuItems` of code.

### _Split Button Base properties

- `variant` — `default` or `secondary`. It sets the fills of both halves and the color of the divider.
- `state` — `default`, `hover`, or `disabled`. The hover reaction switches `default` and `hover` on the primary half.
- `disabled` shows both halves in the disabled look and is static.

### _Menu Button properties

- `variant` and `size` — the values of `_Split Button Base`, which picks the matching chevron half.
- `state` — `default`, `hover`, or `disabled`. The hover reaction of the chevron half switches `default` and `hover`.
- `menuIcon` — swaps the chevron icon.

### Assembly

- Set the primary text with `label` on the exposed `Action`. Show its icons with `showPrefix` and `showSuffix`.
- Edit the rows in the `children` slot of the exposed `Menu`: add, remove, or reorder `_Menu Item` rows.
- Set the title of a row with `label` and its second line with `description`.
- Put an icon before the title with `showPrefix` and `prefix`. Hide the arrow at the end of a row with `showSuffix`.
- Set `size` and `menuAlignment` on `Split Button`.
- Disable the button with `disabled` on `Split Button`; `state` on `Action` leaves the `Menu Hit` reaction active.
- Switching `disabled` shows the defaults of `Action`; its enabled values return when you switch back.
- A reaction added to `Menu Hit` on the instance stays when `disabled` is `true`.
- The `Menu Hit` area and the `Menu` position are set per variant of `Split Button`.
- A click on the chevron half flips `state/menu/open` from `Prototyping / Split Button`, and `Menu` shows or hides with it.
- A second click on the chevron half is the only way the prototype closes `Menu`.
- Add an `On click` reaction with `Set variable` `state/menu/open` to `false` on each `_Menu Item` so a pick closes `Menu`.
- One `state/menu/open` drives the whole file, so two `Split Button` instances in a prototype open together.
- To open one instance alone, bind `visible` of its `Menu` and the reaction of its `Menu Hit` to your own variable.

### Layout

- Both halves share one height: 32px, 36px, or 40px. The primary half hugs its label.
- The chevron half is 41px, 49px, or 57px wide.
- A 1px stroke runs inside each half. The primary half rounds its left corners and the chevron half its right corners.
- The primary half has 1px more padding on its left and the chevron half on its right, for the stroke.
- `Separator` is 1px wide and sits on the right edge of the primary half, 30px, 34px, or 38px tall.
- `Menu Hit` is as wide and as tall as the chevron half and pinned to the right edge.
- `Menu` sits 10px from the button.
- `Menu` is 264px wide and can be resized by hand.

### Motion

- Hover: `Smart Animate`, bezier `0.4, 0, 0.2, 1`, `150 ms`. Each half reacts on its own.
- `Menu` shows and hides at once with the variable.

### Tokens

- Fill — `ds/gray/1000` for `default` and `ds/background/100` for `secondary`; hover — `components/button/default/bg-hover` and `components/button/secondary/bg-hover`.
- Stroke — `ds/gray/400`. Divider — `components/button/default/divider` for `default` and `ds/gray/300` for `secondary`.
- Radius — `tailwind/radius/md` at `small` and `medium`, `tailwind/radius/lg` at `large`.
- Label — Medium 14px with 21px line height at `small` and `medium`, Medium 16px with 24px line height at `large`.
- The label and the chevron icon take `ds/background/100` for `default` and `ds/gray/1000` for `secondary`.
- Disabled — fill `ds/gray/100`; label, icons and chevron `ds/gray/700`; `Separator` at 10% opacity.

## Behavior in Code

### Props in code

- `<SplitButton>` takes `buttonProps`, `children`, `menuItems`, `menuProps`, `menuButtonLabel`, `menuAlignment`, `disabled`, `className` and `Component`.
- `buttonProps` goes to the primary `<Button>`; its `size` and `variant` also apply to the chevron button.
- The primary `<Button>` defaults to `variant` `default` and `size` `medium`.
- `menuProps` goes to the `<Menu>`, and its `width` sets the menu width.
- `menuAlignment` is `bottom-start` unless set, and also takes `bottom-end`, `top-start` and `top-end`.
- `disabled` on `<SplitButton>` disables both halves and takes precedence over `buttonProps.disabled`.
- `Component` replaces the primary `<Button>`; the chevron half stays a `<MenuButton>`.
- `<SplitButtonMenuItem>` takes `title`, `description`, `icon`, `menuItemProps` and `descriptionClassName`; `icon` renders before the title.

### Runtime in code

- Hover changes only the half under the cursor.
- The chevron button opens `Menu`; a pick or a click outside closes it.
- `Menu` flips to the opposite side when the viewport is too small for it.
- A disabled `<SplitButton>` shows both halves with a `gray-100` fill and `gray-700` text, and the divider at 10% opacity.
- The cursor over a disabled half is `not-allowed`.

### Responsive in code

- Below 601px, `Menu` becomes a sheet pinned to the bottom of the viewport.
- The sheet is as wide as the viewport, with 12px top corners.

### Motion in code

- Both halves change background over 150ms with `cubic-bezier(0.4, 0, 0.2, 1)`.

### Accessibility in code

- The chevron button carries `aria-haspopup` and `aria-expanded`.
- `Escape` closes `Menu` and returns focus to the chevron button.

### Best Practices vs code

- Best Practices name the primary variant `type` and say the API blocks the destructive variants. The published `<SplitButton>` reads `buttonProps.variant` and passes it to `<Button>` as given; the set follows that code.
