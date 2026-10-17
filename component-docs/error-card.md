# Error Card

A card used to communicate an error state with a title and message.

Best Practices: written by the author of this library from the Geist code; the site page https://vercel.com/geist/error-card has none.

Contents: Best Practices, Figma Guidelines, Anatomy, Error Card properties, Assembly, Layout, Tokens, Behavior in Code, Props in code, Runtime in code

## Best Practices

- Use `<ErrorCard>` for the error state of a whole region, like `No credits left`. Use **Error** for an inline message that must be announced.
- Put the whole message in `title`. Detail passed as `message` is lost, because the card never renders it.
- Keep `title` to a short phrase that names the state. A long one wraps to centered lines and makes the card taller.
- Announce a new error separately: screen readers meet the card only when they reach it.
- The title is an `<h3>`; place the card where that heading level fits the page outline.

## Figma Guidelines

### Anatomy

- `Error Card` — `<ErrorCard>`: a `Content` column with the `Stop` icon above the `Title`.

### Error Card properties

- `title` — the card text, `title` in code. It wraps and stays centered; every extra line adds 24px to the card.

### Assembly

- Set the instance to `Fill container`; the height follows the title.

### Layout

- The card has 16px padding, a 1px border, and radius 8px. One line of title makes it 82px tall.
- `Content` stacks the 16px icon and the 16px/24px title 8px apart, both centered.

### Tokens

- Fill `ds/red/200`, border `ds/red/400` of `border/width/default`; icon and title `ds/red/900`.
- Radius `tailwind/radius/lg`, padding `tailwind/space/16`, gap `tailwind/space/8`.

## Behavior in Code

### Props in code

- `<ErrorCard>` takes `title`, `error`, `retry`, `retryLabel`, and `className`.
- `<ErrorCard>` renders `title` only; a `message` prop is ignored.
- `retry` adds a `Retry` button that calls the function, and `retryLabel` sets its `aria-label`.
- `error` writes `error.message` and `error.digest` to the console.

### Runtime in code

- `shadow-none` overrides the default `--ds-shadow-border`.
