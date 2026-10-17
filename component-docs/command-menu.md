# Command Menu

Launch a set of actions as a full-screen overlay.

Source of the Best Practices: https://vercel.com/geist/command-menu

Contents: Best Practices, When to use, Behavior, Content, Accessibility, Figma Guidelines, Anatomy, Command Menu properties, _Command Menu Panel properties, _Command Menu Text properties, _Command Menu Item properties, _Command Menu Group properties, Assembly, Layout, Motion, Tokens, Behavior in Code, Props in code, Runtime in code, Responsive in code, Motion in code, Best Practices vs code

## Best Practices

### When to use

- Use CommandMenu for a global, keyboard-first command palette that finds resources and runs actions across the app.
- For a menu opened from a visible trigger on a single resource, use **Menu**; for right-click on a row, use **ContextMenu**.
- Group items into pages (`Projects`, `Team Settings`) when a single flat list would exceed roughly 30 items or span multiple resource types.

### Behavior

- Bind `⌘K` on macOS and `Ctrl+K` elsewhere. Don’t reuse the binding for any in-page filter input; it’s a global shortcut.
- Open into the root page; preserve the search query when navigating back from a sub-page so the user’s typing isn’t lost.
- Trap focus inside the overlay while it’s open and return focus to the previously active element on close.
- Show a recent or default item set when the input is empty so the menu is useful before typing.

### Content

- `<CommandMenu.Item>` children are Title Case verb phrases (`Deploy Project`, `Invite Team Member`). Avoid navigation phrasing like `Go to project page`; CommandMenu commands act, not browse.
- `CommandMenuPage.label` is Title Case and names the scope (`Projects`, `Team Settings`).
- `CommandMenuPage.placeholder` is sentence case, action-oriented, and ends with `…` (`Search projects…`, `Type a command or search…`). Bare `Search…` is wrong because it doesn’t name the scope.
- `<CommandMenu.Group heading>` is Title Case, 1–2 words (`Actions`, `Recent`).

### Accessibility

- Use `aria-live="polite"` on the result count so screen readers hear how the list narrows as the user types.
- Up/Down arrows move highlight, Enter activates, Escape closes. Backspace at an empty input pops the page stack.
- Display each item’s `keybind` as a `Kbd` slot so the shortcut is discoverable to sighted users and announced as a label to screen readers.

## Figma Guidelines

### Anatomy

- `Command Menu` — `<CommandMenu>`: the overlay with `Backdrop` and `Panel`.
- `_Command Menu Panel` — the dialog with `Input` and `List`.
- `Input` holds `_Command Menu Text`, the text of `<CommandMenuInput>`, and `Esc Key`, a `Kbd` instance.
- `_Command Menu Item` — `<CommandMenuItem>`: a row with `Prefix`, `Label`, `Keybind`, `Suffix`, and `suffixText`.
- `_Command Menu Group` — `<CommandMenuGroup>`: the group heading; the items below it belong to the group.
- `_Command Menu Divider` — `<CommandMenuDivider>`: a separator between items.

### Command Menu properties

- `open` — `true` shows `Backdrop` and the panel; `false` hides both.
- `Panel` is an exposed instance, so its `variant`, `query`, and `children` are editable from `Command Menu`.

### _Command Menu Panel properties

- `variant` — `default` shows the list; `empty` shows the no-results message.
- `query` — the searched term shown in the no-results message, with its quotes.
- `children` — a slot for the `children` of `<CommandMenuList>`: `_Command Menu Group`, `_Command Menu Item`, and `_Command Menu Divider` instances.

### _Command Menu Text properties

- `type` — `placeholder` shows the hint, `value` shows the typed text.

### _Command Menu Item properties

- `prefix` — swaps the icon in the 20px `Prefix` box.
- `showKeybind` — shows `Keybind`, a `Kbd Group` instance for `keybind`.
- `suffix` — swaps the icon at the end of the row, shown by `showSuffix`.
- `suffixText` — a slot beside the icon for text, shown by `showSuffixText`.
- `state` — `selected` marks the highlighted item; hovering a `default` item switches it to `selected` instantly.

### _Command Menu Group properties

- `heading` — the text of the group heading.

### Assembly

- Resize the `Command Menu` instance to the screen size; `Backdrop` stretches and the panel stays centered, 135px from the top.
- Bind `open` to `state/command-menu/open` from `Prototyping / Command Menu` and set it to `true` from the trigger; `Backdrop` sets it back to `false`.
- Give each `Command Menu` its own variable. One variable opens every menu bound to it.
- Drop `_Command Menu Group`, `_Command Menu Item`, and `_Command Menu Divider` instances into the `children` slot of `Panel`.
- Layers in the slot stack from the top with 0px between them; place a group first, then its items.
- To close the menu from an item, set the menu variable to `false` on its click.
- A change to `open=false` keeps the item hovered after the menu closes.
- The first default item starts selected through `first-item/state` from `Prototyping / Command Menu`.
- Bind `state` of each closing item to its own string variable, `default` or `selected`; the first starts `selected`.
- Set it with `On hover`: the variable of that item to `selected` and every other variable to `default`.
- Add the same reset to the click that closes the menu and to `Backdrop`.
- For the no-results state, set `variant` to `empty` and enter the term in `query`.

### Layout

- `_Command Menu Panel` is 640px wide with a 12px corner radius.
- `Input` has 12px padding and a 1px bottom border.
- `Input Row` is 28px high with 4px side padding and 12px between its items.
- `List` has 8px padding and hugs its content up to 436px; taller content scrolls.
- `Bottom Spacer` keeps 8px below the last item while the list scrolls.
- Items are 36px high with 8px side padding, 12px between their parts, and a 6px corner radius.
- `Prefix` is a 20px box with a 16px icon.
- Group headings are 36px high with 8px side padding.
- `_Command Menu Divider` is 17px high: a 1px rule with 8px above and below, extending 8px past each side of the list.
- Item text is Geist Regular 14px/20px, group headings are 13px/19.5px, and `_Command Menu Text` is 18px/20px.
- The `empty` variant is 149px high; its message has 30px of padding above and below.

