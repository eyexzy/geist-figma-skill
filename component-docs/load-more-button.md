# Load More Button

A full-width button used to append more items to a paginated list, with loading and styling variants.

Best Practices: written by the author of this library from the Geist code; the site page https://vercel.com/geist/load-more-button has none.

Contents: Best Practices, Figma Guidelines, Anatomy, Load More Button properties, Assembly, Layout, Motion, Tokens, Behavior in Code, Props in code

## Best Practices

- Use `<LoadMoreButton>` to append more items to a paginated list in place. It fills its container’s width, `w-full`.
- Set `loading` while the next batch is fetched. The button becomes `disabled` and shows a **Spinner**.
- Swap the label while loading: `Load More` becomes `Loading...`.
- Name what loads in the label: `Load More`, `Show More Results`.
- The button sits 16px below the list by default, `mt-4`. Set `noGap` when the container already spaces it.
- Set `noBorderRadius` for a button that meets square corners. It replaces the 6px radius with 0px, `rounded-none`.

## Figma Guidelines

### Anatomy

- `Load More Button` — `<LoadMoreButton>`: a column of `Gap` above a full-width button.
- `Control` — a **Button** instance, `secondary`, with prefix and suffix off.
- `Gap` — the spacer above the button, hidden until `showGap`.

### Load More Button properties

- `showGap` — shows `Gap`, the space between the list and the button. The height grows by it, 36px to 52px.
- `noBorderRadius` — `false` or `true`: radius 6px or 0px.
- The nested `Control` is exposed on the instance. Its `label` is the `children` of `<LoadMoreButton>`.
- An empty `children` renders `Load More`.
- The nested `state` carries `loading` and `disabled`, the props of the same name in code.

### Assembly

- Switch `loading` through the nested `state`.
- Use `showGap` for the space above the button instead of spacing the instance by hand.
- Height hugs its content, so `showGap` moves whatever sits below the instance by 16px in an auto layout parent.
- Resize the instance for width only; the `Control` fills it.
- Keep the nested `Control` on `secondary`.

### Layout

- Width — the container’s, `w-full`. The set is 400px wide.
- Gap — 16px above the button, `mt-4`.
- Button — 36px tall, 10px padding left and right.

### Motion

- At `state=loading` the nested **Spinner** is `md`, 16px, with a 1000ms cycle; its keyframes run to 78s.
- Set `Duration` to `78 s` in the timeline panel of the top-level frame.

### Tokens

- Button — fill `ds/background/100`, ring `ring/gray-400`, radius `tailwind/radius/md`.
- At `noBorderRadius=true` the radius is a fixed 0.
- Padding `tailwind/space/10` left and right, height `ds/size/medium`.
- Label hardcoded Geist Medium 14px/21px in `ds/gray/1000`.

## Behavior in Code

### Props in code

- The gap is on by default and `noGap` turns it off.
- `placeholder` renders an empty `h-8` block, 32px tall, in place of the button.
- `<LoadMoreButton>` renders `<Button variant="secondary">` and exposes that variant only.
- `onClick` and `disabled` pass to the inner `<Button>`.
