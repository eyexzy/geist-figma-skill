# Theme Switcher

Component that allows users to switch between light and dark themes.

Source of the Best Practices: https://vercel.com/geist/theme-switcher

Contents: Best Practices, Figma Guidelines, Anatomy, Theme Switcher properties, _Theme Button properties, Prototyping, Layout, Tokens, Behavior in Code, Runtime in code, Best Practices vs code

## Best Practices

- Use Theme Switcher for the canonical Light / System / Dark control. Place it once per app, in the footer or settings, not duplicated across pages.
- Pass `small` for dense chrome (footers, dropdowns); use the default size on a settings page where there’s room for the labels to breathe.
- Theme Switcher reads from and writes to `next-themes`, so wrap the app in `GeistProvider` once at the root and don’t mirror its state into local React state.
- The control auto-disables when `forcedTheme` is set on the provider; setting `disabled` manually is for read-only previews of the control itself.
- Don’t rebuild a theme picker with **Switch** or three icon buttons. Theme Switcher already handles the icons, the `aria-label` per option, and System detection.
- The component composes its own labels from the theme keys (`light`, `system`, `dark`); leave them alone so they stay translatable through `next-themes`.

## Figma Guidelines

### Anatomy

- `Theme Switcher` — `<ThemeSwitcher>`: a `<fieldset>` of three `_Theme Button` instances, `system`, `light` and `dark`.
- `_Theme Button` — one option: a radio and its `<label>` with the icon. Code renders it inline, with the theme key as `aria-label`.

### Theme Switcher properties

- `selected` — the checked option.
- `small` — 24px options with the `Small` icon set.
- `disabled` — every icon `ds/gray/500` and the selected fill gone, as in code.
- `selected` looks the same in all three options while `disabled`.

### _Theme Button properties

- `type` — `system`, `light` or `dark`: `DeviceAlternate`, `Sun` or `Moon`, the `Small` versions with `small`.
- `state` — Figma only: `hover`, `selected` and `disabled` follow the pointer, the checked radio and `disabled` in code.

### Prototyping

- A click on an option switches `selected`; hover lives on `_Theme Button` (`While hovering`). Both are `Instant`, as in code.

### Layout

- Options sit edge to edge, 32px each (`size-8`) or 24px with `small` (`size-6`), with a 16px icon centered. The container is one option high (`h-8`, `h-6`) and fully round.

### Tokens

- Icons `ds/gray/700`, hover `ds/gray/1000`, disabled `ds/gray/500`.
- Selected: `accents/8` icon on `ds/background/100` with a 1px ring of `ds/gray/400` and a 0px 1px 2px shadow of `ds/gray/alpha/100`.
- Container: a 1px ring outside in `shadow/color/border`, the `--ds-shadow-border` of code.

## Behavior in Code

### Runtime in code

- `next-themes` sets `selected` from the current theme, and `onThemeSwitch` reports a change.

### Best Practices vs code

- Best Practices mention labels. The published `ThemeSwitcher` shows icons and keeps the theme keys as `sr-only` text.
