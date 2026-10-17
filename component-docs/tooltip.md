# Tooltip

A floating label that appears on hover or focus to provide additional context about an element.

Source of the Best Practices: https://vercel.com/geist/tooltip

Contents: Best Practices, When to use, Behavior, Content, Accessibility, Figma Guidelines, Anatomy, Tooltip properties, Assembly, Layout, Tokens, Behavior in Code, Props in code, Runtime in code, Motion in code, Accessibility in code, Best Practices vs code

## Best Practices

### When to use

- Use a Tooltip to explain **why** something exists, not **what** it is. The visible label names the thing; the tooltip adds the constraint, scope, or limit.
- For an entity preview with metadata rows (avatar, identifier, 2–4 facts, optional action), use **Context Card**. For long-form content or actions that need persistence, route to a **Drawer** or page navigation.
- Use lifecycle Tooltips (`Alpha`, `Experimental`, `Beta`, `Early Access`) to name the limits that apply: API stability, SLA, support, pricing, retention.

### Behavior

- Tooltips open on hover and on keyboard focus. Keep the default ~150ms entry delay so the tooltip doesn’t flicker on a sweeping mouse.
- Don’t wrap a labelled **Input** in a Tooltip. The trigger lands on the `<label>`, not the field, and the tooltip text becomes a second invisible label for screen readers. Put help on a sibling icon button.
- Keep primary actions outside the Tooltip; touch users can’t reach a hover-revealed control.

### Content

- One sentence or fragment in `text`. Sentence case, no period for a single fragment.
- Skip tooltips that repeat the visible label (`text="Rate Limit"` on a `Rate Limit` button) or describe the interaction (`text="Click to override"`).
- Lifecycle Tooltips follow `{Label}: {one-line meaning}. {Specific limit}.` For a paid Beta feature, combine the lifecycle and pricing in one Tooltip rather than stacking two badges.

### Accessibility

- An icon-only trigger needs an `aria-label` that names the action; the Tooltip body adds context, it doesn’t replace the label.
- Escape closes the tooltip and returns focus to the trigger.

## Figma Guidelines

### Anatomy

- `Tooltip` — `<Tooltip>`: the body with `Label`, the `content` slot, and `Tip`.
- `Label` — the text of the tooltip, the string `text` of code.
- `content` — the slot for richer content next to `Label`, the JSX `text` of code.
- `Tip` — the pointer on the body edge that faces the trigger.

### Tooltip properties

- `position` — `top`, `bottom`, `left`, or `right`: the side of the trigger the tooltip opens on.
- `boxAlign` — `left`, `center`, or `right`: where the tip sits along `top` and `bottom`.
- `center` — `true` centers the text, `false` aligns it to the start.
- `label` — the characters of `Label`.
- `showLabel` — shows or hides `Label`.
- `showContent` — shows or hides the `content` slot.
- `showTip` — shows or hides `Tip`, the `tip` of code.

### Assembly

- Make the instance an absolute child of the frame that contains the trigger.
- Put it last in that frame, so it overlays the layout.
- Set `Canvas stacking` to `Last on top` on that frame, so the tooltip draws over the neighbouring triggers and rows.
- Break a long text with Enter so the tooltip stays inside the width of the content.
- Move the tooltip together with its trigger.
- Keep 10px between the trigger and the body for every `position`; the tip lies inside that gap.
- For `top` and `bottom` with `boxAlign` `center`, center the body over the trigger.
- For `left` and `right`, align the vertical centers of the body and the trigger.
- On `top` and `bottom` with `boxAlign` `left` or `right`, put the tip center over the trigger center.
- Bind `visible` of the instance to a Boolean variable, one per tooltip.
- On the trigger, add `While hovering` with `Set variable` that sets the variable to `true`.
- Add `Mouse leave` with `Set variable` that sets the variable to `false`.
- Put the reactions on the trigger, or on a frame with a `0%` opacity fill around it.
- A trigger with its own hover change keeps it as a second action of the same interaction.
- Type the text in `label`.
- Turn on `showContent` and add layers to the `content` slot for richer content.
- Turn off `showLabel` when the slot holds all of the content.
- Set the `DS / Core Colors` variable mode of the `content` slot to the opposite of the frame mode.
- Use `Light` in a dark frame and `Dark` in a light frame, as the tooltip body does.
- Align layers in `content` with their own settings; `center` acts on `Label`.

### Layout

