<div align="center">

# Geist Figma Skill

**An agent skill for the Geist component library in Figma.**
It picks the right component, sets it through its properties, binds every value to a variable or a style, wires prototypes that run in Present and reviews frames against Geist.

<p>
  <a href="https://github.com/figma/mcp-server-guide"><img alt="Figma MCP" src="https://img.shields.io/badge/FIGMA-MCP-0a0a0a.svg?style=for-the-badge&amp;labelColor=000000&amp;logo=figma&amp;logoColor=white" height="28"></a>
  <a href="https://agentskills.io"><img alt="Agent Skills" src="https://img.shields.io/badge/FORMAT-AGENT%20SKILLS-blue.svg?style=for-the-badge&amp;labelColor=000000" height="28"></a>
  <a href="LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/LICENSE-MIT-green.svg?style=for-the-badge&amp;labelColor=000000" height="28"></a>
</p>

[Figma library][figma-library] · [Install](#install) · [Usage](#usage) · [How it works](#how-it-works) · [What is inside](#what-is-inside)

</div>

## What it is

[Geist][geist] is the design system of Vercel. The [Geist Figma library][figma-library] is an unofficial recreation of it with real variants and properties, variables for Light and Dark, text and effect styles, icons, a documentation frame on every component page and prototypes that run on variables.

This skill gives an agent that works through the [Figma MCP server][figma-mcp] the same knowledge in a form it can query: what each component is for, how it is set up, what its labels say, how it behaves, and which variable, style or material fits a job. It also gives the agent a method for building and checking work, so a screen comes back with the evidence that it works.

## Install

```bash
npx skills add eyexzy/geist-figma-skill -a claude-code
```

Or clone it into the skills directory:

```bash
git clone https://github.com/eyexzy/geist-figma-skill ~/.claude/skills/geist-figma-skill
```

### Requirements

- An agent that supports skills. Tested with Claude Code.
- The Figma MCP server with write access to the canvas (`use_figma`, remote server `https://mcp.figma.com/mcp`) and Figma's `figma-use` skill. In Claude Code both come with the Figma plugin:

  ```bash
  claude plugin install figma@claude-plugins-official
  ```

- Node.js 18 or newer for `scripts/lookup.mjs`.
- The Geist library in the Figma file you work in: the library file itself, a copy of it, or a file with the published library enabled (Assets, Libraries).

## Usage

The skill loads on requests about the library or about a file that uses it:

```text
Which Button settings for a destructive action, and what should it say?
Build a project settings page in Light with a name field, a region select and a danger zone.
Make the Delete Project button open a confirmation modal and show a toast after it.
Add a row actions menu to every row of this table.
Review this frame against Geist.
```

| Mode | The agent |
|---|---|
| **Advise** | Names the component and set, the properties to set with exact names and values, the default, the labels its guidelines ask for, and the Figma page. |
| **Build** | Places library instances and sets them through properties, not overrides. Binds fills, strokes, spacing, radius and text to variables and styles. Sets Light or Dark on the frame. Wires each overlay to a boolean variable of its own. |
| **Review** | Runs the audit on a frame, takes screenshots of each state and checks every component against its documentation. Reports each problem with the node and the exact fix. |

The skill does not turn designs into code and does not create new library components. An element the library does not have, such as a sidebar or a top bar, the agent builds from frames, library parts and tokens, and says so.

## How it works

The Figma file is the source of truth. The skill carries a snapshot of it and compares the snapshot with the file before it gives exact values; when the file has changed, the agent reads the changed part from the file.

On top of the knowledge sits a method. A designer finds what an agent leaves wrong, and finds it late: a menu that opens off the screen, a hover that sticks, a border that is not drawn. The agent works so that there is nothing to find:

1. **Frame the job.** Screens, every interactive element and each of its states, what sits inside what, the shortest and the longest text.
2. **Look for what can go wrong, by class.** [`rules/figma-model.md`](rules/figma-model.md) describes how Figma and the library fail: states and transitions, layer order and clipping, the pixel grid, bindings and modes, reactions inside reactions, instances and overrides.
3. **Inspect, then reuse.** Read what the file already has, read the card of each component, set its properties and add only the wiring the card asks for.
4. **Build in small steps and read back.** Values are read from the file, not from the script.
5. **Look at every state.** Overlays are shown open and measured inside their frame, hover and press are compared with rest, the longest text and the empty case go through the same screen.
6. **Audit, then review.** The audit runs until it is clean, and a fresh review reads the result against [`rules/review-geist.md`](rules/review-geist.md).
7. **Report with evidence.** What was built, the evidence, what only a pointer can test in Present, and every choice that was the agent's own.

### The audit

`scripts/figma/audit.js` reads a frame, a section or an instance and changes nothing. It reports on three levels (errors, warnings, info) in six groups:

| Group | What it finds |
|---|---|
| Values | hex fills and strokes, legacy variables, text without a library style, text on a background step, contrast below WCAG 2 in the mode of the node, radius and spacing off the steps, shadows without an effect style |
| Geometry | positions on a fraction of a pixel, layers beyond their screen, Clip content that cuts a child or a material border, text collapsed to a sliver |
| Overlays | an overlay that opens outside the screen, under later layers or cut by a clipping parent, even while a variable hides it |
| Instances | a missing main component, a look-alike frame, parts restyled by hand, a hover replaced by reactions on the instance, copy left at its default |
| Prototype | a variable set to true and never to false, a variable shared by several overlays, hover inside hover, a click that the wrapped component takes before the layer around it, a clickable layer under 24 px |
| Theme | the mode of `DS / Core Colors` on every screen |

It also prints `toTryInPresent`, the interactions of the design that only a pointer can test.

## What is inside

| Folder | Contents |
|---|---|
| [`component-docs/`](component-docs) | The card of each component: when to use it, properties and defaults, nested parts and slots, labels and messages, behavior, accessibility, layout values and motion. The same text as the documentation frames of the Figma file. |
| [`data/`](data) | Component sets with their properties, variables with their values in Light and Dark, text and effect styles, icons with search synonyms, prototype reactions and the fingerprint of the file the data was read from. |
| [`rules/`](rules) | Which component for which need, which color, text style, material, spacing and motion for which job, copy, accessibility, the models of Figma behavior and the review procedure. |
| [`recipes/`](recipes) | Building a screen, configuring an instance, forms, and overlays that open and close in a prototype. |
| [`scripts/`](scripts) | `lookup.mjs`, an offline search of all of the above, and `figma/`, the scripts the agent runs through `use_figma`: helpers, the audit, the freshness check. |

### Lookup

`node scripts/lookup.mjs` works offline. Run it without arguments for the full list.

| Command | Prints |
|---|---|
| `find <words>`, `choose <words>`, `list` | components for a need, the pick between similar ones, all components by category |
| `brief <slug>`, `component <slug>` | what a component is for and how it is set up: public sets, properties, defaults, Best Practices, assembly |
| `guide <slug> [section]`, `layout <slug>`, `motion <slug>` | written guidelines, exact layout and bindings, reactions with time and curve |
| `use <words>`, `token <words>`, `ramp <hue>`, `style <words>`, `collections` | the variable, text style, material or spacing for a job |
| `icon <words>` | icon names by meaning ("delete", "settings") |
| `check "<Set>: k=v ..."` | validates a plan before building: set, part, property and value |
| `audit <node id>`, `helpers [names]` | the audit and the helper functions, ready to paste into `use_figma` |
| `keys <refs>`, `keys from <file>`, `fresh [compare <file>]` | the search to run and the `GEIST_KEYS` to fill for a file that uses the published library, the freshness stamp |
| `rule [name] [section]`, `example <slug>` | a rule file or one section, how the Examples of a component are set up |

### Layout

```
geist-figma-skill/
├── SKILL.md            instructions for the agent
├── component-docs/     documentation of each component
├── data/               components, variables, styles, icons, motion and the fingerprint of the file
├── rules/              components and tokens, copy, accessibility, motion, how work goes wrong, review
├── recipes/            build procedures
└── scripts/            lookup.mjs and the scripts for use_figma
```

## Contributing

The data is read from the Figma file, so a difference between the file and the skill is the most useful report: open an [issue](https://github.com/eyexzy/geist-figma-skill/issues) with the component or variable, what the file says and what the skill says.

## License

This project is licensed under the [MIT License](LICENSE). Attribution, the disclaimer and trademarks are in [NOTICE.md](NOTICE.md).

The skill is an unofficial community work. It is not affiliated with, endorsed by or sponsored by Vercel, Inc.

The skill is provided "AS IS", without warranty of any kind. It does not guarantee that what an agent builds or answers with it is correct, complete or fit for a purpose, and an agent can still make mistakes. Check the result before you use it. The author is not liable for the work of the skill or for any loss caused by its use.

## Links

- [Geist Figma library][figma-library]
- [Geist design system][geist]
- [Figma MCP server guide][figma-mcp]
- [Agent Skills][agent-skills]
- [Vercel Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines), the source of the copy, accessibility and motion rules

<div align="center">
<sub>Made by <a href="https://www.linkedin.com/in/oleksii-molchanov-ux-ui-design">Oleksii Molchanov</a></sub>
</div>

[figma-library]: https://www.figma.com/community/file/1693390940030302845
[geist]: https://vercel.com/geist
[figma-mcp]: https://github.com/figma/mcp-server-guide
[agent-skills]: https://agentskills.io
