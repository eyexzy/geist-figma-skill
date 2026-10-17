# Toast

A succinct message that is displayed temporarily.

Source of the Best Practices: https://vercel.com/geist/toast

Contents: Best Practices, When to use, Behavior, Content, Accessibility, Figma Guidelines, Anatomy, Toast properties, Toasts properties, Variables, Tokens, Assembly, Motion, Layout, Behavior in Code, Props in code, Runtime in code, Motion in code, Best Practices vs code

## Best Practices

### When to use

- Use a toast for non-blocking acknowledgments of user-initiated actions: `Domain added`, `Project archived`, `Deployment canceled`.
- Don’t use a toast alone for billing failures, permission denials, or build failures the user has to triage. Pair a ≤6-word toast (`Build failed`) with a persistent row carrying the recovery step and a stable identifier.
- Field-level validation belongs on the **Input**, not in a toast. Persistent configuration warnings belong in **Note** or **Banner**.
- Pick the method by how the user experienced the event, not by HTTP status. A user-canceled deploy is `toasts.message('Deployment canceled')`, not `success`. A partial deploy with skipped routes is `toasts.warning(...)`.

### Behavior

- Default toasts auto-dismiss; pass `preserve` only when the user must read or act on the message before it disappears.
- Undo snackbars stay on screen for 5–10 seconds and pair the past-tense toast with a single `Undo` action button.
- Don’t stack toasts to narrate one async flow; emit the success or error toast at the terminal step.

### Content

- One sentence, sentence case, no trailing period when the toast is a single sentence.
- Completion toasts follow `{Noun} {past-participle}`: `Blob deleted`, `Domain added`, `Environment variable saved`. Never include `successfully`; the action name implies it.
- Error toasts are two sentences with periods and end with a recovery step: `Couldn’t verify domain. Try again.` Use `Couldn’t` for user-state errors and `Failed to` for system or infra errors; match adjacent shipped copy and don’t flip mid-flow.
- Pair the toast verb 1:1 with the destructive button verb (`Delete Project` then `Project deleted`, never `Project removed`).
- Undo snackbars use the literal label `Undo`, never `Restore`, `Bring Back`, or `Cancel`. Only use the pattern when the rollback is safe.

### Accessibility

- The toast region announces with `aria-live="polite"`; reserve `assertive` for blocking errors that interrupt a flow.
- Don’t put primary navigation inside a toast; transient surfaces vanish before keyboard users can reach them.

## Figma Guidelines

### Anatomy

- `Toast` — a toast of `toasts.message`, `toasts.success`, `toasts.warning` or `toasts.error`.
- It holds `Content` with the `Text` and the `Actions` icon buttons, or the `Action Row` with two text buttons.
- `Toasts` — `<Toasts>`, the stack: `Toast 3`, `Toast 2` and the front `Toast 1`, with a `Hover Hit Area` below the expanded state.
- `Undo` and `Dismiss` are **Button** at `tertiary`, `square`, `small`; `Secondary Action` is `tertiary` and `Primary Action` `default`, both `small`.

### Toast properties

- `type` — `default`, `success`, `warning`, `error`, set in code by `toasts.message`, `toasts.success`, `toasts.warning` and `toasts.error`.
- `action` — `false` shows the icon buttons beside the text; `true` shows `Action Row` instead, the `action` string of `toasts.message`. The secondary button reads `Dismiss` unless `cancelAction` is set.
- `showUndo` — the `Undo` icon button beside `Dismiss` in the icon form; code renders it with `onUndoAction`.
- `text` — the message, a string or JSX in code. A link inside is medium weight with a 1px underline.

### Toasts properties

- `state` — `default` is the collapsed stack and `hover` the expanded one; the pointer switches them.
- `action` — `true` makes all three toasts the action form; `type` and `text` are set per toast.
- `Toast 1` – `Toast 3` are exposed on the instance with their own `text`, `type` and `showUndo`.
- `type` stays through `state` and `action` changes.
- The modes of `Prototyping / Toasts` decide which toasts are present. The set holds three.

### Variables

- `Prototyping / Toasts` has eight modes named by three digits, one per toast: `1` present, `0` absent. `111` is the full stack, `100` one toast, `000` an empty stack.
- The front toast is the lowest-numbered present one: 420px × 64px with its content shown.
- The next is 399px × 47.5px and the last 378px × 45px.
- Their content is at opacity 0, as in code.
- With `action` the front is 97px tall.
- Each toast N has `toast/N/visible` on its `Visible`. `toast/N/width` and `toast/N/height` set its size, `toast/N/height-with-action` in the action form.
- `toast/N/content-opacity` sits on `Content` and `Action Row`. The expanded state binds only `visible`, so its toasts keep full size.
- Every button (`Undo`, `Dismiss`, `Secondary Action`, `Primary Action`) runs `On click`.
- It checks the three `visible` variables, then runs `Set variable mode` to the mode that omits that toast.
- Closing the front toast brings the next one forward.

### Tokens

- `default` fill `legacy/background` with `ds/gray/1000` text.
- `success` `ds/blue/700` and `error` `ds/red/800` with `ds/contrast/fg` text; `warning` `ds/amber/800` with `ds/gray/1000` text.
- Shadow `ds/shadow/menu`, radius `tailwind/radius/xl`, padding and text-to-button gap `tailwind/space/16`, text row to `Action Row` `tailwind/space/12`, icon buttons `tailwind/space/4`.

### Assembly

