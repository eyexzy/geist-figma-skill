# Breadcrumbs

Navigation aid that shows the user's location within a site's hierarchy, with text and menu variants.

Best Practices: written by the author of this library from the Geist code; the site page https://vercel.com/geist/breadcrumbs has none.

Contents: Best Practices, Figma Guidelines, Anatomy, Breadcrumb properties, _Breadcrumb Item properties, Assembly, Layout, Motion, Tokens, Behavior in Code, Props in code, Runtime in code

## Best Practices

- Use `Breadcrumb` to show where a page sits in a hierarchy. To switch between sibling views on one page, use **Tabs**.
- Use `type="text"` for a trail that links to parent pages. It renders a `nav` labeled `Breadcrumb` around an ordered list, with a chevron between items.
- Use `type="menu"` when a step runs an action in place instead of navigating. It renders each step as a bordered `button` inside a plain `div`.
- Mark the current page with `active`, on the last item. In `text` it sets `aria-current`; in `menu` it only restyles the chip, so pass `aria-current` yourself.
- In `text`, `disabled` only dims the item to `gray-700` with a `not-allowed` cursor. A link inside still navigates, so render an unreachable step as plain text. In `menu`, it sets `disabled` on the `button`.
- Name each step after the page it leads to, in Title Case and one or two words: `Home`, `Dashboard`, `Overview`. In `menu`, an overflowing label truncates and shows in full in a tooltip on desktop.
- `type="text"` renders its own `nav` labeled `Breadcrumb`; wrapping it in another `nav` announces two landmarks. `type="menu"` renders a plain `div`; wrap it in a `nav` with an `aria-label` when its items navigate.

## Figma Guidelines

### Anatomy

- `Breadcrumb` — a row of `_Breadcrumb Item` instances.
- `_Breadcrumb Item` — a `Label`; in `text` a `ChevronRight` follows it, in `menu` a bordered chip holds it.

### Breadcrumb properties

- `type` — `text` or `menu`. Switching it swaps every nested item and keeps each item's `label` and `state`.
- `showItem2` to `showItem7` — one toggle per item after the first.

### _Breadcrumb Item properties

- `_Breadcrumb Item` is `BreadcrumbItem` in code; its `type` mirrors `Breadcrumb`.
- `state` — `active` maps to the `active` prop and `disabled` to the `disabled` prop. `hover` follows the pointer.

### Assembly

- Change `type` on `Breadcrumb`. Its row gap is 6px in `text` and 8px in `menu`.
- In `text`, hide `ChevronRight` inside the last visible item. Every item draws one, and code hides it on the last. Show it again when you reveal another item after it.
- `Item 2` is `active` when you place `Breadcrumb`. Set `state` on each item yourself; toggling items leaves `active` where it is.

### Layout

- `text` — gap 6px · label 14px/20px · chevron 16px
- `menu` — gap 8px · 22px tall · padding 2px 6px · label 12px/16px · radius 4px

### Motion

- `default` and `disabled` carry an `ON_HOVER` reaction to `hover`: `Smart Animate` on `default`, `Dissolve` on `disabled`, both `Ease Out` and `200 ms`.

### Tokens

- Label text `ds/gray/900`, `ds/gray/1000` on `hover` and `active`, `ds/gray/700` on `disabled`. `ChevronRight` stays `ds/gray/900` in every state.
- `menu` chip fill `ds/background/200`, stroke `ds/gray/alpha/400`, and radius `tailwind/radius/sm`. On `hover` the fill is `ds/gray/200` and the stroke `ds/gray/alpha/500`.
- Gaps `tailwind/space/6` in `text` and `tailwind/space/8` in `menu`; chip padding `tailwind/space/2` and `tailwind/space/6`.
- The `active` and `disabled` chips keep the `default` fill and stroke.

## Behavior in Code

### Props in code

- `Breadcrumb` takes any number of `BreadcrumbItem` children.
- The item takes `type` from its parent.

### Runtime in code

- The hover transition runs `200ms` with a bezier of `0.4, 0, 0.2, 1`.
- A `disabled` item takes the `hover` colors, because its `hover:` styles apply regardless of `disabled`.
- The `active` chip takes stroke `ds/gray/600` and fill `ds/background/100`; the `disabled` chip takes fill `ds/gray/alpha/200`.
- Keyboard focus on a `menu` chip adds `ds/focus/ring` through `focus-visible`.
- The `menu` row scrolls horizontally through `max-sm:overflow-x-auto`.
