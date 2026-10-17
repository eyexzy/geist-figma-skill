# Reviewing a design against Geist

Use this when the user asks "does this follow Geist?", "audit this frame", "what is wrong with this screen", or hands over a design to check. It reviews a Figma design that uses (or should use) this library. It does not review code.

## Contents
- Procedure
- Dimensions and checks
- Severity
- Report format
- Rules a script cannot check

## Procedure

1. **Scope.** Which frame or page? If the user did not say, ask for it or use the selection. Review one screen at a time.
2. **Mechanical pass.** Print the audit with `node scripts/lookup.mjs audit <node id>` and run it through `use_figma`; a section id audits each frame in it. It reads only and lists the checks that found something, as errors (very likely wrong), warnings (look at it) and info, each with a count and the first examples. A check that is not listed found nothing. It covers:
   - **Values:** fills and strokes that are hex values, legacy or component-internal variables, text without a library text style or in another font, text bound to a background or border step, text below the WCAG 2 contrast in its own mode, corner radius, padding and gap that are not bound or not on a step, shadows without an effect style, a frame with a material that does not clip (its border is not drawn), a shadow on a frame without a fill.
   - **Geometry:** positions and sizes on a fraction of a pixel, layers beyond their screen, Clip content that cuts a child, text collapsed to a sliver, fixed text boxes, and overlays hidden by a variable that would open outside the screen, under later layers or cut by a clipping ancestor.
   - **Instances:** a missing main component, a frame named like a library component, parts of an instance restyled by hand, a dimmed frame or instance, a hover replaced by reactions set on the instance, default copy such as `Label` or `Value`.
   - **Prototype:** a variable that is set to true and never to false, set and read by nothing, or shared by several overlays; an overlay whose items react to hover inside a layer that also reacts to hover; an overlay that is not the last absolute child; a layer with a reaction and no fill; two hover reactions on one layer; a hover reached by a click; a clickable layer under 24px.
   - **Theme:** a screen whose DS / Core Colors mode is not set (it then shows Dark), and the mode of each screen.
   A frame named like a library component is a hint to look at, not a finding: verify it before you report it. The audit cannot click or hover: it does not see a state that is reached only in Present, so list those for the user to try (it prints `toTryInPresent`, the interactions of the design).
3. **Look at it.** Take a screenshot of the frame (`await node.screenshot()`), in Light and, if the file has it, Dark. The script cannot see composition.
4. **Judgment pass.** Read `node scripts/lookup.mjs brief <slug>` for each component on the frame: its When to use, Content and Assembly are what the instance is checked against. Then go through the dimensions below with the relevant rule file open: `figma-model.md` (what can go wrong and how to look for it), `choosing-components.md`, `color.md`, `typography.md`, `materials-and-elevation.md`, `spacing-and-layout.md`, `content-and-copy.md`, `accessibility-and-interaction.md`.
5. **Verify each finding** against the live node before you report it: read the property, do not rely on how it looks. Drop false positives (for example a hex value inside a component you did not build).
6. **Report** in the format below. Do not fix anything unless the user asks; if asked, change only what you reported, and re-run the script.

## Dimensions and checks

| # | Dimension | What to check | Rule file |
|---|---|---|---|
| 1 | Library use | every part that exists in the library is an instance of the public set (not a `_` helper, not a look-alike drawn from rectangles, not detached); the right component for the job by its When to use; set through its properties as its Assembly says, not overrides | `brief <slug>`, `choosing-components.md`, `recipes/configure-components.md` |
| 2 | Variables | fills, strokes, radius and spacing are bound to variables; no hex; steps used by job (100 background, 400 border, 1000 and 900 text) | `color.md`, `spacing-and-layout.md` |
| 3 | Type | text uses library text styles; the right style for the role; Button styles only in buttons; Mono only for code and ids; Strong and Subtle built as ranges | `typography.md` |
| 4 | Surfaces | the material matches the elevation role; one material per element; radius from the ladder and concentric | `materials-and-elevation.md` |
| 5 | Themes | Dark works: no unbound text color, no hardcoded fill; shadows still separate surfaces | `color.md` |
| 6 | Layout | auto layout everywhere; spacing from the steps; alignment on purpose; content that fits short and long text; no card inside card | `spacing-and-layout.md` |
| 7 | States and flows | empty, loading, error and disabled versions exist; destructive actions confirmed; each message in the component that fits it | `accessibility-and-interaction.md`, `choosing-components.md` |
| 8 | Content | the Content rules of each component (a Modal title is a statement, its primary button repeats the title verb); Title Case labels and buttons, specific button names, errors with a fix, placeholders as examples, units and numerals | `brief <slug>`, `content-and-copy.md` |
| 9 | Accessibility | targets of at least 24px (44px on mobile), visible focus, no meaning by color alone, labels for every control, names for icon-only buttons | `accessibility-and-interaction.md` |
| 10 | Prototype (if present) | each overlay has its own variable; the trigger click sits on a frame around the trigger; overlays draw above the content and are not clipped; motion respects the table | `recipes/interactive-overlays.md`, `motion-and-prototyping.md` |
| 11 | Coverage and stress | every requirement of the request is present and findable within seconds; the longest title, the longest value, an empty list and many rows each hold; sample data is realistic (not all round numbers), and nothing is left at a component default | the request, `figma-model.md` |

## Severity

- **P0 blocking**: the design cannot be built or breaks a core rule (a destructive action with no confirmation, text invisible in Dark, a control that cannot be reached).
- **P1 major**: breaks the system (detached or look-alike component, hardcoded colors, missing states, wrong component for the job, label-less fields).
- **P2 minor**: inconsistent but works (off-scale spacing, wrong text style by one step, loose copy).
- **P3 polish**: small refinements.

Most findings are not P0. Group repeated problems as one finding with a count ("14 fills are hex values, for example `Card/Title` `#171717`").

## Report format

Keep it short. Start with a verdict line, then a table, then the systemic patterns.

```
Verdict: 2 blocking, 5 major, 6 minor. Library use is good; variables and Dark mode need work.

| Sev | Where (node id) | Problem | Fix |
| --- | --- | --- | --- |
| P1 | `Card` (12:34) | fill `#ffffff` is a hex value; breaks in Dark | bind `ds/background/100` |
| P1 | `Delete` (12:50) | red rectangle with text, not a library Button | Button `variant=error` |
| P2 | `Section` (12:70) | gap 18 is off the steps | `tailwind/space/16` or `20` |

Patterns: hardcoded colors in 14 layers; spacing off the steps in 6 frames.
What works: all form fields are Input instances with labels.
```

Rules for the report: say where (name and node id), what is wrong, and the exact fix (the variable, style, property or component by name). State what works in one line, with specifics. List what you could not check (for example "Dark mode not checked: the frame has no Dark variant").

## Rules a script cannot check

Check these by looking (from Vercel's report-site guidance, `vercel.com/design.md`):

- At a glance, is the dominant element obvious and the reading path stable? With the words blurred, does the hierarchy still show emphasis and grouping?
- Is color used only where it adds meaning, with a second cue?
- Can any surface, border, pill, icon, color or label be removed without losing meaning, affordance or rhythm?
- Are there decorations that carry no information: decorative gradients, glows, arbitrary icon tiles, nested panels?
