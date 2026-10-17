# Feedback

Gather text feedback with an associated emotion.

Source of the Best Practices: https://vercel.com/geist/feedback

Contents: Best Practices, When to use, Behavior, Content, Figma Guidelines, Anatomy, Feedback properties, Feedback Inline properties, _Feedback Content properties, _Feedback Emoji Item properties, Assembly, Layout, Motion, Tokens, Behavior in Code, Props in code, Runtime in code, Responsive in code, Motion in code, Accessibility in code, Best Practices vs code

## Best Practices

### When to use

- Place Feedback at the end of a page, doc, or completed flow where the user has formed an opinion. Don’t front-load it on a surface the user has only opened.
- Use the topic Select variant when feedback maps to actionable categories the team triages (`Bug`, `Pricing`, `Documentation`); skip it when the open textarea is enough.
- Don’t use Feedback as a substitute for a support form, a bug report intake, or NPS sampling. Those have dedicated surfaces.

### Behavior

- Keep the panel collapsed until the user clicks the trigger; auto-opening derails the work that prompted the feedback.
- Pair the metadata variant with non-PII context (route, build ID, plan, viewport) so the team can reproduce the report without a second round-trip.
- Submit closes the panel and returns focus to the trigger. Don’t replace the panel with a generic acknowledgment toast; the close itself is the acknowledgment.

### Content

- `label` is Title Case and short. Default `Feedback` is fine; override only when scoping to a flow: `Feedback on Imports`, `Report a Bug`. Don’t end the label with `?`.
- `copy` overrides the prompt header next to the emoji row in sentence case (`How did the import go?`). Cut `please` and `we’re sorry`.
- The textarea placeholder (`Your feedback...`) is fixed by Geist; don’t try to override it with rich children.

## Figma Guidelines

### Anatomy

- `Feedback` — `<Feedback>`: the trigger `Trigger` and the `Content` panel that opens above or below it.
- `Content` — an instance of `_Feedback Content` inside `Feedback`, hidden until `state/feedback/open` is `true`.
- `Feedback Inline` — `<Feedback type="inline">`: a pill that expands into the form.
- `Panel` — the pill and the expanded form of `Feedback Inline`, holding `Header`, then `Body` and `Footer` or `Success`.
- `Header` — the prompt and the `Emoji Row` of the pill.
- `Body` — `Select`, `Input`, `Textarea`, and the `Markdown` note.
- `Footer` — the `Action` that sends the form; in `_Feedback Content` it sits beside `Emoji Row`.
- `Select Space` and `Input Space` — blank rows under `Footer` or `Success` that appear with `showSelect` and `showInput`.
- `Emoji Row` — four `_Feedback Emoji Item` instances: `Emoji 1`, `Emoji 2`, `Emoji 3`, and `Emoji 4`.
- `Success` — the confirmation: `Checkmark`, `Title`, and `Description`.

### Feedback properties

- `side` — `top` or `bottom`: the side of the trigger where `Content` opens, 8px away.
- `Trigger` is exposed: `label` is `buttonText` and `variant` is `buttonVariant`.
- `showPrefix` with `prefix` maps to `prefix`, and `showSuffix` with `suffix` maps to `suffix`.

### Feedback Inline properties

- `open` — `false` is the pill; `true` is the expanded form.
- `submitted` — `true` replaces `Body` and `Footer` with `Success`; it applies when `open` is `true`.
- `copy` — the prompt text in `Header`.
- `showSelect` shows `Select` and `showInput` shows `Input`.
- `copy` keeps its name from `<Feedback>`. `showSelect` is `showTopics` and `showInput` is `showEmail` in code. `open` and `submitted` show internal states.

### _Feedback Content properties

- `submitted` — `false` is the form; `true` is the confirmation.
- `showSelect` shows `Select` and `showInput` shows `Input`, as in `Feedback Inline`.

### _Feedback Emoji Item properties

- `emoji` — the icon, set with an instance swap.
- `state` — `default` or `pressed`; `pressed` is the hover look and the look of the selected emoji.

### Assembly

- Set `side` to `top` when `Feedback` sits near the bottom edge of the screen, so `Content` opens above it.
- Select `Content` in the layers panel to set `showSelect`, `showInput`, or `submitted`; it is hidden until `state/feedback/open` is `true`.
- `Content` is bound to `state/feedback/open` from `Prototyping / Feedback`; the trigger toggles it and the confirmation sets it back to `false`.
- Instances on one screen share `state/feedback/open` and the `emoji/<name>/state` and `emoji/<name>/checked` pairs, so they open and select together.
- Set the vertical constraint of a `Feedback Inline` instance to `Bottom` to open it upward. The pill keeps its bottom edge and the panel grows up.
- In `Content`, each of `showSelect` and `showInput` adds 44px to the height. In `Feedback Inline`, `showSelect` adds 50px and `showInput` adds 48px.
- Set `Canvas stacking` to `First on top` on the parent frame when `side` is `bottom`.
- Set `Canvas stacking` to `Last on top` when `side` is `top`, so `Content` covers its neighbours.
- In `Feedback Inline`, a click on an emoji opens the form and selects it. A second click on the selected emoji clears it and collapses the pill.
- In `Content`, a click on an emoji selects it or clears it. The `Action` in `Footer` shows the confirmation in both forms.
- Press `Esc` in Present to collapse an open `Feedback Inline` and reset the selection.

### Layout

