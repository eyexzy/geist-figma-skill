# Recipe: place and configure a component

Use this whenever you put a library component on the canvas or change one. The goal is an instance that behaves like the original: set through its properties, never by pulling it apart.

## 1. Find the component and read its properties

```
node scripts/lookup.mjs find <what the user wants, in plain words>
node scripts/lookup.mjs component <slug>
```

`component` lists every set, its default variant and every property with its type, default and allowed values; `brief <slug>` adds when to use the component, its Content rules and its Assembly. Treat the property list as the only truth: a property that is not in it does not exist, and a value that is not listed is invalid. Sets whose name starts with `_` are helper blocks of a bigger component; place the public set instead.

## 2. Create the instance from the default variant

The default variant of a set is the one in the top-left corner of the canvas, and `set.defaultVariant` returns it. The layer order inside a set is different, so do not take `set.children[0]`. `geistInstance(await geistSet('<Set>'), props)` does this and applies the properties by name. Print the helpers with `node scripts/lookup.mjs helpers geistSet geistInstance` and the set reference with `keys set:<Set>`.

## 3. Set properties by name

| Property type | What to set | Example |
|---|---|---|
| variant (`variant`, `size`, `state`, `shape`...) | one of the listed options | `{ size: 'large' }` |
| boolean (`showPrefix`, `showLabel`...) | `true` or `false`; it shows or hides a layer | `{ showPrefix: true }` |
| text (`label`, `title`...) | a string | `{ label: 'Delete Project' }` |
| instance swap (`prefix`, `suffix`, `icon` of Button) | an icon name | `{ prefix: 'Trash' }` |
| slot (`children`, `content`, `rows`, `cells`...) | drop layers into the slot | see below |

Two things to know:

- A `showX` toggle only shows the layer. The content of the layer changes through its own property (`showPrefix` shows the slot, `prefix` swaps the icon).
- Boolean, text and swap keys carry an id suffix (`showPrefix#51:0`); variant keys do not. Node ids, keys and these suffixes differ in a copy of the library, so resolve everything by name: `geistSetProps` matches by the name before `#`.

## 4. Slots

A slot is an area that accepts any layers (Modal body, Menu rows, Table cells, Collapse content, the `content` of a Fieldset). Find it with `geistSlot(inst, 'content')` (the names are `children`, `content`, `rows`, `cells`) and drop layers into it with `slot.appendChild(layer)`. Then use `Fill container` for a layer that must span the slot. `guide <slug> Assembly` says what the default content of a slot is and what to do with it.

- Spacing: the gap of a slot is yours to set, and its default differs between components (`guide <slug> Assembly` says). Bind its `itemSpacing` to a step, `geistNumber(slot, 'itemSpacing', 'tailwind/space/16')`. It is a layout property of the area, not a variant property of the component.
- Text: a text layer you drop into a slot is your own layer, black and without a style until you give it both. Create it with `geistText(slot, 'marketing-site', { style: 'Copy/14' })`, which applies the text style and binds the color. `scripts/figma/audit.js` reports a text layer without a style.
- Hidden parts: the helpers turn off `figma.skipInvisibleInstanceChildren`, so the parts an instance hides while it is closed (the list of a menu, the panel of an overlay) can be found. Without it, `exposedInstances` and `findOne` return nothing for them.

## 5. Sizing and states

- Resize an instance for width only unless the guidelines say otherwise; height follows `size`. Where the card says "set the instance to `Fill container`", do that after you append the instance to an auto layout parent.
- Stack controls in an auto layout and make them `Fill container` for width. Controls that share a row must share a `size`: their heights are in `rules/spacing-and-layout.md`.
- `state` shows a state in the design (`hover`, `active`, `disabled`, `loading`...). On a normal screen leave it at `default`: hover is already wired as a prototype reaction on the `default` variant. Use `state=disabled`, `loading` or `error` when the screen has to show that situation. Some components expose `disabled` or `errored` as their own property; use that instead. Do not fake a state with opacity.

## 6. Things that go wrong

- **An override outlives the group value.** In groups (Radio Group, Tabs, Collapse Group, Choicebox Group) the selected item is chosen with the group property (`checked`, `active`, `expanded`). A `checked` or `active` override on a nested item survives later changes and leaves two items selected. Set the selection on the group only.
- **Hidden items keep their numbers.** `checked=4` with item 4 hidden selects a hidden item.
- **Editing text flattens styling.** Changing a text property of a component whose text has bold or linked words resets the range styles; reapply the bold or the link color afterwards (the card says which).
- **Do not detach** an instance or restyle its inner layers by hand. If the library lacks a variant, say so and propose the closest one.
- **Nested instances are exposed.** Many components expose nested parts (`Label`, `Error`, `Action`, `Trigger`, `Menu`) so their properties appear on the instance; `component <slug>` lists them. Set them with `geistNested(inst, '<part>', props)`, for example `await geistNested(input, 'Label', { value: 'Project name' })`.- **Overlays and tooltips are not normal layout children.** See `interactive-overlays.md`.

## 7. Verify

Take a screenshot of the result (`await node.screenshot()` in the same script) and compare it with the intent. Return the ids of everything you created.
