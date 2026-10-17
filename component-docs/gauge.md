# Gauge

A circular visual for conveying a percentage.

Source of the Best Practices: https://vercel.com/geist/gauge

Contents: Best Practices, When to use, Behavior, Content, Accessibility, Figma Guidelines, Anatomy, Gauge properties, Assembly, Layout, Tokens, Behavior in Code, Props in code, Runtime in code, Motion in code, Best Practices vs code

## Best Practices

### When to use

- A 0–100 ratio against a fixed maximum where the comparison is the point, like quota usage, build cache hit rate, uptime, or billing-period consumption.
- For determinate task progress with a known total (uploads, multi-step setup), use **Progress**.
- For binary or enumerated state, use **Status Dot** for deployments or **Badge** for everything else.

### Behavior

- Use `arc="equal"` for true ratios so 50% reads as exactly half. Use the default `primary` arc for single-percentage usage where the filled portion is the story.
- Threshold colors should match the same numeric breakpoints used elsewhere in the product (`>=80%` warning, `>=95%` error). Don’t invent gauge-only thresholds.
- Pair `indeterminate` with explanatory copy nearby (`Calculating usage…`) so the user knows the value is loading, not zero.

### Content

- Always pair the gauge with an adjacent label or **Tooltip** naming what the number represents (`Build Cache Hit Rate`). The gauge alone is not self-describing.
- Don’t put units inside `children`; the label carries the unit (`Uptime · 99.97%`). `children` is reserved for an icon overlay.
- When `showValue` is on, the rendered number is the value only. Never inject a `%` or unit string into the prop.

### Accessibility

- The component sets `role="progressbar"` with `aria-valuemin`, `aria-valuemax`, and `aria-valuenow`. Don’t override those.
- The adjacent label is the gauge’s accessible name. Tie it with `aria-labelledby` on the gauge wrapper so screen readers read “Uptime, 99 percent.”
- Don’t use color to encode the threshold without redundant text; pair the warning tint with copy below or in the Tooltip.

## Figma Guidelines

### Anatomy

- `Gauge` — `<Gauge>`: a ring drawn by a `Track` arc and a `Progress` arc, with a `Label` and an `Icon` at the center.

### Gauge properties

- `value` — 0 to 100 in steps of 5, or `indeterminate`.
- `size` — `tiny`, `small`, `medium`, or `large`: 20px, 32px, 64px, or 128px square.
- `arcPriority` — `primary` or `equal`. `primary` draws the arc at exactly `value`; `equal` shares the gap so 50 gives two equal arcs.
- `showValue` — the number in `Label`.
- `showIcon` and `icon` — the overlay in `Icon`, the `children` in code.
- With both on, the set stacks the number and the icon.

### Assembly

- Turn on `showValue` or `showIcon`, one at a time.
- Switch `value` and `size` through the properties; arc angles, stroke and gap differ per size.

### Layout

- Arcs start at 12 o’clock and run clockwise. `Progress` is the value; `Track` fills the rest after a gap.
- `tiny` — 20px: stroke 3px, arc diameter 17px, gap 9%, icon 10px; the center shows the icon only.
- `small` — 32px: stroke 3.2px, arc diameter 28.8px, gap 6%, number 11px Medium, icon 16px.
- `medium` — 64px: stroke 6.4px, arc diameter 57.6px, gap 5%, number 18px Medium, icon 32px.
- `large` — 128px: stroke 12.8px, arc diameter 115.2px, gap 5%, number 32px SemiBold, icon 64px.
- Gap is a percent of the circumference: the cap length plus a step.
- Cap length is 6%, 4%, 4%, 4% at `tiny`, `small`, `medium`, `large`; the step is 3%, 2%, 1%, 1%.
- The gap is 0% at `0` and `100`.
- At `equal` the two gaps sit at 12 and 6 o’clock.
- The set removes `Track` where `100 − value` is smaller than the gaps.
- At `indeterminate` the arc is gray, 25 percent long, with the `Icon` always shown.

### Tokens

- Default scale — `ds/red/800` below 33 percent, `ds/amber/700` from 33 percent, `ds/green/700` from 66 percent. The color comes with the `value` variant.
- Track — `ds/gray/alpha/400`. Number — `ds/gray/1000`.
- At `indeterminate` the arc is `ds/gray/alpha/400` and the icon `ds/gray/900`.

## Behavior in Code

### Props in code

- `value` is any number and `indeterminate` is its own prop.
- At `tiny` only `children` fills the center.
- `colors` takes thresholds, `{0: …, 33: …, 66: …}`, or `{primary, secondary}`. The default scale is in Tokens.
- `aria-valuenow` is omitted at `indeterminate`.

### Runtime in code

- `children` replaces the number.
- Two `<circle>` strokes draw the arcs on a `0 0 100 100` viewBox with round caps.
- The stroke is 15 units wide at `tiny` and 10 units elsewhere.
- `role="progressbar"` sits on the wrapper, and the `svg` is `aria-hidden`.
- Code hides the track when `100 − value` is smaller than the gaps.
- At `indeterminate` the ring length comes from `value`.

### Motion in code

- A change of `value` moves both arcs over 1s with `ease`.

### Best Practices vs code

- Best Practices write `arc="equal"`. The published `<Gauge>` prop is `arcPriority`; the set follows that code.
