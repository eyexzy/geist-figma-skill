# Book

A responsive book component.

Source of the Best Practices: https://vercel.com/geist/book

Contents: Best Practices, When to use, Behavior, Accessibility, Figma Guidelines, Anatomy, Book properties, Assembly, Layout, Tokens, Behavior in Code, Props in code, Runtime in code, Responsive in code, Motion in code, Rebuild the hover in Figma, Accessibility in code, Best Practices vs code

## Best Practices

### When to use

- Use Book for marketing pages, docs landing covers, and changelog hero shots where content needs the metaphor of a labeled volume.
- For in-product cards and dashboard tiles, use **Card**; Book is too decorative for repeated UI rows.
- Pick `simple` when the title alone carries the design and `stripe` when an icon or color stripe adds hierarchy or category cues.

### Behavior

- Set the `color` prop from design tokens (`var(--ds-blue-700)`, `var(--ds-amber-600)`) instead of raw hex so the cover follows light/dark theme tokens.
- Reserve the textured variant for hero shots; on a row of multiple Books the texture competes with the labels.
- Use the responsive width prop to keep covers proportional across breakpoints; squashing aspect ratio breaks the metaphor.

### Accessibility

- Treat the cover as decorative chrome and surface the title via the underlying heading element so screen readers don’t double-announce.
- Inner illustrations need alt text only when they communicate something the title doesn’t; otherwise mark them `aria-hidden`.
- When the Book wraps a link, put the focus ring on the link itself, not the cover, so keyboard users see the actual hit target.

## Figma Guidelines

### Anatomy

- `Book` — the cover, `<Book>` in code.
- `Stripe` — the band above the title in stripe, holding the `illustration` slot and `Stripe Bind`.
- `Body` — holds `Bind`, the spine shading, and `Content`; in simple it fills the whole cover.
- `Content` — `Title` plus the bottom element: `Icon` in stripe, the `illustration` slot in simple.
- `Texture` and `Border` — overlays above the cover.

### Book properties

- `size` — `small`, `medium`, and `large` are 150px, 200px, and 300px wide; they map to the `width` prop.
- `icon` — swaps the 16px icon below the title; it applies to stripe only.
- `illustration` — in stripe the slot fills the band and clips any overflow.
- In simple the slot sits below the title and shows the default illustration; custom artwork replaces it.
- `color` and `textColor` of the code are fill overrides on the instance.

### Assembly

- For another width, scale the instance with the Scale tool (`K`).
- `color` in stripe: select `Stripe` inside the instance and replace its fill.
- Bind a color variable so the band follows the theme.
- `color` in simple: replace the first fill of the instance and remove the second one, the gradient sheen.
- In simple with `color`, set `Bind` to the `Overlay` blend mode and 100% opacity so the spine matches the code.
- `textColor`: replace the fill of `Title`.
- Illustration: drop layers into the `illustration` slot, or give the slot an image fill with the `Fill` scale mode.
- Set a dropped layer to `Fill container` to cover the band; other layers keep their size from the top left.
- In simple, delete `Default Illustration` inside the slot before adding custom artwork; the slot height follows its content.
- Long titles wrap inside `Content`; in stripe the band shrinks, because `Stripe` is `Fill container` and `Body` is `Hug contents`.
- Any 16px icon fits `icon`, for example `LogoNext` or `LogoReact`.

### Layout

- The `Book` root is vertical and fixed at 150×184px, 200×245px, or 300×367px, ratio 49:60.
- `Stripe` is horizontal, `Fill container` in both axes, and clips its content.
- `Body` is horizontal and `Hug contents` in stripe, `Fill container` in simple.
- The left padding of `Body` equals the spine width: 12.3px, 16.4px, and 24.6px.
- `Content` is vertical and `Fill container` wide, with padding 9.1px, 12.2px, and 18.3px.
- The gap below the title is 18.4px, 24.5px, and 36.7px in stripe, and 12.2px, 16.3px, and 24.5px in simple.
- `Title` is Geist SemiBold with line height 1.25 and letter spacing −2%.
- Its size is 12.5px, 16.7px, and 25.1px in stripe, and 14.3px, 19.1px, and 28.7px in simple.
- `Bind` and `Stripe Bind` are absolute and stretch vertically; `Texture` and `Border` are absolute and stretch both ways.
- The `Icon` of stripe is 16px; `Default Illustration` of simple is 36×56px with fixed colors `#45DEC4`, `#0070F3`, and `#E5484D`.

