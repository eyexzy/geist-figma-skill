---
name: geist-figma-skill
description: "Use when a task touches the Geist component library in Figma or a file that uses it: picking a component or its properties, writing its labels, choosing a color, text style, material, spacing or icon, building or restyling a screen, form, dialog, table or menu, wiring a prototype (modal, menu, tooltip, toast), switching Light and Dark, or reviewing a design against Geist. Also when the request describes UI without naming the library and the file uses it. Not for turning designs into code or for creating new components."
compatibility: Node 18 or newer for scripts/lookup.mjs. Reading and building in Figma needs the Figma MCP tools (use_figma) and the official figma-use skill.
license: MIT
metadata:
  author: eyexzy
  version: "0.1.0"
---

# Geist Figma Skill

The Geist component library in Figma documents every component: what it is for, how it is set up, what its labels say and how it behaves. This skill carries that documentation, the library's variables and styles and the rules for using them, so an agent can advise on the library, build with it and review designs against it in any file where the library is enabled. The data, the rules and `scripts/lookup.mjs` work offline; the scripts in `scripts/figma/` run in Figma through `use_figma`.

The Figma file is the source of truth: where it and this skill disagree, the file wins. The Geist site (`vercel.com/geist`) is the source of the library; a difference between the site and the file is not an error, so build from the file and mention the difference only when the user asks about the site. Answer in the user's language. Keep component, property, variable and style names exactly as they are in the file; they follow the Geist site (the Figma `Button` is `<Button>`).

## How to work

The designer you work for finds what you leave wrong, and finds it late: a menu that opens off the screen, a hover that sticks, a border that is not drawn. Work so that there is nothing to find.

1. **Frame the job.** Before you touch Figma, write down the screens, every interactive element with its states (rest, hover, open, disabled, error, empty, loading, Light, Dark), what sits inside what, what the user must do in Present, and for every text and number the shortest, typical and longest value. Ask only what blocks you; state every other choice as your assumption and go on.
2. **Name the risks.** Read `rules/figma-model.md`. For each class that applies, name the risk in this job and how you will check it; a risk with no check goes in the report as accepted.
3. **Inspect, then use what the library does.** Read what the file already has and match it. Place the component, read its card (`brief <slug>`), set its properties. Add a reaction, an override or a frame only when the card asks for it.
4. **Build in small steps and read back.** One section per call; read what you set from the file, not from your script: property values, bindings, sizes. Look at each section on its own: a reduced screenshot hides cut text, wrong colors and default copy.
5. **Look at every state.** A closed overlay is invisible in a screenshot: show it open (`recipes/interactive-overlays.md`, Show the open state on the canvas) and check that it fits. Run the longest text and the empty case through the same screen; for hover and press set the variant and compare it with rest. What only a pointer can test goes on a list for the user.
6. **Run the audit, then review.** `node scripts/lookup.mjs audit <node id>` prints the script for `use_figma` (add `static`, `overlays` or `prototype` to print one part, for a re-check of one kind of finding). For each finding name the cause before you fix it (wrong component, restyled instance, unbound value, wiring, layout) and fix at the cause; three rounds are enough. Info findings that name a look-alike (`bare-action-icon`, `select-like`, `progress-like`, `text-suggests-component`) are hints. A clean run is evidence, not proof: it cannot hover or click. Then review against `rules/review-geist.md`; a sub-agent gets only the node ids and that file, and without one you review it yourself and say the review was not independent.
7. **Report with evidence:** Built (names and ids); Evidence (the audit run, the states you looked at, values read back, the open size and position of each overlay inside its frame); Not checked, to try in Present (the audit prints `toTryInPresent`); Assumed (every choice that was yours). Claim nothing you did not check this turn: a screen is correct with an audit without errors and a screenshot of each state, a prototype works with bindings, variables and reactions read back, an overlay fits when its open size and position are measured.

When a build does not behave, find the cause before the next fix: reproduce it in one named state, place the same component alone in an empty frame and bring it to that state (if it behaves there, the cause is what you added), change one thing at a time on a copy, and ask the user after the third failed attempt. A second reaction, override or frame added to repair the first one means the cause is not found.

## The component documentation

Every component has a card; answers go wrong where an agent skips it. `node scripts/lookup.mjs brief <slug>` prints the public sets with every property and default, Best Practices, Assembly and Behavior in this file: what the layers of each set do (text case, which layers each property drives and where it is bound in only some variants, text without a text style, what a slot holds, the values a nested part starts with). Read it before you recommend, place or review a component.

Sections of a card and their commands: Best Practices (when to use, behavior, content, accessibility) and Assembly in `brief <slug>`; `guide <slug> <section>` for one section (Behavior, Accessibility, Layout, Assembly, Motion, "Behavior in Code"); `layout <slug>` and `motion <slug>` for exact sizes, bindings and reactions; `choose <words>` when two components compete.

## Advise, build, review

