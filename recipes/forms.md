# Recipe: forms and form controls

Form controls in the library share one rhythm: three sizes, the same set of states, a label above and an error line below. Build forms by stacking instances in an auto layout frame and setting their properties; do not rebuild a field out of rectangles and text. Which control fits which input is in `rules/choosing-components.md`; `node scripts/lookup.mjs component <name>` gives the exact properties and defaults.

## How the parts are exposed

Input and Textarea expose `Label`, `Text` and `Error` (Input also `Prefix` and `Suffix`); Select exposes `Label` and `Error` and has `prefix`, `suffix` and `placeholder` as its own properties. Set exposed parts with `geistNested(inst, '<part>', props)`:

- `Label` has `value` (the text). The label applies Title Case; set `bypassCasing: true` to keep the text as typed.
- `Text` has `type` (`placeholder`, `value`, `disabled`) and `text`. The field starts as a placeholder; to show typed text set `type: 'value'` and `text`.
- `Error` has `message`. The error line shows in the three `error` states, so set `state: 'error'` on the field and write the message.
- Checkbox and Radio put `showLabel`, `label` and `state` on a nested `Control`.
- Radio Group is its own set on the Radio page (`keys "set:Radio Group"`): place it for a list of options, and `Radio` only for a radio outside a group. It has six items; set each option text with `geistNested(group, 'Item 1', { label: 'Production' })` and hide the unused ones with `showItem3` to `showItem6`. Select the option with `checked` on the group.

## Build a form

```js
const card = await geistFrame('Create project', { gap: 16, pad: 24, radius: 12, fill: 'ds/background/100', effect: 'ds/shadow/border' });

const input = await geistInstance(await geistSet('Input'), { showLabel: true, state: 'error' });
card.appendChild(input);
input.layoutSizingHorizontal = 'FILL';
await geistNested(input, 'Label', { value: 'Project name' });
await geistNested(input, 'Text', { type: 'value', text: 'my app!' });
await geistNested(input, 'Error', { message: 'Use lowercase letters and dashes only.' });

const select = await geistInstance(await geistSet('Select'), { showLabel: true, placeholder: 'Next.js' });
card.appendChild(select);
select.layoutSizingHorizontal = 'FILL';
await geistNested(select, 'Label', { value: 'Framework' });
```

Print the helpers first (`node scripts/lookup.mjs helpers geistFrame geistSet geistInstance geistNested`) and the keys (`keys set:Input set:Select`). Append the instance to the auto layout parent first, then set `layoutSizingHorizontal = 'FILL'`.

## Layout rules

- Stack fields in a vertical auto layout with the gap on a `tailwind/space` step. The 8px between label, field and error is built into the component.
- Make fields `Fill container` for width; leave the height alone, it follows `size`. All controls in one row must use the same `size`.
- Buttons in a form are `small`, `medium` or `large` to match the field next to them; the primary action is `variant=default`, the supporting action `secondary`, destructive `error`.
- Fieldset is a card for one setting: turn on `showContent` and put the controls in its `content` slot (`geistSlot(fieldset, 'content')`; the slot stacks them with 0px between, so bind its gap to a step as `configure-components.md` says), give it a `title` and `subtitle`, and use `footerStatus` for helper text and `showActions` for the buttons (`Secondary Action`, `Primary Action` are exposed Button instances, set their `label` with `geistNested`). Turn the footer text into a link by coloring those words `ds/blue/900`.
- Error text of a field comes from the field; a Fieldset has its own `errorText` and `warningText` lines under the subtitle.
- Disable one control with its own `state=disabled` (or the `disabled` property when the component has one); do not fake it with opacity.
- Selection in groups (Radio Group, Choicebox Group, Switch) is set on the group (`checked`, `active`), not on a nested item.
