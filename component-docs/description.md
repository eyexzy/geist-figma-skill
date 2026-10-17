# Description

Displays a brief heading and subheading to communicate any additional information or context a user needs to continue.

Source of the Best Practices: https://vercel.com/geist/description

Contents: Best Practices, Figma Guidelines, Anatomy, Description properties, Layout, Assembly, Tokens, Behavior in Code, Props in code, Runtime in code

## Best Practices

- Use `<Description>` for definition-list metadata: a short Title Case key paired with a single value (`Last Deployed`, `Region`, `Plan`). For inline help under a form field, use the input’s helper-text slot instead.
- Geist renders `<dl>/<dt>/<dd>` so screen readers announce each key/value pair as a definition. Don’t wrap the component in extra paragraphs that break the list semantics.
- Title slot is Title Case noun (`Last Deployed`, `Build Duration`); content is sentence case unless the value is a literal identifier, ID, or timestamp that should be preserved verbatim.
- Pass `tooltip` only when the title alone is ambiguous and a one-sentence definition resolves it. The tooltip text is sentence case and ends with a period.
- Don’t put interactive controls in the title slot. Buttons, menus, and links belong in the content (`<dd>`) or in the parent layout, not the label (`<dt>`).

## Figma Guidelines

### Anatomy

- `Description` — `<Description>`, a `<dl>`.
- `Term` is the `<dt>` with `Title` and `Tooltip Trigger` holding `Icon`; the inner `Description` is the `<dd>` with `Content`.

### Description properties

- `title` — the key. `Title` applies Title Case, the `capitalize` of code, so every word starts with a capital.
- `content` — the value as typed.
- `tooltip` — the information icon.
- `icon` — Figma only: swaps the information icon.
- `showContent` — Figma only: hides `Content`; the 8px under the title stay.
- `right` — right-aligns title, icon and content, the `text-right` of code.
- `ellipsis` — keeps `Content` to one line cut with `…`. Figma clips the title row at the edge.

### Layout

- `Term` sits 8px above `Description`, held as the bottom padding of `Term` so the 8px stay when `showContent` is off.
- `Tooltip Trigger` is 14px wide and 16px high, 4px after the title.
- With `tooltip` on, the title row is 16px high and the pair 40px.
- With `tooltip` off, the row is 14px and the pair 38px.
- Title and trigger start at the top of the row.

### Assembly

- Both rows fill the instance, so `ellipsis` cuts `Content` where the instance ends.
- A list of pairs is one instance per pair.

### Tokens

- `Title` and `Icon` use `ds/gray/900`; `Content` uses `ds/gray/1000`.
- `Title` is hardcoded Geist Regular 14/14 (`text-sm !leading-[14px]`) and `Content` Geist Medium 14/16 (`font-medium !leading-4`).
- The gap between title and trigger is `tailwind/space/4`; the space under the title is `tailwind/space/8`.

## Behavior in Code

### Props in code

- Code takes nodes in `title` and `content`.
- Code renders a separate `<dl>` for each `<Description>`.
- An empty `<dd>` keeps the 8px (`mb-2` on the `<dt>`) under the title.
- With `ellipsis` the `<dt>` and `<dd>` take `w-full`.

### Runtime in code

- The prop is the tooltip text, shown while the icon is hovered.
- Code cuts the title the same way.
