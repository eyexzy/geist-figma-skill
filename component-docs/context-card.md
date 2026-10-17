# Context Card

A floating card that appears on hover or focus. Capable of showing more complex UI than a tooltip.

Source of the Best Practices: https://vercel.com/geist/context-card

Contents: Best Practices, When to use, Behavior, Content, Accessibility, Figma Guidelines, Anatomy, Context Card properties, Assembly, Layout, Tokens, Behavior in Code, Props in code, Runtime in code, Motion in code, Best Practices vs code

## Best Practices

### When to use

- Use Context Card to reveal entity metadata on hover or focus: a user, a deployment, a project, an API key. The trigger is usually a name link or avatar in dense data.
- For a one-line "why" without metadata rows, use **Tooltip**. For long-form content, edit forms, or persistent navigation, route to a **Drawer** or a detail page.
- Don’t use Context Card to surface destructive actions; the panel can dismiss on cursor exit before the user commits.

### Behavior

- Context Card opens on hover and keyboard focus and closes on cursor exit or blur. Preserve the ~150ms entry delay so it doesn’t flash on a fast mouse sweep.
- Cap interactive content at one primary action (`View Project`, `Open Settings`). More than one CTA reads as a menu and belongs in **Menu**.
- Don’t nest a Context Card inside a Tooltip or another Context Card; the second layer steals focus and traps keyboard users.

### Content

- Lead with the entity name as a Title Case heading and one identifying line in sentence case underneath (team slug, owner, deployment URL).
- Follow with 2–4 metadata rows of `Label: value`. Keys are Title Case noun phrases (`Last Active`, `Created`, `Plan`); values follow the same formatting rules as table cells. Use the em-dash character `—` for unknown values, never `N/A` or `null`.
- Don’t restate what the trigger already showed. If the row already renders the deployment URL, don’t repeat it as the first card line.

### Accessibility

- The trigger keeps its own accessible name; the card is supplementary and shouldn’t replace it.
- Card content is reachable by keyboard once the trigger has focus; Escape closes the card and returns focus to the trigger.

## Figma Guidelines

### Anatomy

- `Context Card` — `<ContextCardTrigger>`: the card that opens over its trigger.
- `Title` — the first line of the card, the string `content` of code.
- `Description` and `Row 1` to `Row 4` — the identifying line and the metadata rows of the Best Practices.
- `content` — the slot for other UI, the JSX `content` of code.
- `Action` — the one primary action of the card, a button in `Action Row`.
- `Tip` — the pointer on the card edge that faces the trigger.

### Context Card properties

- `side` — `top`, `bottom`, `left`, or `right`: the side of the trigger the card opens on.
- `align` — `start`, `center`, or `end`: the edge of the trigger the card aligns to along its side.
- `title` — the characters of `Title`.
- `showTitle` — shows or hides `Title`.
- `description` — the characters of `Description`.
- `showDescription` — shows or hides `Description`.
- `label1` to `label4` and `value1` to `value4` — the characters of `Label` and `Value` in each row.
- `showRow1` to `showRow4` — show or hide each row.
- `showAction` — shows or hides `Action`.
- `showContent` — shows or hides the `content` slot.
- The properties of the button in `Action`, such as `label` and `variant`, are exposed on the instance.

### Assembly

- Make the instance an absolute child of the frame that contains the trigger.
- Put it last in that frame, so it overlays the layout.
- Set `Canvas stacking` to `Last on top` on that frame, so the card draws over the neighbouring rows.
- A card keeps its absolute position when the layout around the trigger changes; move it together with the trigger.
- Keep 14px between the trigger and the card for `top` and `left`, and 16px for `bottom` and `right`.
- The tip lies inside that gap.
- With `align` `center`, center the card on the trigger along its side.
- With `start` or `end`, place the card so `Tip` is over the trigger center.
- Bind `visible` of the instance to a Boolean variable, one variable per card.
- On the trigger, add `While hovering` with `Set variable` that sets the variable to `true`.
- Add `Mouse leave` with `Set variable` that sets the variable to `false`.
- Put the reactions on the trigger, or on a frame with a `0%` opacity fill around it.
- A trigger with its own hover change keeps it as a second action of the same interaction.
- Type the text in `title`.
- Turn on `showDescription`, `showRow1` to `showRow4`, and `showAction` for an entity summary.
- Set `Action` to `Fill container` to span the card.
- Turn on `showContent` and add layers to the `content` slot for other UI.
- Turn off `showTitle` when the slot holds all of the content.

