# Menu

Dropdown menu opened via button. Supports typeahead and keyboard navigation.

Source of the Best Practices: https://vercel.com/geist/menu

Contents: Best Practices, When to use, Behavior, Content, Accessibility, Figma Guidelines, Anatomy, Menu properties, _Menu Item properties, _Menu Section properties, States, Assembly, Layout, Motion, Tokens, Behavior in Code, Props in code, Runtime in code, Responsive in code, Motion in code, Best Practices vs code

## Best Practices

### When to use

- Use Menu for a discoverable trigger that opens a list of actions on a single resource (a dots menu on a row, a dropdown on a primary entity).
- For right-click or long-press on a row, use **ContextMenu**. For global commands behind `⌘K`, use **CommandMenu**. For two related primary actions, use a split button rather than burying the secondary action.
- Cap a Menu around 10 items. Past that, group with `MenuSection` or move secondary actions to a settings page.

### Behavior

- Open on click, not hover; hover-open menus collide with screen readers and trackpad scrolls.
- Position auto-flips based on window bounds; don’t hardcode a side that clips on narrow viewports.
- Close on item activation, Escape, and outside-click. Don’t auto-close on a hover-out.
- Use `MenuItemLocked` for permission-gated actions so the lock icon and disabled state explain why the row is inert.

### Content

- Item children are Title Case `Verb + Noun` (`Rename Project`, `Duplicate Deployment`). Bare verbs like `Rename` or `Edit` are wrong outside obvious single-object context.
- End an item with `…` only when activating it opens a follow-up dialog (`Rename…`, `Transfer to Team…`).
- Group destructive items at the bottom, separated by a divider, and keep the destructive copy as `Verb + Noun` (`Delete Project`, never bare `Delete`).
- Section headers (`MenuSection title`) are Title Case, 1–2 words (`Workspace`, `Recent Projects`).

### Accessibility

- Up/Down arrows move focus through items, Home/End jump to first/last, Enter or Space activates.
- Typeahead jumps to the next item whose label starts with the typed character; keep the visible label first so typeahead matches what the user sees.
- Return focus to the trigger on close so keyboard users keep their place in the row.

## Figma Guidelines

### Anatomy

- `Menu` — `<Menu>`: the list; its `children` slot holds the rows.
- `_Menu Section` — `<MenuSection>`: a section title.
- `_Menu Divider` — `<MenuDivider>`: a line between rows.
- `_Menu Item` — `<MenuItem>`: a `Background` and a `Row` of `Prefix`, `Label`, `Suffix`, and `suffixText`, with a `Description` below.
- `state=locked` is `<MenuItemLocked>`. `<MenuLink>` is a `_Menu Item` that renders a link.

### Menu properties

- `children` — a slot for the `children` of `<Menu>`: `_Menu Item`, `_Menu Section`, and `_Menu Divider` instances.

### _Menu Item properties

- `prefix` — swaps the icon before the label, shown by `showPrefix`.
- `suffix` — swaps the icon at the right edge, shown by `showSuffix`.
- `suffixText` — a slot beside the icon for text, shown by `showSuffixText`.
- `description` — a second line below the label, shown by `showDescription`.

### _Menu Section properties

- `title` — the section title, the `title` of `<MenuSection>`.

### States

- `default` and `hover` — a row at rest and a row under the pointer or the keyboard selection.
- `disabled` — the `disabled` prop; the row stays at rest under the pointer.
- `destructive`, `destructive-hover` and `destructive-disabled` — `type` set to `error`: at rest, hovered and disabled.
- `locked` — `<MenuItemLocked>`: a disabled row with the `LockClosed` suffix.

### Assembly

- Put a `_Menu Divider` before the destructive `_Menu Item` to separate it from the rows above.
- Drop `_Menu Section`, `_Menu Item`, and `_Menu Divider` instances into the `children` slot of `Menu`.
- Layers in the slot stack from the top with 0px between them.
- Place `Menu` 10px below its trigger with the left edges flush.
- Show `Menu` from its trigger with a boolean variable. Bind the `visible` of `Menu` to it and flip it with `On click` and `Set variable`.
- Put the `On click` reaction on a frame around the trigger. A reaction set on the `Button` itself overrides the reactions of its master, and the hover sticks.
- Give each trigger its own variable. One variable opens every `Menu` bound to it.
- Add an `On click` reaction with `Set variable` to `false` on each enabled `_Menu Item` row so a pick closes the menu.

### Layout

- `Menu` is 200px wide. Padding is 6px and each row is 36px high.
- The menu can be resized by hand; a longer label is truncated.
- `Prefix` is a 16px icon with 8px after it; `Suffix` sits at the right edge, 12px after the label.
- A section title row is 36px high: 8px padding around the 14px/20px `Title`.
- A divider is 13px high: a 1px line with 6px above and below. The line is as wide as the whole menu.

### Motion

- Hover changes a row with `On hover`, `Change to`, and `Instant`.

### Tokens

- `Menu` — fill `ds/background/100`, radius `tailwind/radius/xl`, padding `tailwind/space/6`, shadow style `ds/shadow/menu`, the `material-menu` of code.
- Rows — radius `tailwind/radius/md`, text `ds/gray/1000`, hover fill `ds/gray/alpha/100`. `disabled` and `locked` text and the lock use `ds/gray/700`.
- `destructive` text `ds/red/900`, `destructive-hover` fill `ds/red/100`. Section `Title` `ds/gray/800`, divider line `ds/gray/alpha/400`.

## Behavior in Code

### Props in code

- `<Menu>` takes `width`, `className`, and the rows as `children`; `width` defaults to 150px.
- `width` is a number of pixels.
- `<MenuContainer>` takes `position`, `closeOnSelect`, `hoverMode`, `hoverCloseDelay`, `enableTypeahead`, `defaultOpen`, `onClose`, and `onEscapePressed`.
- `position` defaults to `bottom-start` with an offset of `0, 10`; `closeOnSelect`, `enableTypeahead` default to `true`.
- `hoverMode` defaults to `false` and `hoverCloseDelay` to 150ms.
- `<MenuButton>` takes `showChevron`, `variant`, `type`, `shape`, `size`, and `svgOnly` like `Button`; a non-text child sets `svgOnly` and `aria-label="Menu"`.
- `<MenuItem>` takes `prefix`, `suffix`, `type`, `disabled`, `onClick`, `value`, `href`, `external`, and `isLink`.
- `type="error"` colors the row `red-900`; `disabled` colors it `gray-700` and ignores the pointer.
- `<MenuLink>` renders the row as a link; `<MenuItemLocked>` is a disabled row with a lock icon suffix.
- `<MenuSection>` takes `title` and renders a `role="group"` list under it; `<MenuDivider>` is a `role="separator"` line.

### Runtime in code

- The list is a `ul` with `role="menu"`, and each row is a `role="menuitem"` with `tabindex="-1"`.
- A longer label wraps onto more lines and grows the row past 36px.
- `<MenuItem>` puts `prefix` in a span with 8px after it.
- It puts `suffix` in a span with 12px before it, at the right edge.
- `<MenuItem>` draws the `prefix` and `suffix` icons at 18px with `--geist-icon-size`.

### Responsive in code

- Under 601px the menu is a bottom sheet: full width with a 12px top radius.
- In the sheet, rows are 40px high with 16px/24px text.

### Motion in code

- The menu fades out over 150ms when it closes.

### Best Practices vs code

- Best Practices move typeahead to the next match. Code selects the first item whose label starts with the typed text, and clears it after 1s.
- Best Practices return focus to the trigger on close. Code does it for keyboard closes, and a pointer pick leaves focus on the page.
