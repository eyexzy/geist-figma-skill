# Separator

A visual divider that separates content into distinct sections, with support for horizontal and vertical orientations.

Best Practices: written by the author of this library from the Geist code; the site page https://vercel.com/geist/separator has none.

Contents: Best Practices, Figma Guidelines, Anatomy, Separator properties, Assembly, Tokens, Behavior in Code, Props in code

## Best Practices

- Use `<Separator>` between blocks of one container. Inside a **Menu** use `MenuDivider`.
- Set `orientation` to `vertical` for items in a row. The default is `horizontal`.
- Give the parent of a vertical separator a set height, like `h-8`. The line is `h-full`, and in a parent without a height it is 0px tall.
- Space the line from the parent: `space-y-4` between sections and `space-x-4` between row items, 16px each.
- Place a separator only where content really changes. Screen readers announce each one as a `separator` with its `aria-orientation`.

## Figma Guidelines

### Anatomy

- `Separator` — `<Separator>`: a single 1px line.

### Separator properties

- `orientation` — `horizontal` draws a 1px high line, `vertical` a 1px wide line. The length is 24px until the instance is resized.

### Assembly

- Stretch a horizontal separator with `Fill container` in an auto layout parent. The height stays 1px.
- Give the row a set height, align items to `Center`, and set the vertical separator's height to `Fill container`.
- Space the line with the parent gap: 16px between sections (`space-y-4`) and between row items (`space-x-4`).

### Tokens

- `ds/gray/200`, the `bg-gray-200` of code.

## Behavior in Code

### Props in code

- `<Separator>` takes `orientation`, default `horizontal`, and `inset`, default `false`.
- `inset` shortens the line by 1px at each end and fills it with `bg-gray-400`.
