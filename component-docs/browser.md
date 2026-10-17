# Browser

The Browser component lets you showcase website screenshots or any other content within a realistic browser-style frame.

Source of the Best Practices: https://vercel.com/geist/browser

Contents: Best Practices, When to use, Behavior, Accessibility, Figma Guidelines, Anatomy, Browser properties, _Browser Copy Button properties, Content, Assembly, Layout, Motion, Tokens, Behavior in Code, Props in code, Runtime in code, Responsive in code

## Best Practices

### When to use

- Use Browser as marketing chrome around screenshots, demos, and recordings shown on landing pages, docs, and changelog posts.
- Don’t render real product UI inside a Browser frame; the chrome implies a screenshot, not a live surface.
- Compose from the building blocks (`Dots`, `Controls`, address bar) when the canned `Browser` shape doesn’t fit the layout; don’t fork the chrome.

### Behavior

- Match the variant to the surrounding theme: `light` chrome on light backgrounds, `dark` chrome on dark, so the frame doesn’t fight the page.
- For long URLs, use Middle Truncate inside the address bar so the host and path tail both remain visible.
- Lock the inner image aspect ratio so the chrome doesn’t reflow when an image is missing or slow to load.

### Accessibility

- The browser chrome is decorative and should carry `aria-hidden="true"`; meaning lives on the inner image or video.
- Give the inner screenshot meaningful alt text describing what the user is seeing, not “browser screenshot”.
- Don’t add focusable dot controls or back/forward buttons; the chrome is a frame, and unreachable controls confuse keyboard users.

## Figma Guidelines

### Anatomy

- `Browser` — a `Header` above a `Viewport`. `Header` holds `Controls` with the traffic lights and navigation, `Address`, and an empty `Actions` frame.
- `_Browser Copy Button` — the button at the end of `Address Bar`.

### Browser properties

- `address` — the text in `Address Bar`.
- `Viewport` is `children` in code; content sits directly under `Header`.

### _Browser Copy Button properties

- `state` — `default`, `hover`, `copied`, `copied-hover`.
- `copied` shows `Check` for 1s and switches `aria-label` from `Copy` to `Copied`. A failed copy shows the toast `Failed to copy to clipboard`.

### Content

- Select `Viewport` inside the instance and add an image fill with the screenshot, scale mode `Fill`. The frame radius crops its corners.
- Set the instance height to 54px plus the image height.
- A 16:10 screenshot at 812px wide needs 562px.
- Place a recording or an animated demo above the instance, aligned to `Viewport`.

### Assembly

- Type `address` as code displays it, such as `vercel.com/geist`; drop `https://`, `www.`, and the trailing `/`.
- Resize the width as needed; `Address Bar` stops at 320px and stays centered.

### Layout

- `Header` — 54px tall · padding 10px 20px · gap 24px · side slots 140px wide
- `Address Bar` — 34px tall · up to 320px wide · padding 4px 4px 4px 16px · text 13px/18px
- Traffic lights 12px · gap 8px · navigation icons 14px · gap 16px · copy button 24px · icon 12px

### Motion

- `_Browser Copy Button`: `ON_HOVER` → `hover` with `Smart Animate`, bezier `0.4, 0, 0.2, 1`, `150 ms`. `ON_CLICK` → `copied` or `copied-hover` with bezier `0, 0, 0.2, 1`, `150 ms`.
- `copied` and `copied-hover` return to `default` on `AFTER_TIMEOUT` at `1000 ms`.
- The hidden icon sits at 6px × 6px with opacity 0, so `Smart Animate` grows it to 12px.

### Tokens

- Frame fill `ds/background/200`, radius `tailwind/radius/md`; `Header` `ds/background/100`; shadow `ds/shadow/border-small`.
- `Address Bar` fill `ds/background/200`, stroke `ds/gray/400`, radius `tailwind/radius/full`; `URL` text `ds/gray/1000` in `Copy/13`.
- `Navigation` icons `ds/gray/900`. `_Browser Copy Button` icon `ds/gray/1000`, hover fill `ds/gray/alpha/200`, radius `tailwind/radius/sm`.
- Traffic lights use fixed hex in both themes, as in code: `#FE5F57`, `#FEBB2E`, `#26C941`.

## Behavior in Code

### Props in code

- Other props, such as `aria-hidden` and `className`, go to the frame itself.
- The copy button is a `Button` with `variant="tertiary"`, `size="tiny"`, and `shape="square"`.
- The copy button adds `!rounded-full` to its `Button` classes.

### Runtime in code

- Code strips `https://`, `www.`, and a trailing `/` from the address; the copy button copies the full string.
- Each copy button icon scales from `scale-0` and fades over `150ms` with `ease-out`.

### Responsive in code

- From 601px code scales the corner radius with the width, 1.5% of it (`1.5cqw`): about 12px at 812px wide.
- Below 961px code hides `Actions`, and `Address Bar` fills the middle slot.
- Below 601px code also hides `Navigation` and sets padding 8/16 and gap 16.
- `Address Bar` stops at 320px from 961px through `lg:max-w-xs`.
- Figma holds one `variant=default`; the narrow layouts exist in code only.
