# Recipe: things that open and close (overlays, menus, tooltips, toasts)

Overlay components are made to be clicked through in a prototype. A boolean variable says "open", the overlay is shown by it, and reactions on the trigger and on the closing parts flip it. Each overlay on the screen gets its own variable: the library variables (`state/modal/open` and the others) are shared by every instance wired to them, so two overlays on one of them open together.

Read the component card for the details of one component (`node scripts/lookup.mjs guide <slug> Assembly`, `example <slug>`). This page gives the procedure and the numbers.

## Contents
- One overlay: Modal, Destructive Action Modal, Drawer, Sheet, Command Menu, Menu
- Which component, which variable, where it goes
- Built-in menus used several times: Dots Menu in table rows
- Absolute overlays: tooltip, context card, relative time card
- Canvas stacking for menus that open downward
- A menu inside a Table cell
- Show the open state on the canvas
- Toast
- Command Menu items
- Checks

## One overlay: Modal, Destructive Action Modal, Drawer, Sheet, Command Menu, Menu

Print the helpers first: `node scripts/lookup.mjs helpers geistBoolean geistSetProps geistBindProp geistBindVisible geistRewireReactions geistOnClickSet geistSet geistInstance`.

1. Create one boolean for this overlay in a collection of yours: `await geistBoolean('modal/delete-project/open', 'Prototyping / My prototype')`. Name it after the overlay, not after the component.
2. Rewire what the library put inside the instance, while it is open. The reactions live in the open variant only: the Modal master sets `state/modal/open` to `false` from the Backdrop and the Secondary Action and to `true` from the Panel (a click inside must not close it), and the closed variant has none of them. Set the open property first (`geistSetProps(modal, { active: 'true' })`), then move every reaction in one call: `await geistRewireReactions(modal, 'state/modal/open', 'modal/delete-project/open', 'Prototyping / Modal', 'Prototyping / My prototype')`. It returns the number of layers it changed: 3 for a Modal. In the same reactions the master also switches the instance to the closed variant (Change to); the helper drops that action, because the bound variable switches the variant, as in the Modal Examples. Use the variable of the component from the table below. The overrides stay with the instance when it switches between closed and open.
3. Bind the overlay to your variable: `geistBindProp(inst, 'active' | 'show' | 'open', name)` for a Modal, Drawer, Sheet or Command Menu; `geistBindVisible(menu, name)` for a Menu next to your own trigger. The instance now starts closed. Switching the variant replaces the layers inside the instance and their ids, so find nested layers again by name after `geistSetProps` or `geistBindProp`; a reference to a layer inside the overlay taken before the call throws "node does not exist" and the whole script rolls back, so set everything inside the overlay first and bind last.
4. Open it from the trigger. If the trigger component has no click reaction of its own (a Button), put On click on a frame around it: the click on the component reaches the frame. A component whose variants react to click (Input, in its hover and active states; `motion <slug>` lists the reactions of a component) takes the click itself, and a frame around it never receives it: draw an absolute layer of the same size above the component and put On click on that layer. Neither the frame nor the hit layer needs a fill. Do not put On click on a Button itself: a reaction set on the Button overrides the reactions of its master and the hover look is lost. `await geistOnClickSet(triggerFrame, name, true)`; for a menu use `'toggle'`, so the same click opens and closes it.
5. Close it from the parts that should close: the buttons you add inside the overlay and every enabled menu row, `await geistOnClickSet(button, name, false)`. In a Modal the footer buttons are the exposed `Primary Action` and `Secondary Action`.
6. When the trigger is a part you cannot wrap (the `Primary Action` of a Fieldset), set the click on that part with `geistOnClickSet`, which keeps its other reactions, and read `reactions` afterwards: the hover reaction must still be there.

