# Keyboard Input

Display keyboard input that triggers an action.

Source of the Best Practices: https://vercel.com/geist/keyboard-input

Contents: Best Practices, Figma Guidelines, Anatomy, Kbd properties, Kbd Group properties, Assembly, Layout, Tokens, Behavior in Code, Props in code, Runtime in code

## Best Practices

- Use `<Kbd>` for shortcut hints inside prose, menu items, and button suffixes. In long-form docs that narrate a shortcut, write `the ⌘ K shortcut` directly so the page renders the same when copied to plain text.
- Pass modifiers via boolean props (`meta`, `shift`, `alt`, `ctrl`). The component swaps `⌘` for `Ctrl` on Windows and Linux, so hard-coding `<Kbd>Cmd+K</Kbd>` ships the wrong glyph to half your users.
- `children` is one key, digit, or named key (`K`, `7`, `Enter`, `Esc`). Don’t lowercase it, don’t spell out modifiers inside, and don’t pack a sentence into the element.
- Use `small` inside dense surfaces like menu rows, command-bar items, or table cells where the default size crowds adjacent text.
- Punctuation lives outside the element: `Press <Kbd meta>K</Kbd> to open the command menu.` Period, comma, and `or` separators stay in surrounding prose so screen readers don’t announce them as keys.

## Figma Guidelines

### Anatomy

- `Kbd` — `<Kbd>`: one key cap holding modifier glyphs and a label.
- `Kbd Group` — up to five `Kbd` instances in a row, one per key.

### Kbd properties

- `meta`, `shift`, `alt`, `ctrl` — the glyphs `⌘`, `⇧`, `⌥`, `⌃`, the props of the same name in code.
- Glyphs read in the order `meta`, `shift`, `alt`, `ctrl`, then the label.
- `Kbd` has all modifiers off by default; `Kbd 1` of `Kbd Group` has only `meta` on.
- `label` with `showLabel` — the key. In code it is `children`.
- `small` — `false` or `true`, the `small` prop in code.

### Kbd Group properties

- `showKbd2` to `showKbd5` — the keys after the first.
- Each `Kbd 1` to `Kbd 5` exposes its modifiers and `label` on the instance.
- `small` — switches the group and every key in it together.
- The group gap is 4px, or 6px at `small`.

### Assembly

- One `Kbd` with `meta`, `shift`, and a `label` is a single cap, as `<Kbd meta shift>K</Kbd>`. A `Kbd Group` draws one cap per key.
- In an **Input**, set the suffix `type` to `kbd`; it holds a `Kbd Group`.

### Layout

- Cap — 24px tall with 6px padding left and right, minimum width 24px. At `small`, 20px tall with 4px padding, minimum width 20px.
- Glyphs and the label sit flush.
- Text — Geist Regular 14px with line height 23.8px; at `small`, 12px with 20.4px.

### Tokens

- Cap — fill `ds/background/100`, ring `ring/gray-alpha-400`, radius `tailwind/radius/sm`.
- Padding `tailwind/space/6`, or `tailwind/space/4` at `small`. Text `ds/gray/1000`.
- Group gap `tailwind/space/4`, or `tailwind/space/6` at `small`.

## Behavior in Code

### Props in code

- Any number of `<Kbd>` can sit in a row.
- Each `<Kbd>` has a left margin, 4px or 2px at `small`. The **Input** suffix adds a gap of 4px.
- `<Kbd>` sets text with `text-sm` and `text-xs` at `small`, both with `!leading-[1.7em]`.
- `<Kbd>` passes `className` and other props to the `<kbd>` element.

### Runtime in code

- `meta` renders `⌘` on macOS and iOS and `Ctrl` elsewhere.
- `meta` shows a blank space of `1em` minimum width until the platform is detected.
