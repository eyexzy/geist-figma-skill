# Badge & Pill

A label that emphasizes an element that requires attention, or helps categorize with other similar elements.

Source of the Best Practices: https://vercel.com/geist/badge

Contents: Best Practices, Figma Guidelines, Anatomy, Badge properties, Pill properties, Assembly, Scaling, Motion, Tokens, Behavior in Code, Props in code, Runtime in code

## Best Practices

- Use Badge for short, scannable metadata that sits next to the thing it describes: status, plan tier, environment, or role. One badge per row; two side by side is a sign the row needs a second column.
- For a colored dot without text, use **Status Dot**. For clickable filter chips that toggle a query, use the `pill` variant or a small **Button**.
- Badges are static labels. Don’t wire `onClick` onto them; promote to a Button or link if the user can act on the value.
- Keep badge content to text or `icon` + text. Never stack two icons or a child Badge inside a Badge.
- Pair lifecycle badges (`Alpha`, `Beta`, `Early Access`) with a **Tooltip** that names the limit, like `Alpha: API may change before GA`.
- Title Case, one word when possible, two max: `Active`, `Pending`, `Pro`, `Enterprise Trial`. Match the canonical API or log term: `Production` not `Prod`, `Deployed` not `Live`, `Canceled` not `Cancelled` (the Vercel API uses one L).
- Don’t add a checkmark icon for success states or an X for errors; the variant carries that signal. Map meaning to color: `green` for healthy, `red` for error, `amber` for warning, `blue` for informational or production, `gray` for neutral. The `-subtle` suffix tones any of them down on dense surfaces.
- Skip stuffing sentences inside (`Currently Active`, `You are on Pro`); the surrounding row supplies the context.
- Set `title` for icon-only or ambiguous badges so screen readers announce the meaning. Don’t rely on color alone; the text has to be readable without it.

## Figma Guidelines

### Anatomy

- `Badge` — a static label.
- `Pill` — a link styled like a Badge.

### Badge properties

- `variant` — the colors `gray`, `blue`, `purple`, `amber`, `red`, `pink`, `green`, and `teal`, plus `trial`, `turbo`, and `inverted`.
- `size` — `sm`, `md`, or `lg`. Height, text, gap, padding, and icon scale with it.
- `contrast` — `high` or `low`. `low` is the `-subtle` suffix from the Geist docs. `trial`, `turbo`, and `inverted` exist at `high` only.
- `label` — renders in Title Case on one line.
- `showIcon` — shows or hides the leading icon. `icon` swaps the glyph.

### Pill properties

- `size`, `label`, `showIcon`, and `icon` work as they do on Badge.
- `state` — `default` or `hover`.
- Badge takes its icon as a prop, `icon={<IconShield />}`; Pill takes it as a child marked `data-slot="icon"`.

### Assembly

- Swap the icon through the `icon` slot rather than placing a glyph beside the label. The slot carries the per-size offset, and on Badge the glyph follows the label color.
- Recompute `components/badge/<color>/subtle` after a ramp step changes; the variables hold fixed values.
- Keep Pill at `state=default`; the prototype switches it to `state=hover` on pointer hover.

### Scaling

- `sm` — 20px tall · text 11px/20px · tracking 0.2px · gap 4px · padding 2px 8px · icon 12px · offset −2px
- `md` — 24px tall · text 12px/24px · gap 5px · padding 2px 12px · icon 14px · offset −4px
- `lg` — 32px tall · text 14px/20px · gap 6px · padding 2px 12px · icon 16px · offset 0px

### Motion

- The pair’s only reaction sits on Pill: `ON_HOVER` → `Smart Animate`, `Ease Out`, `200 ms`. It swaps the fill from `legacy/background` to `ds/gray/200`.
- The `200ms` duration belongs to the prototype reaction.

### Tokens

- Radius `tailwind/radius/full`. Label `ds/contrast/fg` at `contrast=high` and `ds/<color>/900` at `low`.
- Label exceptions: `gray` at `low` uses `ds/gray/1000`, `amber` at `high` uses `ds/black`, and `trial` and `turbo` use `ds/white`.
- `contrast=high` fills `gray`, `purple`, `red`, `pink`, `green`, and `teal` with `components/badge/<color>/solid`. It is `ds/<color>/900` in Light and `ds/gray/500`, `ds/purple/500`, `ds/red/800`, `ds/pink/600`, `ds/green/600`, `ds/teal/600` in Dark.
- `blue` at `contrast=high` uses `ds/blue/800` and `amber` uses `ds/amber/700`, in both modes.
- `contrast=low` fills with `components/badge/<color>/subtle`, a fixed value per mode.
- Figma stores the blended result over `ds/background/100`.
- `inverted` is `ds/gray/1000` behind `ds/gray/100` text.
- `trial` runs `rgb(0,112,243)` → `rgb(248,28,229)`.
- `turbo` runs `rgb(255,30,86)` → `rgb(0,150,255)`.
- Figma holds them as the paint styles `Gradient/Trial` and `Gradient/Turborepo` with literal stops.
- Pill uses `legacy/background` fill, a 1px `ds/gray/alpha/400` border inside the edge, and `legacy/foreground` text.

## Behavior in Code

### Props in code

- A Badge without `children` collapses to a square of 20px, 24px, or 32px.
- Pill is a `<Link>` carrying Badge styling through `badgeVariants({ variant: 'pill' })`.
- `numerical` sets `min-w-6` on the Badge.

### Runtime in code

- The hover fill `hover:[a,button]:bg-(--ds-gray-200)` applies when the element is an `a` or a `button`.
- Code hardcodes the `trial` and `turbo` gradients at `135deg`.
- A transparent Badge carries a `::before` layer filled `oklch(from var(--ds-<color>-200) L calc(c * 1.3) h)`.
- `L` is `0.94` in Light and `0.27` in Dark; `pink` and `teal` read `-300`, and `gray` keeps `c` unscaled.
- The layer blends with `multiply` in Light and `screen` in Dark.
