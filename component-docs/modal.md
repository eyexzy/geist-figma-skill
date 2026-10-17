# Modal

Display popup content that requires attention or provides additional information.

Source of the Best Practices: https://vercel.com/geist/modal

Contents: Best Practices, When to use, Behavior, Content, Accessibility, Figma Guidelines, Anatomy, Modal properties, _Modal Panel properties, Assembly, Layout, Motion, Tokens, Behavior in Code, Props in code, Runtime in code, Responsive in code, Motion in code, Accessibility in code, Best Practices vs code

## Best Practices

### When to use

- Use Modal when a decision must block the rest of the page. For persistent associated context where the underlying page stays readable, use **Sheet** on desktop or **Drawer** on mobile.
- Confirm destructive actions in a Modal. **Drawer** and **Sheet** don’t fully dim the page, so they read as too soft for a delete or revoke.
- Skip Modal for routine create flows that have a dedicated page; route to the page instead.

### Behavior

- Default focus to `Cancel` on any destructive Modal. Enter must never trigger the destructive action without a typed confirmation.
- Allow Escape and outside-click to dismiss non-destructive Modals; gate dismissal on destructive ones with unsaved input.
- Trap focus inside the Modal while it’s open and return focus to the trigger after close. Restore body scroll on the same tick the Modal unmounts.
- For high-stakes destructive actions (delete production resource, rotate signing key, downgrade plan), gate the primary button on a typed match of the resource name.

### Content

- `Modal.Title` is a Title Case statement, never a question. `Transfer Project` is correct; `Transfer Project?` is wrong.
- `Modal.P` body is sentence case, 1–3 sentences. State the consequence first, then any cascade.
- Primary button is `Verb + Noun` and matches the title verb (`Transfer Project` title pairs with `Transfer Project` button). Never `Confirm`, `OK`, or a bare verb on a destructive primary.
- Cancel literal stays `Cancel`. Acknowledgment-only Modals (after a key reveal, after a one-time-show) use `Done`, never `OK` or `Close`.
- Close irreversible bodies with `This cannot be undone.`; close cascade-only bodies with `Some effects cannot be undone.`. Don’t claim full irreversibility for a partial cascade.
- Pair the success toast verb 1:1 with the primary button: `Delete Project` button, `Project deleted` toast.

### Accessibility

- Set `aria-labelledby` to the `Modal.Title` id so screen readers announce the title on open.
- Keep the Cancel button literally `Cancel` so screen-reader users hear a stable dismissal label across destructive flows.
- After an error inside the Modal, keep focus inside so the user can retry; after success, return focus to the trigger.

## Figma Guidelines

### Anatomy

- `Modal` — `<Modal>`: the overlay with `Backdrop` and the `children` slot.
- `Panel` — the dialog, sitting in the slot of `Modal`.
- `Body` — `<ModalBody>`: holds `Header` and the `children` slot.
- `Header` — `<ModalHeader>` with `Title` (`<ModalTitle>`) and `Subtitle` (`<ModalSubtitle>`).
- `Actions` — `<ModalActions>`: `Secondary Action` and `Tertiary Action` sit in `Actions Start`; `Primary Action` sits at the opposite end.
- Each of `Secondary Action`, `Tertiary Action`, and `Primary Action` is a `<ModalAction>`.

### Modal properties

- `active` — `true` shows `Backdrop` and the panel; `false` hides both.
- `children` — a slot that holds `Panel`; the panel can be resized, swapped, or replaced.

### _Modal Panel properties

- `sticky` — `true` lifts `Header` out of `Body` into a full-width row with a line below.
- `Subtitle` exists only at `sticky=false`.
- `showHeader`, `showSubtitle`, `showContent`, and `showActions` match omitting `<ModalHeader>`, `<ModalSubtitle>`, the body children, or `<ModalActions>`.
- `children` — a slot for the body content, below `Header`.
- `showActionsStart` and `showPrevious` show the `Actions Start` group and `Tertiary Action`.
- `Secondary Action`, `Tertiary Action`, and `Primary Action` are exposed **Button** instances.
- The `state` values `disabled` and `loading` of those buttons match the `disabled` and `loading` props of `<ModalAction>`.

### Assembly

- Resize the `Modal` instance to the screen size; `Backdrop` stretches and the panel stays centered.
- Bind `active` to `state/modal/open` from `Prototyping / Modal`.
- The trigger sets the variable to `true`; `Backdrop` and `Secondary Action` set it back to `false`.
- To use another variable, override the reactions of `Backdrop` and the footer buttons inside the instance.
- Drop content into the `children` slot of `Panel`; layers stack from the top with 0px between them.
- Select `Panel` in the slot of `Modal` and resize it for another `width`; the default is 540px.
- Turn on `showPrevious` for a second button beside `Secondary Action`; `Actions Start` keeps 16px between them.
- Turn off `showActionsStart` for a single button; set `Primary Action` to `Fill container` and `variant` to `secondary` for `fullWidth`.
- For `<ModalInset>`, center a 540px-wide frame inside a frame that fills the slot; it overflows 20px on each side.
- Give the inset 24px vertical and 20px horizontal padding, an `accents/1` fill, and 1px `accents/2` lines above and below.
- For `<ModalInset last>`, set the bottom padding of `Body` to 1px and remove the bottom line of the inset.

