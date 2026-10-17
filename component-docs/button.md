# Button

Trigger an action or event, such as submitting a form or displaying a dialog.

Source of the Best Practices: https://vercel.com/geist/button

Contents: Best Practices, Figma Guidelines, Anatomy, Button properties, States, CustomButton, Assembly, Scaling, Motion, Tokens, Behavior in Code, Props in code, Runtime in code, Best Practices vs code

## Best Practices

- Use `Button` for actions that mutate state (deploy, save, delete); use `ButtonLink` for navigation that changes the URL. Switch to a **Menu** or **Split Button** when more than one related action shares a row.
- Default `Button` is primary. Pass `type="secondary"` for the supporting action and `type="error"` for destructive confirmations. `primary`, `success`, `ghost`, and `violet` are not valid `type` values.
- For form submits, use `typeName="submit"`. The HTML `type` attribute lives on `typeName`, not on `type`, which controls the visual variant.
- Pass `loading` instead of swapping in a spinner so the button stays focusable and announces the busy state to assistive tech.
- Disable a button only when the action is impossible right now (missing input, insufficient permission); pair with a **Tooltip** that explains why.
- Title Case the label and name what happens: `Deploy Project`, `Invite Member`, `Rotate Key`. Avoid bare verbs (`Submit`) and generic confirms (`OK`, `Confirm`).
- Destructive buttons follow `Verb + Noun` and pair 1:1 with their toast: `Delete Project` then `Project deleted`. Mode-switch buttons append `Instead`: `Use a Recovery Code Instead`.
- Icon-only buttons require both `svgOnly` and `aria-label`; the validator throws without them. The `aria-label` names the action and the target (`Copy deployment URL`), not the icon (`Copy`).
- Don’t set `aria-label` on a button that already has visible text; it overrides the label and creates a screen-reader mismatch.

## Figma Guidelines

### Anatomy

- `Button` — an optional `Prefix`, `Label`, and an optional `Suffix` in a row.
- `shape="square"` and `shape="circle"` keep only `Label`, which holds an Icon instance instead of text.
- `Prefix` and `Suffix` — instance-swap icon slots.

### Button properties

- `variant` — `default`, `secondary`, `tertiary`, `error`, `warning`.
- `shape` — `default`, `rounded`, `square`, `circle`.
- `size` — `tiny`, `small`, `medium`, `large`. `tiny` pairs only with `shape="square"` or `shape="circle"` in the set.
- `showPrefix` and `showSuffix` toggle the visibility of `prefix` and `suffix`; the instance swap itself happens on `prefix` and `suffix`.
- `icon` is the instance-swap behind `Label` for `shape="square"` and `shape="circle"`.

### States

- `state` — `default`, `hover`, `loading`, `disabled`.
- `loading` replaces `Prefix` with a Spinner on `shape="default"` and `shape="rounded"`; on `shape="square"` and `shape="circle"` the Spinner replaces `Label` itself.

### CustomButton

- `CustomButton` accepts `normal`, `hover`, and optional `active`, each `{foreground, background, border}`.
- Values are literal hex or variable values, written as inline CSS variables exactly as passed.
- Pass `normal` and `hover` together; with `normal` alone the button turns transparent on hover.
- `active` falls back to `hover` when omitted.

### Assembly

- Build `rounded` marketing buttons from `shape="rounded"` plus the `shadow` prop.
- `shadow` renders the elevation, while `shape="rounded"` alone gives the pill shape.
- `ButtonLink` shares the same shell and props as `Button`, rendered as an `a`.
- Swap `Prefix` and `Suffix` through the property.
- Slot padding follows the side that holds an icon.

### Scaling

- `small` — 32px tall · padding 6px · text 14px/21px
- `medium` — 36px tall · padding 10px · text 14px/21px · radius 6px
- `large` — 40px tall · padding 14px · text 16px/24px · radius 8px
- `shape="rounded"` — padding 12px at `small`, `medium` and `large` in place of the padding above.
- `tiny` — 24px × 24px · radius 4px · icon 16px
- `square` and `circle` — width equals height at every size; `default` and `rounded` grow with the label.

### Motion

- Every `default` -state variant carries an `ON_HOVER` reaction to its matching `hover` variant.
- The reaction uses `Smart Animate`, a custom bezier `0.4, 0, 0.2, 1`, and `150ms`.
- `hover`, `loading`, and `disabled` are static end states.

### Tokens

- `default` fill `ds/gray/1000`, hover `components/button/default/bg-hover`, text `ds/background/100`.
- `error` fill `ds/red/800`, hover `components/button/error/bg-hover`, text `components/button/error/fg`.
- `warning` fill `ds/amber/800`, hover `components/button/warning/bg-hover`, text `components/button/warning/fg`.
- `secondary` fill `ds/background/100`, hover `components/button/secondary/bg-hover`, text `ds/gray/1000`.
- `tertiary` — transparent fill; hover `ds/gray/alpha/200`, text `ds/gray/1000`.
- `loading` text, icons, and `Spinner` bars use `ds/gray/700`.

## Behavior in Code

### Props in code

- `variant` selects the look: `default`, `secondary`, `tertiary`, `error`, or `warning`.
- `typeName` sets the HTML `type` attribute and defaults to `submit`.
- `type` is the legacy look prop and defaults to `invert`; it only tunes the hover colors.
- `size` defaults to `medium`; `width` sets both `minWidth` and `maxWidth`.
- `loading` applies the same disabled behavior as `disabled`, so the button stops reacting to presses and hover.

### Runtime in code

- Hover colors transition over `150ms` with `ease-in-out`.

### Best Practices vs code

- Best Practices name `type="secondary"` and `type="error"`; the site examples set the look with `variant`.
- Best Practices read `type` as the visual variant; the code defaults it to `invert` and `variant` takes over the look.
