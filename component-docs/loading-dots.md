# Loading Dots

Indicate an action running in the background.

Source of the Best Practices: https://vercel.com/geist/loading-dots

Contents: Best Practices, When to use, Behavior, Accessibility, Figma Guidelines, Anatomy, Loading Dots properties, Assembly, Layout, Motion, Tokens, Behavior in Code, Props in code, Runtime in code, Motion in code, Best Practices vs code

## Best Practices

### When to use

- Use Loading Dots embedded in copy for short indeterminate waits, e.g. `Saving<LoadingDots />` or `Building<LoadingDots />`.
- For buttons, set the `loading` prop on **Button** instead of dropping dots inside the label.
- For layout placeholders use **Skeleton**; for known progress use **Progress**; for icon-sized indeterminate waits use **Spinner**.

### Behavior

- Pass `size` (number, dot diameter in px) only when the default doesn’t match adjacent type size.
- Keep the trailing label specific to the work in flight (`Saving`, `Deploying`, `Uploading`) so a wait over ~1s still tells the user what’s happening.
- Don’t string Loading Dots after a completed verb (`Saved<LoadingDots />`); the dots imply ongoing work.

### Accessibility

- Mark the wrapping span with `aria-live="polite"` so screen readers pick up the in-progress label without interrupting.
- The dots are decorative; the surrounding text carries meaning, so don’t add `aria-label` to the component itself.
- Honor `prefers-reduced-motion` and avoid pairing Loading Dots with another animated indicator on the same line.

## Figma Guidelines

### Anatomy

- `Loading Dots` — `<LoadingDots>`: a `Label`, then `Dots` with `Dot 1`, `Dot 2`, and `Dot 3`.

### Loading Dots properties

- `size` — `sm`, `md`, or `lg`: dots of 2px, 3px, or 4px.
- `showLabel` — shows `Label`, the `children` in code.
- `Label` text is edited on the instance.

### Assembly

- To embed the dots in your own copy, turn off `showLabel` and place the instance after the text.

### Layout

- Dot — a full circle of 2px, 3px, or 4px across for `sm`, `md`, `lg`.
- `Dots` — 12px, 15px, or 18px wide: 1px at each edge and 2px between dots.
- `Label` and `Dots` sit 8px apart, centered on one line.
- `Label` text — Geist Regular 14px with line height 20px, the `Copy/14` style.

### Motion

- Each dot has one `OPACITY` track: opacity 0.2 up to 1, then back to 0.2 at 1.4 s. The peak is at 0.28 s, 0.48 s, and 0.68 s for `Dot 1`, `Dot 2`, and `Dot 3`.
- `Dot 2` and `Dot 3` rest at opacity 0.2 for 0.2 s and 0.4 s first.
- Set `Duration` to 1.4 s in the top-level frame timeline, the length of one cycle.
- The duration covers every Loading Dots instance in that frame.

### Tokens

- Dots — fill `ds/gray/900`.
- `Label` — `ds/gray/900` with the `Copy/14` text style.

## Behavior in Code

### Props in code

- Code defaults `size` to `lg`.

### Runtime in code

- The root is a `span` with `aria-label="Loading"`; the label is its `children` and each dot is a `span`.
- The label sits in a `div` with `mr-2`, and every dot has `mx-px`.

### Motion in code

- Every dot runs `blink 1.4s infinite both`: `opacity` 0.2, 1 at 20 percent, then 0.2.
- The delays are `0`, `animation-delay-200`, and `animation-delay-400`.

### Best Practices vs code

- Best Practices call `size` a number of pixels. The published `<LoadingDots>` takes `sm`, `md`, or `lg`; the set follows that code.
- Best Practices ask for `aria-live="polite"`. The published `<LoadingDots>` sets `aria-label="Loading"` and omits `aria-live`.
- Best Practices ask to honor `prefers-reduced-motion`. The published `<LoadingDots>` keeps `blink` running when the system requests `reduce`.