### Layout

- The card pads 12px on every side, with a 6px radius.
- `Title`, `Description`, the rows, `content`, and `Action` sit 8px apart.
- `Action Row` places `Action` at the end of the card.
- A row lays out `Label` and `Value` side by side, 4px apart.
- `Title` is 16px/24px Geist; `Description` and the rows are 14px/20px.
- The card is as wide as its content.
- `Tip` is 14px × 7px for `top` and `bottom`, and 7px × 14px for `left` and `right`.
- With `align` `center`, `Tip` sits at the center of its edge.
- With `start` or `end`, `Tip` sits 32px from that edge.
- With `center`, `Tip Track` keeps `Tip` centered when the card size changes.

### Tokens

- `Context Card` — fill `ds/background/100`, effect `ds/shadow/tooltip`, radius `tailwind/radius/md`, padding `tailwind/space/12`, gap `tailwind/space/8`.
- `Title` and `Value` — text `ds/gray/1000`; `Description` and `Label` — text `ds/gray/900`.
- `Tip` — fill `ds/background/100`, stroke `components/context-card/tip-stroke`.

## Behavior in Code

### Props in code

- `content` is any React node; a string renders as 16px/24px text. A `null` or Boolean content keeps the card closed.
- `side` defaults to `right`, `align` to `center`, `sideOffset` to `16`, and `alignOffset` to `0`.
- With `align` `start` or `end` the card edge is flush with that edge of the trigger.
- The tip keeps pointing at the trigger center, and stays at least 7px from the card edge.
- `sideOffset` is measured from the content box, and the card adds 2px.
- The visible gap to the trigger is 14px on top and left, and 16px on bottom and right.
- `noPadding` removes the 12px padding of the card.
- `hide` keeps the card closed.
- `render` replaces the trigger `div`, for example with an anchor.
- `ignoreCardPointerEvents` stops the card from taking the pointer.
- `inactiveTimeoutMs` defaults to `250`; `className` and the other props go to the trigger.

### Runtime in code

- The trigger is an `inline-flex` `div` with `cursor-pointer` and `overflow-hidden`.
- The card renders in a portal on a fixed layer at `z-index` `100000`.
- The card opens 150ms after the mouse enters the trigger, or at once when another card is visible.
- It closes 250ms after the mouse leaves the trigger and the card.
- It stays open while the mouse is over the card.
- A click on a link inside the trigger closes it.
- Scroll and resize reposition the card.
- It flips to the opposite side when the chosen side lacks room and the opposite has more.
- It keeps 8px from the viewport edge.

### Motion in code

- The card fades in and out over 150ms with `cubic-bezier(0.3, 0.57, 0.07, 0.95)`.
- Moving to another card slides it over 250ms with `cubic-bezier(0.29, 0.31, 0.05, 0.96)`.
- A jump over 150px, a scroll, or the first card skips the slide.
- With `prefers-reduced-motion` both transitions are off.

### Best Practices vs code

- Best Practices open on hover and keyboard focus, and close on blur. The published `<ContextCardTrigger>` opens on mouse enter and closes on mouse leave.
- Best Practices close on Escape and return focus to the trigger. The published `<ContextCardTrigger>` reacts to the mouse only.
- Best Practices keep a ~150ms entry delay. The published `<ContextCardTrigger>` waits 150ms, or opens at once when another card is visible.
