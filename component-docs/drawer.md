# Drawer

Display content in a separate view from the existing context.

Source of the Best Practices: https://vercel.com/geist/drawer

Contents: Best Practices, When to use, Behavior, Content, Accessibility, Figma Guidelines, Anatomy, Drawer properties, _Drawer Panel properties, Assembly, Layout, Motion, Tokens, Behavior in Code, Props in code, Runtime in code, Motion in code, Best Practices vs code

## Best Practices

### When to use

- Drawer renders as a bottom sheet on small viewports only. On desktop render **Modal** (or **Sheet** for lateral context) directly instead of forcing Drawer.
- Don’t use Drawer to confirm destructive actions. The lack of a fully blocking dim weakens the severity signal that delete and revoke flows need; route to **Modal**.
- A Drawer is good for short focused mobile actions: a single form, a filter sheet, a primary CTA paired with `Cancel`.

### Behavior

- Tap-outside and swipe-down dismiss by default; preserve both unless the form has dirty input.
- Use `verticalScroll` so the drawer body scrolls inside its frame instead of the page behind it.
- Cap content height with `customHeight` only when the default height clips the primary action; the action and `Cancel` must stay above the fold.

### Content

- `DrawerTitle` is a Title Case statement that names the entity (`Deployment Details`, `Filter Logs`).
- Body is sentence case prose. One primary `Verb + Noun` button and a literal `Cancel`; don’t cram a destructive cascade copy into the smaller frame.
- Don’t restate the page heading as the drawer title; name what this view does.

### Accessibility

- Trap focus inside the drawer while open and return focus to the trigger on close.
- Escape closes the drawer; honor the system back gesture on mobile so users can dismiss without reaching for the close affordance.
- Lock body scroll on open and restore it on close so iOS rubber-band scroll doesn’t leak through.

## Figma Guidelines

### Anatomy

- `Drawer` — `<Drawer>`: the bottom sheet with `Backdrop` and `Panel`.
- `_Drawer Panel` — the sheet itself; its `children` slot holds the content.
- `Content` — the default slot content: `Title` and `Description`.

### Drawer properties

- `show` — `true` shows `Backdrop` and the panel; `false` hides both.
- `Panel` is an exposed instance, so its `children` slot is editable from `Drawer`.

### _Drawer Panel properties

- `children` — a slot for the content of `<Drawer>`.

### Assembly

- Resize the `Drawer` instance to the screen size; `Backdrop` stretches and the panel stays at the bottom.
- Bind `show` to `state/drawer/open` from `Prototyping / Drawer` and set it to `true` from the trigger; `Backdrop` sets it back to `false`.
- To use another variable, override the reactions of `Backdrop` inside the instance.
- Drop content into the `children` slot of `Panel`; layers stack from the top with 0px between them.
- For `height={200}`, set the height of the slot content to 200px.
- A click on `Panel` sets `state/drawer/open` back to `true`, so a click inside the sheet keeps it open.

### Layout

- `Panel` fills the width of `Drawer` and has an 8px corner radius on the top corners.
- Height hugs the content up to 675px, 80% of the 844px `Drawer`; taller content scrolls inside the panel.
- `Content` has 48px padding; `Title` and `Description` are 8px apart and centered.
- `Title` is Geist SemiBold 18px/24px; `Description` is Geist Regular 14px/20px.

### Motion

- A click on `Backdrop` changes the instance to `show=false` with `Smart Animate`, `500 ms`, and a custom bezier of `0.32, 0.72, 0, 1`.

### Tokens

- `Backdrop` is black at 40% opacity.
- The panel is `ds/background/100` with the `ds/shadow/menu` shadow and the `tailwind/radius/lg` top radius.
- `Title` and `Description` are `ds/gray/1000`.

## Behavior in Code

### Props in code

- `<Drawer>` takes `show`, `onDismiss`, `height`, `verticalScroll`, `onAnimationDone`, `container`, `className`, `resetScroll`, `onScroll`, `nested`, and `fixed`.
- `show` defaults to `false` and `verticalScroll` to `true`.
- `height` takes a number of pixels or `"max"` for the full screen height; by default the panel hugs its content.
- `verticalScroll={false}` switches the panel from `overflow-y-auto` to `overflow-y-hidden`.
- The panel scrolls back to the top when it opens and when `resetScroll` changes.
- `nested` raises the drawer one level above `--ds-z-modal`, so it renders over an open `<Modal>`.
- `container` sets the portal target; `onAnimationDone` runs after the closing animation.
- `fixed` is forwarded to the dialog and left unused.

### Runtime in code

- The panel is a `role="dialog"` with `tabindex="-1"`; focus lands on it when it opens.
- A fixed viewport at `z-index: 200` (`--ds-z-drawer`) pins the panel to the bottom; the panel is `w-full`.
- The panel has `overscroll-none`, so scrolling stays inside the panel.
- `onDismiss` receives every dismissal: outside tap, swipe down, and Escape.
- A `pointerdown` on buttons, links, menu items, options, and tabs inside the panel calls `stopPropagation`.
- When `visualViewport` shrinks by more than 50px, the viewport gets that height as bottom padding. The panel rises above the keyboard.
- Opening sets `overflow: clip` on `body` and `html`. It adds a transparent right border of the scrollbar width; closing restores both.
- The global `div.geist-dialog` rule overrides the Tailwind classes on the panel.
- It sets an 8px radius (`--geist-marketing-radius`) instead of `rounded-t-[10px]` and `max-height: 80dvh` instead of `max-h-[90dvh]`.
- It sets `border: none` and draws the edge with `--ds-shadow-menu`.

### Motion in code

- The panel slides in from `translateY(100%)` over `.5s` with `cubic-bezier(0.32, 0.72, 0, 1)`.
- The `duration-[400ms]` class on the panel loses to the `div.geist-dialog` rule.
- The backdrop fades from opacity 0 to 1 over `300ms` with the same curve.
- A swipe moves the panel through `--drawer-swipe-movement-y`.

### Best Practices vs code

- Best Practices name `customHeight`; the prop is `height`.
- Best Practices name `DrawerTitle`; the site examples render the title as plain text.
- Best Practices say Drawer is a bottom sheet on small viewports only; `<Drawer>` renders as a sheet at any width.
