# Note

Display text that requires attention or provides additional information.

Source of the Best Practices: https://vercel.com/geist/note

Contents: Best Practices, When to use, Behavior, Content, Figma Guidelines, Anatomy, Note properties, Assembly, Layout, Tokens, Behavior in Code, Props in code, Runtime in code, Responsive in code

## Best Practices

### When to use

- Use a Note for inline contextual feedback next to the field, card, or section it describes: a region change warning above a region picker, a rate-limit notice next to a usage gauge.
- Pick **Banner** when the message is page-level or system-wide and needs a CTA, **Toast** for transient acknowledgments, **Modal** for destructive confirmations.
- Choose `variant` by meaning: `error` for a problem the user must fix, `warning` for a consequence to acknowledge, `success` for a passed check, `secondary` for neutral information.

### Behavior

- A Note is persistent until the underlying state changes; don’t add an ad hoc dismiss control because it competes with the message.
- One Note per concept. Stacking three Notes on a card means the page architecture, not the Note copy, is wrong.
- The optional `NoteAction` holds a single inline CTA. Don’t pair it with a second button.

### Content

- `NoteLabel` is a 1–2 word Title Case prefix that names the topic: `Region Change`, `Rate Limit`, `Plan Limit`. Cut hedges like `Heads Up`, `FYI`, and `Note`.
- `NoteContent` is one sentence in active voice that names the impact: `Changing this region restarts all functions.`
- No `variant="info"` exists; omit `variant` for the default info icon or use `variant="secondary"` for neutral copy.
- Single-fragment labels take no period; full descriptive sentences in the body do.

## Figma Guidelines

### Anatomy

- `Note` — `<Note>`: `Note Body` holds `Note Icon`, `Note Custom Icon`, and `Note Content Group`; `Note Action` sits beside it.
- `Note Content` — `<NoteContent>`, the text; `Note Content Group` stacks the body children 8px apart.
- `Note Action` — `<NoteAction>`: a `Button` instance, the `<Button size="small">` of code.

### Note properties

- `variant` — `default`, `secondary`, `success`, `error`, `warning`, `violet`, or `cyan`. `violet` and `cyan` use the `purple` and `teal` steps.
- `disabled` — `false` or `true`. It replaces the border, text, and fill of any `variant` and keeps the variant’s icon.
- `size` — `medium` or `small`.
- `fill` — `true` tints the note and `false` leaves it outlined. Under `disabled` both look the same.
- `showButton` — shows `Note Action`, the `NoteAction` of code, at both sizes.
- `showIcon` — the variant’s icon; `icon={null}` in code turns it off.
- `showCustomIcon` and `icon` — a custom 16px icon in the variant’s color, `icon={<Icon />}` in code.
- `content` — the text, the `NoteContent` of code.
- The icon follows `variant`: `CheckCircle` for `success`, `Stop` for `error`, `Warning` for `warning`, else `Information`; all 14px.
- `Action` is exposed on the instance, with its `label`.

### Assembly

- Set the instance to `Fill container`. Long text wraps and the note grows, with `Note Action` centered.
- For a custom icon, turn on `showCustomIcon`, pick it in `icon`, and turn off `showIcon`. It stays when `variant` changes.
- For a `NoteLabel`, set the first words of `content` to SemiBold.
- Set link words in `content` to Medium in the link color from Tokens.
- Set `label` on the exposed `Action` for the call to action; `disabled` switches it to its disabled state.

### Layout

- `medium` — 36px high: a 1px border, then 6px above and below and 12px at the sides, text 14px/20px.
- `small` — 32px high: a 1px border, then 6px above and below and 8px at the sides, text 13px/18px.
- The border counts in the size, as with `box-sizing: border-box`: strokes are included in the layout.
- Icon and text sit 12px apart. The icon sits centered on the first line, in a box as high as the line.
- With `Note Action` the radius is 10px instead of 6px, and the right padding is 8px.
- With a button the note is 46px high: a 32px button, 6px above and below, and the two 1px borders.

### Tokens

- `default` — border `ds/gray/400`, text `ds/gray/900`; filled with `ds/gray/100` and a `ds/gray/100` border.
- `secondary` — border `ds/gray/alpha/400`, text `ds/gray/alpha/900`; filled with `ds/gray/alpha/200` and a transparent border.
- `success`, `error`, `warning`, `violet`, `cyan` — border step 400 and text step 900 of `ds/blue`, `ds/red`, `ds/amber`, `ds/purple`, `ds/teal`.
- Filled, these variants use step 200 with a step 100 border.
- `disabled` — border `ds/gray/alpha/200`, text and icon `ds/gray/700`, transparent fill.
- Links in `NoteContent` are Medium.
- Link color: `ds/gray/1000` in `secondary`, `ds/blue/700` in `default`, step 1000 of the variant color elsewhere.
- Inline `code` in the colored variants: fill step 300, border step 400, text step 1000 of the variant color.
- Text `Copy/14` at `medium` and `Copy/13` at `small`; radius `tailwind/radius/md`, and `tailwind/radius/10` with the button.

## Behavior in Code

### Props in code

- `variant` defaults to `default`, `size` to `medium`, and `fill` to `false`.
- `icon` takes any node; the default icon follows `variant`, and `icon={null}` hides it.
- `<NoteAction>` children sit after the body; `<Note>` detects them by element type.
- `<NoteLabel>` is a separate `span` export with `mr-1`, `font-semibold` and `whitespace-nowrap`.

### Runtime in code

- The root is a `div` with `role="note"` and `data-slot="note"`.
- The `data-slot` values `note-body`, `note-icon`, `note-content`, `note-label` and `note-action` mark the parts.
- In a `disabled` note each `<button>` gets `pointer-events-none`, a `gray-100` fill, a `gray-alpha-400` border and `gray-700` text.
- The body fills the root with `gap-3` between icon and text and `gap-2` between children.

### Responsive in code

- Under 601px `<NoteAction>` spans the full width and its children share the row.
- With an action the root gets `max-md:py-3` under 601px.