- Place `Toasts` in the screen frame: the toast belongs to the window, like the fixed `<Toasts>` area in code.
- Pin the instance to `Right` and `Bottom`, 24px from each edge, as code does (`right` and `bottom` at `var(--geist-gap)`). For `<Toasts center>` centre it horizontally; code uses `right: calc(50% - 210px)`.
- In a scrolling screen turn on `Fix position when scrolling` for the group, so it stays in the visible corner.
- Put the group last in the screen frame so it draws over the content; code uses `z-index` `--ds-z-toast`, 5000.
- Hide it at the start with a boolean variable bound to the instance’s `Visible`, `false` at first.
- Show it from the trigger: `On click` → `Set variable` → that variable to `true`. For the stack add `Set variable mode` → `Prototyping / Toasts` → `111`, or `100` and `110` for fewer toasts.
- A single `Toast` closes with its own `Dismiss`: `On click` → `Set variable` → `false`. The buttons of `Toasts` already close through the modes.
- Any layer can be the trigger; the toast always appears in the corner, as in code.
- Each slot keeps its own `text`: in `100` the message is that of `Toast 1`.
- When the front toast closes, the text of the next slot comes forward.
- To dismiss by time, show the toast on a copy of the screen. The trigger runs `Navigate to` the copy, and the copy runs `After delay` `3500 ms` → `Navigate to` the original. Code dismisses after 3500 ms by itself.
- Use `Toast` alone for a static one-message layout and `Toasts` for the stack.
- Both pin the same way and are 420px wide.

### Motion

- In Figma `Toasts` `default` turns into `hover` with `On hover`, `Smart Animate`, `0.25, 0.75, 0.6, 0.98`, `350 ms`, the code curve. The buttons add their own `150 ms` hover from **Button**.
- Adding and closing a toast is a mode switch, instant in Figma.

### Layout

- `Toast` is 420px wide (`w-[420px]`, at most `100vw − 48`) with 16px padding (`p-4`) and radius 12px (`rounded-[12px]`). The text is 14px/21px and sits 16px from the 32px icon buttons, which are 4px apart.
- The text row and `Action Row` are 12px apart; the action buttons sit at the right, 2px apart.
- `Toast` is 64px high, and 97px with `action`.
- The collapsed `Toasts` is 99px tall: `Toast 1` 420px × 64px, `Toast 2` 399px × 47.5px, `Toast 3` 378px × 45px. Expanded, the three are 64px each with 20px between them and the `Hover Hit Area` 20px below, 232px tall.

## Behavior in Code

### Props in code

- Code stacks any number of toasts and shows the newest three.

### Runtime in code

- Call `useToasts()` and use `toasts.message(text | options)`, `toasts.success`, `toasts.warning` and `toasts.error`.
- `toasts.success`, `toasts.warning` and `toasts.error` default to `Success!`, `Warning!` and `An error occurred.`.
- The text row has `-mt-px`, so a one-line toast measures 63px.
- One `<Toasts>` renders them, and calls made before it mounts wait for it. A repeated `key` is ignored. `toasts.clear()` removes all toasts.
- Auto-dismiss runs 3500 ms from mount (`timeout`). `preserve` or an `action` keeps the toast until it is dismissed. `preserve={false}` gives an action toast the timer again.
- Hovering the stack clears the timers; when the pointer leaves they restart in full.
- `action` is the primary button label with `onAction`, and `cancelAction` the secondary one with `onCancelAction`.
- `actionHref` makes the primary button a link, and `onUndoAction` adds the Undo icon button. Each of these closes the toast.
- An Undo toast follows the same 3500 ms; set `timeout` for the 5–10 seconds the Best Practices ask for.
- `hideX` hides the icon buttons and `fullWidth` stretches the text. `fullBleed` removes the 16px padding.
- `visual` adds media on top, 128px tall by default. `center` on `<Toasts>` centres the area.
- The newest three toasts show. Older ones go to opacity 0 and stop taking pointer events (`nth-last-[n+4]`); below the `sm` breakpoint only two show.
- A toast is `role="status"` with `aria-atomic`, and `success: ` or `error: ` is read first. An action toast is `role="alertdialog"`, labelled by its message.
- `autoFocus` can move focus to the action of an action toast.

### Motion in code

- Appear: 10 ms after mount the toast leaves `translate3d(0, 100%, 150px)` at opacity 0. It rests at opacity 1 after 350 ms, `cubic-bezier(0.25, 0.75, 0.6, 0.98)` (`transition-all`).
- Disappear: the toast fades to opacity 0 and scales to 0.98 in 160 ms, `cubic-bezier(0.6, 0.3, 0.98, 0.5)`, then it is removed.
- A click on a button starts the same fade and removal.
- Stack: each toast behind the front scales by 5% per step (0.95, 0.9) and is offset 20px per step. It is capped at 50px tall, so 47.5px and 45px.
- The area moves up 10px when there is more than one toast. The content of the back toasts fades. Both take 400 ms `ease-in-out`.
- Expand: hovering the stack runs the same 350 ms bezier. Every toast returns to scale 1 and its own height, and the content comes to opacity 1.
- Each expanded toast steps up by its height plus 20px (83px and 166px for 63px tall toasts). A 20px strip under the stack keeps the hover (`after:h-5`).
- Adding and closing a toast plays the appear, disappear, and re-stacking motion.

### Best Practices vs code

- The Best Practices name `aria-live="polite"`; the code relies on `role="status"`, a polite live region.
