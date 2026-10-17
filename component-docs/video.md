# Video

Embed a video with built-in playback controls and lazy loading support.

Best Practices: written by the author of this library from the Geist code; the site page https://vercel.com/geist/video has none.

Contents: Best Practices, Figma Guidelines, Anatomy, Video properties, _Video Control properties, Assembly, Layout, Motion, Tokens, Behavior in Code, Props in code, Runtime in code, Motion in code, Responsive in code, Accessibility in code

## Best Practices

- Pass the real `width` and `height` of the file. The player reserves that ratio before the video loads, so the layout holds still.
- Keep `lazy` on for videos below the fold. The file loads once the player is within 20% of the viewport. Set `lazy={false}` for a video visible on load.
- Videos start `muted`, and `autoPlay` follows `prefers-reduced-motion`: visitors who asked for less motion get a paused video.
- Set `controls={false}` for ambient clips. A click on the video still pauses and resumes it.
- `loop` replays the clip twice after the first play, then pauses on the last frame. `loop={false}` pauses after one play.

## Figma Guidelines

### Anatomy

- `Video` — `<Video>`: the video fill and `Controls`, an instance of `_Video Control`.
- `_Video Control` — the control bar inside `<Video>`: `Play Button` with `Icon`, `Current Time`, `Progress` with `Track`, `Fill` and `Handle`, then `Duration`.
- `_Play Icon` — the play and pause glyphs; `Icon` is an instance of it.

### Video properties

- `controls` — shows `Controls`; turned off, the bar is hidden in every state.
- `borderRadius` — rounds the video to 6px, the `--geist-radius` of code.
- `hovered` — Figma only: the pointer over the video, which lifts and shows `Controls`.

### _Video Control properties

- `currentTime` and `duration` — the two time labels, written as `MM:SS`.

### Assembly

- Replace the fill of `Video` with your own video or image; `Controls` stay on top.
- Type the time in `currentTime` and `duration` on `Controls`, then resize `Fill` to the matching share of `Track`.
- Select `Icon` inside `Controls` to switch `icon` between `play` and `pause`.
- After resizing `Video`, set `Controls` 5% of the new height above the bottom edge; its width follows at 85%.

### Layout

- `Video` is 600px by 582px.
- `Controls` is 85% of the video width, centered: 510px at 600px.
- `Controls` rests 29px above the bottom edge, 5% of the height, and rises 6px on hover.
- `Controls` is 48px high with 8px side padding and 6px corners.
- `Play Button` is 40px square around a 16px `Icon`.
- `Current Time` and `Duration` are 60px wide, set in Geist 13px on a 40px line.
- `Progress` fills the remaining width at 18px high; `Track` is 4px high.
- `Handle` is a 10px circle, hidden.

### Motion

- Hover in: `Mouse enter` on `Video`, `Smart Animate`, `0.25, 0.57, 0.45, 0.94`, `200 ms`; `Controls` fades in and rises 6px.
- Hover out: `Mouse leave`, `Smart Animate`, `0.4, 0, 0.2, 1`, `150 ms`.
- Clicking `Icon` swaps `play` and `pause`: `On click`, `Change to`, `Instant`.

### Tokens

- `legacy/background` — `Controls` fill, the `--geist-background` of code.
- `ds/shadow/tooltip` — the shadow of `Controls`, `--ds-shadow-tooltip` in code.
- `ds/gray/1000` — time labels and icons; `ds/gray/200` — `Track`; `legacy/foreground` — `Fill` and `Handle`.
- `tailwind/radius/md` — corners of `Controls`; `tailwind/space/8` — its side padding.

## Behavior in Code

### Props in code

- `margin` spaces the figure 40px above and below.
- `maxWidth` caps the figure; the player is `min(width, 950px)` and fits its container.
- `preload` is `auto` and `playsInline` is on.
- `onPlay` receives `src` each time playback starts.

### Runtime in code

- The bar renders once the video reports `readyState` 3 or higher.
- The bar shows on pointer move and hides after 3s of stillness, or when the pointer leaves.
- Times print as `MM:SS`, each part padded with a leading zero.
- Dragging the track moves the progress live and seeks on release.
- The 10px handle stays at `scale-0`, so only `Fill` shows progress.

### Motion in code

- The bar enters with `opacity-100` and `-translate-y-[6px]` over `duration-200` and `cubic-bezier(0.25, 0.57, 0.45, 0.94)`.
- The bar leaves over the base `transition-all`: 150ms and `cubic-bezier(0.4, 0, 0.2, 1)`.
- The handle animates `transform`, `width`, `height`, `border-radius` and `background-color` over `duration-100` and `ease-in-out`.

### Responsive in code

- At 992px viewport width and below, the bar collapses to zero height (`scale-y-0`).

### Accessibility in code

- The figure is `role="region"` with `aria-label="Video player"`.
