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

The Geist component library in Figma (file key `FV7WoolwA4hN58QpnEPfVZ`) documents every component: what it is for, how it is set up, what its labels say and how it behaves. This skill carries that documentation, the library's variables and styles and the rules for using them, so an agent can advise on the library, build with it and review designs against it in any file where the library is enabled. The data, the rules and `scripts/lookup.mjs` work offline; the scripts in `scripts/figma/` run in Figma through `use_figma`.

The Figma file is the source of truth: where it and this skill disagree, the file wins. The Geist site (`vercel.com/geist`) is the source of the library; a difference between the site and the file is not an error, so build from the file and mention the difference only when the user asks about the site.

Answer in the user's language. Keep component, property, variable and style names exactly as they are in the file. Figma names follow the Geist site: the Figma `Button` is `<Button>`.

## How to work

The designer you work for finds what you leave wrong, and finds it late: a menu that opens off the screen, a hover that sticks, a border that is not drawn. Work so that there is nothing for them to find. This is the method; the sections below hold the knowledge it uses. Following a step in spirit and skipping it in letter is skipping it.

1. **Frame the job first.** Before you touch Figma, write down the screens; every interactive element and each of its states (rest, hover, open, disabled, error, empty, loading, Light, Dark); what sits inside what; what the user must be able to do in Present; and for every text and number the shortest, the typical and the longest value you will test with. Ask the user only what blocks you: what opens what, content you cannot invent. Say every other choice out loud as your assumption and go on: a default the user never heard is one they could not reject.
2. **Look for what can go wrong, by class.** Read `rules/figma-model.md`. For each of its classes that applies, name the risk in this job and how you will check it. A risk with no check is a risk you accept, and the report says so.
3. **Inspect, then use what the library already does.** Read what the file already has (existing screens, the variables and styles in use, the enabled library) and match it. Place the component, read its card (`brief <slug>`) and set its properties. Do not add a reaction, an override or a frame that the component already has; when wiring is needed, add only what the card asks for.
4. **Build in small steps and read back.** One section per call. After each call read what you set from the file, not from your script: property values, bindings, sizes. Look at each section on its own: a reduced screenshot of the whole screen hides cut text, wrong colors and copy left at its default.
5. **Look at every state.** Each state you listed in step 1 is looked at, not assumed. A screenshot shows one state at one moment, and a closed overlay is invisible in it: show it open (`recipes/interactive-overlays.md`, Show the open state on the canvas), look at what sticks out of it and check that it fits. Run the longest text and the empty case through the same screen. For hover and press set the variant and compare it with rest. What only a pointer can test goes on a list for the user.
6. **Run the audit until it is clean, then review the work as the designer would.** Print it with `node scripts/lookup.mjs audit <node id>` and run it through `use_figma`. For each finding name the cause before you fix it: the wrong component, a restyled instance, a value that is not bound, wiring, layout. Fix at that cause. Three rounds of audit and fix are enough; report what remains. A clean run is evidence, not proof: it cannot hover or click. Then review the result against `rules/review-geist.md`. If you can start a sub-agent, give a fresh one only the node ids and that file and have it review the result before you hand it over; it must not see your reasoning. If you cannot, review it yourself and say in the report that the review was not independent.
7. **Report with evidence.** Use this form; a report without the last two parts is incomplete.
   - Built: names and ids.
   - Evidence: the audit run (errors, warnings, what remains and why), the states you looked at, the values you read back, and for each overlay its open size and position inside its frame.
   - Not checked, to try in Present: the exact interactions (the audit prints `toTryInPresent`).
   - Assumed: every choice that was yours.

   Do not claim a check you did not run.

### What counts as done

No claim without evidence from this turn: before you write that something works, fits or is correct, name the evidence, produce it now, read it, and only then say it. A paraphrase of success is a claim too.

| Claim | Evidence that supports it | Does not support it |
|---|---|---|
| The screen is correct | the audit with no errors and a screenshot of each state you listed | a screenshot of the resting state alone |
| The prototype works | bindings, variables and reactions read back, and the list of clicks for the user | "I wired it" |
| It works in Dark | a screenshot in Dark and the mode read from the frame | "I set the mode once" |
| It fits | the open size and position of each overlay measured inside its frame | it looks fine at rest |

Stop and rethink when you are about to write "should", "probably", "looks good" or "done" about a state you have not looked at, when you add a second reaction, override or frame to repair the first one, or when you repair the same area for the third time. Then follow `rules/when-it-misbehaves.md`: find the cause before the next fix, compare with a clean instance of the component, change one thing at a time, and ask the user after the third failed attempt.

