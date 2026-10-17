# Pagination

Navigate to the previous or next page.

Source of the Best Practices: https://vercel.com/geist/pagination

Contents: Best Practices, Figma Guidelines, Anatomy, Pagination properties, _Pagination Item properties, Assembly, Layout, Motion, Tokens, Behavior in Code, Props in code, Runtime in code, Responsive in code, Motion in code

## Best Practices

- Use Pagination for sequential navigation between sibling pages (docs articles, blog posts, onboarding steps). For revealing more rows of the same data set, use **Show More** or a numbered pager.
- `previous.title` and `next.title` are the destination page names (`Deploy Hooks`, `Environment Variables`). Geist already renders the `Previous` / `Next` label, the chevron, and the `Go to {direction} page: {title}` aria label; don’t prepend arrows or `Go to`.
- Hide the slot at the start or end of a sequence instead of disabling it; an empty rail reads cleaner than a dimmed link with nowhere to go.
- Keep titles Title Case and short enough to fit the rail without wrapping; long destination names truncate, so put the distinctive word first.
- Don’t restate ordinal positions like `Page 3 of 10` inside `previous.title` or `next.title`. Pagination is sibling-link, not a numbered pager.

## Figma Guidelines

### Anatomy

- `Pagination` — `<Pagination>`: `Previous` and `Next` at the sides, with `slot` at the center.
- `_Pagination Item` — the `previous` or `next` link of code: `Label`, then `Row` with `Title` and `Chevron`.

### Pagination properties

- `showPrevious` and `showNext` — show `Previous` and `Next`.
- `showSlot` — shows `slot`, the `children` of code. `slot` takes any content.
- `Previous` and `Next` are exposed on the instance with their own properties.

### _Pagination Item properties

- `type` — `previous` or `next`. `next` is the `alignRight` link of code, with its chevron on the right.
- `state` — `default` or `hover`.
- `title` — the destination page name, the `previous.title` or `next.title` of code.

### Assembly

- Turn off `showPrevious` on the first page and `showNext` on the last.
- Write the page names in `title` on the exposed `Previous` and `Next`.
- Set the instance to `Fill container`, with `Previous` left and `Next` right.
- Turn on `showSlot` and place the content in `slot`.

### Layout

- An item is 56px high: 4px padding above and below, a 24px `Label` line and a 24px `Row`.
- The 13px/18px `Label` text sits 5px from the top of its 24px line.
- `previous` has 28px of padding on the left and 8px on the right.
- `next` has 8px of padding on the left and 28px on the right.
- `Chevron` is 20px, with its outer edge 26px from `Title` and its top 2px below the `Title` top.
- `Title` is 16px/24px Medium, up to 320px wide, then truncated with an ellipsis.
- `slot` is centered on the rail.

### Motion

- Hover: `Smart Animate`, bezier `0.4, 0, 0.2, 1`, 200ms.
- `On hover` in `default` runs `Change to` the `hover` variant of the same `type`.
- Only `Label` and `Chevron` change color; `Title` stays.

### Tokens

- `Label` — `ds/gray/900`, `legacy/foreground` on hover; text style `Copy/13`.
- `Chevron` — `ds/gray/900`, `legacy/foreground` on hover.
- `Title` — `ds/gray/1000` in both states; Medium 16px/24px, hardcoded.
- Radius — `tailwind/radius/md`.
- Padding — `tailwind/space/4`, `tailwind/space/8` and `tailwind/space/28`; `Label` top `tailwind/space/5`.

## Behavior in Code

### Props in code

- Code renders each link only when `previous` or `next` is passed.
- `previous` and `next` are objects `{ title, href }`, and `href` is required.
- The link labels `Previous` and `Next` and the `aria-label` `Go to previous page: {title}` are fixed text.

### Runtime in code

- The root is a `<nav>` with `aria-label="pagination"`, and each item is a link.
- The rail fills its container with `w-full`.
- The links use `pl-7 pr-2` for `previous` and `pl-2 pr-7` for `next`; `Title` has `max-w-[20em]`.

### Responsive in code

- The rail wraps (`flex-wrap`) on overflow, and `Next` keeps the right edge (`ml-auto`).
- The `slot` is centered with `left-1/2 top-1/2` and hides below 1200px with `max-xl:hidden`.

### Motion in code

- Hover colors transition with `transition-colors duration-200 ease-in-out`.
