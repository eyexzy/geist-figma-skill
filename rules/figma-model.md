# How the work goes wrong: models of Figma and the library

Source: the Figma Plugin API documentation, the library file, and probes in the library file and in Present. These are models of how Figma and the library behave. Use them to work out what can go wrong in your job, not as a list of cases: a case you have not seen is a combination of the same few mechanisms.

## Contents
- States and transitions
- Layer order, clipping and open geometry
- Geometry and the pixel grid
- Bindings and modes
- Reactive layers inside reactive layers
- Instances and overrides
- Reading back and looking

## States and transitions

Every interactive layer is a small state machine. The states of a component are its variants (`state`, `active`, `open`), a reaction is a transition between them, and a variable that opens an overlay is a boolean state with something that sets it to true and something that sets it to false.

- `While hovering` (`ON_HOVER`) returns a layer to rest by itself only for a change that the hover made. A hover state entered by a click or a timer stays after the pointer leaves. `MOUSE_ENTER` and `MOUSE_LEAVE` as a pair avoid this.
- The content of a slot is not rebuilt when its parent changes variant, so a layer in a slot that was hovered when it was hidden can appear hovered when it is shown again.
- Reactions set on an instance replace the reactions of its component. A click set on a Button removes the hover that the Button had.

Ask: what are all the states of every interactive layer, what moves it out of each, and can any layer be left in a state that only a pointer event on a hidden layer would undo?

Check: the audit reports `never-closes`, `never-opens`, `variable-not-read`, `hover-lost`, `duplicate-hover` and `stuck-hover`.

## Layer order, clipping and open geometry

Later siblings draw over earlier ones, and canvas stacking reverses this inside an auto layout. Clip content cuts everything outside the frame, effects and rings included. An overlay that a variable hides still has its open size and position, so you can measure where it opens before anyone sees it.

- An overlay opens in the direction its component sets (a `position` or `side` property, or the constraint of the instance). Nothing checks that the direction fits the screen.
- A frame that carries a material border (`ds/shadow/border` and its relatives) draws that border only while its Clip content is on, so such a frame needs padding of at least 4px.
- For an overlay to draw over the layers below it, every layout between the overlay and that content needs canvas stacking `First on top`; for one that opens upward, `Last on top`.

Ask: where does each overlay open, how large is it, what is there, does it fit the frame, what draws over it and what clips it?

Check: `overlay-outside-screen`, `overlay-covered`, `overlay-clipped`, `overlay-placement`, `clip-cut`, `clip-ring` and `material-clip`.

## Geometry and the pixel grid

A centered element sits at `(parent - child) / 2`. When the two sizes differ in parity the position ends in .5, and everything inside inherits it. Borders and 1px shadows on a half pixel blur or merge. An inner 1px stroke changes the usable width by one and with it the parity.

- Percentage-based parts (a Progress bar) give fractional widths when their container is not a multiple of the step.
- `resize()` sets fixed sizing, so set the sizing modes after it.
- In the file's tests `createInstance()` returned an instance positioned absolutely; after placing one in an auto layout read `layoutPositioning` before you set Fill or Hug.

Ask: which sizes are odd, what is centered in what, where does a fraction come from?

Check: `half-pixel`, `spacing-fraction`, `text-collapsed`.

## Bindings and modes

A bound value resolves in the mode of the layer that uses it. The mode comes from the nearest ancestor that sets one, and a frame that sets none shows the default mode: Dark for `DS / Core Colors`. A variable is shared by everything bound to it.

- A clone keeps the mode of the original, and the clone made for the other theme is wired to the same prototype variables as the original.
- Recoloring a part inside an instance turns an inherited value into an override that survives later changes of the variant.

Ask: which mode does each frame show, which variables does more than one thing read, what changes when I switch the mode?

Check: the `theme` line, `unbound-fill`, `unbound-stroke`, `text-color-role`, `low-contrast`, `legacy-token` and `shared-variable`.

## Reactive layers inside reactive layers

When a layer that reacts contains another that reacts, their states interact. A change of the variant of the outer layer can reset what is inside it, and both hovers can fire at once.

- A click on a nested button that changes the variant of its parent resets the hover of that button.
- A hover reaction on a layer and the hover reactions of the items of an overlay inside it conflict: after the pointer leaves, the items stay in hover (checked in Present with a table row and a menu inside it).

Ask: for every pair of an outer and an inner reactive layer, what happens to the inner one when the outer one changes state, and the other way round? Can I force each combination and look at it?

Check: `hover-in-hover`.

## Instances and overrides

An instance inherits everything from its component. What you change becomes an override. Properties are the supported way to change an instance, and a part restyled by hand is a deviation from the library.

- A nested instance does not change size through the API: `resize()` returns without an error and nothing changes, so read the size back.
- Parts that an instance hides are invisible to a script unless `figma.skipInvisibleInstanceChildren` is `false`.
- Text properties start at the component defaults (`Label`, `Value`), and a text edit needs its font loaded.

Ask: am I changing a property or a part, and did the value I set arrive?

Check: `restyled-instance`, `default-copy`, `detached`, `lookalike` and `layer-opacity`.

## Reading back and looking

Code that ran without an error did not necessarily do what it says, and a screenshot shows one state at one moment. A failed `use_figma` call changes nothing. Read each value you set back from the node, with a fresh id, and look at every state you listed. The audit cannot hover or click, so list what only a pointer can test for the user, with the exact interaction.
