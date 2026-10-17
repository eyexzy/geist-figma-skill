# Sources and attribution

Facts in this skill come from the Figma file and from public Vercel and Geist material. Each rule file says which part comes from where.

## Contents
- The Figma file
- Geist and Vercel material
- License

## The Figma file

Component properties, variants, variables, styles, icons, keys, prototype reactions, the Figma Guidelines, Examples, and the pages `↳ Colors`, `↳ Typography`, `↳ Materials` and `↳ Icons` were read from the Figma file `FV7WoolwA4hN58QpnEPfVZ`. When anything here disagrees with the file, the file wins. `data/stamp.json` records the state of the file that the data was taken from, and `scripts/figma/fresh-check.js` compares it with the file as it is now.

## Geist and Vercel material

- Geist Design System: `https://vercel.com/geist/introduction` indexes the foundations and the components. The components are published as `@vercel/geistcn`, the icons and logos as `@vercel/geistcn-assets`. Append `.md` to any page, or send `Accept: text/markdown`, for Markdown.
- Foundations: `https://vercel.com/geist/colors`, `/typography`, `/materials`, `/grid`. The introduction also links `/geist/icons`, which opens the introduction; the icon names in this skill come from the `↳ Icons` page of the file.
- Components: `https://vercel.com/geist/<component>`; `component <slug>` prints the link. Read a page for what the component is for and how it is used. The Best Practices in `component-docs/` are the text of those pages; the site has none for some components, listed in `NOTICE.md`; their Best Practices are written by the library author from the Geist code.
- Typeface: `https://vercel.com/font`, source `https://github.com/vercel/geist-font` (SIL Open Font License 1.1). Which files to install for Figma: `typography.md`.
- Vercel Web Interface Guidelines: `https://vercel.com/design/guidelines`, source `https://github.com/vercel-labs/web-interface-guidelines`, MIT, Copyright (c) 2025 Vercel Labs. `content-and-copy.md`, `accessibility-and-interaction.md`, `spacing-and-layout.md`, `motion-and-prototyping.md`, `typography.md` and `materials-and-elevation.md` restate its rules for work in Figma. Its copywriting section is Vercel's brand preference, not a universal rule. The same rules in MUST/SHOULD/NEVER form are in `AGENTS.md` of that repository. Vercel's `web-design-guidelines` agent skill (`https://github.com/vercel-labs/agent-skills`) applies them to code, not to Figma.
- Vercel Writing Guidelines: `https://github.com/vercel-labs/writing-guidelines` (`command.md`). They are for documentation and long-form prose, not interface labels; no rule of this skill is taken from them.
- Vercel report-site designer skill: `https://vercel.com/design.md` (also served at `https://vercel.com/design`). It is written for official Vercel report websites, not product UI. The restraint checks in `spacing-and-layout.md` and `review-geist.md` follow it; its CSS and tokens are not used.
- Brand assets: `https://vercel.com/geist/brands.md`. Vercel and Geist are trademarks of Vercel, Inc. This skill is an unofficial community project and is not affiliated with, endorsed by or sponsored by Vercel. The brand guidelines forbid using the marks in the name of a product or in a confusingly similar way and require an attribution statement where marks appear; check them before you publish anything that carries a Vercel mark.

## License

The upstream license that requires a notice:

Web Interface Guidelines (vercel-labs/web-interface-guidelines):

```
MIT License

Copyright (c) 2025 Vercel Labs

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
