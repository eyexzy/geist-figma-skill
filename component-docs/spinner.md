# Spinner

Indicate an action running in the background. Unlike the loading dots, this should generally be used to indicate loading feedback in response to a user action, like for buttons, pagination, etc.

Source of the Best Practices: https://vercel.com/geist/spinner

Contents: Best Practices, When to use, Behavior, Accessibility, Figma Guidelines, Anatomy, Spinner properties, Assembly, Layout, Motion, Tokens, Behavior in Code, Props in code, Best Practices vs code

## Best Practices

### When to use

- Use a Spinner for indeterminate, single-action waits of roughly one to three seconds: submit buttons, inline icon refresh, row-level retries.
- For submit buttons, set the `loading` prop on **Button** so the spinner, sizing, and busy state stay aligned; don’t hand-roll a Spinner inside a button.
- Pick **Skeleton** when async data fills a known layout, **LoadingDots** for inline copy, and **Progress** when total work is known.

### Behavior

- Mount the Spinner only after the action starts. Pre-rendering and toggling visibility leaves a partial rotation visible at idle and reads as jank.
- Pair any wait longer than ~1s with copy that names the work (`Verifying…`, `Deploying…`) so the user knows what’s blocking.
- Match the Spinner size to the surrounding type or icon size, not the parent container.

### Accessibility

- Set `aria-busy="true"` on the element wrapping the in-flight action so screen readers announce the state change.
- Keep the trigger focusable while loading; swapping it for a separate spinner element loses keyboard focus.
- Honor `prefers-reduced-motion` and skip stacking extra animation around the Spinner.

## Figma Guidelines

### Anatomy

- `Spinner` — `<Spinner>`: a ring of bars that fade in turn. Each variant holds a `Spinner` frame with one `Bar` per step, numbered from `Bar 1`.
- In code the root is a `div` with `role="status"` and `aria-label="Loading"`.
- An `sr-only` `Loading...` text follows the bars, which are `aria-hidden`.

### Spinner properties

- `size` — `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, or `4xl`: 12px, 16px, 20px, 24px, 32px, 40px, or 56px square. Bar count, bar size, and cycle time change with it.
- `color` — `default`, `red`, `green`, or `blue`. Every bar takes the color.

### Assembly

- Switch `size` and `color` through the properties; bar count, bar size, and keyframes come with each size.

### Layout

- Each bar turns clockwise around the center by its step, then moves out 146% of its width, `translate(146%)`.
- `Bar 1` sits at 0°, the 3 o’clock position.
- `sm` — 12px, `size-3`: 8 bars of 3px × 1.5px, step 45°.
- `md` — 16px, `size-4`: 10 bars of 4px × 1.5px, step 36°.
- `lg` — 20px, `size-5`: 12 bars of 5px × 2px, step 30°.
- `xl` — 24px, `size-6`: 12 bars of 6px × 2.5px, step 30°.
- `2xl` — 32px, `size-8`: 15 bars of 8px × 2.5px, step 24°.
- `3xl` — 40px, `size-10`: 15 bars of 10px × 3px, step 24°.
- `4xl` — 56px, `size-14`: 18 bars of 14px × 3.5px, step 20°.

### Motion

- Each bar has one `OPACITY` track, `Linear`, from opacity 1 down to 0.15 over a cycle.
- The track then jumps back to 1 at once.
- In code every bar runs `spinner-opacity` from `opacity: 1` to `.15`, `linear infinite`, with `--animation-duration` set per size.
- Cycle time is 1000ms for `sm` and `md`, 1200ms for `lg` to `3xl`, and 1300ms for `4xl`.
- Bars start offset: `--animation-delay` is negative, one step per bar, and zero on the last bar. A step is the cycle time divided by the bar count.
- `Bar 1` starts most faded and the last bar at opacity 1, so the brightest bar moves clockwise.
- Keyframes run to 78s in every variant. 78s is a whole number of cycles for each size: 78 × 1s, 65 × 1.2s, and 60 × 1.3s.
- Set `Duration` to `78 s` in the timeline panel of the top-level frame; it covers every Spinner in it.

### Tokens

- Bars — `ds/gray/700` for `default`, `ds/red/700` for `red`, `ds/green/700` for `green`, `ds/blue/700` for `blue`.
- Bars — corner radius `tailwind/radius/full`, in code `rounded-full`.

## Behavior in Code

### Props in code

- Code defaults `size` to `md`, 16px.
- `color` is the `className`: `text-gray-700` for `default`, then `text-red-700`, `text-green-700`, and `text-blue-700`. The bars use `bg-current`, so any text color class applies.

### Best Practices vs code

- Best Practices ask to honor `prefers-reduced-motion`. The published `<Spinner>` keeps running `spinner-opacity` when the system requests `reduce`; the set follows that code.
