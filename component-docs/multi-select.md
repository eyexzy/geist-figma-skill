# Multi Select

A keyboard-navigable dropdown for selecting multiple items with advanced focus management.

Source of the Best Practices: https://vercel.com/geist/multi-select

Contents: Best Practices, When to use, Behavior, Accessibility, Figma Guidelines, Anatomy, Multi Select properties, _Multi Select Trigger properties, _Multi Select Content properties, _Multi Select Row properties, Assembly, Layout, Motion, Tokens, Behavior in Code, Props in code, Runtime in code, Responsive in code, Motion in code, Accessibility in code, Best Practices vs code

## Best Practices

### When to use

- Pick `<MultiSelect>` when users pick more than one value from a known list (regions, scopes, tags).
- For a single value from a short list, use **Select**.
- When typing to filter is more important than seeing every option at once, use **Combobox**.
- Skip `<MultiSelect>` for boolean settings; **Toggle** handles those.

### Behavior

- Show the selected count in the trigger (`3 regions selected`); show the single name when only one is picked.
- Use controlled mode when state lives in the URL or syncs to the server so the trigger label and stored value stay in lockstep.
- Keep checkbox focus and button focus distinct so Up/Down navigates rows and Left/Right toggles between the row’s checkbox and action button.
- For empty filters, render `No {items} match "{query}"` rather than `No results`.

### Accessibility

- Each row checkbox needs an `aria-label` that names the item (`Select us-east-1`); a bare `Select` is unanchored for screen readers.
- The trigger button needs a stable accessible name even when zero items are selected; don’t rely on the placeholder alone.
- Trap focus inside the menu while it’s open and return focus to the trigger on close.
- Announce bulk actions (`Select All`, `Select Only`) through the visible button label so the action matches what the screen reader speaks.

## Figma Guidelines

### Anatomy

- `Multi Select` — `<MultiSelectRoot>`: a trigger, a menu, and a transparent hit frame in one component.
- `_Multi Select Trigger` — `<MultiSelectTrigger>`: the button with the label and the chevron.
- `_Multi Select Content` — `<MultiSelectContent>`: the menu panel with a `children` slot for rows.
- `_Multi Select Row` — `<MultiSelectRow>`: a checkbox and a row button with a hidden action label.
- `Trigger Hit` is a transparent frame over the trigger; its reaction opens and closes the menu.
- `Item 1 Row` wraps an `Item 1` instance and a `Checkbox Hit` frame.
- The row runs the button action; `Checkbox Hit` runs the checkbox action.

### Multi Select properties

- `position` — `top` or `bottom`: the menu opens above or below the trigger.
- `disabled` — `false` or `true`: `true` shows the disabled trigger and hides the menu.
- The `disabled` `true` variants are static.
- `Trigger` and `Menu` are exposed instances; their properties appear on the instance.

### _Multi Select Trigger properties

- `label` — the trigger text; `Multi Select` binds it to `trigger/label`.
- `state` — `default`, `hover`, or `disabled`; the `disabled` state is static.
- `open` — `false` or `true`; `true` rotates the chevron by 180°.

### _Multi Select Content properties

- `children` — a slot for rows; the default content is `Item 1 Row` to `Item 3 Row`.
- Rows in the slot carry their own reactions and variable bindings.

### _Multi Select Row properties

- `state` — `default`, `hover` for the row button, `checkbox-hover` for the checkbox, and `disabled`.
- `checked` — `true`: all rows are checked; the hover label is `Only`.
- `check-all`: a checked row in a partial selection; the hover label is `Check All`.
- `false`: an unchecked row in a partial selection; the hover label is `Only`.
- `check`: an unchecked row in an empty selection; the hover label is `Check`.
- In `checkbox-hover` the label is `Uncheck` on a checked row and `Check` on an unchecked row.
- `disabled` dims the row button to 60% opacity and shows the disabled checkbox; the state is static.

### Assembly