| What you tell yourself | Why it fails |
|---|---|
| The audit is clean | It reads geometry and wiring. It cannot hover or click. |
| The screenshot looks right | It shows the state of that moment. Overlays are closed in it. |
| I read the card, so I know how it behaves | The card describes the component alone, not your combination of parts. |
| The component already does this | An instance can replace what its component does; read it back. |
| It works now, I changed one more thing | Then you do not know which change fixed it. Undo the others. |
| A fraction of a pixel is invisible | It blurs borders and shadows. |
| I will note it for later | Note only what you cannot check. Fix the rest. |

## The component documentation

Every component has a card with three parts. Answers go wrong where an agent skips it: a default it did not expect, a label the Content rules forbid, a property it guessed.

| Question | Section of the card | Command |
|---|---|---|
| Is this the right component, or another one? | Best Practices: When to use | `brief <slug>`, `choose <words>` |
| How is it set up: properties, parts, slots? | Figma Guidelines: properties, Assembly | `brief <slug>`, `component <slug>` |
| What do its title, buttons and messages say? | Best Practices: Content | `brief <slug>` |
| How does it behave, where does focus go? | Best Practices: Behavior, Accessibility | `guide <slug> Behavior`, `guide <slug> Accessibility` |
| Exact sizes, spacing, tokens | Figma Guidelines: Layout, Tokens | `guide <slug> Layout`, `layout <slug>` |
| How it opens, closes and animates | Figma Guidelines: Motion, Assembly | `motion <slug>`, `guide <slug> Assembly` |
| What the published component does in code | Behavior in Code | `guide <slug> "Behavior in Code"` |

Read `node scripts/lookup.mjs brief <slug>` for each component before you recommend, place or review it. It prints the public sets with every property and default, the Best Practices and the Assembly steps in one call.

## Advise

1. Find the component: `find <words>` for a need, `choose <words>` between similar ones, `rules/choosing-components.md` for the full decision tables. A need the library has no component for is in its last section.
2. Read `brief <slug>`.
3. Answer with the component and set, the properties to set with exact names and values, the default, one sentence of why from the card, and the Figma link from `component <slug>`. An answer without the property names and the link was written from memory. For a choice between components: the pick and the one condition that would switch it. Do not paste whole property tables unless asked.

> Use Button with `variant=error`, `size=large`, `showPrefix=true`, `prefix=Trash` and `label="Delete Project"`. The default is `variant=default, state=default, shape=default, size=medium`. Confirm it in a Destructive Action Modal: the action deletes a resource, and its Best Practices ask for a typed gate there. Link: the set link from `component button`.

Tokens and styles are chosen the same way: `use <words>` finds the variable, text style, material or spacing for a job; the reasons are in `rules/color.md`, `typography.md`, `materials-and-elevation.md` and `spacing-and-layout.md`. Icons: `icon <words>` understands meanings such as "delete" and "settings".

## Build

Follow the method above. These are the tools of the build:

1. Check the data against the file once per session (below).
2. Validate the plan before you build: `node scripts/lookup.mjs check "Button: variant=error label=\"Delete Project\"" "Input > Label: value=Name"`. It rejects a set, part, property or value the library does not have.
3. Build with the recipes: `recipes/build-screen.md` (frames, variables, styles, Light and Dark), `recipes/configure-components.md` (one instance, its properties, slots and states), `recipes/forms.md` (form controls), `recipes/interactive-overlays.md` (anything that opens and closes). Add interactions only when asked.
4. Audit and report as steps 6 and 7 say.

> Built "Settings" (Light, `11:2`) and its Dark copy (`11:40`): three Fieldset cards with Input, Select and Toggle, and a danger card with a Button `variant=error`. Fills, spacing, radius and text are bound to the library's variables and styles; the audit reports no errors and mode Light and Dark on the two frames. Looked at: rest, Dark, an error state on the Input. Not done: the prototype, which was not requested. Assumed: the card titles.

Without Figma tools, answer with the exact components, properties and variables the designer should set in the Figma UI.

## Review

Follow `rules/review-geist.md`: run the audit on the frame (`lookup.mjs audit <node id>`) for what a script can see, take screenshots in Light and Dark and of each state, then check each component against its card (`brief <slug>`: is it the right one, set through its properties, are its labels written as its Content rules say) and the frame against the rules. Report a verdict line and a table of findings, each with the node, the problem and the exact fix.

## Where Figma and the library differ from what you would assume

