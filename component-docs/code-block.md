# Code Block

Code Block component used across Vercel and Next.js.

Source of the Best Practices: https://vercel.com/geist/code-block

Contents: Best Practices, When to use, Behavior, Content, Figma Guidelines, Anatomy, Code Block properties, _Code Lines properties, _Code Block Copy Button properties, File icon, Code slot, Syntax colors, Prototyping, Assembly, Layout, Motion, Tokens, Behavior in Code, Props in code, Runtime in code, Motion in code

## Best Practices

### When to use

- Use `<CodeBlock>` for multi-line, syntax-highlighted source the reader will scan or paste.
- For a single inline token (env var, function name, file path), use **Inline Code**.
- Pick **Snippet** for a copy-to-clipboard shell command or one-line key reveal; it ships with the prompt glyph and copy affordance built in.

### Behavior

- Always pass a `language/syntax` (`tsx`, `bash`, `json`, `diff`). Highlighting is the primary reason to choose `<CodeBlock>` over a plain `<pre>`.
- Highlight only the lines under discussion. A block where every line is highlighted reads the same as no highlight at all.
- Mark added or removed lines with the `diff` syntax or the dedicated added/removed props. Faking them with `// added` comments breaks copy-paste.
- Show the filename header when the snippet has a paste destination (`app/page.tsx`, `vercel.json`). Omit it for ephemeral examples.

### Content

- Snippets stay runnable. Don’t paraphrase real code into pseudo-syntax, and don’t prepend `$` to shell commands. `<Snippet>` already renders the prompt, so `text="$ vercel deploy"` doubles to `$ $ vercel deploy`.
- Keep prose around the block in sentence case and put backticks around CLI flags inline (`--prebuilt`).

## Figma Guidelines

### Anatomy

- `Code Block` — `<CodeBlock>`: `Tabs Container` above `Box`; `Box` stacks `Header`, `Content` and `Footer`. `Content` holds the `code` slot and `Code Copy Button`.
- `_Code Lines` — one `.line` of the `<pre>`; code builds one per line of `children`. It holds `_Line Number`, the `.lineNumber` button, and the code text.
- `_Lang Switch Trigger` — the `switcher` control.
- `_Code Block Copy Button` — `<CopyButton>`: `header` sits in `Header`, `code` floats over the lines.
- `Tabs Container` holds a `secondary` **Tabs**; `Footer` holds a **Button** and a **Split Button**.

### Code Block properties

- `code` — slot with the lines, eight `_Code Lines` by default. It stands for `children`, the source string code splits into lines.
- `filename` and `icon` — the header label and file icon; code derives the icon from `language`, see File icon.
- `showHeader` — the header bar.
- `showTabs` — the tab row above the box, the `tabs` prop. `showTab2` – `showTab4` and the tab labels are exposed on the instance.
- `showSwitcher` — `_Lang Switch Trigger` in the header, the `switcher` prop; its `language` label is exposed on the instance.
- `showCopyButton` — the copy button over the lines.
- `showFooter` — the `v0` bar. `showButton` is `v0="ask"`, an `Ask` button; `showSplitButton` is `v0="build"`, `Open in` with `MVP Example` and `Full Example` in its menu.

### _Code Lines properties

- `highlight` — `highlighted`, `added` or `removed`, from `highlightedLinesNumbers`, `addedLinesNumbers` and `removedLinesNumbers`; `added` and `removed` add a `+` or `-` at the left edge.
- `active` — the line a reader picked by clicking its number. `true` turns any line amber and keeps its `+` or `-`.
- `showLineNumber` — the number column.
- `code` — the line text; `number` on the exposed `_Line Number` is its number.

### _Code Block Copy Button properties

- `type` — `header` is 28px and transparent, the `tertiary` button in code; `code` is 32px on `ds/background/200` with a ring, the `secondary` one.
- `state` — `copied` swaps Copy for Check; `hover` and `copied-hover` add the hover fill.

### File icon

- Code picks the icon from `language`, else from the `filename` extension; a `filename` containing `tailwind` gets the Tailwind logo.
- `jsx` → `LogoReact`; `ts` and `tsx` → `AcronymTs`; `js` → `AcronymJs`.
- `next` → `LogoNext`; `py` → `LogoPythonMonochrome`; `bash` and `sh` → `Terminal`.
- `json` → `AcronymJson`; `prompt` → `PencilEdit`.
- `vue`, `svelte`, `astro`, `lua`, `pnpm` and `tailwind` map to their logos; any other language maps to `File`.
- The icon takes `ds/gray/900` from the block.
- `LogoPnpm` keeps its colors; `LogoVue`, `LogoSvelte` and `LogoAstro` keep part of their brand fill.

### Code slot

- Add a line by duplicating a `_Code Lines` inside the `code` slot of the instance; remove one the same way. The block grows with the slot.
- Number new lines by hand through `number` on `_Line Number`; the slot doesn’t count lines.
- Type each line into `code`, then color tokens by selecting ranges of the text, as in Syntax colors. Editing `code` resets the line to `ds/gray/1000`.
- A long line clips at the right edge.

### Syntax colors

