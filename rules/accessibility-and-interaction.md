# Accessibility and interaction: what to design in

Source: Vercel's Web Interface Guidelines (MIT, Vercel Labs) and the Geist component Best Practices. The Web Interface Guidelines are written for code; this file keeps the parts a designer decides in Figma and says what to hand over to a developer.

## Contents
- Targets and states
- Focus
- Color and contrast
- Forms
- Loading, empty and error
- Overlays and destructive actions
- What to put in the handoff

## Targets and states

- Visual and hit target match. If a visual target is smaller than 24px, enlarge its hit area to at least 24px; on mobile the minimum is 44px.
- Buttons and links have a hover state, and hover, active and focus show more contrast than the resting state. Use the component's `state` property for these looks; do not draw them by hand.
- A checkbox or radio and its label share one generous hit target, with no dead zones.
- Every drag, swipe or path gesture has a click or keyboard alternative.

## Focus

- Keyboard focus is always visible and never covered by sticky headers, footers or overlays. The ring styles are in `materials-and-elevation.md`.
- Group focus for compound controls: a field with a prefix and suffix is one focus unit.
- Focus moves into a modal or drawer when it opens, stays inside, and returns to the trigger on close.

## Color and contrast

- Never carry meaning by color alone: add text, an icon or a shape (a Badge with its state word, a Status Dot with its label).
- Prefer APCA over WCAG 2 for judging contrast. Check hover and focus colors too, in Light and Dark.

## Forms

- Every control has a label, visible or at least an accessible name; a placeholder is not a label. Click on the label focuses the control.
- Errors appear next to their field; on submit the first error gets focus. Do not block typing or pre-disable the submit button; show validation instead.
- Submit stays enabled until the request starts, then shows a spinner, disables and keeps its label (Button `state=loading`).
- Mobile inputs use at least 16px text so the browser does not zoom (`Input` `large` is 16px).
- Warn before leaving a form with unsaved changes. Support paste, password managers and one-time codes; never block paste.

## Loading, empty and error

- A spinner or skeleton needs a short show-delay (about 150 to 300 ms) and a minimum visible time (about 300 to 500 ms) so fast responses do not flicker.
- Skeletons mirror the final layout exactly, so nothing shifts when the content arrives.
- Design the empty, sparse, dense and error versions of a screen. Every screen has a next step or a way to recover.
- Announce async updates (toasts, inline validation) politely to assistive technology.

## Overlays and destructive actions

- A destructive action needs a confirmation or an undo window. Which overlay confirms it is in `choosing-components.md`.
- Prefer inline explanation; a tooltip is the last resort.
- A modal or drawer contains its scroll and does not scroll the page behind it.
- Navigation uses real links, not buttons. Geist code uses `Button` for actions that change state and `ButtonLink`, with the same look, for navigation; both are the `Button` set in Figma, so say which one in the handoff.

## What to put in the handoff

State these in layer names, component descriptions or notes, because Figma cannot express them:

- accessible names for icon-only buttons (`Copy deployment URL`);
- the focus order, and where focus goes when an overlay opens and closes;
- the motion: which transition, how long, and the reduced-motion version;
- keyboard shortcuts, with platform symbols (⌘ on macOS, Ctrl elsewhere).
