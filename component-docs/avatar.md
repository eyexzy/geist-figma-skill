# Avatar

Avatars represent a user or a team. Stacked avatars represent a group of people.

Source of the Best Practices: https://vercel.com/geist/avatar

Contents: Best Practices, Figma Guidelines, Anatomy, Avatar properties, Avatar Group properties, States, _Avatar Badge properties, Assembly, Scaling, Motion, Tokens, Behavior in Code, Props in code, Runtime in code, Accessibility in code

## Best Practices

- Use a single `<Avatar>` for one person, team, or organization. For two or more stacked avatars, use `<AvatarGroup>` so the cluster gets correct overlap, sizing, and a single accessible label.
- Pass `src` first and fall back to `letter` (1–2 uppercase chars) when the image is missing. Reserve `placeholder` for the loading shell, never as a permanent fallback.
- `title` is the literal entity name (`Acme Inc.`, `Jane Doe`). Geist already prefixes letter avatars with `Avatar with initials:` for screen readers, so don’t hand-write `Avatar of …`.
- Keep `letter` uppercase and derived from the entity name. No emoji, no punctuation, no `?`.
- Pick a size that matches adjacent type: 20–24px next to `text-label-14`, 32px next to `text-label-16`, 48–64px in headers and onboarding states.

## Figma Guidelines

### Anatomy

- `Avatar` — one person, team, or organization. A circle with a 1px border and an optional corner badge.
- `Avatar Group` — a stacked cluster of members with an overflow counter.
- `_Avatar Badge` — the corner mark, nested inside `Avatar`.
- `_Avatar Placeholder` — the loading shimmer. Nested inside `Avatar` at `type=placeholder`.

### Avatar properties

- `size` — 24px, 32px, or 48px. The letter and badge scale with it.
- `letter` — the initials. Applies only at `type=letter`.
- `showBadge` — shows or hides the corner badge.

### Avatar Group properties

- `overlap` — negative spacing between members. `auto` scales with size: −7px at 24px, −10px at 32px, −14px at 48px. `6` and `0` hold at every size.
- `reverse` — flips which member paints on top. Member 1 stays leftmost, so the left-to-right order is unchanged.
- `showMember2` to `showMember5` — the visible members. Members 2 and 3 are on by default.
- `showCounter` — shows or hides the overflow chip. It is on by default.
- `count` — the overflow chip text, typed manually.
- Each member is an `Avatar` instance pinned to `username` with the badge off. Changing faces means overriding each image fill by hand.

### States

- `username` — the entity has a photo.
- `letter` — the photo is missing and the name is known. Shows initials on a tinted fill.
- `default` — generated artwork for an entity with neither photo nor name to abbreviate.
- `placeholder` — loading.

### _Avatar Badge properties

- The nested `_Avatar Badge` carries its own `type`: `github`, `gitlab`, `bitbucket`, or `custom`.
- Each type maps to its own React component: `<GitHubAvatar />`, `<GitLabAvatar />`, `<BitbucketAvatar />`, and `<AvatarWithIcon />`.
- At `type=custom`, swap the `icon` slot for any icon from the library.
- The badge is always half the avatar’s width: `small` (12px) at 24px, `medium` (16px) at 32px, `large` (24px) at 48px.

### Assembly

- Toggle `showBadge` on the `Avatar` instance rather than placing `_Avatar Badge` beside it.
- Change `size` through the property. The badge sits at an absolute offset and ignores a manual resize.

### Scaling

- `24` — letter 12px · badge 12px · badge offset x −3px, y 16px
- `32` — letter 16px · badge 16px · badge offset x −3px, y 21px
- `48` — letter 24px · badge 24px · badge offset x −5px, y 32px

### Motion

- `_Avatar Placeholder` animates its `Shimmer` layer, a gradient 20× the avatar’s width.
- The gradient starts at −4× the width and moves by −12× on `TRANSLATION_X` over 8s with `Ease In And Out`.
- Set `Duration` to `8 s` in the timeline panel of the top-level frame, or the sweep stops before the end.

### Tokens

- Radius `tailwind/radius/full`. Border `border/width/default` with `ds/gray/alpha/400`: white at 14% in Dark, black at 8% in Light.
- `letter` fill: gradient `accents/1` → `accents/2` → `accents/1` under an `accents/6` tint at 50% layer opacity. Initials `ds/white`.
- Members and the counter carry `ring/background`, a 1px ring in `legacy/background` that separates overlapping avatars.

## Behavior in Code

### Props in code

- `overlap` accepts any pixel value.
- `members` is an array of any length, and `limit` renders `limit − 1` members with the counter over the next one.
- `count` reads `+N` for the members past the shown ones plus `extra`, and `9+` above 9.
- `limit` defaults to `3`, so two members and the counter render.

### Runtime in code

- The placeholder runs `loading 8s ease-in-out infinite`, moving `background-position` from `200%` to `-200%`.
- The `::before` gradient runs `accents-1` → `accents-2` → `accents-1` at `400%` width.

### Accessibility in code

- `placeholder` renders no image and reads as `Placeholder Avatar` to screen readers.
