# Dots Menu

An overflow menu triggered by a three-dot icon that reveals additional actions in a dropdown.

Best Practices: written by the author of this library from the Geist code; the site page https://vercel.com/geist/dots-menu has none.

Contents: Best Practices, Figma Guidelines, Anatomy, Dots Menu properties, Assembly, Prototyping, Layout, Motion, Tokens, Behavior in Code, Runtime in code, Motion in code, Props in code

## Best Practices

- Use `<DotsMenu>` when the trigger is an icon-only button. Use **Menu** when the trigger carries a label.
- Pass `MenuItem` elements as `children`. The list is at least 200px wide and grows to fit the longest label.
- Write each label as a Title Case verb phrase, like `View Build Logs` or `View Analytics`.
- Pass `aria-label` in `menuButtonProps` to name the trigger. Without it every trigger is announced as `Menu`.
- Set `disabled` on `<DotsMenu>` to dim the trigger to 50% and block opening.
- Set `disabled` on a `MenuItem` to grey out that row. The other rows stay active.
- On the trigger, `ArrowDown`, `ArrowUp`, `Enter` and `Space` open the menu.
- In the open menu, the arrow keys move the selection; `Home` and `End` jump to the first and last item.
- `Enter` or `Space` picks the item, and `Escape` closes the menu and returns focus to the trigger.
- Typing letters selects the first item whose label starts with them. The typed text clears after 1s.
- Selecting an item closes the menu. Set `closeOnSelect` to `false` to keep it open.
- `iconSize` sets the size of the dots, `18` by default. Set `horizontal` to `false` for vertical dots.

## Figma Guidelines

### Anatomy

- `Dots Menu` — `<DotsMenu>`: `Trigger` with the `Menu` it opens, and an `Open Background` behind the button.
- `Trigger` — `<MenuButton>`: a `Button` instance, `tertiary`, `square` and `small`, holding the three-dot icon.
- `Menu` — `<Menu>`: a `Menu` instance with three `_Menu Item` rows shown.

### Dots Menu properties

- `position` — `bottom` opens `Menu` below `Trigger` and `top` above it, both aligned to the right edge of the button.
- `horizontal` — `true` shows the `MoreHorizontal` icon in `Trigger` and `false` the `MoreVertical` icon.
- `disabled` — `true` sets `Trigger` to its `disabled` `state` and removes its hover and click. `Menu` stays hidden.
- `Trigger` and `Menu` are exposed on the instance, so the `children` slot of `Menu` is editable.

### Assembly

- Edit the rows in the `children` slot of the exposed `Menu`: add, remove, or reorder `_Menu Item` rows.
- Set the text of each row with its `label`.
- Disable one row with `state` `disabled` on its `_Menu Item`. The other rows stay active.
- Disable the whole menu with `disabled` on `Dots Menu`.
- `state` on `Trigger` leaves the click reaction active, so the menu would still open.
- Add an `On click` reaction with `Set variable` `state/menu/open` to `false` to each `_Menu Item` so a pick closes the list.

### Prototyping

- A click on `Trigger` flips `state/menu/open` from `Prototyping / Dots Menu`. `Menu` and `Open Background` show with it.
- A second click on `Trigger` is the only way the prototype closes the list.
- One `state/menu/open` drives the whole file, so two enabled `Dots Menu` instances in a prototype open together.

### Layout

- `Menu` sits 10px from `Trigger` with the right edges flush. In `top` it sits 10px above.
- `Menu` is 200px wide and can be resized by hand.
- A longer `_Menu Item` label is truncated.

### Motion

- Hover: `Smart Animate`, bezier `0.4, 0, 0.2, 1`, `150ms`.
- `Menu` and `Open Background` switch at once with the variable.

### Tokens

- `Open Background` — fill `ds/gray/alpha/100`, the `aria-expanded:bg-gray-alpha-100` of code; radius `tailwind/radius/md`.
- `Trigger` — size `ds/size/small`, radius `tailwind/radius/md`.

## Behavior in Code

### Runtime in code

- The list also closes on a pick, `Escape`, and a click outside.

### Motion in code

- The list opens at once and closes with `animate-fade-popover-out`, staying mounted for 400ms.
- The button background fades over 150ms, the `duration-[time:150ms] ease-in-out` of **Button**.

### Props in code

- The list opens at `bottom-end` and flips to `top-end` when space runs out below.
- `menuButtonProps` and `menuButtonClassName` reach the trigger **Button**.
- The list has a `min-width` of 200px and widens to fit a longer label.