### Tokens

- `components/book/cover/bg` — cover fill: `#1f1f1f` in Dark, `ds/background/200` in Light.
- `components/book/cover/sheen` — white highlight at the top of the cover: 10% in Dark, 0% in Light.
- `components/book/cover/border` — border color: transparent in Dark, `ds/gray/alpha/400` in Light.
- `components/book/texture/opacity` — texture opacity: 60% in Dark, 50% in Light.
- `components/book/shadow/drop-1`, `drop-2`, `inset-side`, `inset-top`, and `inset-bottom` are the effect colors of Dark.
- `components/book/shadow/light-drop-1`, `light-drop-2`, and `light-drop-3` are the effect colors of Light.
- `ds/amber/600` — fill of `Stripe`; `ds/gray/1000` — fill of `Title`.
- `tailwind/radius/md` rounds the left corners; `tailwind/radius/sm` rounds the right corners.
- `Border` opacity is 60% in simple.

## Behavior in Code

### Props in code

- `<Book>` comes from `@vercel/geistcn/components` and takes `title` as a string.
- `variant` is `stripe` or `simple`; the default is `stripe`.
- `width` is a number in px or a breakpoint object; the default is 196px.
- `color` takes any CSS color; the default is `var(--ds-amber-600)` in stripe and `var(--ds-gray-200)` in simple.
- `textColor` takes any CSS color; the default is `var(--ds-gray-1000)`.
- `icon` is a React node for the bottom of stripe; the default is the Vercel logo, and simple ignores it.
- `illustration` is a React node; in simple it replaces the default illustration.
- `textured` is false by default; the texture turns 180° when a 32-bit hash of the title is odd.
- `className` is applied to the outer `perspective` wrapper.

### Runtime in code

- The markup nests `perspective`, `rotateWrapper`, and `book`; `pages` and `back` sit beside `book` inside `rotateWrapper`.
- The `rotateWrapper` keeps the ratio `49 / 60` and its minimum width is `--book-width` in px.
- The title is a `span` with weight 600, letter spacing −0.02em, and line height 1.25em.
- Its size is 10.5cqw in stripe and 12cqw in simple.
- Simple `Title` takes `text-wrap: balance` and a two-part `text-shadow` mixed from `--book-color`.
- The cqw unit is 1% of the title width, which is 238.8px in a 300px book.
- Content padding is 6.1% and the spine is 8.2% of the book width.
- The gap below the title is 24px × width / 196 in stripe.
- In simple the gap below the title is 16px × width / 196.
- Corner radii are `6px 4px 4px 6px`: top-left, top-right, bottom-right, bottom-left.
- Dark cover: `#1f1f1f` under a gradient from `#ffffff1a` at 0% to transparent at 50%.
- Dark shadows: `0 1.8px 3.6px #0000000d`, `0 10.8px 21.6px #00000014`, then inset `0 -0.9px #0000001a`, `0 1.8px 1.8px #ffffff1a`, `3.6px 0 3.6px #0000001a`.
- Light cover: `ds-background-200` with shadows `0 1px 1px #00000005`, `0 4px 8px -4px #0000001a`, `0 16px 24px -8px #00000008`.
- Light adds a 1px `gray-alpha-400` border.
- Both themes add an inset `0 1px 2px #ffffff4d`.
- Dark simple with the default `color` swaps that inset to `#ffffff1a`.
- The spine `--bg-shadow` is a white and a black gradient across the spine width.
- In the stripe band it is drawn with 100% overlay.
- White stops: transparent to 12%, `#ffffff40` at 29.25%, transparent at 50.5% and 75.25%, `#ffffff40` at 91%, transparent at 100%.
- Black stops: `#00000008` at 0%, `#0000001a` at 12%, transparent at 30%, `#00000005` at 50%, `#0003` at 73.5%.
- More black stops: `#00000080` at 75.25%, `#00000026` at 85.25%, transparent at 100%.
- The spine below the band uses the same gradients at 20% opacity; simple with `color` switches it to 100% overlay.
- The texture is `book-texture.avif` sized `cover` with the `hard-light` blend.
- Its opacity is 0.5 with brightness 1.1 in Light, and 1 in Dark.