- The body pads 6px above and below and 8px at the sides (`py-1.5`, `px-2`), with an 8px radius (`rounded-lg`).
- The body lays out `Label` and `content` in a row with 4px between them.
- With `content` shown, `Label` narrows and wraps so the row stays within 250px.
- The text is 13px/16.9px Geist (`text-[13px]`, `leading-[1.3]`).
- The body hugs the text up to 250px wide and wraps longer text (`maxWidth` `250px`).
- `Tip` is 14px × 6px for `top` and `bottom`, and 6px × 14px for `left` and `right`.
- On `left` and `right`, and with `boxAlign` `center`, `Tip` sits at the center of its edge.
- With `boxAlign` `left` or `right` on `top` and `bottom`, `Tip` sits 20% of the width from that edge.
- That distance stays between 12px and 20px.
- `Tip Track` positions `Tip` along its edge and keeps that distance when the body width changes.
- The body is at least 32px wide, so `Tip` stays on the straight part of its edge.
- `Tip` enters the body by 0.6px on every side, which hides the seam at its feet.
- The instance is the body; the `Tip` lies outside it.

### Tokens

- `Tooltip` — fill `components/tooltip/bg`, text `components/tooltip/fg`, radius `tailwind/radius/lg`, padding `tailwind/space/6` and `tailwind/space/8`.
- The fill and text variables hold the opposite theme’s colours, as `invertTheme` does in code.
- `Tip` — the fill of the body.

## Behavior in Code

### Props in code

- `text` is a string or JSX. A string drops its trailing period.
- `position` defaults to `top`. `auto` opens `bottom` for a trigger in the upper half of the viewport, otherwise `top`.
- `boxAlign` defaults to `auto`, which is `center` for `left` and `right`.
- For `top` and `bottom`, `auto` picks `left` or `right` within 100px of that viewport edge, otherwise `center`.
- With `boxAlign` `left` or `right` the tip center sits `clamp(12px, 20%, 20px)` from the body edge (`--tooltip-arrow-offset`).
- `maxWidth` defaults to `250px`, `wrap` to `true` (`break-words whitespace-pre-line`), `center` to `true`, and `tip` to `true`.
- `type` values `success`, `error`, `warning`, and `violet` only set `--themed-bg` and `--themed-fg`.
- The body fill reads `--ds-background-100`.
- A `kbd` child in the body gets `bg-gray-400`, `rounded-sm` and `text-xs`, with `gap-1` beside it.
- `tooltipClassName` and `tooltipStyle` reach the body, so a custom fill goes through them; the tip keeps `--ds-background-100`.
- `invertTheme` defaults to `true`: the body gets `invert-theme`.
- The body is dark on a light page and light on a dark page (`#0a0a0a` with `#ededed` text in light).
- Everything inside the body reads the opposite theme’s `--ds-*` tokens, because `invert-theme` redefines them on the body.
- A custom fill keeps `invert-theme`, so the content still reads the opposite theme’s tokens.
- With `invertTheme` `false` the body and its content follow the page theme.
- Other props: `as`, `className`, `containerRef`, `cursor`, `delay`, `delayTime`, `desktopOnly`, `disableTriggers`, `fill`, `forceHide`, `hideOnClick`, `htmlType`, `lowerDelay`, `padding`, `shown`, `sticky`, `style`, `tooltipClassName`, `tooltipStyle`, `useParentForBoundingRect`.

### Runtime in code

- The body renders in a portal (or in `containerRef`) as `position: absolute` at `z-index` `--ds-z-tooltip`.
- The body is placed from the trigger’s bounding box.
- The body sits 10px from the trigger (`calc(-100% - 10px)` for `top`, the same offset on the other sides).
- The trigger is an `inline-flex` `span` (`as`) with `tabIndex` `0`.
- The tooltip opens on pointer enter and closes 100ms after the pointer leaves.
- It also closes on Escape and on any scroll; a resize repositions it.
- Enter and Space open it from the keyboard; focus alone opens it only with `sticky`.
- On touch it opens when the touch ends on the trigger, with the faster delay.
- When `text` is undefined, the component renders only `children`.

### Motion in code

- The tooltip fades in from opacity 0 to 1 over 100ms with `ease-in` after a 400ms delay (`animate-fadeInTooltip`).
- `lowerDelay` and touch shorten the delay to 100ms (`animate-fadeInTooltipFaster`).
- `delay={false}` sets `animation-delay: 0s`.
- The tooltip closes at once and unmounts.
- At the end of the keyframes `pointer-events` becomes `all`; the body starts with `pointer-events-none`.

### Accessibility in code

- The body has `role="tooltip"` and an `id`; the trigger gets `aria-describedby` with that id while the tooltip is open.

### Best Practices vs code

- Best Practices keep a ~150ms entry delay. The published `<Tooltip>` waits 400ms (`animate-fadeInTooltip`).
- Best Practices open on hover and on keyboard focus. The published `<Tooltip>` opens on pointer enter, `Enter`, and `Space`; focus alone needs `sticky`.
- Best Practices return focus to the trigger on Escape. The published `<Tooltip>` closes the tooltip and leaves focus where it is.
