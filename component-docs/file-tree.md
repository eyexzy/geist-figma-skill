# File Tree

Display a hierarchical directory structure with expandable folders and files, useful for illustrating project layouts.

Best Practices: written by the author of this library from the Geist code; the site page https://vercel.com/geist/file-tree has none.

Contents: Best Practices, Figma Guidelines, Anatomy, Tree properties, _Folder properties, _File properties, Assembly, Folder variables, Folder reactions, Layout, Motion, Tokens, Behavior in Code, Props in code

## Best Practices

- Use `Tree` to show a directory layout, such as a deployment output or a project structure.
- Nest `Folder` and `File` inside `Tree`. Each `Folder` renders its children one level deeper, so depth is unlimited.
- Set `defaultOpen` on a `Folder` when readers need its contents at first glance. Use `open` and `onToggle` when your state owns it.
- Pass `name` to every `Folder` and `File`. `label` replaces it in the row, and the row `title` repeats the text.
- Set `type` on a `File` to `lambda`, `edge-function`, or `middleware` when its runtime matters; any other file shows the plain file icon.
- Set `active` on the current `File` to give its label a heavier weight and its icon a stronger color.
- Add `href` to a `File` to set the link target; every `Folder` row is a button.
- Add `card` to `Tree` to place it on a padded, shadowed surface.

## Figma Guidelines

### Anatomy

- `Tree` — `<Tree>`: the container, with one slot, `items`.
- `Card Surface` draws the card fill, radius, and shadow behind the slot.
- `_Folder` — `<Folder>`: one folder row.
- `_File` — `<File>`: one file row.
- `List Item` holds a folder row and its `List`. `List` holds the rows inside that folder.
- `Connector 1` to `Connector 5` draw the guide lines of one row, one per depth level.

### Tree properties

- `items` — the slot that holds the tree, `children` in code. Its default content is the example tree.
- `card` — `true` puts the tree on a surface with a fill, a shadow or ring, and an 8px radius.
- `card` `true` sets the `File Tree / Card` collection to its `Card` mode, which makes labels 16px.

### _Folder properties

- `open` — `true` shows the open-folder icon, `false` the closed one.
- `state` — `default` or `hover`.
- `label` sets the folder name. `iconFolderOpen` and `iconFolderClosed` swap the two icons.
- `showConnector1` to `showConnector5` show the guide line of each depth level.

### _File properties

- `label` sets the file name. `iconFile` swaps the icon.
- `state` — `default` or `hover`.
- `active` — `true` sets the label to SemiBold and brightens the icon.
- `showIcon` shows or hides the icon; the label moves 24px left when the icon hides.
- `showConnector1` to `showConnector5` show the guide line of each depth level.

### Assembly

- Build the tree inside the `items` slot of a `Tree` instance.
- To add a file, duplicate a `_File` row inside a `List` and set its `label`.
- To add a folder with rows, duplicate a `List Item`, rename its folder and files, then give it a variable.
- A row inside 3 nested `List` frames turns on `showConnector1` to `showConnector3`. A top-level row has all five connectors off.
- After moving a duplicate to another depth, update its connector properties to match.
- To mark the current file, set `active` to `true` on its `_File` row. Hover keeps working on it.
- To move the mark, set the old row to `false` and the new row to `true`.
- A current file inside a closed folder stays hidden. Set that folder’s variable and `open` to `true`, and do the same for each parent folder.

### Folder variables

- Each folder opens and closes in Present through its own boolean variable.
- Create one boolean variable per folder, for example `file-tree/folder/top-3/open`.
- Set the variable to `true` for a folder that starts open and `false` for one that starts closed.
- Bind `visible` of the folder’s `List` to its variable. A duplicated `List` stays bound to the variable of the source folder.
- Set `open` on the `_Folder` row to `true` for an open folder and `false` for a closed one.
- `open` picks the icon shown at rest. Keep it equal to the variable: open icon with visible rows, closed icon with hidden rows.
- Point the three reactions at the new variable: every `If` condition and both `Set variable` actions of `On click`.
- Changing `open` adds an unconditional `On hover` reaction to the row. Delete it, so only the three conditional reactions remain.

### Folder reactions

- `On hover` — `If` the variable equals `true`, `Change to` `open=true, state=hover`; otherwise `open=false, state=hover`.
- `Mouse leave` — `If` the variable equals `true`, `Change to` `open=true, state=default`; otherwise `open=false, state=default`.
- `On click` — `If` the variable equals `true`, `Set variable` to `false` and `Change to` `open=false, state=default`.
- Otherwise `On click` sets the variable to `true` and changes to `open=true, state=default`.

### Layout

- A row is 28px tall. Top-level rows sit 1px apart; nested rows touch.
- Each depth level indents 23px. A guide line is 1px wide and sits 7.5px into its level.
- Folder icons are 16px × 16px and file icons 14px × 14px. Each is followed by 8px, so labels start 24px in.
- Every row starts 8px left of the top-level icons, and its hover fill starts there at any depth.
- Labels are Geist Mono 13px; a card makes them 16px.
- A card keeps the rows 24px from its edges.

### Motion

- Hovering a row fills it instantly. Opening or closing a folder shows its rows instantly.
- The `On hover`, `Mouse leave`, and `On click` reactions use `Instant`.

### Tokens

- Row hover fill: `ds/gray/200`, radius `tailwind/radius/sm`.
- Label: `accents/8`. Icons: `ds/gray/900`.
- Guide line: `ds/gray/400` on `components/file-tree/connector/transparent`.
- Active label: Geist Mono SemiBold. Active icon: `ds/gray/1000`.
- Card fill: `legacy/background`, radius `tailwind/radius/lg`.
- Card shadow: effect style `legacy/shadow/smallest`, a drop shadow in light and a 1px ring in dark.
- Its colors: `legacy/shadow/smallest/drop` and `legacy/shadow/smallest/ring`.
- Label size: `file-tree/label/size`, 13px in `Default` and 16px in `Card`.

## Behavior in Code

### Props in code

- The code opens a folder with `defaultOpen` or `open` and reports changes with `onToggle`.
- `<File>` also takes `href`; the row looks the same either way.
- `<File>` always renders an `<a>` row, and `type` swaps the icon for `lambda`, `edge-function` or `middleware`.
- `<File>` takes `showIcon`, default `true`, and passes other props to its `<a>`.
- `<Tree>` takes `card`, default `false`, and `<Folder>` takes `label` and `className`.