```js
const modal = await geistInstance(await geistSet('Modal'), { /* title and content as the card says */ });
screen.appendChild(modal);                                   // last child: it draws over the content
modal.layoutPositioning = 'ABSOLUTE';
modal.resize(screen.width, screen.height);
await geistBoolean('modal/delete-project/open', 'Prototyping / My prototype');
await geistSetProps(modal, { active: 'true' });               // the reactions to rewire exist only in the open variant
await geistRewireReactions(modal, 'state/modal/open', 'modal/delete-project/open', 'Prototyping / Modal', 'Prototyping / My prototype');
await geistBindProp(modal, 'active', 'modal/delete-project/open');   // now closed, opened by the variable
await geistOnClickSet(deleteTriggerFrame, 'modal/delete-project/open', true);
```

A trigger that handles clicks itself (an Input that opens a Command Menu) gets a hit layer above it, in the frame that holds it:

```js
const hit = await geistFrame('Search hit', { parent: wrapper });   // wrapper: the auto layout frame around the Input
hit.layoutPositioning = 'ABSOLUTE';
hit.x = 0; hit.y = 0;
hit.resize(wrapper.width, wrapper.height);
await geistOnClickSet(hit, 'command-menu/open', true);
```

The body of a Modal goes into the `children` slot of its `Panel`, not into the outer `children` slot of the Modal, which holds the Panel itself: `geistSlot(modal.findOne(n => n.name === 'Panel'), 'children')`. The `title` and `subtitle` are properties of the `Panel` instance (`geistSetProps(panel, { title })`), and the labels of the footer buttons are set on the exposed `Primary Action` and `Secondary Action`.

A Destructive Action Modal is a Modal with a phrase field, and its Submit stays `disabled` until the phrase matches. A prototype cannot take typing, so show the confirmation with the phrase filled in and Submit enabled, or keep Submit disabled and say so.

## Which component, which variable, where it goes

| Component | Property or layer bound to your variable | Variable the master is wired to (rewire it) | Placement |
|---|---|---|---|
| Modal | `active` | `state/modal/open` (`Prototyping / Modal`) | resize the instance to the screen; the panel stays centered |
| Destructive Action Modal | `active` of its Modal instance | `state/modal/open` | same as Modal |
| Drawer | `show` | `state/drawer/open` | resize to the screen; the panel sits at the bottom |
| Sheet | `open` | `state/sheet/open` | resize to the screen; `side` picks the edge (set `side` before editing the slot) |
| Command Menu | `open` | `state/command-menu/open` | resize to the screen; the panel is centered 135px from the top |
| Menu (own trigger) | `visible` of the Menu | none | 10px below the trigger, left edges flush |
| Tooltip | `visible` | none | absolute child, 10px from the trigger |
| Context Card | `visible` | none | absolute child, 14px (top, left) or 16px (bottom, right) from the trigger |
| Relative Time Card | `visible` | none | absolute child, same gaps as Context Card |
| Toast | `visible` of the instance; Toasts also uses modes of `Prototyping / Toasts` | none; modes `111`, `110`, `100`... | pinned `Right` and `Bottom`, 24px from each edge, last in the screen frame |
| Dots Menu | built in | `state/menu/open` (`Prototyping / Dots Menu`) | menu 10px from the trigger, right edges flush |
| Split Button | built in | `state/menu/open` (`Prototyping / Split Button`) | chevron half opens the menu; `menuAlignment` picks the side |
| Combobox | built in | `state/list/open`, `input/value`, `input/field-state`, `input/has-value`, `item/N/highlight`, `item/N/selected` | the list is hidden until `state/list/open` is `true` |
| Multi Select | built in | `state/menu/open`, `item/N/selected`, `selection/*`, `trigger/label` (`Prototyping / Multi Select`) | `position` top or bottom; set `selection/row-count` after adding rows |
| Calendar | built in | `state/calendar/open`, `state/presets/open` | one calendar per prototype screen |
| Feedback | built in | `state/feedback/open` | `side=top` near the bottom edge of the screen |

"Built in" means the component is wired to its variable inside, trigger included, so one instance on a screen works without any setup. A library variable cannot be edited in a file that uses the library: a value such as `selection/row-count` of Multi Select stays at its default there. For another value create your own variables and point the reactions at them: `geistRewireReactions` moves the wiring of one variable. Add only what its guidelines ask for, such as a click that sets the variable to `false` on each `_Menu Item` you drop into a Dots Menu or a Split Button. `state/menu/open` exists in three collections, so pass the collection: `geistOnClickSet(item, 'state/menu/open', false, 'Prototyping / Dots Menu')`. Find a variable name with `node scripts/lookup.mjs token <words>`.

