# Project Banner

Used for temporary, project-wide notifications that require resolution

Source of the Best Practices: https://vercel.com/geist/project-banner

Contents: Best Practices, When to use, Behavior, Content, Figma Guidelines, Anatomy, Project Banner properties, _Project Banner Link properties, States, Assembly, Layout, Motion, Tokens, Behavior in Code, Props in code, Runtime in code, Responsive in code, Accessibility in code

## Best Practices

### When to use

- Use Project Banner for project-wide states that need resolution: overdue billing, an active rollback, attack mitigation, an expiring trial blocking deploys.
- Pick **Note** for inline contextual messages tied to a single field or card, **Toast** for transient acknowledgments, **Modal** for confirmations.
- Match `variant` to severity: `error` for critical downtime or payment-blocking states, `warning` for an exceptional state with non-immediate action, `success` for a positive temporary mitigation, `gray` for routine project-wide notices.

### Behavior

- Project Banner is non-dismissible by design. If the message can be dismissed without resolving the underlying state, it isn’t banner-worthy; move it to a **Note**.
- Show one Project Banner at a time. Stacking competing banners drowns the most urgent state.
- Always pass a `callToAction` that resolves the state. A banner with no route is a dead end.

### Content

- `label` is one sentence in sentence case that names the impact: `Your Pro trial expires in 3 days.` Don’t open with `Heads up` or apologetic preambles.
- `callToAction.label` is Title Case `Verb + Noun` and points at the resolver: `Update Payment Method`, `Reactivate Project`, `Review Tokens`.
- Name the affected entity when the project context isn’t obvious from the surrounding chrome (`Production deployments are paused on my-project`).
- Don’t encode severity in the copy with emoji or interjections; the variant carries that signal.

## Figma Guidelines

### Anatomy

- `Project Banner` — `<ProjectBanner>`, rendered as an `<aside>`: `Content` holds `Outer`, and its `Inner` holds `Icon`, `Label` and `Call To Action`.
- `Call To Action` — an instance of `_Project Banner Link`, the `callToAction` of code.

### Project Banner properties

- `variant` — `gray`, `error`, `success` or `warning`. The fill, border, text, icon and link follow it.
- `label` — the sentence.
- `icon` — the leading icon.
- `showCTA` — shows `Call To Action`.
- `Call To Action` is exposed on the instance, with the `label` of its link.
- In the set `Inner` has a max width of 764px, so a banner wider than 812px wraps the label at the same place.

### _Project Banner Link properties

- `type` — `gray`, `error`, `warning` or `success`: the `variant` of the banner the link sits in.
- `label` — the link text, `callToAction.label` in code.

### States

- `default` and `hover` — the link at rest and under the pointer.

### Assembly

- Set the banner to `Fill container` in an auto layout parent.

### Layout

- The banner is 812px wide and 40px high on one line.
- It has 8px above and below, 24px at the sides, and 8px between icon, text and link.
- The border is 1px on top and bottom; Figma draws it outside, so the banner measures 42px.
- A long label wraps and the link stays to its right. Two lines make the banner 58px high and each further line adds 20px.

### Motion

- Hover: `On hover`, `Change to`, `Instant` — the link changes color at once.

### Tokens

- `Project Banner` — fill `ds/gray/100`, border `ds/gray/400`, text and icon `ds/gray/900`. `warning`, `error` and `success` use the same steps of `ds/amber`, `ds/red` and `ds/blue`.
- Padding `tailwind/space/8` and `tailwind/space/24`, gap `tailwind/space/8`.
- Link text `ds/gray/1000`, `ds/gray/900` on hover; underline `ds/gray/500` at a 5px offset, radius `tailwind/radius/xs`.
- The other variants use `ds/amber`, `ds/red` and `ds/blue`; their underline goes from step 400 to step 500 on hover.

## Behavior in Code

### Props in code

- `callToAction` is optional.
- `callToAction` renders an `<a>` with `href` or a `<button>` with `onClick`.
- Code also accepts inline content in the label, such as a **Tooltip**.

### Runtime in code

- The label wraps at the container width.
- The banner fills the width of its container.
- Code counts the border inside the 40px with `min-h-[40px]`.

### Responsive in code

- Under 601px code stacks the link under the text, 24px from the left (`ml-6`), in line with the label.

### Accessibility in code

- Code hides the icon from assistive technology with `aria-hidden`.
- Keyboard focus draws a 2px ring, 2px off the link.
- The ring is `ds/blue/600` for `gray` and `success`, `ds/amber/700` for `warning`, and `ds/red/700` for `error`.
