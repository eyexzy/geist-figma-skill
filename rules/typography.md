# Typography: which text style for what

Source: the `↳ Typography` page of the Figma file and the description of each of its 30 text styles. The Geist page `vercel.com/geist/typography` says the same with Tailwind class names (`text-copy-14`).

## Contents
- Fonts
- The 30 styles
- Strong and Subtle
- Choosing a style
- Applying a style in Figma
- Rules that hold everywhere

## Fonts

Every style is set in Geist (Regular, Medium, SemiBold) or Geist Mono (Regular). Install the static OTF or TTF files, not the variable font: Figma finds the weights Medium and SemiBold only by their named style records, which a variable font does not expose. The font variables are `font/family/sans` (Geist), `font/family/mono` (Geist Mono), `font/weight/normal` 400, `medium` 500 and `semibold` 600.

## The 30 styles

Style names are `Group/size` (`Heading/32`). The site class is `text-<group>-<size>`. Letter spacing is built into the headings, so do not change it.

| Group | Styles | Use |
|---|---|---|
| Heading (Geist SemiBold) | `Heading/72` `64` `56` `48` `40` | introduce pages or sections; 72 is for marketing heroes. Tracking -6%. |
| | `Heading/32` | marketing subheadings, paragraphs and dashboard headings. Tracking -4%. |
| | `Heading/24` `20` `16` `14` | introduce pages or sections. Tracking -4% (24) and -2% (20, 16, 14). |
| Button (Geist Medium) | `Button/16` | largest button |
| | `Button/14` | default button |
| | `Button/12` | only for a tiny button placed inside an input field |
| Label (Geist Regular) | `Label/20` | marketing text |
| | `Label/18` | no usage note in the file |
| | `Label/16` | titles, to set them apart from regular text |
| | `Label/14` | the most common text style of all; used in many menus |
| | `Label/14 Mono` | the largest mono; pair it with text larger than 14 |
| | `Label/13` | a secondary line next to other labels; tabular figures for numbers |
| | `Label/13 Mono` | pairs with Label 14, where the smaller mono looks better |
| | `Label/12` | tertiary text in busy views: comments, Show More, calendar capitals |
| | `Label/12 Mono` | no usage note in the file |
| Copy (Geist Regular) | `Copy/24` `20` | hero areas on marketing pages |
| | `Copy/18` | mainly marketing, big quotes |
| | `Copy/16` | simpler, larger views such as Modals where text can breathe |
| | `Copy/14` | the most commonly used text style |
| | `Copy/13` | secondary text and views where space is at a premium |
| | `Copy/13 Mono` | inline code mentions |
| | `Copy/14 Mono` | no usage note in the file |

Label or Copy? Label is for single lines and has generous line height so it lines up with icons. Copy is for text that wraps over several lines. At the same size Copy has the taller line height at 13, 16, 18 and 20 (13/18 against 13/16, 16/24 against 16/20, 18/28 against 18/20, 20/36 against 20/32) and the same at 14 (14/20).

## Strong and Subtle

These are not separate styles. They are ranges inside one text layer. The style descriptions in the file name where each exists:

- Strong: `Label/16`, `14`, `13`, `12`; `Copy/24`, `20`, `18`, `16`, `14`, `13`; `Copy/14 Mono`. A Strong run is Geist Medium in `ds/gray/1000`, inside body text whose color is `ds/gray/900`. In code it is a `<strong>` inside the text class.
- Subtle: `Heading/32`, `24`, `20`, `16`. A Subtle run is the heading in `ds/gray/900` next to a main run in `ds/gray/1000`. The weight stays SemiBold.

The Typography page shows live samples of both. The site page lists Strong on fewer styles (Label 16 and 14, Copy 24 to 14); the Figma descriptions are the source for this library.

To build it, set the style on the whole layer, then change the font style of the Strong range to Medium and its fill to `ds/gray/1000`. Changing the text of a layer that has ranges resets them, so reapply after editing.

## Choosing a style

| Need | Style |
|---|---|
| Dashboard heading, such as the page title of a dashboard | `Heading/32` |
| Page or section title | a Heading style |
| Marketing hero | `Heading/72`, with `Copy/24` or `Copy/20` |
| Text that wraps over several lines | `Copy/14`; `Copy/16` in a Modal; `Copy/13` for secondary text |
| Menus and other single-line UI text | `Label/14` |
| Meta line next to a label, counts | `Label/13` (tabular numbers) |
| Tertiary text in busy views: comments, Show More, calendar capitals | `Label/12` |
| Button text | `Button/14` (`16` on large, `12` on tiny in an input) |
| Code | `Copy/13 Mono` for inline code; `Label/13 Mono` next to `Label/14`, `Label/14 Mono` next to text larger than 14 |

The rows restate the usage notes of the styles. Next to a library component, match the size it uses.

## Applying a style in Figma

```js
await geistTextStyle(textNode, 'Copy/14');
await geistFill(textNode, 'ds/gray/900');
```

Or in one call: `await geistText(parent, 'Last deployed 3m ago', { style: 'Label/13', color: 'ds/gray/900' })`. A new text layer is black until a color is bound, which breaks Dark mode; bind a text color from `color.md`.

## Rules that hold everywhere

- `Button/*` styles belong inside components that render buttons. Do not use them for other text.
- Use tabular figures, or a Mono style, when numbers sit in a column or are compared (Web Interface Guidelines).
