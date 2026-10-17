# Copy Button

A button that copies a given string to the clipboard and provides feedback when copied.

Best Practices: written by the author of this library from the Geist code; the site page https://vercel.com/geist/copy-button has none.

Contents: Best Practices, Figma Guidelines, Anatomy, Copy Button properties, Prototyping, Layout, Motion, Tokens, Behavior in Code, Runtime in code, Props in code, Motion in code

## Best Practices

- Use `<CopyButton>` next to a value people paste elsewhere: a token, an ID, a URL, a command. For a shell command with a prompt use **Snippet**.
- Pass the full value in `textToCopy`, even when the screen shows it truncated or masked; the clipboard gets exactly that string.
- Pass a `label` that names what gets copied: `Copy deployment URL`, not `Copy`. The button is icon-only, so without it screen readers announce an unnamed button.
- The check icon confirms the copy for 1 second, and screen readers announce `copiedLabel` (`Copied!` by default). Don’t add a success toast on top; it repeats the confirmation.
- A failed copy raises a `Failed to copy to clipboard` toast. Pass `onCopyError` only when you need different handling; it replaces the toast.
- Use `onCopySuccess` for analytics or follow-up state, not to show feedback.

## Figma Guidelines

### Anatomy

- `Copy Button` — `<CopyButton>`: a square holding `Icon`, a 16px frame that stacks `Copy` and `Check`.
- Code draws it as a **Button** with `svgOnly` and `shape="square"`, passing `variant` and `size` through.

### Copy Button properties

- `variant` — `secondary` has a fill and a ring; `tertiary` stays transparent and fills only on hover.
- `size` — `small` or `medium`. The set pairs `secondary` with `medium` and `tertiary` with `small`; switching `variant` takes the matching `size`.

### Prototyping

- Hover moves `default` to `hover`; a click moves to `copied` or `copied-hover`.
- After 1s `copied` returns to `default` and `copied-hover` to `hover`.

### Layout

- `medium` is a 36px square and `small` is 32px; the icon is 16px in both.

### Motion

- Hover: `Smart Animate`, bezier `0.4, 0, 0.2, 1`, `150ms`.
- Click and return: `200ms`, same bezier.
- Both icons exist in every variant; the hidden one is 8px at opacity 0, so `Smart Animate` scales and fades it.

### Tokens

- Radius `tailwind/radius/md`, icons `ds/gray/1000`.
- `secondary` — fill `ds/background/100`, ring `ring/gray-400`. Hover `components/button/secondary/bg-hover`: `ds/gray/200` in dark and `ds/gray/100` in light.
- `tertiary` is transparent; hover fills `ds/gray/alpha/200`.

## Behavior in Code

### Runtime in code

- `hover` comes from the pointer, and `copied` follows a click or the `copied` prop.

### Props in code

- `variant` defaults to `secondary` and `shape` to `square`.

### Motion in code

- Hover uses the `duration-[150ms] ease-in-out` of **Button**.
- The icons use `transition-all duration-200`.