In a file that uses the published library, the variables of the `Prototyping / <Component>` collections are library variables and `geistVar` imports them by name. If binding or setting a library variable is refused in your file, use your own boolean and rewire to it.

## Built-in menus used several times: Dots Menu in table rows

Every Dots Menu is wired to the same `state/menu/open`, so every Dots Menu on the screen opens at once. Give each row its own variable: rewire the trigger and bind to it the two layers the master shows from the variable, the `Open Background` rectangle and the `Menu` instance (both are hidden while closed).

```js
await geistBoolean('orders/row-1/menu/open', 'Prototyping / Orders');
const bg = dotsMenu.findOne(n => n.name === 'Open Background');
const menu = dotsMenu.findOne(n => n.name === 'Menu');
await geistBindVisible(bg, 'orders/row-1/menu/open', 'Prototyping / Orders');
await geistBindVisible(menu, 'orders/row-1/menu/open', 'Prototyping / Orders');
await geistRewireReactions(dotsMenu, 'state/menu/open', 'orders/row-1/menu/open', 'Prototyping / Dots Menu', 'Prototyping / Orders');
```

The Trigger of a Dots Menu flips the variable (the NOT of itself); `geistRewireReactions` keeps that expression and points it at the new variable. Add `geistOnClickSet(menuItem, 'orders/row-1/menu/open', false, 'Prototyping / Orders')` to each `_Menu Item` so a pick closes the list. Repeat per row.

## Absolute overlays: tooltip, context card, relative time card

- Make the instance an absolute child of the frame that contains the trigger (layout positioning `ABSOLUTE`), and put it last in that frame so it overlays the layout.
- Set the canvas stacking of that frame to `Last on top` (`itemReverseZIndex = false`), so the overlay draws over its neighbours.
- A tooltip keeps 10px between trigger and body for every position. A context card and a relative time card keep 14px for `top` and `left` and 16px for `bottom` and `right`; the tip lies inside that gap.
- The overlay does not follow the layout around the trigger. Move it together with the trigger.
- Give each overlay its own boolean variable.
- Size the host frame for the open overlay: read `width` and `height` of the placed instance and leave room on the side it opens to, otherwise the card sticks out of the screen. A relative time card is wider than most triggers.
- Hover-driven layers use `geistOnHoverShow(trigger, varName)`: hovering sets the variable to `true`, leaving sets it to `false`. Put the reactions on the trigger, or on a frame around it. If the trigger already has a hover reaction (a Button has one), the helper adds the variable action to that same reaction, as the guidelines ask.

Example: a tooltip under a button, 10px away, shown only while hovering.

```js
// helpers and keys pasted above; `host` is the frame that contains the button
const button = await figma.getNodeByIdAsync(BUTTON_ID);              // or your own instance
const tip = await geistInstance(await geistSet('Tooltip'), { position: 'bottom', label: 'Saves your changes' });
host.appendChild(tip);                                               // last child, so it draws on top
tip.layoutPositioning = 'ABSOLUTE';                                  // only if host has auto layout
tip.x = button.x; tip.y = button.y + button.height + 10;             // 10px between trigger and body
host.itemReverseZIndex = false;                                      // canvas stacking: Last on top
await geistBoolean('tooltip/save/visible', 'Prototyping / My prototype');
await geistBindVisible(tip, 'tooltip/save/visible');
await geistOnHoverShow(button, 'tooltip/save/visible');
```

The tooltip is not centered under the button by this code; set `x` to `button.x + (button.width - tip.width) / 2` for `boxAlign=center`. The real component fades in after a 400 ms delay; a prototype shows it instantly.

## Canvas stacking for menus that open downward

