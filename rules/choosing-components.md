# Choosing between similar components

Source: the Best Practices of each component, which the Figma file takes from the Geist site (`vercel.com/geist/<component>`). Where the site has none, the library author wrote them from the Geist code; `NOTICE.md` lists those components. Component names in **bold** are sets of this library. Thresholds are the numbers the Best Practices give; treat them as defaults.

## Contents
- Capacity of the Figma sets
- Actions
- Text entry
- Choosing from options
- Boolean settings
- Messages and feedback
- Waiting and progress
- Overlays
- Menus
- Navigation and structure
- Showing data
- Code
- Geist site components without a set

## Capacity of the Figma sets

The thresholds below are the Best Practices. A Figma set can show fewer parts than the guideline allows. Numbered properties (`showItem3`, `showTab5`) fix how many parts one instance can show:

| Set | Part | Up to |
|---|---|---|
| Avatar Group | member | 5 |
| Breadcrumb | item | 7 |
| Choicebox Group | item | 6 |
| Collapse Group | item | 6 |
| Context Card | label, value, row | 4 |
| Kbd Group | kbd | 5 |
| Radio Group | item | 6 |
| Relative Time Card | zone, date, time | 2 |
| Switch | item | 5 |
| Tabs | tab | 5 |

Past a set's capacity, build the rest from the part sets or choose another component.

## Actions

| Need | Use | Instead of, and when to switch |
|---|---|---|
| An action that changes state (deploy, save, delete) | **Button** | a link-style navigation that changes the URL is a button link, not a state-changing Button |
| One main action plus 1 to 4 close variants | **Split Button** | unrelated actions in one place: **Menu** |
| Several related actions behind one trigger | **Menu** (labelled trigger) or **Dots Menu** (icon-only three-dot trigger) | do not scatter several buttons in a row |
| Copy a value people paste elsewhere | **Copy Button** | a shell command with a prompt: **Snippet** |
| Add more rows to a long list | **Load More Button** (append) or **Show More** (reveal in place) | optional sections: **Collapse** |
| Previous / next between sequential sibling pages (docs articles, blog posts, onboarding steps) | **Pagination** | revealing more rows of one list: Show More |

Button rules: `error` for destructive confirmation, `secondary` for supporting action, `loading` instead of a hand-placed spinner, `disabled` only when the action is impossible right now (pair with a **Tooltip** that says why).

## Text entry

| Need | Use | Switch when |
|---|---|---|
| A single-line value (name, domain) | **Input** | content can wrap to several lines: **Textarea** |
| Free-text comment, message, description | **Textarea** | single value: Input |
| Pick one from a long list by typing | **Combobox** | short fixed list where typing adds nothing: **Select** |
| Pick one from a short fixed list (under about 10) | **Select** | filtering helps: Combobox; 2 to 3 mutually exclusive views: **Switch** |
| Pick several from a list | **Multi Select** | a single value: Select; typing to filter matters more: Combobox; a boolean: **Toggle** |
| A numeric value where proximity matters (bandwidth, opacity) | **Slider** | an exact value (port, memory): pair with an Input |
| Pick a date or range | **Calendar** | an ISO date or a relative shorthand like `7d`: free-form Input |
| A keyboard shortcut hint | **Keyboard Input** (`Kbd`) | in running text write the shortcut out |

Group related controls of one setting inside a **Fieldset** (a bordered card with a footer for actions). Name every control with a **Label**. Do not wrap a labelled Input or Select in a Tooltip; put the hint on a sibling icon button.

## Choosing from options

| Options | Use |
|---|---|
| 2 to 3 mutually exclusive views of the same surface (`Source` / `Output`) | **Switch** (segmented selector) |
| A few options, label only, up to about 6 | **Radio** |
| A few options with a description, icon or badge; 4 to 6 tiles at most | **Choicebox** |
| More than 6 options | **Select** or **Combobox** |
| A multi-select list (table row pickers, filters, preference groups) | **Checkbox** |
| Sibling views inside one page | **Tabs** (5 to 7 on desktop, 3 to 4 on mobile; the Figma set holds 5) |

## Boolean settings

| Need | Use | Not |
|---|---|---|
| A single boolean setting that takes effect at once (`Password Protection`, `Auto-Cancel Builds`) | **Toggle** | Checkbox (clearer on/off mechanic here); disable it only when the action is impossible, with helper text or a Tooltip that names the resolver |
| One item of a multi-select list, or a statement the user must affirm (terms of service) | **Checkbox** | Toggle |
| A theme choice (Light / System / Dark) | **Theme Switcher**, once per app, in the footer or settings | rebuilding it from Switch or three icon buttons |
| 2 to 3 mutually exclusive views | **Switch** (radio semantics) | Toggle |

## Messages and feedback

| Situation | Use |
|---|---|
| Transient confirmation of a user action | **Toast** (non-blocking) |
| Inline context next to the field, card or section it describes | **Note** |
| Page-level or site-wide announcement with one action | **Banner** |
| Project-wide state that needs resolution (billing, rollback, attack) | **Project Banner** (not dismissible; if it can be dismissed, use a Note) |
| An inline error message that must be announced | **Error** |
| The error state of a whole region | **Error Card** |
| Field-level validation | the `error` state of the **Input**, not a toast |
| Nothing to show yet | **Empty State** (title, description, real Button) |
| A prompt for the user's opinion at the end of a page, doc or completed flow | **Feedback** (not a support form, bug report, or NPS) |
| Destructive confirmation | a **Modal**, not a Toast |