### Layout

- `_Modal Panel` is 540px wide with a 12px corner radius.
- Height hugs the content up to 720px, 80% of the 900px `Modal`.
- `Body` scrolls beyond its ceiling: 664px, or 600px when `sticky` is `true`.
- `Body` has 20px padding, 21px at the bottom: the extra 1px is the scroll sentinel of `<ModalBody>`.
- 20px separates `Header` from the `children` slot; `Title` and `Subtitle` are 8px apart.
- `Title` is Geist SemiBold 20px/26px with −0.4px tracking; `Subtitle` is Geist Regular 14px/20px.
- With `sticky`, `Header` is a row with 20px padding and a 10px gap; `Title` is 20px/24px.
- `Actions` is 56px high: 12px padding around 32px buttons.

### Motion

- A click on `Backdrop` changes the instance to `active=false` with `Smart Animate`, `300 ms`, and a custom bezier of `0.175, 0.885, 0.32, 1.1`.

### Tokens

- `Backdrop` is `ds/overlay/backdrop/color` at 80% opacity.
- `Body` uses `components/modal/body/bg`, sticky `Header` uses `components/modal/header/bg-sticky`, and `Actions` uses `ds/background/200`.
- The panel shadow is `ds/shadow/modal-elevated`, the line above `Actions` is `ring/top-border`, and the line under sticky `Header` is `ds/gray/alpha/400`.
- `Title` is `ds/gray/1000`; `Subtitle` and the default `Paragraph` are `ds/gray/900`; the radius is `tailwind/radius/xl`.

## Behavior in Code

### Props in code

- `<Modal>` takes `active`, `width`, `sticky`, `onClickOutside`, `onEnterKeyPress`, `initialFocusRef`, and `allowOverflow`.
- `width` defaults to `540`.
- `<ModalBody>` takes `padding`, which defaults to `20`; `<ModalTitle>` takes `center`.
- `<ModalAction>` takes `variant`, `disabled`, `loading`, and `fullWidth`; it always renders `size="small"`.
- `fullWidth` adds `w-full` and defaults `variant` to `secondary`.
- `<ModalInset>` takes `last`, which drops the bottom border and cancels the bottom padding of `<ModalBody>`.
- `<ModalActions>` takes `as`, which defaults to `footer`.
- `<Modal>` also takes `drawer`, default `true`, `drawerClassname`, `overlayClassname`, `onAnimationDone`, `root` and `containerRef`.

### Runtime in code

- The dialog has `role="dialog"` and `aria-modal="true"`.
- It is a flex column with `rounded-xl` and `shadow-[var(--ds-shadow-modal-elevated)]`.
- Its height is capped at `max-h-[min(800px,80vh)]`, 720px in a 900px viewport; `<ModalBody>` scrolls inside.
- `<ModalActions>` is `sticky bottom-0` and `shrink-0` with `p-3`.
- `<ModalBody>` contains two 1px sentinels that detect the scroll position.
- Escape calls `onClickOutside` unless an element inside has `aria-expanded="true"`; Enter calls `onEnterKeyPress`.
- The backdrop is `.geist-overlay-backdrop` at `z-index: 300`: `--ds-overlay-backdrop-color` at opacity `.8`.

### Responsive in code

- Up to 540px viewport width, the dialog gets `max-w-[calc(100vw-20px)]`.
- Up to 600px, with `drawer` on (the default), the Modal renders as a bottom sheet.
- The sheet is full width with `rounded-t-xl`, a `gray-alpha-400` top border, and `max-h-[90dvh]`.
- `drawerHeight` sets its height: `"max"` is `100dvh`, `"expand"` is `90dvh`, a number is pixels.
- `drawerVerticalScroll={false}` switches the sheet to `overflow-hidden`.

### Motion in code

- The panel goes from opacity 0 to 1 and scale `.96` to 1 over `.3s` with `cubic-bezier(.175, .885, .32, 1.1)`.
- The backdrop fades from opacity 0 to `.8` with the same duration and timing.
- The sheet slides in from the bottom over `400ms` with `cubic-bezier(0.32, 0.72, 0, 1)`; its backdrop fades over `300ms`.

### Accessibility in code

- The dialog traps focus; on desktop, `disableFocusTrap` turns the trap off.
- On open, focus goes to `initialFocusRef`.
- When `initialFocusRef` is omitted, the desktop dialog keeps focus on an element already focused inside it.
- Otherwise focus moves to the first tabbable element other than a `<ModalAction>`.

### Best Practices vs code

- Best Practices name `Modal.Title` and `Modal.P`. The published components are `<ModalTitle>` and `<ModalSubtitle>`, and body text is a plain `<p>`.