### Motion

- A click on `Backdrop` changes the instance to `open=false` with `Smart Animate`, `300 ms`, and a custom bezier of `0.175, 0.885, 0.32, 1.1`.
- In `open=false` the panel is hidden and scaled to 96%, so closing scales it down and fades it out.
- Hover changes an item to `selected` instantly.

### Tokens

- `Backdrop` is `ds/background/100` at 80% opacity.
- The panel is `ds/background/100` with the `ds/shadow/modal` shadow and the `tailwind/radius/xl` radius.
- `Input` border and `Rule` are `ds/gray/alpha/400`; a `selected` item is `ds/gray/alpha/100`.
- `Label` and `Query Value` are `ds/gray/1000`; `Group Heading`, `Prefix`, `Message Text`, and `Period` are `ds/gray/900`.
- The `Suffix` icon and `suffixText` are `ds/gray/700`; `_Command Menu Text` is `ds/gray/700` as `placeholder` and `ds/gray/1000` as `value`.

## Behavior in Code

### Props in code

- `<CommandMenu>` takes `open`, `setOpen`, `label`, `pages`, `setPages`, `onClose`, `onSelect`, and `container`.
- It also takes `value`, `onValueChange`, `filter`, `shouldFilter`, `withPortal`, `infiniteScrollingCb`, and `infiniteScrollingThreshold`.
- `label` sets the `aria-label` of the dialog.
- `pages` is an array of `{ label, placeholder }` objects; the last one is the active page.
- With `pages`, the input shows each `label` as a breadcrumb; clicking one removes the pages after it.
- The active page `placeholder` fills the input; otherwise the `placeholder` of `<CommandMenuInput>` applies.
- Backspace in an input empty for 500ms removes the last page while more than one page is open.
- The input clears and takes focus when the menu opens and when `pages` changes.
- `<CommandMenuInput>` takes `placeholder`, `onValueChange`, `onKeyDown`, and `customBreadcrumbs`, which replaces the `pages` breadcrumbs.
- `<CommandMenuItem>` takes `callback`, `closeOnCallback`, `prefix`, `suffix`, `keybind`, `value`, and `className`.
- `callback` runs on click or Enter; `closeOnCallback` defaults to `true` and closes the menu afterwards.
- `keybind` is an array of key names; `Meta` renders as ⌘ and `Shift` as ⇧, each key in a `<kbd>`.
- `<CommandMenuGroup>` takes `heading`; `<CommandMenuDivider>` and groups emptied by the filter hide while the input has text.
- `<CommandMenuList>` calls `infiniteScrollingCb` within `infiniteScrollingThreshold` pixels of the bottom and scrolls down when it resolves truthy.
- `withPortal` defaults to `true` and locks body scroll while the menu is open.
- `onClose` runs 200ms after the menu closes; on small screens it runs after the `<Drawer>` animation.

### Runtime in code

- The dialog is a `role="dialog"` with a `sr-only` title, `Command Menu`, and a description for screen readers.
- The dialog is fixed 15% from the top (135px in a 900px viewport), 640px wide, and centered.
- The overlay is `bg-background-100` at `opacity-80`.
- The first item is selected when the menu opens; moving the pointer over an item selects it.
- `ArrowDown`, `Ctrl+N`, and `Ctrl+J` select the next item; `ArrowUp`, `Ctrl+P`, and `Ctrl+K` select the previous one.
- `Home` and `End` select the first and last item; with ⌘ held, `ArrowUp` and `ArrowDown` do the same.
- With `Alt` held, `ArrowUp` and `ArrowDown` jump to the previous and next group.
- `Enter` runs the selected item and `Escape` closes the menu.
- Typing filters the items by their text and selects the first match.
- An unmatched query shows `No results found for "query".` and the menu is 149px high.
- `Esc` is a button that closes the menu; it appears on devices that support hover.
- The list scrolls to the top when `pages` or the input text changes.

### Responsive in code

- At 600px and narrower, the menu renders in a `<Drawer>` with a height of 80vh instead of the dialog.
- The `<Drawer>` closes through `setOpen`, and its `resetScroll` follows the input text.
- At 400px and narrower, items are 40px high and the input text is 16px.
- At 400px and narrower, the list grows to its full height.
- The input row stays at the top of the `<Drawer>` at 400px and narrower.

### Motion in code

- The dialog scales from 0.96 to 1 and fades in over 300ms with `cubic-bezier(0.175, 0.885, 0.32, 1.1)`.
- The overlay fades from 0 to 0.8 over 300ms with the same curve.
- Closing plays `cmdkScaleOut` and `cmdkFadeOut`, which end at 0.96 scale and 0 opacity.
- When `pages` changes, the dialog scales to 0.99 for 100ms.
- An item background changes instantly on selection.

### Best Practices vs code

- Best Practices name `<CommandMenu.Item>` and `<CommandMenu.Group heading>`; the components are `<CommandMenuItem>` and `<CommandMenuGroup>`.
- Best Practices name `CommandMenuPage.label` and `CommandMenuPage.placeholder`; the pages are plain objects with `label` and `placeholder`.
- Best Practices name `aria-live="polite"` on the result count; the list is a `role="listbox"` with `aria-label="Suggestions"`.
- Best Practices name a `Kbd` slot for `keybind`; the item renders each key in a `<kbd>` element.
