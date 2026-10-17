# Fieldset

Groups related form controls inside a bordered card with optional footer actions.

Best Practices: written by the author of this library from the Geist code; the site page https://vercel.com/geist/fieldset has none.

Contents: Best Practices, Figma Guidelines, Anatomy, Fieldset properties, Assembly, Layout, Tokens, Behavior in Code, Props in code, Runtime in code

## Best Practices

- Use Fieldset to group the controls of one setting inside a bordered card, with its actions in the footer: account preferences, a project transfer, an API token.
- Put the controls in `FieldsetContent` and the actions in `FieldsetFooterActions`; `FieldsetFooterStatus` carries the helper text on the left.
- Build footer buttons with `FieldsetFooterAction`, which renders a small `Button`: `variant="secondary"` for the supporting action, the default variant for the primary one.
- Use `type="error"` for a failed state and `type="warning"` for a state that needs action; both recolor the border and the footer. Leave `type` off for everything else.
- Show a message for one field with `ErrorText` or `WarningText` under the subtitle; reserve `type` for the whole Fieldset.
- Block a section with `disabled` on `FieldsetContent` and explain why in the footer: `You need additional permissions to transfer projects.`
- Omit the footer for read-only content; the card then ends at the 20px bottom padding of the content.
- Stack Fieldsets 24px apart (`gap-6`), one per concern.
- `FieldsetTitle` renders an `h4` and `FieldsetFooter` a `footer`. Pass `id` to `FieldsetTitle` to link to the section.

## Figma Guidelines

### Anatomy

- `Fieldset` — `<Fieldset>`: `Fieldset Content`, then `Fieldset Footer`.
- `Fieldset Content` — `<FieldsetContent>`: `Fieldset Title` (`<FieldsetTitle>`), `Fieldset Subtitle` (`<FieldsetSubtitle>`), the `content` slot, then the optional slots.
- The `content` slot — the `children` of `FieldsetContent`: form controls and any other content.
- `Error Text Slot` — `<ErrorText>`; `Warning Text Slot` — `<WarningText>`.
- `Fieldset Footer` — `<FieldsetFooter>`: `Fieldset Footer Status` (`<FieldsetFooterStatus>`) and `Fieldset Footer Actions` (`<FieldsetFooterActions>`).
- `Secondary Action` and `Primary Action` — `Button` instances, the `<FieldsetFooterAction>` of code, always `size="small"`.

### Fieldset properties

- `type` — `default`, `error`, or `warning`.
- `showTitle` and `title` — the `FieldsetTitle`.
- `showSubtitle` and `subtitle` — the `FieldsetSubtitle`.
- `showContent` and `content` — the slot for the controls, `children` in code.
- `showErrorText` and `errorText` — the `ErrorText` line.
- `showWarningText` and `warningText` — the `WarningText` line.
- `showFooter` and `footerStatus` — the `FieldsetFooter` and its status text.
- `showActions` — the `FieldsetFooterActions`.
- `showSecondary` and `showPrimary` — the two buttons of `FieldsetFooterActions`.
- `Secondary Action` and `Primary Action` are exposed on the instance, with their `label`.
- Every block in `Fieldset Content` ends with 20px of bottom padding, so blocks shown together add up.
- The set keeps 8px under the title when `showSubtitle` is off.

### Assembly

- Set the instance to `Fill container`.
- Put the controls of the setting in the `content` slot, or turn off `showContent`.
- Set `label` on the exposed `Secondary Action` and `Primary Action`.
- Turn a button off with `showSecondary` or `showPrimary`.
- For a footer with text only, turn off `showActions` and keep `footerStatus`.
- For a link in `footerStatus`, set its words to `ds/blue/900`.

### Layout

- The card has a 6px radius and a 1px shadow border.
- The card clips its content.
- `Fieldset Content` has 20px of padding at the top and sides.
- `Fieldset Title` is 20px/26px SemiBold.
- `Fieldset Subtitle` is 14px/20px, 8px below the title.
- The subtitle ends with 20px of space.
- `ErrorText` and `WarningText` sit 16px below the controls.
- The last child ends with the 20px bottom padding of `FieldsetContent`.
- `Fieldset Footer` is at least 56px high, the 1px top border included.
- `Fieldset Footer` has 12px of padding above, right, and below, and 20px on the left.
- With a 32px button the footer is 57px high.
- A long `footerStatus` wraps and the footer grows.
- The status text and the buttons are centered on each other.
- The buttons sit at the right end of the footer.
- The two footer buttons sit 16px apart.
- Borders count in the size, as with `box-sizing: border-box`.
- `error` and `warning` add a 1px border on each side.

### Tokens

- `Fieldset` — fill `ds/background/100`, effect `ds/shadow/border`, radius `tailwind/radius/md`.
- `error` and `warning` — a 1px border of `ds/red/400` or `ds/amber/400` in place of the effect.
- `Fieldset Footer` — fill `ds/background/200`, top border `ds/gray/400`, text `ds/gray/900`.
- `error` footer — fill `ds/red/100`, border `ds/red/400`, text `ds/red/900`; `warning` takes the same steps of `ds/amber`.
- `Fieldset Title` — `Heading/20` in `ds/gray/1000`.
- `Fieldset Subtitle` — `Copy/14` in `ds/gray/900`.
- `Error Text` — Regular 16px in `ds/red/900`; `Warning Text` — Regular 16px in `ds/amber/900`.
- Link in `footerStatus` uses `ds/blue/900` (`variant="highlight"`); a plain `Link` uses `ds/blue/700`.

## Behavior in Code

### Props in code

- `FieldsetFooterActions` takes any number of `FieldsetFooterAction`.
- `Fieldset` also takes `disabled`, `highlight`, `hasShadow`, and `borderlessTabs`.
- `highlight` draws a 2px `blue-500` ring and `hasShadow` adds `shadow-large`.
- `FieldsetContent` takes `noBottomPadding` and `FieldsetFooter` takes `highlight`.
- `FieldsetFooterAction` takes `loading` and `disabled`.
- Only the last child of `FieldsetContent` ends with the 20px bottom padding.
- The title sits flush above the content when the subtitle is omitted.
- `Fieldset` fills the width of its container; the card uses `material-base` and `overflow-hidden`.
- `FieldsetContent` uses `p-5`, the subtitle `pt-2` and `pb-5`, and the error and warning text `mt-4`.
- `FieldsetFooter` uses `min-h-14`, `items-center`, and `ml-auto` for the buttons, each with `mx-2`.
- A `<Link variant="highlight">` underlines on hover.

### Runtime in code

- `disabled` on `FieldsetContent` puts an invisible overlay (`position: absolute; inset: 0`, `cursor: not-allowed`) over the content.
- `disabled` on `FieldsetContent` turns the text of the content `gray-700`.