- Edit `label` of an `Item` in the slot to rename a row.
- Bind `open` of `Trigger`, `visible` of `Menu`, and the toggle on `Trigger Hit` to one Boolean variable, `state/menu/open`.
- Bind `checked` of every `Item N` to its own String variable, `item/N/selected`.
- Each `Item N Row` and each `Checkbox Hit` runs a click reaction that rewrites all ten `item/N/selected` variables.
- The same reactions write `selection/checked-count` and then rewrite `trigger/label`.
- A row click on a `check-all` row sets all rows to `true` and the count to `selection/row-count`.
- Any other row click sets that row to `check-all`, the others to `false`, and `selection/checked-count` to 1.
- A checkbox click first copies the row value into `internal/prev-row-value` and the count into `internal/prev-checked-count`.
- When nothing is checked, a checkbox click sets that row to `check-all` and the count to 1.
- An unchecked row sets itself to `check-all` and raises the count by 1.
- The last unchecked row sets all rows to `true`.
- When all rows are checked, a checkbox click sets that row to `false` and the others to `check-all`. It lowers the count by 1.
- A `check-all` row sets itself to `false` and lowers the count by 1.
- The last checked row sets all rows to `check`.
- Four conditions then compare `selection/checked-count` with `selection/row-count`, 1, and 0 to write `trigger/label`.
- Set `selection/row-count` to the number of enabled rows in the slot after every added or removed row.
- Set the start state with `item/N/selected`: `true` on every row starts all checked; `check` on every row starts empty.
- For a partial start, set `check-all` on checked rows and `false` on the others.
- Set `selection/checked-count` and `trigger/label` to match the start state.
- For a disabled row, set `state` of its `Item` to `disabled`.
- Clear the reactions of that row and its `Checkbox Hit`.
- Set `checked` of a disabled row by hand, unbound from any variable.
- Add a row: duplicate the last row in the slot and set `label` on its `Item`.
- Bind `checked` of the copy to the next `item/N/selected`.
- Open the Prototype panel of the copied row and of its `Checkbox Hit`.
- In every action, exchange the copied row variable and the new `item/N/selected`.
- The count strings are `All items selected`, `1 item selected`, `No items selected`, and the count followed by `items selected`.
- Edit those strings in each row reaction to change the wording of the trigger.
- Create the sixteen variables of `Prototyping / Multi Select` again in your own collection to drive another menu.
- Rebind `label` and `open` of `Trigger`, `visible` of `Menu`, and `checked` of every `Item N` to your variables.
- Rewrite the reactions of `Trigger Hit`, every row, and every `Checkbox Hit` to read and write your variables.
- Instances that share a prototype share the variables of `Prototyping / Multi Select`; give each instance its own set.
- Resize the `Multi Select` instance to change the trigger and menu width together; rows fill the menu.
- If following content hides the open menu, set the parent `Canvas stacking` to `First on top`.

### Layout

- The trigger is 36px tall with 10px padding on the left, 12px on the right, and a 6px radius.
- `Label Wrap` adds 6px on each side of the label.
- The chevron is 14px × 14px, 4px after the label and 12px from the right edge.
- The menu is 8px from the trigger, below it in `bottom` and above it in `top`.
- In `top` the menu uses the `Bottom` constraint, so added rows grow it upward.
- The menu has 8px padding, a 12px radius, and the width of the trigger.
- The menu is at most 384px tall and scrolls vertically; `Bottom Spacer` keeps 8px below the last row.
- Each row is 28px tall; the checkbox cell is 28px × 28px with 4px padding and a 4px radius.
- The row button has 4px padding, 8px between label and action label, and a 4px radius.
- The action label is 12px/16px text with 2px 4px padding, aligned to the right; hover states show it.
- `Checkbox Hit` covers the checkbox cell, 28px × 28px at the top left of the row.

### Motion

- Trigger states change with `Smart Animate`, `Custom bezier` `0.4, 0, 0.2, 1`, and `150 ms`.
- Row states change instantly.
- The checkbox in `Item` changes with `Smart Animate`, `Custom bezier` `0.4, 0, 0.2, 1`, and `200 ms`.
- `state/menu/open` shows and hides the menu instantly.

### Tokens

