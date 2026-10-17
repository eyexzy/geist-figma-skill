# Calendar

Displays a calendar from which users can select a date or range of dates.

Source of the Best Practices: https://vercel.com/geist/calendar

Contents: Best Practices, When to use, Behavior, Accessibility, Figma Guidelines, Anatomy, Calendar properties, _Calendar Panel properties, _Calendar Trigger properties, _Calendar Day properties, _Calendar Presets Panel properties, Prototyping, Assembly, Scaling, Motion, Tokens, Behavior in Code, Props in code, Runtime in code, Motion in code

## Best Practices

### When to use

- Pick `<Calendar>` for analytics ranges and any picker where day-of-week and month context matter.
- For ISO dates pasted whole or relative shorthand like `7d`, use a free-form **Input**.
- Provide `<Calendar.Presets>` for the common ranges (`Last 7 Days`, `Month to Date`) so users land on the right window in one click.
- Pair a horizontal layout with live results next to the calendar; in narrow surfaces like a sidebar, fall back to the stacked layout.

### Behavior

- Set `min` and `max` to the data window so users can’t pick outside the retention range.
- Default to the user’s locale and timezone; never silently render UTC for a US-Pacific viewer.
- Keep the trigger label as the chosen range (`Apr 1 – Apr 28, 2026`); don’t fall back to `Pick a date` once a value is committed.
- Persist the selected range when the popover closes and re-opens so users can tweak the end date without re-picking the start.

### Accessibility

- Trap focus inside the popover so Tab cycles day cells and presets instead of the page behind it.
- Support arrow-key day navigation, `Shift` + arrow for week jumps, and `Page Up` / `Page Down` for month jumps.
- Announce range changes through `aria-live="polite"` so a screen reader hears `From Apr 1 to Apr 28` after the second click.
- Each preset is a real button with a Title Case label (`Last 30 Days`); don’t mark presets as menu items without keyboard handling.

## Figma Guidelines

### Anatomy

- `Calendar` — a `_Calendar Trigger` and a `_Calendar Panel` popover.
- `Calendar with Presets` — a `_Calendar Trigger Pair` with two popovers: `_Calendar Presets Panel` under the preset half, `_Calendar Panel` under the date half.
- `_Calendar Panel` — a header with the month and two `_Calendar Nav Button` instances.
- Below the header sit a grid of `_Calendar Day` cells, the Start and End fields, Apply, and the timezone.
- `_Calendar Presets Panel` — the `presets` slot of `_Calendar Preset Item` rows; `hints=true` adds a second column of `_Calendar Hint Chip` instances.

### Calendar properties

- `size` — `small` or `medium`. It switches the trigger; the panels have one size.
- `layout` exists on `Calendar with Presets`; `horizontal` is the default pair.
- `stacked` and `compact` mirror the props of the same name on `<Calendar presets>`.
- `horizontalLayout` — Start, End and Apply sit beside the grid instead of under it.
- With `horizontalLayout` the panel centers on its trigger.
- `position` — the side the popover opens on.
- The trigger is exposed on both composites: set `value`, `allowClear`, `state` and the labels on the instance.
- Selection is a range, `selectionMode="range"`, the code default.

### _Calendar Panel properties

- `month` sets the header; `showWeek5` and `showWeek6` hide the last rows. A month spans 4 to 6 weeks, counted by `weeksInMonth` in code.
- `showTimeInput=false` hides the Start and End fields.
- `pinnedTimezone` — `true` swaps the timezone select for read-only text; `timezone` is the string passed to `pinnedTimezone`.

### _Calendar Trigger properties

- `value` — `empty` shows the placeholder, `filled` a committed range. `_Calendar Trigger Pair` adds `dateOnly`: a range picked in the grid, outside the preset list, so the preset half keeps its placeholder.
- A pair with `value=filled` also stands for a preset chosen on load, which code sets with `presetIndex`.
- `allowClear` — the clear button; it needs a value and lives outside `compact`. A click resets the trigger to `value=empty`.
- `state` — `default`, `hover`, `focus`, `focusHover`; the pair names each half, as in `focusPresetHoverDate`. Hover and focus are separate CSS states, so they combine.
- `label`, `presetLabel` and `dateLabel` hold the trigger text.
- In `compact` one half collapses to a square.
- The preset half expands while a preset is chosen or focused; the date half expands otherwise.

### _Calendar Day properties

- `type` — `today`, `weekend`, `outsideMonth` for the adjacent months, `disabled` for days outside `minValue` and `maxValue`.
- `state=rangeEnd` is the dark pill at each end of a range. `inRange` draws the gray band; `capStart` and `capEnd` trim it so it starts and ends under the pills.

