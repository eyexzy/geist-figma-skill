# Progress

Display progress relative to a limit or related to a task.

Source of the Best Practices: https://vercel.com/geist/progress

Contents: Best Practices, When to use, Behavior, Content, Accessibility, Figma Guidelines, Anatomy, Progress properties, Assembly, Layout, Motion, Tokens, Behavior in Code, Props in code, Runtime in code, Motion in code, Best Practices vs code

## Best Practices

### When to use

- Determinate work whose total is knowable, like file uploads, multi-step setup, build steps, or batch deletions.
- For short indeterminate waits (~1–3s), use **Spinner**; for inline copy like `Saving`, use **Loading Dots**.
- For usage against a quota or ratio, use **Gauge**; the circle reads as health, the bar reads as progress.

### Behavior

- Use `max` for the real ceiling (`max={files.length}`), not a hardcoded `100`. The component computes the percentage from `value / max`.
- Threshold colors via `dynamic colors` should mirror the same breakpoints used elsewhere (warning at the same threshold a quota note fires).
- Use stops for genuine multi-stage work and label the stage next to the bar (`Step 2 of 4 · Building`); a stop with no label is decorative noise.

### Content

- Pair the bar with text naming the work and units: `Uploading 12 of 30 files`, `Building · 1.2 GB / 4 GB`. The bar alone doesn’t say what’s progressing.
- Don’t append `successfully` or `complete` once the bar fills; swap to a completion state (toast, success row, redirect).
- For long operations, name the work in the surrounding copy (`Building deployment…`) instead of leaving a bare percentage.

### Accessibility

- Component sets `role="progressbar"` with `aria-valuemin`, `aria-valuemax`, and `aria-valuenow`; pass an accessible name through `aria-label` on the wrapper or a sibling `<label>` tied with `aria-labelledby`.
- Throttle `aria-valuenow` updates to roughly once a second so screen readers don’t announce every increment of a fast upload.
- Stops accept their own `ariaLabel`; name each one (`Build complete`, `Tests complete`) so the bar is navigable without sight.

## Figma Guidelines

### Anatomy

- `Progress` — `<Progress>`: the track, with a `Progress` bar and a `Remainder` after it.

### Progress properties

- `value` — 0 to 100 percent in steps of 10: the share of the track the bar fills.
- `type` — `default`, `secondary`, `success`, `error`, or `warning`: the color of the bar. `success` is blue.

### Assembly

- Resize the instance for width and height; the bar keeps its share of the track.
- Round a ratio from code to the nearest `value` step: 17 of 40 is 42.5%, so `40`.
- Switch `type` at each threshold to mirror `colors` in code.

### Layout

- The set is 100px wide and 10px tall.
- The radius stays 6px at every height.

### Motion

- In a prototype, animate between `value` variants with `Smart Animate`, `Ease In`, 100ms.

### Tokens

- Track — fill `ds/gray/200`, radius `geist/radius`, clipping the bar.
- Bar — `ds/gray/1000` for `default`, `ds/gray/700` for `secondary`, `ds/blue/700` for `success`, `ds/red/700` for `error`, `ds/amber/700` for `warning`.

## Behavior in Code

### Props in code

- `value` is any number against `max`, 100 by default; the bar is `value / max`.
- `colors` picks the bar color by threshold: the last key at or below `value`.
- `colors` compares against `value` itself, whatever `max` is.
- `colors` overrides `type` when both are set.
- `width` is `100%` and `height` is 10px by default; both take any value.
- `stops` is an array of `{ value, tooltip }` markers along the bar.

### Runtime in code

- A wrapper `div` sets the size; inside it a native `<progress>` draws the track and bar.

### Motion in code

- The bar eases in on change with `transition`: `width 0.1s ease-in` and `background-color 0.1s ease-in`.

### Best Practices vs code

- Best Practices describe `role="progressbar"` with `aria-valuemin`, `aria-valuemax`, and `aria-valuenow`. The published `<Progress>` renders a native `<progress>` with `max` and `value`; ARIA attributes come from the props you pass. The set follows that code.
