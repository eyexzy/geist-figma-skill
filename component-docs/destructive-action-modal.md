# Destructive Action Modal

Confirm destructive actions with a required type-to-confirm gate and an optional irreversibility band.

Source of the Best Practices: https://vercel.com/geist/destructive-action-modal

Contents: Best Practices, When to use, Behavior, Content, Accessibility, Figma Guidelines, Anatomy, Assembly, Layout, Behavior in Code, Props in code, Runtime in code

## Best Practices

### When to use

- Reach for this over **Modal** when the action is destructive and warrants friction: delete, rotate, revoke, disconnect, downgrade, disable a security setting. The typed gate forces deliberate intent.
- Use it for reversible destructive actions too, when the consequence is serious enough to warrant a pause — disabling deployment protection, revoking a shared token. Keep the typed gate; drop `irreversibleDescription`.
- Don't use for routine confirmations (save draft, discard changes, close without saving). The typed gate reads as melodrama when the stakes are low — use a plain **Modal** instead.

### Behavior

- The verification input gets focus on open so the user can start typing immediately. Submit stays disabled until the value matches `verificationPhrase` exactly.
- Enter submits only when the gate is open; it's a no-op otherwise. Cancel, outside-click, and Escape all dismiss.
- `loading` disables both buttons. The caller owns `open` — do not self-dismiss from `onConfirm`. Close the modal after the API settles (success or error), or keep it open on error so the user can retry.
- Pair the post-confirm success toast verb 1:1 with the primary button: `Delete Project` button, `Project deleted` toast. Never `Project removed`.

### Content

- `title` is Title Case, `Verb + Noun`, a statement — never a question. `Delete Project`, not `Delete this project?`.
- `description` is sentence case, names the consequence, and interpolates the specific resource when relevant. `<b>my-project</b> and all its deployments will be permanently deleted.` reads stronger than `This project and all its deployments will be deleted.`.
- `confirmLabel` matches the title 1:1. Never generic (`Confirm`, `OK`, `Continue`), never a bare verb (`Delete`).
- `cancelLabel` defaults to `Cancel`. Override when Cancel is ambiguous, such as `Keep Turn Running` when the primary action is itself a cancellation.
- `verificationPhrase`: for entity deletes, type the resource name itself (`my-project`) and pair with `verificationLabel="project name"` so the prompt reads `To confirm, type the project name "my-project"`. That's the canonical signal that the user knows which thing they're acting on. Fall back to a lowercase verb phrase (`disable vercel authentication`) only when there's no entity to name.
- `irreversibleDescription` names the specific action and resource and ends with `cannot be undone.` — `Deleting my-project cannot be undone.` rather than the generic `This cannot be undone.`. Omit the prop entirely for reversible actions; the prop's absence is the signal, not a falsy value.
- `error` surfaces the API failure verbatim in Vercel voice: `Couldn't save settings. Try again.`. Never dump a raw error object.

### Accessibility

- The verification input is associated with its prompt via `aria-labelledby` + `htmlFor`. Screen readers announce the full prompt (`To confirm, type "delete my-project"`) on focus.
- The Warning icon in the irreversibility band is `aria-hidden`; the sentence carries the meaning so nothing is announced twice.
- Focus stays inside the modal across an `error` transition so the user can retry without losing context. After success, return focus to the trigger.

## Figma Guidelines

### Anatomy

- A **Modal** instance is the overlay of `<DestructiveActionModal>`.
- `Title` and `Subtitle` carry `title` and `description`.
- The slot holds `Fields`, a column with 24px between `Irreversible Note`, `Verification Field`, and `Request Error`.
- `Irreversible Note` — a **Note** with `variant` `error` and `fill` `true`, shown when `irreversibleDescription` is set.
- `Verification Field` — the prompt above an **Input**, 8px apart.
- `Request Error` — an **Error** with the `error` message.
- `Cancel` and `Submit` are `cancelLabel` and `confirmLabel`.

### Assembly

- Place a **Modal** instance, select its `_Modal Panel`, and resize it to 480px wide with `sticky` off.
- Set `title` and `subtitle` first, then set the resource name in `Subtitle` to Medium; changing `subtitle` later resets the range.
- Replace the default `Paragraph` in the slot with `Fields` built from `Irreversible Note`, `Verification Field`, and `Request Error`.
- Add `Irreversible Note` only for an irreversible action.
- Set `Submit` to `variant` `error` with the title as its label, and `state` `disabled` until the phrase matches.
- For a pending request, set `Submit` to `state` `loading`, and `Cancel` and the `Input` to `state` `disabled`.
- For a failed request, add `Request Error` under the field; the Modal stays open.

### Layout

- `Fields` separates its children by 24px; `Verification Field` separates the prompt and the input by 8px.
- `Prompt` is 14px/20px `ds/gray/1000`, with the phrase in SemiBold between curly quotes.

## Behavior in Code

### Props in code

- `<DestructiveActionModal>` takes `open`, `onCancel`, `onConfirm`, `loading`, `error`, `title`, `description`, `irreversibleDescription`, `verificationPhrase`, `verificationLabel`, `confirmLabel`, `cancelLabel`, `confirmVariant`, and `width`.
- `cancelLabel` defaults to `Cancel`, `confirmVariant` to `error`, `width` to `480`, and `loading` to `false`.
- `error` takes a string or an `Error` and shows its message.
- The irreversible notice renders a **Note** with `fill` and `variant="error"`, a flat background.

### Runtime in code

- The content is a `form` inside `<Modal>`; submit calls `onConfirm` only when the phrase matches and `loading` is off.
- `onCancel` is wired to `Cancel` and to `onClickOutside` of `<Modal>`, so outside-click and Escape call it.
- `loading` disables the cancel button and the input, and shows a spinner on the confirm button.
- The input gets focus one animation frame after `open` becomes `true`.
- Closing resets the typed value and the touched state.
- After blur, a wrong non-empty value shows `The {verificationLabel} must match exactly.`; an unset label gives `Doesn’t match.`
- The prompt reads `To confirm, type the {verificationLabel} “{phrase}”`.
- The input sets `autoCapitalize="none"`, `autoCorrect="off"`, `spellCheck={false}`, and `translate="no"`.