### Responsive in code

- `width` accepts an object such as `{ sm: 150, md: 196 }` with the keys `xs`, `sm`, `smd`, `md`, and `lg`.
- The ranges are `xs` up to 400px, `sm` 401–600px, `smd` 601–768px, `md` 769–960px, and `lg` from 961px.
- A missing `xs` falls back to `sm`; a missing `lg` falls back to `md`, then `smd`, then `sm`.
- A missing `smd` falls back to `md`, then `sm`; a missing `md` falls back to `smd`, then `sm`.

### Motion in code

- Hovering the `perspective` wrapper sets `rotateY(-20deg) scale(1.066) translateX(-8px)` on `rotateWrapper` with `perspective: 900px`.
- The transition is `transform .25s ease-out` in both directions, with `transform-style: preserve-3d` and the origin at the center.
- At 300px width the right edge becomes 13.1% taller and the left edge 0.2% taller than at rest.
- The `pages` plane starts 4px inside the right edge, from 3px below the top to 3px above the bottom.
- Its width is `calc(29cqw - 2px)`, placed by `translateX(calc(W - 29cqw / 2 - 3px)) rotateY(90deg) translateX(29cqw / 2)`.
- The `pages` fill is `linear-gradient(90deg, #eaeaea 0%, #0000 70%)` over `linear-gradient(#fff, #fafafa)`.
- With `textured` the `pages` fill is `repeating-linear-gradient(90deg, #fff, #efefef 1px, #fff 3px, #9a9a9a 1px)`.
- The `back` layer copies the cover size and sits at `translateZ(-29cqw)` in `--ds-gray-200` in stripe or `--book-color` in simple.
- The layout box stays unchanged, because the transform moves paint only.

### Rebuild the hover in Figma

- A rotation about the vertical axis keeps vertical lines vertical, so each strip needs only scale and shift.
- Cut the cover into 60 vertical strips.
- Cut `pages` into 12 strips at x = W − 4 and `back` into 8 strips.
- For a strip at distance u from the left and depth z, use `xs = (u − W / 2 − 8) × 1.066`.
- Then `x2 = xs × cos 20° − z × sin 20°`, `z2 = xs × sin 20° + z × cos 20°`, and `k = 900 / (900 − z2)`.
- The projected position is `X = W / 2 + x2 × k` and the vertical scale is `1.066 × k`.
- Use z = 0 for the cover and z = −0.29 × W for `back`.
- Use z from −1 to −(0.29 × W − 1) for `pages`.
- Keyframe `SCALE_X` as (X1 − X0) / strip width.
- Keyframe `SCALE_Y` as 1.066 × k and `TRANSLATION_X` as the new center minus the old center.
- Start every track at its rest value: 1 for scale and 0 for shift.
- End it at the computed value with 0.25 s and  `Ease Out`, which equals  `cubic-bezier(0, 0, 0.58, 1)`.
- Move `Title` and `Icon` as single layers with `SCALE_X`, `SCALE_Y`, `TRANSLATION_X`, `TRANSLATION_Y`, and `ROTATION` computed at their center.
- A static pose applies the same formulas to vector quads, with perspective 900px and the pivot at the book center.

### Accessibility in code

- The stripe block, the spine in `Body`, `texture`, `pages`, and `back` carry `aria-hidden="true"`.
- The title is a plain `span`, and the simple illustration is exposed to assistive technology.
- The hover rotation responds to the pointer only.

### Best Practices vs code

- Best Practices call `textured` a variant; in the code and in the set it is the boolean `textured`.
- Best Practices ask for the title in the underlying heading element.
- The component renders a `span`, so the heading comes from the surrounding markup.
- Best Practices advise tokens for `color`; the code accepts any CSS color, and its own examples pass hex values.
- Best Practices mark inner illustrations `aria-hidden`.
- The code already hides the stripe illustration, so only the simple one needs the attribute.
