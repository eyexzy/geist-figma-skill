# Snippet

Display a snippet of copyable code for the command line.

Source of the Best Practices: https://vercel.com/geist/snippet

Contents: Best Practices, Figma Guidelines, Anatomy, Snippet properties, Secret Value properties, _Snippet Line properties, Commands slot, Prototyping, Assembly, Layout, Motion, Tokens, Behavior in Code, Props in code, Runtime in code, Responsive in code, Accessibility in code

## Best Practices

- Use Snippet for a runnable shell command the user is meant to copy. For inline tokens (env var names, paths) use `InlineCode`, and for multi-line source use `CodeBlock`.
- Pass the command as `text`. Authors never type a leading `$`; the component renders the prompt, so `text="$ vercel deploy"` displays as `$ $ vercel deploy`.
- Set `prompt={false}` for non-shell content (URLs, JSON, output you want copied verbatim) so the rendered string matches what gets copied.
- Pair `placeholder` with `text=""` for an empty state. Sentence case, no trailing period, no `Please`: `Run vercel link to fetch env vars`. The placeholder is informational, not copied.
- Use `copyText` only when `text` contains rich nodes (`<span>` highlights, conditional fragments) and the clipboard payload should be plain text. For a string `text`, `copyText` is redundant.
- Keep one command per Snippet. Pass an array to `text` for a short multi-line block; for longer scripts, switch to `CodeBlock` so users can read before they copy.
- Use `copied` plus an `onCopy` callback when a parent surface (a card, a tooltip) needs to show the same checkmark feedback while copying different text.

## Figma Guidelines

### Anatomy

- `Snippet` — `<Snippet>`: the `commands` slot of lines and `Copy Button Wrapper` with `Copy Button`, an instance of `_Snippet Copy Button`.
- `_Snippet Line` — one `<pre>`, one item of the `text` array: `Prompt` and `Text`.
- `_Snippet Copy Button` — the `<CopyButton>` of Snippet, restyled through `className`.
- `Secret Value` — `<SecretValue>`: `Field` with `Value` (`Code` holds the text and `Fade`) and `Actions` (`Reveal Hit` with `Reveal Button`, `Copy Button`), then `Error`.

### Snippet properties

- `type` — `default`, `success`, `error` or `warning`: text, fill and border, the `--themed-*` values that `geist-new-<type>` sets in code.
- `dark` — the inverted snippet. The set pairs it with `type=default`.
- `compact` — 36px high for one row, and every further row adds 20px.
- `icon` — shows the copy button; `icon={false}` removes it in code.
- `commands` — slot of `_Snippet Line` instances, the `text` prop of code.
- A string is one line and an array is one line per item; Copy joins them with `\n`.

### Secret Value properties

- `revealed` — masked or full value; the eye toggles it.
- `value` and `maskedValue` — the full text and the mask typed by hand.
- The mask keeps the first 4 and last 4 characters around eight `*`.
- Values of 12 characters or fewer get twelve `*`.
- `label` — names the secret in `Error`: `Failed to copy {label}. Try again or show it.`
- `loading` — a `Skeleton` in place of the value and a disabled eye.
- `showError` — Figma only: the line code shows after a failed copy.
- `revealButton` — Figma only: hover of the eye. It sits on the set so the hover survives the click that switches `revealed`.

### _Snippet Line properties

- `command` — one item of the `text` array.
- `prompt` — `$` before the line, the `::before` of code.

### Commands slot

- A command is one `_Snippet Line`.
- Lines take their color from the snippet through `Snippet / Theme`, so switching `type` or `dark` restyles lines already in the slot. A fill override on a line cuts that link.

### Prototyping

- Hover sits on the set: `Mouse enter` and `Mouse leave` on `Reveal Hit` switch `revealButton` between `default` and `hover`.
- A click flips `revealed` and keeps `revealButton=hover`. Switching `revealed` rebuilds the nested `Reveal Button`, so a hover held inside the button would drop and the eye would flash.
- In `loading` the eye stays disabled through every hover and click.

### Assembly

- A Snippet hugs its lines, as `w-fit` does; the `width` prop of code fixes its width.
- At a fixed width, lines keep their length and cut 48px before the copy button; code scrolls them sideways.
- An empty state is the `placeholder` text in `command` at 50% opacity, the `opacity-50` that code adds.
- Secret Value fills its container in code (`w-full`); long values cut under `Fade`.

### Layout

- Snippet padding is 10px above and below, 12px left and 48px right (`py-2.5 pl-3 pr-12`). The 48px keeps lines clear of the 32px copy button, set 4px inside the border and centered (`right-1`, `top-1/2`).
- Strokes count toward the layout.
- One line is 1px + 10px + 20px + 10px + 1px = 42px; each extra line adds 20px.
- `compact` is 36px high for one row, the `height: 36px` of code, with 7px padding above and below instead of 10px.
- Secret Value `Field` is at least 44px (`min-h-11`). The value has 8px 12px padding (`py-2 px-3`); `Actions` has 4px padding and gap (`p-1 gap-1`) behind a left border. `Error` sits 8px below (`gap-2`).
- The buttons are 32px (`md:size-8`).
- `Fade` covers the last 32px of the value, matching the `mask-image` of code.
- The text keeps 100%, 99%, 97%, 82% and 0% every 8px.

### Motion

- Eye hover: `Smart Animate`, bezier `0.4, 0, 0.2, 1`, `150 ms` — the Button transition.
- Eye click: `Instant` — code swaps the icon and the value immediately.

### Tokens

- `Snippet / Theme` — `themed/fg`, `themed/bg` and `themed/border` in five modes. `Default`: `ds/gray/1000`, `ds/background/100`, `ds/gray/alpha/400`. `Dark`: `ds/gray/100`, `ds/gray/1000`, `ds/gray/alpha/400`.
- `Success`, `Error` and `Warning` use `ds/blue`, `ds/red` and `ds/amber`.
- Text takes the 900 step, fill the 100 step and border the 400 step.
- Lines are hardcoded Geist Mono 13/20, as `text-[13px] leading-[20px]` in code. Radius `tailwind/radius/md`.
- Secret Value — `Field` `ds/background/100` with `ds/gray/alpha/400` borders and `tailwind/radius/md`; value `Copy/13 Mono` in `ds/gray/1000`; `Error` `Copy/13` in `ds/red/900`.

## Behavior in Code

### Props in code

- With `compact`, code fixes the height at 36px, so a second line spills out.
- Code starts from `defaultRevealed`.
- Code sets `prompt` once on `<Snippet>`, so all lines share one value.

### Runtime in code

- While `loading`, Copy stays active and copies a message that the `label` is still being created.
- Each array item gets one `$`; a line break inside an item stays under that prompt.
- Code adds the same fade on the left once the value scrolls.

### Responsive in code

- Code grows the buttons to 44px below 601px (`size-11`).

### Accessibility in code

- Code also builds the button names from `label`: `Show {label}`, `Hide {label}`, `Copy {label}`.