- `Feedback Inline` is a 274px × 48px pill; open, it is 336px wide and 243px high.
- `Header` is 48px high, with 16px left padding, 8px padding elsewhere, and 8px between the prompt and `Emoji Row`.
- Each `_Feedback Emoji Item` is 32px × 32px, with 1px between items in `Emoji Row`.
- `Body` has 8px padding and 8px between rows; `Textarea` is 100px high.
- `Content` is 340px wide and 197px high; the confirmation is 195px high.
- `Footer` in `Content` is 57px high, with a 1px top border and 12px padding.
- `Content` is centered on the trigger and 8px away from it.
- The prompt, the confirmation texts, and `Success` use Copy/14.

### Motion

- In `Feedback Inline`, an emoji click or `Esc` changes `open` with `Smart Animate`, `150 ms`, and a custom bezier of `0, 0, 0.2, 1`.
- The `Action` in `Footer` changes the form to the confirmation with `Smart Animate` and `200 ms`.
- The confirmation ends after `After delay` of `4 s`: the pill collapses or `Content` closes, and the selection resets.

### Tokens

- The panels are `ds/background/100`; `Footer` has the same fill and a 1px `ds/gray/400` top stroke.
- `Feedback Inline` has the `ds/shadow/border-small` effect and `Content` has `ds/shadow/menu`.
- The open panels use the `tailwind/radius/xl` radius; the closed pill has a 30px radius.
- The prompt is `ds/gray/900`; the confirmation texts are `ds/gray/1000` and `Checkmark` is `ds/green/900`.
- A pressed emoji has a `ds/blue/300` circle and a `ds/blue/900` icon tint; the circle uses `tailwind/radius/2xl`.

## Behavior in Code

### Props in code

- `<Feedback>` renders the popover form; `type="inline"` renders the inline pill.
- The trigger text is `buttonText`, default `Feedback`; `buttonVariant` defaults to `secondary`.
- `buttonType`, `buttonClassName`, `prefix`, and `suffix` go to the trigger `Button`.
- `label` is a name sent with the submission, such as `vercel`.
- `copy` is the inline prompt, default `Was this helpful?`.
- `fullWidth` stretches the collapsed inline pill to its container; the open form stays 336px wide.
- `upwards` fixes the inline wrapper at 48px and opens the form above the pill.
- `showTopics` adds a `Select` with the placeholder `Select a topic...`.
- The topics are `AI`, `Accounts and Access Controls`, `Billing`, `CDN (Firewall, Caching)`, `CI/CD (Builds, Deployments, Environment Variables)`, `Dashboard Interface (Navigation, UI Issues)`, `Domains`, `Frameworks`, `Marketplace and Integrations`, `Observability (Observability, Logs, Monitoring)`, and `Storage`.
- `showEmail` adds an email input with the placeholder `Email Address`; a set `email` replaces the typed address in the submission.
- `metadata` is an object whose keys are sent with the submission. Strings, numbers, booleans, and `null` stay as they are; other values become JSON strings.
- `planName` is sent as `plan`; `siteType` defaults to `front` and selects the origin of the API request.
- `dryRun` skips the checks and the request and goes straight to the confirmation.
- `onFeedbackFormOpen` and `onFeedbackFormClose` fire on opening and closing; `onFeedbackSubmit` fires when the confirmation ends.

### Runtime in code

- Submitting checks the topic, the email, the text, and the emoji, in that order, for the fields that are shown.
- The first failure shows its message in red under `Textarea`: `Please select a topic`, `Please enter your email`, `Please enter your feedback`, or `Please select an emoji`.
- The request is a `POST` of JSON to `/api/feedback` with the form fields, `emotion`, `label`, and every `metadata` key.
- `emotion` is the emoji code: `f62d` Hate it, `f615` Not great, `f600` It’s okay, `f929` Love it!.
- After a successful request the confirmation stays for 4 s. Then the form closes and the fields and the emoji reset.
- In the popover, a pointer over the panel when the 4 s end keeps it open until the pointer leaves.
- `Esc` closes either form; `Meta + Enter` submits the form.
- Opening the popover clears the confirmation and the error, then focuses the first field after 150ms.
- In the inline form, an emoji click opens the form and focuses the first field after 150ms. A click outside collapses it.
- Clicking the selected emoji clears it; in the inline form it also collapses the pill.
- Closing the form clears the selected emoji.
- The popover opens below the trigger and flips above when there is no room. It centers on the trigger and sits 8px away.
- The inline form is 243px high. `showTopics` or `showEmail` makes it 293px, both make it 341px, and an error adds 28px.
- With `upwards` the form is 2px taller and moves up 200px, or 100px while an error shows.

### Responsive in code

- Geist marks the popover form as desktop-only.

### Motion in code

- The popover fades in over 100ms from scale 0.95 with `cubic-bezier(0.16, 1, 0.3, 1)` and fades out over 200ms.
- The inline form animates height, width, radius, and position over 150ms with `ease-out`.
- The form leaves over 200ms, fading and moving up 4px.
- `Checkmark` and the two lines of text rise 5px and fade in over 500ms, one after another.

### Accessibility in code

- Each emoji is a `button` with `role="radio"`, `aria-checked`, and an `aria-label` such as `Select Hate it emoji`.
- The popover panel has `role="dialog"`; the trigger has `aria-haspopup="dialog"` and `aria-expanded`.
- Closing the popover returns focus to the trigger.
- The topic `Select` uses `aria-labelledby="Product topic selection"`; the email input uses `aria-labelledby="E-mail"`.

### Best Practices vs code

- Best Practices set the trigger text with `label`. The published `<Feedback>` sets it with `buttonText` and sends `label` with the submission.
- Best Practices call the close the acknowledgment; the published `<Feedback>` shows `Your feedback has been received!` for 4 s before closing.
