# Slider

Input to select a value from a given range.

Source of the Best Practices: https://vercel.com/geist/slider

Contents: Best Practices, Figma Guidelines, Anatomy, Slider properties, _Slider Thumb properties, Assembly, Layout, Motion, Tokens, Behavior in Code, Props in code, Runtime in code

## Best Practices

- Use a slider for ranged numeric input where shape and proximity matter more than precision: bandwidth caps, opacity, audio volume, color channels.
- For exact values like a port number or memory limit, pair the slider with a numeric **Input**; keyboard users default to typing.
- Snap to a sensible step (`1`, `5`, `10%`) so dragging never produces values like `47.83291`. Clamp `min` and `max` to real product limits.
- Always render the live value next to the track in tabular nums, and label what the number represents (`Sample Rate · 44 kHz`). The track alone is not self-describing.
- Threshold colors (warning, error tints past a limit) should match the same numeric breakpoint surfaced elsewhere in the UI; don’t invent a slider-only threshold.
- Give the slider an accessible name through a sibling `<label htmlFor>` or `aria-label`, and let the native arrow-key, Page Up/Down, Home/End behavior do the keyboard work. Don’t intercept those keys.

## Figma Guidelines

### Anatomy

- `Slider` — `<Slider>`: a label, a track, a fill, and a thumb.
- `_Slider Thumb` — the thumb, nested as `Thumb`.
- `Label` — the `<Label>` above the track, which `showLabel` turns on.
- `Left Spacer` and `Right Spacer` split the track by `value`. `Range Fill` sits in `Left Spacer`.
- `Thumb Anchor` holds `Thumb` where the two spacers meet.
- `Step 0` to `Step 100` sit in `Track Hit`. Each unselected step carries an `On click` reaction that sets `value`.

### Slider properties

- `value` — `0` to `100` in steps of 10. The thumb center and the fill end sit at that percent of the track.
- `disabled` — `true` or `false`. Only enabled sliders carry `Track Hit`.
- `showLabel` — shows the `Label` above the track. The label text and `bypassCasing` are exposed on the instance.
- The set holds one thumb and one value.

### _Slider Thumb properties

- `state` — `default` or `dragging`. `dragging` scales the thumb by 1.2.

### Assembly

- Set `value` on `Slider`. The thumb and the fill follow it.
- Edit the label text on the exposed `Label`; `bypassCasing` keeps the text as typed.
- Resize the instance to change its width. The thumb, the fill, and the steps keep their proportions.

### Layout

- The default width is 216px.
- The track is 8px tall and fully rounded. The label sits 8px above it.
- The thumb is 6px × 14px with a 1px ring; `dragging` makes it 7.2px × 16.8px.
- The thumb center sits on `value`, so the thumb extends 3px beyond the track at `0` and `100`.
- `Track Hit` is 30px tall; each step is a tenth of the track wide.

### Motion

- Pressing the thumb scales it by 1.2: `On press`, `Smart Animate`, `100 ms`, bezier `.4, 0, .2, 1`.
- A value change moves the thumb and the fill instantly.

### Tokens

- `Track`: `ds/gray/200`. `Range Fill`: `ds/blue/700`, `ds/gray/500` when disabled.
- Thumb: fill `ds/white`, ring `components/slider/thumb/ring` (`ds/gray/alpha/500` in light, `ds/black` in dark).
- Radii: `tailwind/radius/full` on the track and the fill, `tailwind/radius/1` on the thumb.
- Ring width: `border/width/default`.

## Behavior in Code

### Props in code

- Code accepts one or two values, `min`, `max`, and `step`.
- `fullWidth` makes it 100%.
- `showStartInput` and `showEndInput` add a small number `Input` 48px wide beside the track, 12px apart.

### Runtime in code

- In development, the code throws unless `<Slider>` sits inside a `<form>`.
- Keyboard focus scales the thumb by 1.2 and adds a 2px outline in `--ds-focus-color`, as `dragging` does.
