# Table

A semantic HTML table component

Source of the Best Practices: https://vercel.com/geist/table

Contents: Best Practices, When to use, Behavior, Content, Figma Guidelines, Anatomy, Table properties, _Table Row properties, _Table Cell properties, Assembly, Layout, Motion, Tokens, Behavior in Code, Props in code

## Best Practices

### When to use

- Use `<Table>` for tabular data where rows share the same shape and at least one column is sortable or comparable across rows.
- For a row of descriptive content paired with a single action (membership row, integration row), use **Entity** instead.
- For a key/value metadata block on a detail page, use **Description**, not a two-column table.

### Behavior

- When the underlying list is empty (filter cleared, never created), render **Empty State** outside the table rather than an empty `<Table.Body>`.
- Render `—` in cells where a value is unknown or not applicable. Don’t substitute `N/A`, `null`, or an empty string.
- Sortable column headers are buttons. The visible label stays Title Case; the sort-direction arrow is decorative and the button announces the next sort state to assistive tech.
- Apply `tabular-nums` (or Geist Mono) to numeric columns so digits align across rows for comparison.

### Content

- Column headers (`<Table.Head>`) are Title Case nouns or noun phrases: `Last Used`, `Requests (7d)`, `Created`, `Status`. Never sentences.
- Use the canonical short relative-time form in cells (`2m ago`, `5h ago`); switch to `Mar 14, 2026` past 7 days. See **Relative Time Card**.
- Pagination labels are `Previous` and `Next`. Page-count copy reads `Page 2 of 7` or `21–40 of 142` with an en-dash inside the range.

## Figma Guidelines

### Anatomy

- `Table` — `<TableRoot>` wrapping `<Table>`: header, body, footer, and Show More.
- `Table Header` — `<TableHeader>`: holds the `Head Row`.
- `Table Body` — `<TableBody>`: holds the slot `rows`.
- `Table Footer` — `<TableFooter>`: holds the `Footer Row`.
- `_Table Row` — `<TableRow>`: one row with the slot `cells`.
- `_Table Cell` — `<TableHead>` or `<TableCell>`: one cell with the slot `content`.
- `Stripe`, `Hover`, and `Border` are the row decor: odd-row stripe, hover fill, and bottom border.
- `Spacer` is the 12px gap between the header and the body.
- `Show More` holds the fade and the Show More button.

### Table properties

- Modes of the `Table / Body` collection set striped, bordered, and density, as the `<TableBody>` props do.
- Modes with Striped show the stripe of rows marked `odd`. The set starts on `Striped`.
- Modes with Bordered add a 1px border under each row with `showBorder` on.
- Modes with Compact give 30px body rows; the others give 40px.
- `rows` — the slot that holds the body rows, `children` in code.
- `showHeader` shows the header row. `showFooter` shows the footer row.
- `showSpacing` shows the 12px gap above the body; code removes it with `removeSpacing`.
- `showMore` shows the Show More button over a fade, as in the Virtualized table example.
- `expanded` — `false` crops the body to 200px, 150px when compact; `true` shows every row and Show Less.

### _Table Row properties

- `type` — `head`, `body`, or `footer`: the row inside `<TableHeader>`, `<TableBody>`, or `<TableFooter>`.
- `state` — `default` or `hover` on `body`.
- `cells` — the slot that holds the cells; a row takes any number of columns.
- `odd` marks rows 1, 3, 5, and so on for the Striped modes.
- `showBorder` is off on the last row, since code draws its border only between rows.
- `head` draws a 1px border under the header; `footer` draws one above the footer.

### _Table Cell properties

- `type` — `head` for `<TableHead>`; `cell` and `footer` for `<TableCell>` in the body and footer.
- `align` — `left` or `right`; code right-aligns the last column with `last:text-right`.
- `content` — the slot that holds the cell content, `children` in code. Its default is a text label.
- Head and footer labels are Medium; cell labels are Regular.

### Assembly

- Pick a mode, such as `Compact + Striped`, in the variable modes of the selected `Table`.
- Add or remove body rows in `rows` by duplicating or deleting a row.
- Turn on `odd` on rows 1, 3, 5, and so on; a duplicated row keeps the value of its source.
- Turn off `showBorder` on the last row only.
- Add or remove columns in `cells` of the `Head Row`, every row and the `Footer Row`; keep the counts equal.
- Set `align` to `right` on the last cell of each row and `left` on the others.
- Put text, a badge, or any instance into a cell’s `content` slot; the row grows with it.
- For a subtotal like `colSpan`, turn on `showFooter` and leave the middle footer cells empty.
- To show every row, set `expanded` to `true` and turn off `showMore`.

### Layout

- Header cells are 36px tall. Body cells add 10px above and below, 5px when compact; side padding is 8px.
- Cell text sets font, size and line height directly: Geist 14px on a 20px line, Medium in head and footer, Regular in body.
- A 12px gap separates the header from the body.
- A 1px border closes the header and opens the footer.
- Each bordered row is 1px taller.
- Stripe and hover fills have 6px rounded corners.
- Cells split the row width equally.
- Cells keep equal widths on resize; long text ends in an ellipsis and other content is clipped.
- `Table` clips its content, so a menu that opens from a cell is cut at the table edge.
- The Show More button sits centered over a 128px fade at the bottom of the body.

### Motion

- Rows fill on hover over 150ms. The `On hover` reaction on `_Table Row` uses `Smart Animate`, `150 ms`, and `cubic-bezier(.4, 0, .2, 1)`.
- The Show More button’s `On click` switches `expanded` instantly.

### Tokens

- Text: `ds/gray/900`. Borders: `ds/gray/400`.
- Stripe: `ds/background/200`. Hover fill: `ds/gray/100`. Fill radius: `tailwind/radius/md`.
- Modes: the `Table / Body` collection, from `Default` to `Compact + Striped + Bordered`. Collapsed height: `table/collapsed-height`, 200px or 150px.
- Cell padding: `table/cell-padding-y`, 10px in `Default` and 5px in `Compact`.
- Fade: `ds/background/100`, `components/table/fade/bg-67`, `components/table/fade/bg-33`, and `components/table/fade/bg-0` at 80% opacity.

## Behavior in Code

### Props in code

- `interactive` on `<TableBody>` fills the hovered row; every `body` row in the set has a `hover` state.
- `virtualize` renders only the rows within `overscan` pixels of the viewport.
- `density` is `default` or `compact`; `overscan` defaults to 150.
- `<TableColgroup>` and `<TableCol>` set column widths, for example `w-[44%]`.
- `colSpan` merges cells, as in the Subtotal footer.
- A cell with a checkbox drops its right padding; a cell with `data-cell-link` drops all padding.
- A long value widens its column, and `<TableRoot>` scrolls horizontally.
