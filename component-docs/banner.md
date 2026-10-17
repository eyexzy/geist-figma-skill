# Banner

A prominent message that spans the full width of its container to announce important information.

Best Practices: written by the author of this library from the Geist code; the site page https://vercel.com/geist/banner has none.

Contents: Best Practices, Figma Guidelines, Anatomy, Banner properties, Action, Assembly, Layout, Motion, Tokens, Behavior in Code, Props in code

## Best Practices

- Use Banner for a page-level or site-wide announcement with one action, like a launch or scheduled maintenance. Use **Project Banner** for a state that needs resolution in one project, and **Note** for context inside a section.
- Show one Banner at a time. It spans the full width of its container, so a second one competes with the first for attention.
- A Banner always renders its button, so pass `button` with an `href` and a `content` label. Name the destination or the action in the label: `View Changelog`, `Upgrade Plan`.
- Wrap the lead phrase in `<b>` and follow it with an en dash. On desktop the component sets `<b>` in `gray-1000` semibold and the rest of the message in `gray-900`.
- Keep the message to one sentence. Below 961px the message becomes the button label; pass `mobileCopy` with a shorter version when the desktop copy runs long.
- Use `prefix` for a logo or icon that names the source of the announcement. It renders before the message on desktop and inside the button on mobile.
- `href` values that start with `http` open in a new tab, so use them for external destinations. Use a path for pages inside the app.

## Figma Guidelines

### Anatomy

- `Banner` — a row of an optional prefix, the message, and an `Action`.

### Banner properties

- `showPrefix` — shows a leading element before the message; `prefix` swaps it.
- `showButton` — shows or hides the button.

### Action

- `Action` — the `secondary` variant, `rounded` shape, and `small` size, with a `ChevronRightSmall` suffix.

### Assembly

- Editing `message` flattens the text to a single style. Re-apply the emphasis to the lead phrase, which is the `<b>` element in code.
- Change the button label and suffix icon on the nested `Action`; its props stay hidden on `Banner`.
- Resize `Banner` to the width of its container instead of editing its content. The row stays centered, and in code it stops growing at 1080px.

### Layout

- 1080px max · gap 12px

### Motion

- The nested `Action` brings its own hover reaction: `ON_HOVER` → `Smart Animate`, `150 ms`, and a custom bezier of `0.4, 0, 0.2, 1`.

### Tokens

- Message `ds/gray/900`; lead phrase `ds/gray/1000`.
- Row gap `tailwind/space/12`.
- `Action` shadow `ds/shadow/border-small`.

## Behavior in Code

### Props in code

- The button is always rendered.
- The button takes `shadow`, `shape="rounded"`, `size="small"`, and `variant="secondary"`.
- The label is `button.content` in code.
- Only `<b>` renders in semibold; the rest of the message uses `text-copy-16`.