- The trigger uses `ds/background/100` fill, `ring/gray-400` ring, `ds/gray/1000` text, and `tailwind/radius/md` radius.
- The trigger padding is `tailwind/space/10` on the left and `tailwind/space/12` on the right.
- Hover changes the ring to `ring/gray-alpha-500` and the chevron from `ds/gray/700` to `ds/gray/1000`.
- The `disabled` state uses `ds/gray/100` fill and `ds/gray/700` text and chevron; the ring stays `ring/gray-400`.
- The menu uses `ds/background/100` fill, `ds/shadow/menu` effect, `tailwind/radius/xl` radius, and `tailwind/space/8` padding.
- Row hover fills the row button and the checkbox cell with `ds/gray/100`.
- Row text uses `Label/14` in `ds/gray/1000`; the action label is 12px in `ds/gray/900`.
- Rows and cells use `tailwind/radius/sm` radius and `tailwind/space/4` padding.

## Behavior in Code

### Props in code

- `<MultiSelectRoot>` takes `children`, `onOpenChange`, and the Popover root props.
- `<MultiSelectTrigger>` renders a medium secondary `Button`; `children` is the label and other props reach the button.
- `<MultiSelectContent>` defaults to `align` `end` and `sideOffset` `8`; `container`, `onOpenAutoFocus`, and `className` are accepted.
- `<MultiSelectRow>` takes `name`, `checked`, `onChange`, `onSelectOnly`, `onSelectAll`, `selectedCount`, and `totalCount`.
- `selectedCount` and `totalCount` choose the action label of a row, and the parent supplies both.
- Optional row props: `disabled`, `indeterminate`, `leading`, `showActionLabel` (`true`), `checkboxPosition` (`start` or `end`), `checkboxName`, `checkboxTestId`, `className`.
- `children` of a row replaces the `name` text; `leading` adds content before it.
- `checkboxPosition` `end` moves the checkbox to the right of the row button.

### Runtime in code

- The trigger is 36px tall with 0px 13px 0px 10px padding and a 6px radius.
- The ring is 1px `gray-400`; hover changes it to `gray-alpha-500`.
- The chevron is 14px, `gray-700`, and `gray-1000` on hover; it sits 12px from the right edge.
- The menu opens 8px below the trigger with 8px padding, a 12px radius, and the trigger width as its minimum.
- The menu is at most 384px tall and scrolls vertically.
- Each row is 28px tall; the checkbox cell is 28px × 28px with 4px padding and a 4px radius.
- Row text is 14px/20px in `gray-1000`; the action label is 12px/16px in `gray-900` with a 64px minimum width.
- Hover fills the row button or the checkbox cell with `gray-100`; press uses `gray-200`.
- A disabled row is 60% opaque and its hover fills stay transparent.
- The action label appears on hover and on keyboard focus of the row.
- The label is `Check` when nothing is selected, and `Only` when all rows are checked.
- In a partial selection the label is `Check All` on a checked row and `Only` on an unchecked row.
- Over the checkbox the label is `Uncheck` on a checked row and `Check` on an unchecked row.
- A row button click runs `onSelectOnly` when all rows are checked, or on an unchecked row in a partial selection.
- It runs `onSelectAll` on a checked row in a partial selection, and `onChange` when nothing is selected.
- A checkbox click runs `onChange`.
- Opening the menu moves focus to the menu panel.

### Responsive in code

- The trigger fills the available width below 401px.

### Motion in code

- Trigger hover transitions over 0.15s with `cubic-bezier(0.4, 0, 0.2, 1)`.
- The chevron color transitions over 150ms; its 180° rotation on open is instant.
- The menu fades out over 200ms on close.
- Row and checkbox hover change color instantly.

### Accessibility in code

- The trigger has `aria-haspopup="dialog"` and `aria-expanded`; the menu is a `role="dialog"` panel with `tabindex="-1"`.
- Each checkbox is a native input named by `aria-labelledby`, which points at the row button id.
- The row button label reads the name followed by the action, such as `Design System. Check All`.
- The action label is hidden from assistive technology with `aria-hidden`.
- Down arrow on the trigger opens the menu.
- Up and Down arrows move between row buttons and wrap at the ends.
- Left arrow selects checkbox mode and Right arrow selects button mode; the action label follows.
- Enter or Space runs the checkbox action in checkbox mode and the smart action in button mode.
- Escape closes the menu and returns focus to the trigger.
- Tab or an outside click closes the menu and focus moves to the page.

### Best Practices vs code

- Best Practices ask to trap focus inside the open menu. The published menu closes on Tab and moves focus to the page.
- Best Practices describe a filtered empty message. The published menu lists every row and offers neither filter nor empty state.
