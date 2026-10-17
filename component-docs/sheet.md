# Sheet

Display content in a side panel that slides in from the edge of the screen.

Source of the Best Practices: https://vercel.com/geist/sheet

Contents: Best Practices, When to use, Behavior, Content, Accessibility, Figma Guidelines, Anatomy, Sheet properties, _Sheet Panel properties, Assembly, Layout, Motion, Tokens, Behavior in Code, Props in code, Runtime in code, Responsive in code, Motion in code, Best Practices vs code

## Best Practices

### When to use

- Use Sheet for persistent associated context like deployment details, log row inspection, or a member profile, where the underlying page stays useful.
- For a blocking decision, use **Modal**. For a mobile-only bottom sheet, use **Drawer**.
- Don’t use Sheet to confirm destructive actions. The default `modal=false` keeps the page interactive, which weakens severity for a delete or revoke.

### Behavior

- Sheet defaults to `modal=false` so toasts and other high-z elements stay reachable. Keep that default unless the sheet owns the screen.
- Pick `side` from the trigger location: a row inspector slides from `right`, a global filter from `left`. Don’t change sides mid-session.
- Outside-click does not auto-close, so always render an explicit close affordance and honor Escape.

### Content

- Title is Title Case and names the entity (`Deployment Details`, `Member Profile`), not the page action.
- Body is read-mostly: sentence case prose with Title Case sub-headings. Action buttons are optional; when present, follow `Verb + Noun`.
- Don’t duplicate the page header inside the sheet; the sheet is the detail layer.

### Accessibility

- Trap focus inside the sheet while it’s open and return focus to the trigger row on close so keyboard users keep their place in the list.
- Provide a visible close button labeled `Close` (or an icon button with `aria-label="Close"`) since clicking outside doesn’t dismiss.
- Announce the sheet with `aria-labelledby` pointing at the title; pair it with `aria-describedby` only when the body is short and load-bearing.

## Figma Guidelines

### Anatomy

- `Sheet` — `<Sheet>` with `<SheetContent>`: the side panel with `Backdrop` and a `children` slot.
- `Backdrop` — the layer behind the panel that closes the sheet on click.
- `Overlay` — the dimmed fill inside `Backdrop`, `sheet-overlay` in code.
- `Panel` — an instance of `_Sheet Panel` inside the `children` slot of `Sheet`.
- `_Sheet Panel` — `<SheetContent>`: the panel itself; its `children` slot holds the content.
- `Header` — `<SheetHeader>` with `Title` (`<SheetTitle>`) and `Text`: the default slot content.

### Sheet properties

- `open` — `true` shows `Backdrop` and the panel; `false` hides both.
- `side` — `right`, `top`, `bottom`, or `left`: the edge `Panel` is attached to.
- `showOverlay` — `true` shows `Overlay`; `false` hides it, and `Backdrop` still closes the sheet.
- `showOverlay` is the inverse of `noOverlay` on `<SheetContent>`.
- `children` — a slot that holds `Panel`; the `side` of `Panel` matches the `side` of `Sheet`.

### _Sheet Panel properties

- `side` — `top`, `right`, `bottom`, or `left`; it mirrors `side` of `<SheetContent>`.
- `children` — a slot for the content of `<SheetContent>`.

### Assembly

- Resize the `Sheet` instance to the screen size; `Backdrop` and the slot stretch, and `Panel` stays at its edge.
- Choose `side` on `Sheet` before editing the slot. After the slot is edited, a changed `side` keeps the previous `Panel`.
- Bind `open` to `state/sheet/open` from `Prototyping / Sheet` and set it to `true` from the trigger; `Backdrop` sets it back to `false`.
- To use another variable, override the reactions of `Backdrop` and `Panel` inside the instance.
- Drop content into the `children` slot of `Panel`; layers stack from the top with 0px between them.

### Layout

- `Panel` on `right` and `left` is 384px wide and as tall as `Sheet`.
- On `top` and `bottom` it fills the width and hugs its content.
- `_Sheet Panel` has 24px padding and square corners.
- `Title` is Geist SemiBold 18px/28px; `Text` and the body text are Geist Regular 14px/20px.

### Motion

- A click on `Backdrop` changes the instance to `open=false` with `Smart Animate`, `200 ms`, and a custom bezier of `0.4, 0, 0.2, 1`.

### Tokens

- `Overlay` is `ds/overlay/backdrop/color` and `Backdrop` has 80% opacity.
- The panel is `ds/background/100` with the `ds/shadow/modal-elevated` shadow.
- `Title` is `ds/gray/1000`; `Text` and the body text are `ds/gray/900`.

## Behavior in Code

### Props in code

- `<Sheet>` takes `modal`, default `false`, and forwards its other props to the dialog root.
- `<SheetContent>` takes `side`, `noOverlay`, `className`, `onInteractOutside`, `onEscapeKeyDown`, and `ref`.
- `side` defaults to `right`; `noOverlay` removes the `sheet-overlay` layer.
- `<SheetTrigger>` and `<SheetClose>` forward their props to the dialog, so `asChild` applies.
- `<SheetHeader>` and `<SheetFooter>` render a `div`; `<SheetTitle>` renders an `h2` and `<SheetDescription>` a `p`.
- Each part merges `className` after its default classes.
- A floating panel combines `m-3`, `h-[calc(100%-1.5rem)]`, `rounded-2xl`, `p-0`, `flex flex-col`, and `lg:w-[512px]` in `className`.

### Runtime in code

- `<SheetContent>` is a `role="dialog"` with `tabindex="-1"`; `aria-labelledby` points at the title and `aria-describedby` at the description.
- The overlay and the panel are `position: fixed` at `z-index: 200` (`--ds-z-drawer`).
- The panel is a block container: its children stack with 0px between them.
- `gap-4` applies once a class adds `flex`.
- Focus lands on the first focusable element in the panel, or on the panel itself.
- Escape closes the sheet and returns focus to the trigger.
- With `modal`, a click outside the panel closes the sheet.
- With `modal`, `body` gets `overflow: hidden`, `data-scroll-locked`, and `pointer-events: none`; its other children get `aria-hidden`.
- `onInteractOutside` prevents dismissal for targets inside `.toast-area` and then calls the prop of the same name.
- `<SheetContent>` renders a `sheet-nested-portal` container; overlays opened inside the sheet portal into it.
- While a `[data-geist-modal]` is open inside the sheet, Escape closes only that modal.

### Responsive in code

- `right` and `left` panels are `w-3/4` with `sm:max-w-sm`: 75% of the viewport, capped at 384px from 401px.
- `top` and `bottom` panels span the viewport width with `inset-x-0` and hug their content.
- `<SheetHeader>` centers its text below 401px and aligns it left from 401px.
- `<SheetFooter>` stacks buttons in a reversed column below 401px.
- From 401px it is a row aligned to the end, with 8px between buttons.
- `w-[calc(100%-1.5rem)]` with `m-3` insets the panel 12px from every edge; `lg:w-[512px]` sets its width from 961px.

### Motion in code

- Opening fades the panel from opacity 0 to 1 over 200ms with `cubic-bezier(0.4, 0, 0.2, 1)`.
- `slide-in-from-*-5` resolves to an invalid offset, so only the fade runs.
- Closing slides the panel 10% of its size toward its edge and fades it out over 200ms with that curve.
- The overlay fades from opacity 0 to 0.8 over 150ms with `ease` and fades out over the same time.

### Best Practices vs code

- Best Practices say a click outside keeps the sheet open; with `modal` it closes it.
