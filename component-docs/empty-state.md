# Empty State

Fill spaces when no content has been added yet, or is temporarily empty due to the nature of the feature and should be designed to prevent confusion.

Source of the Best Practices: https://vercel.com/geist/empty-state

Contents: Empty state Design framework, Design framework, Best Practices, When to use, Behavior, Content, Figma Guidelines, Anatomy, Empty State properties, _Empty State Link properties, Assembly, Layout, Motion, Tokens, Behavior in Code, Props in code, Runtime in code, Accessibility in code

## Empty state Design framework

### Design framework

When designed thoughtfully, empty states become an essential part of a smooth user experience, providing enough context to keep users working in a productive way. There are several approaches to explore that will match the needs a developer in different situations:
- **Blank Slate** - Basic empty state for first run experience
- **Informational** - Alternative for first use empty state, including in-line CTAs and supplemental documentation links
- **Educational** - Launch a contextual onboarding flow to gain deeper understanding about that area of the app
- **Guide** - Starter content that allows users to interact with data and learn the system by tinkering or setting up their environment

[Diagram: Matrix; labels: Educational, Guide, Intuitiveness High, Information Density High, Intuitiveness Low, Information Density Low, Informational, Blank Slate, Axis Title Intuitiveness, Axis Title Information Density]

## Best Practices

### When to use

- Pick the variant by what the user needs: no-results for a filtered list that returned zero rows, blank slate or informational for a resource the user hasn’t created, cleared for completed work, permission for role or tier denials, error for a failed load.
- Render the permission and tier-denial variants full-page when the user lands on a route they can’t view. Use a **Note** only when one tile inside an otherwise-accessible page is gated.
- Don’t put critical persistent warnings here. Empty states vanish when the list populates; persistent warnings belong in **Note** or the page header.

### Behavior

- The CTA must be a real **Button** or **Link**, not an `onClick` div, so it joins the tab order and exposes a role.
- Cap at one primary CTA, plus one secondary when the first action could legitimately be one of two paths (`Import Repository` and `Deploy Template`). Three CTAs is a smell.
- After an async filter change, wrap the region in `aria-live="polite"` so screen readers announce the new state.
- Don’t auto-launch a tour from the educational variant; pair `Start Tour` with `Skip`.

### Content

- `title` is Title Case (`No Logs Match Your Filter`); `description` is sentence case and adds new information instead of restating the title.
- Quote a single typed query verbatim with curly quotes: `No logs match “${query}”. Clear the filter to see all logs.` For multi-facet filters use the plural template `No {Items} Match Your Filters` and suggest widening or clearing.
- Onboarding bodies name the next action that creates the first item: `Push to your Git repository to create your first one.` Tier-gated bodies follow `{Feature value} with the {Plan} plan.`
- Error variant pairs the body with a copyable request ID and a `Try Again` button.
- CTA labels are Title Case `Verb + Noun`. Never `Get Started`, `Continue`, or `OK`.

## Figma Guidelines

### Anatomy

- `Empty State` — `<EmptyState>`: the container with `Icon Badge`, `Text`, the `children` slot, and `Border`.
- `Icon Badge` — `<EmptyStateIcon>`: a 54px square around the `icon` instance.
- `Text` — `Title` and `Description`, centered in one column.
- The `children` slot holds a **Button** and `_Empty State Link` by default.
- `_Empty State Link` — `<Link>` with `type="secondary"` and an optional external icon.

### Empty State properties

- `secondary` — `true` changes the fill and reduces the title from 16px/24px to 14px/20px.
- `border` — toggles the `Border` layer.
- `icon` — swaps the 32px glyph in `Icon Badge`.
- `children` — a slot. Layers added to it stack in one column, centered, with 24px between them.

### _Empty State Link properties

- `external` — shows the 16px `ExternalSmall` icon after the label.

### Assembly

- Wrap two **Button** instances in a horizontal frame inside the `children` slot to place them side by side.
- Set `showChildren` to `false` for a blank slate; the 24px gap above the slot is removed with it.
- Set the instance width to the container width; `Text` stays centered and wraps at 340px.

### Layout

- `Empty State` is 812px wide by default, with 48px top and bottom padding, 70px side padding, and 24px between children.
- The 1px border always takes space, shown or hidden; content starts 49px from the top and 71px from the sides.
- `Text` fills the width inside the padding, up to 340px, with 8px between `Title` and `Description`.
- `Title` is Geist Medium 16px/24px; `Description` is Geist Regular 14px/20px.
- `Icon Badge` is made of a 32px icon, 10px padding, and a 1px border.

### Motion

- On hover, `_Empty State Link` changes from `default` to `hover` with `Smart Animate`, `100 ms`, and a custom bezier of `0.4, 0, 0.2, 1`.

### Tokens

- `Empty State` fills with `ds/background/100`, `secondary` with `ds/background/200`; the border is `ds/gray/200` and the radius `tailwind/radius/lg`.
- `Icon Badge` uses `ds/background/100` for the fill, `ds/gray/alpha/400` for the stroke, and `ds/gray/900` for the icon.
- `Icon Badge` has the radius `tailwind/radius/lg`, 8px, the `rounded-lg` of code.
- `Title` is `ds/gray/1000` and `Description` is `ds/gray/900`.
- The link label and icon go from `ds/gray/900` to `ds/gray/1000` on hover.

## Behavior in Code

### Props in code

- `<EmptyState>` takes `title`, `description`, `icon`, `children`, `secondary`, and `border`, which defaults to `true`.
- `title`, `description`, `icon`, and `children` render only when passed; `showIcon`, `showTitle`, `showDescription`, and `showChildren` mirror this.
- `<EmptyStateIcon>` takes `icon` and an optional `size` that sets the badge height and width.
- `<Link>` takes `type`, `href`, and `external`; `external` adds the icon and opens a new tab with `rel="noopener"`.
- `<EmptyState>` exposes a single layout; the Best Practices variants such as `no-results` and `permission` are separate compositions of its props.

### Runtime in code

- Children are direct flex items: they stack in a column, centered, with 24px between them.
- `title` and `description` are capped at 340px with `max-w-[340px]` and balanced across lines with `text-balance`.
- `border={false}` keeps the 1px border and makes it transparent.
- `secondary` switches `--ds-background-100` to `--ds-background-200` and `text-heading-16` to `text-heading-14`.
- `font-medium` keeps the title weight at 500 in both sizes.
- Links that are direct children render at 14px through `[&>a]:text-sm`.

### Accessibility in code

- `<EmptyStateIcon>` wraps the icon in an element with `aria-hidden="true"`.
