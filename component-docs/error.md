# Error

Good error design is clear, useful, and friendly. Designing concise and accurate error messages unblocks users and builds trust by meeting people where they are.

Source of the Best Practices: https://vercel.com/geist/error

Contents: Best Practices, When to use, Behavior, Content, Accessibility, Figma Guidelines, Anatomy, Error properties, _Error Link properties, Assembly, Layout, Motion, Tokens, Behavior in Code, Props in code, Runtime in code, Best Practices vs code

## Best Practices

### When to use

- Use the Error component as a block surface when a section or page-level resource failed to load: a panel, a dashboard card, a route boundary.
- Pick `toasts.error()` for transient action failures (`Couldn’t save settings. Try again.`) and the `error` prop on **Input** for field-level validation. Don’t replace either with this block.
- Always pair platform or system errors with a stable identifier (request ID `x-vercel-id`, deployment ID `dpl_…`, run ID, trace ID). Validation and permission denials are user-state, not system, and don’t need an ID.

### Behavior

- The recovery action must do something concrete: a `Try Again` button when the operation is retry-safe, a named verb (`Reconnect GitHub`, `Update Payment Method`) when it isn’t.
- Don’t auto-retry in the background; the user came to this surface to decide.
- For full-page route errors (`error.tsx`), return focus to the `Try Again` button on appearance so a keyboard user can retry without hunting for it.

### Content

- State what happened and what to do next, in that order. Cut apologetic preambles (`Unfortunately`, `Oops`, `We’re sorry`).
- Use `Couldn’t` or `Can’t` for user-state errors (`Couldn’t verify your passkey. Try again.`); use `Failed to` for system or infra errors that mirror CLI output (`Build failed. Bundle exceeds 50 MB.`). `Unable to` is banned.
- Don’t fall back to `Something Went Wrong` as a title; name the resource that failed (`Couldn’t Load Page`, `Couldn’t Load Deployments`).
- Render the stable ID on a monospace sub-line under a collapsed `<details>` so the user can copy-paste it into a support thread.
- Never humor an error. Users hitting an error are frustrated; insincere copy makes it worse.

### Accessibility

- When the error appears asynchronously (after a failed fetch), wrap the region in `aria-live="polite"` so it’s announced. Reserve `aria-live="assertive"` for true blocking errors that interrupt input.

## Figma Guidelines

### Anatomy

- `Error` — `<Error>`, a `role="alert"` region: `Icon`, `Label` (`Text` and `Colon`) and `Message` with `Text` and `Link`.
- `_Error Link` — the `Link` that `<Error>` renders for `error.link`, with `type="blend"` and `external`.

### Error properties

- `size` — `small` 13/20, `medium` 14/20, `large` 16/24.
- `message` — `children` in code, or `error.message` when code gets an error object.
- `showLabel` and `label` — the Medium prefix, the `label` prop. Code adds the colon, so `label` holds the name only: `Email Error`.
- `showAction` — `Link`, rendered when `error.link` is set; its text is `error.action`, `Learn More` by default.
- `showIcon` — Figma only.

### _Error Link properties

- `size` matches the `size` of the Error around it; code inherits the text size.
- `external` shows the arrow icon, 2px after the text.
- `state` — Figma only: `hover` drops the link to 60%, the `hover:opacity-60` of code.

### Assembly

- `Error` hugs its content and keeps the message on one line.

### Layout

- The icon is 16px, 8px before the text.
- The icon sits 2px lower, 4px in `large`, so it centers on the first line.
- The label sits 8px before the message (`mr-2`); `Link` sits 4px after it, the space code puts before the link.

### Motion

- `Link` hover: `While hovering`, `Dissolve`, bezier `0.4, 0, 0.2, 1`, `100 ms` — code transitions `opacity` over 100ms.

### Tokens

- Icon, label, message and link use `ds/red/900`.
- Label and link are Geist Medium; the message is Geist Regular.
- Spacing `tailwind/space/8` between icon, label and message, `tailwind/space/4` before the link, `tailwind/space/2` inside it. The icon drop is `tailwind/space/2`, `tailwind/space/4` in `large`.

## Behavior in Code

### Props in code

- Code names the middle size `default`.
- Code always draws the icon.
- `error` takes an object `{ message, link, action }` or a React element; `children` takes priority over it.
- `label` renders in bold Medium followed by a colon, and `label={false}` hides it.
- `<Error>` always passes `external` to its link, which opens in a new tab.

### Runtime in code

- `<Error>` is a block that spans its container and wraps long messages with `break-words`.
- `<Error>` sets `aria-atomic="true"` and hides the icon with `aria-hidden`.

### Best Practices vs code

- Best Practices describe a block surface for a section or page that failed to load. The published `<Error>` is an inline row of icon, label, message and link; the set follows that code.