- **Advise.** `find <words>` for a need, `choose <words>` between similar ones, `rules/choosing-components.md` for the decision tables and the needs with no component. Answer with the component and set, the properties with exact names and values, the default, one sentence of why from the card and the page from `component <slug>`; between components, the pick and the one condition that would switch it. Tokens and styles: `use <words>` (reasons in `rules/color.md`, `typography.md`, `materials-and-elevation.md`, `spacing-and-layout.md`); icons: `icon <words>`.
- **Build.** Check the data against the file once per session (below). Validate the plan: `node scripts/lookup.mjs check "Button: variant=error label=\"Delete Project\"" "Input > Suffix: type=kbd suffixStyling=false"`. It rejects a set, part, property or value the library does not have, a combination of variant properties no variant has, and a value of a nested part that does not exist together with the values the part starts with inside its parent. Build with `recipes/build-screen.md` (frames, variables, styles, Light and Dark), `recipes/configure-components.md` (properties, nested parts, slots, states) and `recipes/interactive-overlays.md` (anything that opens and closes). Add interactions only when asked. Without Figma tools, name the components, properties and variables to set in the Figma UI.
- **Review.** `rules/review-geist.md`: the audit for what a script can see, screenshots in Light and Dark and of each state, each component against its card, the frame against the rules. Report a verdict line and a table of findings with node, problem and exact fix.

## Where Figma and the library differ from what you would assume

| You would assume | What holds | Read |
|---|---|---|
| A new frame is Light | The default mode of `DS / Core Colors` is `Dark`; set the mode on the root frame (`geistFrame` option `theme`). | `recipes/build-screen.md` |
| A hidden part of an instance is read | Hidden parts (a closed menu list, an overlay panel) are skipped unless `figma.skipInvisibleInstanceChildren` is `false`; the helpers and read scripts set it. | `recipes/configure-components.md` |
| A frame around components is harmless | Clip content cuts the borders and rings they draw outside their edge. `figma.createFrame()` turns it on; `geistFrame` leaves it off except with an effect style; `geistNoClip` turns it off on your own frames. | `rules/materials-and-elevation.md` |
| An overlay sits above what it is placed over | Later siblings draw over earlier ones: an overlay is an absolute last child, and a menu opening downward needs canvas stacking `First on top` on the layouts above the content below it. | `recipes/interactive-overlays.md` |
| One variable runs the prototype | One boolean per overlay; the library `state/*/open` variables are shared by every instance. `geistRewireReactions` moves one instance to your variable, `geistCloneVariables` copies a `Prototyping / <Component>` collection. | `recipes/interactive-overlays.md` |
| A frame around the trigger gets its click | Only when the trigger has no click reaction of its own (Button). A component whose variants react to click (Input) takes it: put On click on an absolute hit layer above it. A reaction set on a Button replaces those of its master. | `recipes/interactive-overlays.md` |
| Select an option on the item | Select on the group (`checked`, `active`); an override on an item survives later changes. | `recipes/configure-components.md` |
| Text dropped into a slot is styled | It is your own layer, black and without a style; create it with `geistText`. | `recipes/configure-components.md` |
| This skill carries import keys | It carries none: the original file, its Community copy and files that use the copy can have different keys. Read them with `search_design_system`. | `recipes/build-screen.md` |
| Every Geist page has a component here | Some (Entity, Scroller, Context Menu...) have no set, and there is no sidebar or top bar. Build them from frames, library parts and tokens, and say so. | `rules/choosing-components.md` |

## Check the data against the file

Once per session, before exact values or building; skip it for advice without exact values.

1. A file with pages `↳ Button`, `↳ Colors` and so on is the library file or a copy: read it directly (`layout <slug>` and `example <slug>` print how to run `read-layout.js` and `read-examples.js`). Any other file uses the published library, which must be enabled for it, and the cards and data of this skill stand in for those pages.
2. Run `scripts/figma/fresh-check.js` through `use_figma` (`quick` in the library file, `consumer` elsewhere; set `MODE_SETTING` to `full` when the answer rests on the written guidelines), save the JSON and run `node scripts/lookup.mjs fresh compare <file>`.
3. On `STALE`, read the changed part from the file and tell the user the bundled data is out of date for it. Variables someone added to the file are not part of the library.
4. In a file that uses the published library, `node scripts/lookup.mjs keys <refs>` prints the `search_design_system` call for what you plan to use and the `GEIST_KEYS` line to fill (the keys of the entry whose `libraryName` is the library of the file). Variables are found by name and need no keys.

## Working rules

1. Use the library's parts; a look-alike drawn from rectangles has no states or variants.
2. Choose a component by the job it does, not by how it looks: run `find` and `choose` for every part you place or swap, also in a small edit. A dropdown that picks a date range is a date range picker; the card's When to use decides.
3. Set properties, do not override; an override survives a variant change and leaves bugs that are hard to see.
4. Bind variables, never type values; pick them by job (`rules/color.md`).
5. Restraint: hierarchy from type, space and alignment before borders, boxes and color (`rules/spacing-and-layout.md`, `rules/review-geist.md`).
6. One material per surface, chosen by elevation role (`rules/materials-and-elevation.md`).
7. Design every state: empty, loading, error, disabled and Dark.
8. Never invent a component, property or variable; state what could not be verified.

When the component is not in the library, say so and compose it from library parts and tokens. When a size, timing or binding is not in the data, read it from the file (`layout`, `motion`) or say it is unverified. When a prototype does not say what opens or closes, ask, or build the one flow that is clear and name what you left out. When the library is not enabled in the file, ask the user to enable it before building.

`node scripts/lookup.mjs rule [name] [section]` prints a rule file or one of its sections; run `lookup.mjs` without arguments for every command and `lookup.mjs helpers` for the helpers of `scripts/figma/helpers.js`. Read the one file the task needs.
