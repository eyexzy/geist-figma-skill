# Show More

Styling component to show expanded or collapsed content.

Source of the Best Practices: https://vercel.com/geist/show-more

Contents: Best Practices, Figma Guidelines, Anatomy, Show More properties, Assembly, Layout, Motion, Tokens, Behavior in Code, Props in code, Runtime in code, Best Practices vs code

## Best Practices

- Use ShowMore for progressive disclosure of a single long list or block (recent activity, repo branches, attached resources). For sibling pages of the same data set, use **Pagination**; for optional sections, use **Collapse**.
- Show enough rows to convey the shape of the list before truncating (5–10 typical). Truncating at 2 makes the affordance feel performative.
- Pair the trigger with the count of hidden items so the user knows the cost of expanding (`Show 12 More`, then `Show Less` after expand). Title Case both labels.
- Don’t cycle Show More then Show Less mid-flow on the same data set; collapsing rows after the user expanded them scrolls them away from where they were reading.
- Render hidden rows in the DOM when the count is small so find-in-page works; lazy-load only when the dataset is large enough to hurt initial render.
- The trigger is a `<button>` with `aria-expanded` and `aria-controls` pointing at the list. After expansion, move focus to the first newly revealed row so screen readers and keyboard users land in the new content.

## Figma Guidelines

### Anatomy

- `Show More` — `<ShowMore>`: `Divider` runs behind `Button Wrapper`, which holds `Control`.
- `Control` — the `<Button>` of code, `secondary`, `small`, `rounded`; its `Suffix` holds the chevron.
- `Divider` — the two `data-line` rules of code, drawn as one rule behind the button; `Button Wrapper` hides it there.

### Show More properties

- `expanded` — `false` reads `Show More` with `ChevronDownSmall`; `true` reads `Show Less` with `ChevronUpSmall`.
- `showBorder` — shows `Divider`; it is `noBorder` in code, inverted.
- `state` — `default` and `hover`; hover changes only the fill of the button.
- `Control` is exposed on the instance, with its `label`.

### Assembly

- Set the instance to `Fill container`: `Divider` stretches and the button stays centered. Code fills the width of its container.
- Set `label` on the exposed `Control` to carry the count (`Show 12 More`). The value stays when `expanded` changes, so set `Show Less` again.

### Layout

- The row is 32px high, the height of the small button (`min-h-[30px]` in code).
- The button has 18px before the text: 12px of `Control` padding and 6px of `Label` padding (`px-1.5`).
- Text and chevron sit 4px apart (`ml-1`). The chevron is 14px in the `Suffix` slot, which leaves 8px after it.
- The row fills the container to the right edge.

### Motion

- Hover: `Mouse enter` and `Mouse leave`, `Change to`, `Smart Animate`, bezier `0.4, 0, 0.2, 1`, `150 ms` — code transitions the button over 150ms with the same curve.
- On the `hover` variants, `On click` runs `Change to` the other `expanded` value with `Smart Animate`, bezier `0.4, 0, 0.2, 1`, `200 ms`.
- The chevron swaps direction; code turns it 180° (`rotate-180` with `duration-200 ease-in-out`).

### Tokens

- `Button Wrapper` and `Control` fill `ds/background/100`, `components/button/secondary/bg-hover` on `hover`; ring `ring/gray-400`.
- `Divider` `ds/gray/alpha/400` at 14%.
- `Label` hardcoded Geist Medium 14px/21px in `ds/gray/1000`; the chevron `ds/gray/1000`.
- Radius `tailwind/radius/full`; padding `tailwind/space/12`, `tailwind/space/6` and `tailwind/space/8`, `tailwind/space/4` before the chevron.

## Behavior in Code

### Props in code

- `label` replaces both the text and the chevron; `loading` puts the button into its loading state once `expanded`.
- The text reads `Show Less` when `expanded` is `true` and `loading` is `false`; otherwise `Show More`.

### Runtime in code

- Code puts 20px above and 20px left of the row (`mt-5 ml-5`).

### Best Practices vs code

- Best Practices say the trigger carries `aria-expanded` and `aria-controls`. The published `<ShowMore>` sets neither; the set follows that code.
