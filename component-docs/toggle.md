# Toggle

Displays a boolean value.

Source of the Best Practices: https://vercel.com/geist/toggle

Contents: Best Practices, Figma Guidelines, Anatomy, Toggle properties, Prototyping, Motion, Layout, Tokens, Behavior in Code, Props in code

## Best Practices

- Use Toggle for a single boolean setting where ON takes effect immediately, like `Password Protection` or `Auto-Cancel Builds`. Switch to **Checkbox** for a multi-select list, or to **Switch** for 2–3 mutually exclusive views.
- `checked` is required and the component is controlled. Own the state and update it from `onChange`.
- Persist on change and surface the result in a `useToasts().success(…)` toast (`Password protection enabled`); don’t leave the user wondering whether the flip stuck. Pair with a form footer only when the setting needs an explicit `Save` step.
- Disable Toggle only when the action is impossible (missing plan, locked policy); pair with helper text or a **Tooltip** that names the resolver.
- The label is `children`, not a `label` prop. Title Case noun phrase, 1–4 words, naming what is true when ON: `Password Protection`, not `Enable Password Protection`.
- Render an optional one-sentence description as a sibling under the label that explains ON only. Don’t describe OFF; it’s the negation.
- Keep `labelCasing="title"` (the default) so labels match other Title Case surfaces. Use `labelCasing="normal"` only when sentence-case content sits inline next to the toggle.
- Provide an accessible name through `children`, `aria-label`, or `aria-labelledby`. Geist warns in development if all three are missing.
- Set `aria-label` only when the visible label sits elsewhere on the row; otherwise let `children` carry it so sighted and screen-reader copy stay aligned.

## Figma Guidelines

### Anatomy

- `Toggle` — `<Toggle>`: `Label`, the `children`, and `Track` holding `Thumb`.

### Toggle properties

- `size` — track 28px × 14px, 36px × 20px or 40px × 24px; thumb 11px, 17px or 21px.
- `checked` — moves the thumb 14px in `small` and 16px in `medium` and `large`, and fills the track `legacy/success`.
- `disabled` — a flat thumb on a muted track, with shadow and border removed; clicks are ignored.
- `direction` — `label-first` or `switch-first`, the `flex-row-reverse` of code.
- `label` and `showLabel` — the `children` of code.
- `labelCasing` — `title` or `normal`, as in code. `title` is the `capitalize` of code: every word starts with a capital, so `Only errors` shows as `Only Errors`. `normal` keeps the text as written.

### Prototyping

- A click flips `checked`: `On click`, `Smart Animate`, bezier `0.4, 0, 0.2, 1`, `150 ms`.

### Motion

- Thumb: `transition-transform` `duration-[time:150ms]` `ease-in-out`. It slides 14px in `small` and 16px in `medium` and `large` (`translate-x-[14px]`, `translate-x-[16px]`).
- Track: `transition-[background,border-color]` `duration-[time:150ms]` `ease-[easing-function:cubic-bezier(0,0,0.2,1)]`. The fill fades from `ds/gray/400` to `legacy/success` at the same time.
- `ease-in-out` is `0.4, 0, 0.2, 1`, the curve of the Figma reaction.
- `Smart Animate` runs one curve for both layers.

### Layout

- The label sits 12px from the track (`--geist-space-gap-half`) with 3px above and below (`py-[3px]`). The label line is 18px, so a labelled toggle is 24px, 26px or 30px high.
- The thumb sits 1.5px inside the track edge (`left-[1.5px]`), centered vertically.

### Tokens

- Track `ds/gray/400`, checked `legacy/success`; disabled `ds/gray/200` and `components/toggle/track/bg-disabled-checked`.
- Thumb `components/toggle/thumb/bg` with `components/toggle/thumb/border`, visible in dark only, and the three drop shadows of code. Disabled `components/toggle/thumb/bg-disabled-unchecked` and `components/toggle/thumb/bg-disabled-checked`.
- Label `legacy/secondary` (`--geist-secondary`), hardcoded Geist Medium 12px/18px. Track radius 14px, thumb radius half its size (`rounded-[50%]`).

## Behavior in Code

### Props in code

- `color` and `icon` live only in code.
- The track color eases out from the first frame, so it starts faster than the Figma track.
- `size` defaults to `small`; `noMargin` sets `m-0` on the track.