Figma draws later siblings over earlier ones. An overlay that opens downward (Calendar panel, Multi Select menu, Feedback with `side=bottom`, a relative time card with `bottom`) lands under the next section unless every auto layout between the overlay and the content below it has canvas stacking `First on top` (`itemReverseZIndex = true`). An overlay that opens upward (`side=top`, a `top` card) needs `Last on top` on the layouts between it and the content above it.

## A menu inside a Table cell

A Dots Menu or a Menu in a cell opens over the rows below it, and the Table works against that in two ways.

- The Table clips its content: the root of the `Table` component and `Table Body` have Clip content on, and the guidelines add that other content is clipped. Turn Clip content off on the `Table` instance and on its `Table Body`, and on the `content` layer of the cell that holds the menu; Figma allows it on layers inside an instance. Without it the menu is cut at the cell.
- Later layers draw over earlier ones, and three of them cover a menu that opens down: the `Border` of its own row, which comes after the `Row` frame inside the `_Table Row` instance; the next rows in the `rows` slot; and the `Table Footer`, which comes after `Table Body` in the inner `Table` frame. Set canvas stacking `First on top` (`itemReverseZIndex = true`) on the row instance that holds the menu, the `rows` slot, the inner `Table` frame, the `Table` instance and every frame between the Table and the screen. Leave the inner `Row` frame of the row on `Last on top`: its `Hover` and `Stripe` layers sit under the cells, and `First on top` there draws them over the cells, so a hovered row shows an empty band.
- A cell grows with its content (`guide table Assembly`), so check the row height after the Dots Menu is in.

## Show the open state on the canvas

A prototype variable shows one state at a time, and the library collections have a single mode, which you cannot change. To lay the open state out as a frame (for review or a screenshot), keep the variable in a collection of yours with two modes and set the mode on a clone of the screen.

```js
const col = figma.variables.createVariableCollection('Prototyping / Orders');
col.renameMode(col.modes[0].modeId, 'Closed');
const openId = col.addMode('Open');
const v = figma.variables.createVariable('orders/row-1/menu/open', col, 'BOOLEAN');
v.setValueForMode(col.modes[0].modeId, false);
v.setValueForMode(openId, true);
// bind the overlay to v, clone the screen, then:
clone.setExplicitVariableModeForCollection(col, openId);
```

## Toast

- Place `Toasts` in the screen frame, not inside the trigger. Pin it to `Right` and `Bottom`, 24px from each edge (`<Toasts center>` is centered horizontally); in a scrolling screen turn on "Fix position when scrolling".
- Use `Toast` for one message on a static layout and `Toasts` for the stack that a prototype shows and dismisses.
- Hide it at the start with a boolean variable bound to the instance `Visible`, `false` at first. The trigger click sets it to `true`. For the stack the same click also sets the variable mode of `Prototyping / Toasts` to `111` (three toasts), or `100` (one), as a second action.
- Each button in a toast closes through a mode switch that drops that toast.
- To dismiss after a delay, show the toast on a copy of the screen: the trigger navigates to the copy, and the copy runs `After delay` 3500 ms and navigates back to the original.

## Command Menu items

Create a string variable per item with `geistString` (`default`, and `selected` for the first item) and bind `state` of the item to it. On hover of an item set its own variable to `selected` and the others to `default`; add the same reset to the click that closes the menu. Setting `open=false` directly on an item keeps it hovered after the menu closes, so close it by setting the variable.

```js
await item.setReactionsAsync([{ trigger: { type: 'ON_HOVER' }, actions: [
  await geistSetVarAction('cmd/item-1', 'selected'),
  await geistSetVarAction('cmd/item-2', 'default'),
] }]);
```

## Checks

- Present the prototype and click through: open, close with the backdrop, close with an item, open a second time.
- If two instances open together, they share a variable: rewire one of them.
- If an overlay appears under other content, fix canvas stacking and Clip content (above, and `rules/materials-and-elevation.md`, Clipping).
- If the trigger Button lost its hover look, its click reaction replaced the one of its master: move the click to a frame around it.
- If a click on the trigger does nothing, the trigger component may handle clicks itself (Input, Select, Toggle...): move the click to an absolute hit layer above it.
