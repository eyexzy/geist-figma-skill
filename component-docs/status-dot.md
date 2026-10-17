# Status Dot

Display an indicator of deployment status.

Source of the Best Practices: https://vercel.com/geist/status-dot

Contents: Best Practices, When to use, Behavior, Content, Accessibility, Figma Guidelines, Anatomy, Status Dot properties, Layout, Tokens, Behavior in Code, Props in code, Best Practices vs code

## Best Practices

### When to use

- Deployment lifecycle only. `state` accepts `QUEUED | BUILDING | READY | ERROR | CANCELED | DELETED`.
- For non-deployment statuses (Workflow runs, Queue messages, Sandbox, Cron jobs), use a **Badge** with the canonical state vocabulary instead of repurposing the dot.
- For health summaries that need a number (uptime, hit rate), use **Gauge**; for in-flight work with a knowable total, use **Progress**.

### Behavior

- The dot animates while `BUILDING` or `QUEUED` and goes static once the deployment reaches a terminal state. Don’t add a separate spinner alongside it.
- Don’t flash the color through every transitional state on a polling tick; only update when the readyState changes.
- Pair with **RelativeTimeCard** when timing matters (`Building · 12s ago`); the dot alone doesn’t convey duration.

### Content

- `titlePrefix` is a noun phrase, not a sentence. Default `"This deployment"` works for single-deployment surfaces; in lists, pass the entity (`titlePrefix="vercel-site production"`). Don’t end with a verb or punctuation.
- Use `label` only when the dot stands alone without surrounding text; Geist sentence-cases the state for you (`Building`, `Ready`, `Error`).
- Don’t wrap the dot in extra prose like `Status: Ready`. The label already names the state.

### Accessibility

- The component composes its own `aria-label` from `titlePrefix` plus the state message; don’t override it with a generic `aria-label="status"`.
- When the dot sits inline with text that already names the state, mark the dot decorative with `aria-hidden` so screen readers don’t announce it twice.
- Color is not the only signal: every state ships with a distinct title and label so colorblind users get the same information.

## Figma Guidelines

### Anatomy

- `Status Dot` — `<StatusDot>`: `Dot` and `Label`, the state name. The wrapper carries `aria-label` with that name and a `title` with the state message: `This deployment is ready.`

### Status Dot properties

- `state` — `QUEUED`, `BUILDING`, `READY`, `ERROR`, `CANCELED` or `DELETED`, upper case as in code. It sets the dot color and the label text.
- `label` — shows the state name next to the dot: `Queued`, `Building`, `Ready`, `Error`, `Canceled`, `Deleted`.

### Layout

- The dot is 10px (`size-2.5`) and round, 8px before the label (`ml-2`), centered on its 16px line.

### Tokens

- Dot: `QUEUED`, `CANCELED` and `DELETED` use `accents/2` (`--accents-2`); `BUILDING` `legacy/warning` (`--geist-warning`); `READY` `legacy/cyan` (`--geist-cyan`); `ERROR` `legacy/error` (`--geist-error`).
- Label is hardcoded Geist Regular 14px/16px in `ds/gray/1000`: `text-label-14` with `leading-[16px]`, which replaces the 20px line height of `Label/14`. Code inherits the color from the page.
- Radius `tailwind/radius/full`, gap `tailwind/space/8`.

## Behavior in Code

### Props in code

- Code shows the label only with the `label` prop.

### Best Practices vs code

- Best Practices name `titlePrefix` and an animated dot for `BUILDING` and `QUEUED`. The published `StatusDot` takes `state` and `label` only and keeps the dot static; the set follows that code.