| You would assume | What holds | Read |
|---|---|---|
| A new frame is Light | The default mode of `DS / Core Colors` is `Dark`. Set the mode on the root frame of the screen (`geistFrame` option `theme`). | `recipes/build-screen.md` (Light and Dark) |
| `Switch` is the on/off control | `Switch` is a segmented selector of options. An on/off setting is `Toggle`. | `rules/choosing-components.md` |
| A part an instance hides does not exist | Parts hidden while an instance is closed (a menu list, an overlay panel) are skipped unless `figma.skipInvisibleInstanceChildren` is `false`. The helpers and the read scripts set it. | `recipes/configure-components.md` (Slots) |
| A frame around components is harmless | Clip content cuts the borders and rings the components draw outside their edge. `figma.createFrame()` and `figma.createAutoLayout()` turn it on; `geistFrame` leaves it off, except on a frame with an effect style, whose material border is drawn only while Clip content is on. Set `clipsContent = false` on any other frame that holds components. | `rules/materials-and-elevation.md` (Clipping) |
| An overlay sits above what it is placed over | Later siblings draw over earlier ones: an overlay is an absolute last child, and a menu that opens downward needs canvas stacking `First on top` on the layouts above the content below it. | `recipes/interactive-overlays.md` |
| One variable runs the prototype | One boolean per overlay. The library `state/*/open` variables are shared by every instance wired to them. `geistRewireReactions` moves the wiring of an instance to your variable. | `recipes/interactive-overlays.md` |
| A click on the trigger Button is enough | A reaction set on the Button replaces the reactions of its master. Put On click on a frame around the trigger. | `recipes/interactive-overlays.md` |
| Select an option on the item | Select on the group (`checked`, `active`). An override on an item survives later changes. | `recipes/configure-components.md` |
| Text dropped into a slot is styled | It is your own layer, black and without a style. Create it with `geistText`. | `recipes/configure-components.md` (Slots) |
| Every Geist page has a component here | Some site components (Entity, Scroller, Context Menu...) have no set, and the library has no sidebar or top bar. Build them from frames, library parts and tokens, and say so. | `rules/choosing-components.md` |

## Check the data against the file

Do this once per session, before giving exact values or building. Skip it for advice that needs no exact values.

1. Work out the mode. The library file has pages named `↳ Button`, `↳ Colors` and so on. Any other file uses the published library, which must be enabled for that file.
2. Run `scripts/figma/fresh-check.js` through `use_figma` (it picks `quick` in the library file and `consumer` in another file; set `MODE_SETTING` to `full` when the answer rests on the written guidelines), save the returned JSON to a file and run `node scripts/lookup.mjs fresh compare <file>`.
3. On `STALE`, read the changed part from the file and tell the user that the bundled data is out of date for it. Variables and collections that someone added to the file are not part of the library: a difference that comes from them is not staleness.

## Working rules

1. Use the library's parts. A look-alike drawn from rectangles has no states or variants and does not follow the library.
2. Set properties, do not override. An override survives a variant change and leaves bugs that are hard to see.
3. Bind variables, never type values; pick them by job (`rules/color.md`).
4. Restraint: hierarchy from type, space and alignment before borders, boxes and color (`rules/spacing-and-layout.md`, `rules/review-geist.md`).
5. One material per surface, chosen by elevation role (`rules/materials-and-elevation.md`).
6. Design every state: empty, loading, error, disabled and Dark (`rules/review-geist.md`).
7. Never invent a component, property or variable. State what could not be verified.

## Ask or say, do not guess

- The component is not in the library: say so and compose it from library parts and tokens. Do not draw a look-alike of a library component.
- A size, timing or binding is not in the data: read it from the file (`layout`, `motion`) or state that it is unverified.
- A prototype is requested without saying what should open or close: ask, or build the one flow that is clear and name what you left out.
- The file does not have the library enabled: ask the user to enable it (Assets, Libraries) before building.

## Files

```
component-docs/                         the card of each component; read it with brief and guide
data/                                   components, variables, styles, icons and motion of the file, and its fingerprint (stamp.json); read it with lookup.mjs
rules/
├── figma-model.md                      how the work goes wrong: states, layer order, geometry, bindings, nested reactions, instances
├── when-it-misbehaves.md               finding the cause when a build does not behave
├── choosing-components.md              which component for which need, the capacity of the sets, site components without a set
├── color.md                            which variable for which job
├── typography.md                       which text style for which job
├── materials-and-elevation.md          which material for which surface, and clipping
├── spacing-and-layout.md               spacing, radius, page widths and grids
├── content-and-copy.md                 labels and messages
├── accessibility-and-interaction.md    focus, targets and states
├── motion-and-prototyping.md           motion and prototype reactions
├── review-geist.md                     the review procedure and report
└── sources.md                          where every fact comes from
recipes/
├── build-screen.md                     frames, variables, styles, Light and Dark
├── configure-components.md             one instance: properties, nested parts, slots, states
├── forms.md                            form controls
└── interactive-overlays.md             anything that opens and closes
scripts/
├── lookup.mjs                          the offline lookup; run it without arguments for every command
└── figma/                              scripts for use_figma: helpers.js (print what a script needs with lookup.mjs helpers <names>), audit.js, fresh-check.js, read-examples.js, read-layout.js
```

`node scripts/lookup.mjs rule [name] [section]` prints a rule file or one of its sections. Read the one file the task needs.