### _Calendar Presets Panel properties

- `hints` — `true` adds the chip column and fixes the panel at `calc(var(--radix-popover-trigger-width) * 2 + 2px)`; `false` takes the trigger width.
- `presets` — a slot of `_Calendar Preset Item` rows, four by default.

### Prototyping

- `Prototyping / Calendar` holds two booleans: `state/calendar/open` shows `_Calendar Panel`, `state/presets/open` shows `_Calendar Presets Panel`.
- `Calendar` toggles `state/calendar/open` on mouse down.
- In `Calendar with Presets`, `Preset Hit` and `Date Hit` toggle their own variable and set the other to `false`.
- One panel opens at a time.
- Hover, focus and clear run inside the trigger masters; the composites only open panels.
- Days switch instantly: `MOUSE_ENTER` to `hover`, `ON_CLICK` to `rangeEnd`. A click marks its own cell; ranges are drawn with properties.

### Assembly

- Mark the first and last day `state=rangeEnd` with `capStart` and `capEnd`.
- Mark every day between with `inRange`.
- Change the month through `month`, `showWeek5`, `showWeek6` and each cell's `day` and `type`.
- Keep one calendar per prototype screen: the variables are shared, so a click opens the panels of every instance.
- Set Canvas stacking to `First on top` on every auto layout between a calendar and the content below it. Figma draws later siblings over earlier ones, so with `Last on top` an open panel lands under the next section.
- Resize the composite for width; height follows `size`.
- With `hints=true` the presets panel stays 502px wide as the trigger grows.
- Drop `_Calendar Preset Item` rows into the `presets` slot; the panel grows with them.
- Switch `position` to `top` for triggers near the bottom edge.

### Scaling

- `small` — trigger 32px tall, stacked pair 64px tall
- `medium` — trigger 36px tall, stacked pair 72px tall
- Trigger — 250px wide; horizontal pair 500px wide; compact 180px wide plus a square of the trigger height
- `_Calendar Panel` — 276px wide, 518px wide with `horizontalLayout`; 8px below the trigger (`sideOffset` 8px)
- `_Calendar Presets Panel` — 502px wide with `hints=true`, the trigger width with `hints=false`
- `_Calendar Presets Panel` height — 16px of padding plus 36px per row; with `hints=true` the minimum is 216px.

### Motion

- Triggers: `Smart Animate`, bezier `0.4, 0, 0.2, 1`, `150ms`.
- `_Calendar Day`, `_Calendar Nav Button`, `_Calendar Preset Item` and `_Calendar Hint Chip` switch instantly.
- Panels toggle instantly through the variables.

### Tokens

- Panels — `ds/background/100`, `ds/shadow/menu`; radius `tailwind/radius/xl` for the calendar, `tailwind/radius/lg` for presets; footer divider `ds/gray/100`.
- Day — `today` `ds/blue/900`; `rangeEnd` `ds/gray/1000` with `ds/background/100` text; band `ds/gray/300`; hover border `ds/gray/alpha/500`.
- Day text — `ds/gray/700` for `outsideMonth` and `disabled`, `ds/gray/900` for `weekend`.
- Triggers — `ring/gray-400`, `ring/gray-500` on hover, `ds/focus/border` on focus; text `ds/gray/700` when empty, `ds/gray/1000` when filled.
- Presets — item hover `ds/gray/alpha/300`; chips `accents/2`, hover `components/calendar/hint/bg-hover`.
- Pinned timezone — `ds/gray/800`, 12/16, hardcoded like code's `text-xs`.

## Behavior in Code

### Props in code

- The popover aligns to `start` by default.
- `presets` is an object of any length; each entry has `text`, `start` and `end`.
- The list has no maximum height and no scroll; the popover grows with the rows.
- The placeholders are `Select Date Range` and `Select Period`.
- `selectionMode` defaults to `range`; `single` is the other value.
- `width` defaults to `250px`, or `180px` with `compact`.
- With `hints`, the presets panel width is `calc(var(--radix-popover-trigger-width) * 2 + 2px)`.

### Runtime in code

- The popover opens below and moves above when the viewport runs out of room (`collisionPadding` 16px).
- A chip click works like a preset click in code: it sets the value and closes the panel.
- On small viewports the picker opens as a bottom sheet with `min-h-[500px]` instead of the popover.

### Motion in code

- Code opens the panels instantly and closes them with `fadeOut`, 200ms, `cubic-bezier(.175, .885, .32, 1.1)`.
- Triggers transition `box-shadow` over `150ms` on Tailwind's default easing.
