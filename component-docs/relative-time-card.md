# Relative Time Card

Popover to show a given date in local time.

Source of the Best Practices: https://vercel.com/geist/relative-time-card

Contents: Best Practices, Figma Guidelines, Anatomy, Relative Time Card properties, Assembly, Layout, Tokens, Behavior in Code, Rendering in code, Positioning in code, Motion in code, Best Practices vs code

## Best Practices

- Use `<RelativeTimeCard>` anywhere a recent timestamp appears in scannable surfaces: **Table** cells, **Entity** rows, deploy lists, activity feeds. For a static date in body prose past 7 days, render `Mar 14, 2026` directly.
- Pass `date` as a number (Unix ms or epoch). Don’t pre-format the value, and don’t replace `children` with a formatted string. The component’s short formatter is the canonical form (`2m`, `5h`, `Yesterday`).
- Don’t append `ago` after the component. The formatter already produces `2m ago` / `5h ago`, so `<RelativeTimeCard /> ago` reads as `2m ago ago`.
- Use `children` only for non-time labels (`Just now`, `Pending`, `Queued`) where the formatter can’t describe the state.
- Pair with a leading label when the row is ambiguous on its own: `Last deploy <RelativeTimeCard date={ts} />`. The hover card already shows absolute UTC and local time, so don’t duplicate that copy elsewhere on the row.

## Figma Guidelines

### Anatomy

- `Relative Time Card` — the card that `<RelativeTimeCard>` opens over its trigger.
- `Content` — `Relative Time`, then `Timezones`.
- `Relative Time` — the time elapsed since `date`.
- `Timezones` — two `Timezone Row` layers: UTC, then the viewer’s time zone.
- `Timezone Row` — `Timezone Label` (`Timezone Badge` and `Date`), then `Time`.
- `Tip` — the pointer on the card edge that faces the trigger.

### Relative Time Card properties

- `side` — `top`, `bottom`, `left`, or `right`: the side of the trigger the card opens on.
- `relativeTime` — the elapsed line, such as `2 hours, 15 minutes, 8 seconds ago`.
- `zone1`, `date1`, `time1` — the badge, date, and time of the `UTC` row.
- `zone2`, `date2`, `time2` — the same for the time zone of the viewer, such as `GMT+3`.

### Assembly

- Make the instance an absolute child of the frame that holds the trigger; it then overlays the layout.
- Set `Canvas stacking` to `Last on top` on every auto layout between a `top` card and the content above it.
- For `bottom`, set `First on top` on every auto layout between the card and the content below it.
- Figma draws later siblings over earlier ones; with the wrong setting an open card lands under that content.
- Keep 14px between the trigger and the card for `top` and `left`, and 16px for `bottom` and `right`.
- The `Tip` lies inside that gap, outside the instance box.
- Bind `visible` of the instance to a Boolean variable.
- Name the variable like `relative-time-card/default/visible`.
- On the trigger, add `While hovering` with `Set variable` that sets the variable to `true`.
- Keep the hover change of the button as a second action of that interaction.
- Add `Mouse leave` with `Set variable` that sets the variable to `false`.

### Layout

- The card is 324px wide: a 300px content column inside 12px of padding.
- `Relative Time` and `Timezones` sit 12px apart; the two rows sit 8px apart.
- `Timezone Row` puts `Timezone Label` at the start and `Time` at the end, 12px apart.
- `Timezone Badge` is 16px high with 6px of side padding; badge and date sit 6px apart.
- `Tip` is 14px × 7px, centered on the edge of the card.
- The instance is the card, 324px × 104px for every `side`.
- `Relative Time` and `Date` are 13px/19.5px Geist; `Timezone Badge` and `Time` are 12px/18px Geist Mono.
- `Relative Time` and `Time` use tabular numbers.

### Tokens

- `Relative Time Card` — fill `ds/background/100`, effect `ds/shadow/tooltip`, radius `tailwind/radius/md`.
- `Relative Time`, `Time`, and the text of `Timezone Badge` — `ds/gray/900`; `Date` — `ds/gray/1000`.
- `Timezone Badge` — fill `ds/gray/200`, radius `tailwind/radius/xs`.
- `Tip` — fill `ds/background/100`, stroke `components/context-card/tip-stroke`.

## Behavior in Code

### Rendering in code

- The default `children` is 14px `gray-900` text such as `5 hours ago`, and `Just now` under a minute.
- The trigger text refreshes every 60s. The elapsed line in the card refreshes every 1s.
- The card needs `date`; an empty `date` renders `children` alone.
- The elapsed line lists up to three units from years to seconds, such as `2 hours, 15 minutes, 8 seconds ago`.
- A future `date` reads `in 2 hours`, and under one second the line reads `Just now`.
- Dates read `October 7, 2026` and times `11:06:40 AM`.
- The card uses `min-w-[300px]`, `p-3`, `gap-3` between blocks and `gap-2` between rows.
- Rows use `justify-between gap-3`, badges use `px-1.5` and `gap-1.5`, and times use `tabular-nums`.

### Positioning in code

- `side` defaults to `right`, `align` to `center`, `sideOffset` to 16px, and `alignOffset` to 0px; all pass through to the card.
- When the card runs out of room, it moves to the opposite side if that side has more space. It keeps at least 8px from the viewport edges.

### Motion in code

- The card appears 150ms after the pointer enters the trigger and disappears 250ms after it leaves.
- It fades in and out over 150ms with `cubic-bezier(0.3, 0.57, 0.07, 0.95)`.
- The card stays open while the pointer is over it.
- `prefers-reduced-motion` removes the fade.

### Best Practices vs code

- Best Practices describe a short formatter (`2m`, `5h`, `Yesterday`). The published `<RelativeTimeCard>` renders `2 minutes ago`, `5 hours ago`, and `3 days ago`.
