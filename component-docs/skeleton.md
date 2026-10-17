# Skeleton

Display a skeleton whilst another component is loading.

Source of the Best Practices: https://vercel.com/geist/skeleton

Contents: Best Practices, When to use, Behavior, Accessibility, Figma Guidelines, Anatomy, Skeleton properties, Assembly, Layout, Motion, Tokens, Behavior in Code, Props in code, Best Practices vs code

## Best Practices

### When to use

- Show a Skeleton when async data fills a known layout: table rows, card grids, profile blocks, sidebars.
- For a single in-flight action, use **Spinner**; for an indeterminate inline wait, use **LoadingDots**; for known progress, use **Progress**.
- Don’t use Skeleton as permanent decoration or as a placeholder for empty states. When there’s no data to load, render an **EmptyState**.

### Behavior

- Set `width` and `height` to match the final content so the layout doesn’t shift when data resolves. A 200×20 block becoming an 80×16 string reads as a glitch.
- Pick `pill`, `rounded`, or `squared` to mirror the eventual element’s shape (avatars `pill`, buttons and chips `rounded`, image tiles `squared`).
- When the skeleton wraps children, keep dimensions stable so the reveal swap doesn’t reflow surrounding content.

### Accessibility

- Wrap the loading region in `aria-busy="true"` and announce completion with `aria-live="polite"` on the destination container, not the skeleton itself.
- Disable the shimmer with the `no animation` variant on low-power surfaces and respect `prefers-reduced-motion`.
- Skeletons are decorative; avoid placing focusable controls inside them while loading.

## Figma Guidelines

### Anatomy

- `Skeleton` — `<Skeleton>`: a clipped block with a `Shimmer` frame inside.
- In code the block is a `span` with `data-geist-skeleton`.
- In code the sweep is the `::after` layer of the block.

### Skeleton properties

- `shape` — `default`, `pill`, `rounded`, or `squared`.
- `animated` — `true` runs the sweep and `false` holds it still.
- A wrapping skeleton lacking `width` and `height` hides the children and takes their size.
- With `show={false}` the wrapping skeleton shows the children.
- With `height` set, non-null `children` replace the shimmer and keep the height.

### Assembly

- Resize the instance to the size of the content it stands for.
- `Shimmer` keeps its length and the block clips it.
- Switch `shape` and `animated` through the properties, so the radius and the keyframes come with the variant.

### Layout

- `default` — a 5px radius (`rounded-[5px]`).
- `pill` and `rounded` — a full radius (`rounded-full`).
- `squared` — square corners (`rounded-none`).

### Motion

- `Shimmer` is a gradient frame 2880px wide.
- `Shimmer` starts 240px left of the block in `default` and 216px left in `pill`, `rounded`, and `squared`.
- The fill alternates `ds/gray/100` and `ds/gray/200`: 25 stops in `default`, 81 in the narrow variants.
- One gradient repeat is 1.5 times the block width: 240px in `default`, 72px in `pill`, `rounded`, and `squared`.
- `Shimmer` has one `TRANSLATION_X` track: 0 to one repeat over 1.5s, `Ease In And Out`, then back to 0 at once.
- In code the `::after` layer, 3 times the block width (`right: -200%`), runs `loading-skeleton 1.5s ease-in-out infinite reverse`.
- In code the layer moves by `translate(-50%)` over a `gray-100`, `gray-200`, `gray-100` tile of 1.5 times the block width.
- Keyframes run to 30s in every animated variant: 20 cycles of 1.5s.
- Set `Duration` to `30 s` in the timeline panel of the top-level frame; it covers every Skeleton in it.

### Tokens

- Gradient — `ds/gray/100` and `ds/gray/200`, the `gray-100` and `gray-200` of code.
- Radius — `tailwind/radius/5` for `default`.
- Radius — `tailwind/radius/full` for `pill` and `rounded`.

## Behavior in Code

### Props in code

- `pill`, `rounded`, and `squared` are booleans.
- `width` and `height` default to 24px each.
- `boxHeight` adds its difference from `height` below the block as `margin-bottom`: 18px for `boxHeight={42}` at 24px.
- `Skeleton` can wrap `children`.
- `button` extends the sweep by 1px at the top, bottom, and left, for a wrapped `Button`.
- `block` defaults to `true`; `false` sets `!inline-block`.
- `vcenter` splits the `boxHeight` margin between top and bottom.
- `autoSize` sizes the skeleton to its `children`.

### Best Practices vs code

- Best Practices pair `rounded` with buttons and chips and `pill` with avatars. The published `<Skeleton>` gives both the same full radius; the set follows that code.
- Best Practices ask to respect `prefers-reduced-motion`. The published `<Skeleton>` keeps `loading-skeleton` running when the system requests `reduce`; the set follows that code.