- Colors follow the token class Prism assigns, so one color keeps one role across languages.
- `ds/pink/900` — keywords: import, function, return, const, def, local, null; true and false in Lua; CSS selectors such as.card:hover.
- `ds/purple/900` — function names and calls: Page, do_GET, npm; attribute names: className, onClick; regular expressions: /^v\d+/; CSS functions: var.
- `ds/green/900` — strings, numbers and booleans: 'utf-8', 200, true; tag names: h1.
- `ds/green/900` also colors type and class names: Props, User; constants and variables: MAX_SIZE, $HOME.
- `ds/green/900` also colors shell builtins: echo; CLI flags: --prebuilt.
- `ds/blue/900` — attribute values and strings inside JSX and HTML tags: "text-heading-32", 'saved' inside `onClick`.
- `ds/red/900` — object keys: appDir in JS, "framework" in JSON; CSS properties: padding; HTML entities: &amp;.
- `ds/gray/900` — comments: # Install the CLI, -- Base64 values.
- `accents/5` — markup prolog, doctype and CDATA: <!DOCTYPE html>, <?xml ?>.
- `ds/gray/1000` — punctuation, operators, identifiers and plain text: { } ( ) = props.name; decorators such as @dataclass. Namespace tokens drop to 70% opacity.
- Weight: SemiBold for CSS at-rules such as @import and for YAML keys.
- Bold for !important, Markdown bold text, #!/bin/bash and YAML booleans.
- Markdown italic text is italic.

### Prototyping

- Hovering the block reveals `Code Copy Button`: the root’s `Mouse enter` and `Mouse leave` set `state/copy-button/hover` in `Prototyping / Code Block`.
- On the canvas the button stays hidden.
- Hovering one block reveals the button in every block with `showCopyButton` on.
- Clicking a line number toggles `active` on that line; a second click clears it.
- The copy button turns `copied` on click and returns after 1s.
- A tab becomes active on click while the code below stays the same.
- `_Lang Switch Trigger` has hover only.

### Assembly

- Turn `showHeader` off and `showCopyButton` on for the copy button over the lines.
- Turn on `showButton` or `showSplitButton` under `showFooter`; `v0` holds a single value.
- Keep four tabs or fewer, `showTab5` off; use `showSwitcher` for a longer list.
- Turn `showLineNumber` off on every line.
- Mark one line `active` at a time.
- Resize the instance for width; the lines fill it.

### Layout

- Box — 1px border; header and footer 40px tall (`--ds-size-large`). Header padding 16px left and 5px right, footer padding 12px.
- Tab row — tabs 32px tall with 12px below (`mb-3`), outside the border.
- Lines — 16px above and below; each line 20px tall with 16px at each side, text Geist Mono 13px/20px.
- Line number — 32px wide: 16px for digits plus 16px gap; it grows to 40px and 48px for three and four digits.
- Copy button over the lines — 32px square, 16px from the top and right edges.

### Motion

- Line number hover: `Smart Animate`, `Ease Out`, `125ms`.
- The `active` click reuses it.
- Copy button: hover `Smart Animate`, bezier `0.4, 0, 0.2, 1`, `150ms`; click and return `200ms`; `copied` holds `1s`.
- The hidden icon sits at 8px with opacity 0, the `scale-50` frame, so `Smart Animate` scales and fades it.
- `_Lang Switch Trigger` hover: `Smart Animate`, bezier `0.4, 0, 0.2, 1`, `200ms`.
- The overlay copy button appears instantly.

### Tokens

- Box — fill `ds/background/100`, border `ds/gray/400`, radius `tailwind/radius/lg`; header and footer `ds/background/200` with `ds/gray/400` dividers.
- Filename `Label/13` in `ds/gray/900`, file icon `ds/gray/900`.
- Lines — `ds/blue/300` highlighted, `ds/green/300` added, `ds/red/300` removed, `ds/amber/300` active.
- Each line has a 2px inner shadow in the `900` step of its hue.
- Number `ds/gray/600`, `ds/gray/1000` on hover.
- Code text is Geist Mono 13/20 set by hand; `+` and `-` are Medium.
- Copy button `code` — `ds/background/200` with `ring/gray-400`; hover adds `ds/gray/alpha/200` on top, the only hover fill of `header`. Lang switch `ds/background/200`, `ds/gray/200` on hover.

## Behavior in Code

### Props in code

- The number column hides for the whole block with `hideLineNumbers`, and on screens below 601px.
- `textToCopy` replaces the copied text; the default is the text of `children`.
- `borderless` sets `border-0` on the block.
- Code text uses `!text-[13px] leading-[20px]`.
- `LogoVue`, `LogoSvelte` and `LogoAstro` render in gray.

### Runtime in code

- The header renders when `filename` or `headerActions` is set, or with more than four `tabs`.
- The copy button sits over the lines when `filename`, `tabs` and `headerActions` are all unset, or `copyButtonPlacement` is `overlay`.
- A block with up to four `tabs` and an unset `filename` puts the copy button in the tab row.
- More than four `tabs` render as a select in the header.
- The block fills its container.
- The copy button appears on hover through `group-hover/copy`.
- The active line is linked in the URL as `#C…-L4`.
- Code scrolls the `<pre>` sideways (`overflow-x: auto`).
- The line stays active until another number is clicked.
- The trigger opens the browser’s native list.

### Motion in code

- The overlay copy button fades in over 150ms.
- Line numbers transition `color` over `.125s` with `ease-out`; `active` switches the background instantly.
- `<CopyButton>` resets after 1000ms, and its icons use `duration-200`.
- The language trigger uses `transition-colors duration-200`.