Persistent configuration warnings belong in a Note or Banner, not a toast.

## Waiting and progress

| Wait | Use |
|---|---|
| A single action, about 1 to 3 seconds, indeterminate | **Spinner** (in a Button use `loading`) |
| Inline copy that waits (`Saving…`) | **Loading Dots** |
| Content that will fill a known layout | **Skeleton** |
| Known total or stages | **Progress** (use stops only for real stages and label them) |
| Usage against a limit, a health percentage | **Gauge** (a number needs a label or Tooltip next to it) |
| A deployment state | **Status Dot** (non-deployment states: **Badge**) |

## Overlays

| Need | Use | Not |
|---|---|---|
| A decision that blocks the page | **Modal** | |
| Destructive and serious, with friction (delete, revoke, rotate) | **Destructive Action Modal** (typed gate; reversible actions drop the irreversibility line) | routine confirmations (save draft, discard changes): a plain Modal |
| Persistent associated context while the page stays useful (deployment details, row inspector) | **Sheet** on desktop | confirming destruction; a bottom Drawer on desktop |
| Mobile bottom panel | **Drawer** | destructive confirmation |
| One sentence on hover or focus that says why something exists or what limits it | **Tooltip** | wrapping a labelled form field; long-form content or actions (Drawer or a page) |
| A preview of an entity (avatar, identifier, 2 to 4 facts, one action) | **Context Card** | more than one action: a Menu |
| The exact time behind a relative timestamp | **Relative Time Card** | |
| Global, keyboard-first command palette (`⌘K`) | **Command Menu** | an in-page filter input |

## Menus

| Need | Use |
|---|---|
| Actions on one resource from a visible labelled trigger | **Menu** |
| The same with an icon-only trigger | **Dots Menu** |
| Right-click or long-press on a row | Context Menu, which has no set (last section) |
| A permission-gated action | **Menu** with a locked item so the reason is visible |

## Navigation and structure

| Need | Use |
|---|---|
| Where a page sits in a hierarchy | **Breadcrumbs** (`text` to navigate, `menu` when a step runs an action) |
| Sibling views on one page | **Tabs** |
| Optional or advanced content most visitors skip (FAQ, advanced settings) | **Collapse** (one block) or a Collapse Group |
| A group of related settings | **Fieldset** |

## Showing data

| Need | Use |
|---|---|
| Rows of the same shape with at least one sortable or comparable column | **Table** (an empty list: Empty State outside the table) |
| Key/value metadata (`Last Deployed: 3 minutes ago`) | **Description** |
| A user, team or organization | **Avatar**; two or more stacked: **Avatar Group** |
| Short scannable metadata (status, plan, environment, role) | **Badge** (one per row); clickable filter chip: `pill` or a small Button; a colored dot: Status Dot |
| A hierarchical directory | **File Tree** |
| A divider between blocks of one container | **Separator** (inside a Menu: the menu divider) |
| A labelled-volume cover on a marketing page | **Book** (in-product cards: use your own card surface) |
| A website screenshot in a browser frame | **Browser** |
| A video with controls | **Video** |

## Code

| Need | Use |
|---|---|
| Multi-line highlighted source | **Code Block** |
| A runnable shell command to copy, or a secret value reveal | **Snippet** / **Secret Value** |
| A single inline token (env var, function name, path) | the Inline Code component (page `↳ Inline Code`; it has no documentation frame and is not described in this skill, so inspect it in Figma before use) |

## Geist site components without a set

The Geist site has component pages that have no set in this file. Read the page (`vercel.com/geist/<page>.md`) for what the component is for; build from the library's own parts.

| Site page | What it is, in the site's words | In this file |
|---|---|---|
| Search Input (`search-input`) | pre-configured search input with a magnifying glass icon and clear button | Input, configured as in `guide input Assembly` |
| Clearable Input (`clearable-input`) | text input with a clear button that resets the value on Escape | Input, configured as in `guide input Assembly` |
| Text With Copy Button (`text-with-copy-button`) | text alongside a button that copies the text to the clipboard | none |
| Context Menu (`context-menu`) | a menu for contextual actions, revealed on right click or long press | none |
| Entity (`entity`) | up to two columns: arbitrary content on the left, controls or actions for it on the right | none |
| Scroller (`scroller`) | an overflowing list of items | none |
| Phone (`phone`) | website screenshots or other content in a phone-style frame | none |
| JSON View (`json-view`) | JSON objects and arrays as a collapsible tree with syntax coloring | none |
| Middle Truncate (`middle-truncate`) | truncates text in the middle, preserving its start and end | none |
| Code (`code`) | a snippet of code with syntax highlighting | none |
| Grid (`grid`) | cell-and-guide layouts for marketing pages, docs landing pages and feature breakdowns | grid styles of the file (`spacing-and-layout.md`), not the component |
| Sidebar | the navigation column of an application | none, built from frames (below) |
| Top bar | the bar along the top of an application | none, built from frames (below) |

Sidebar and top bar are built as named auto layout frames on the grid style `Layout/App Shell 1220` (260 sidebar and content), put library parts inside and bind their fills, strokes, spacing and text to the library variables and styles. Say in the answer which frames are built this way and are not library parts.
