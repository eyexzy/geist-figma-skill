# Content and copy: the words in the interface

Source: Vercel's Web Interface Guidelines (MIT, Vercel Labs; https://github.com/vercel-labs/web-interface-guidelines), its section "Vercel-specific copywriting", and the Best Practices of the Geist components (Button, Error, Toast, Empty State, Description, Note, Context Card, Table, Relative Time Card, Status Dot, Badge, Tooltip). Vercel describes the copywriting rules as its brand preferences, not universal rules; follow them for Geist-style work unless the user gives other copy.

## Contents
- Voice
- Casing
- Labels and buttons
- Errors and empty states
- Toasts and notes
- Numbers, units, dates and symbols
- Placeholders
- Status vocabulary

## Voice

- Active voice, action-oriented, second person: "Install the CLI", not "The CLI will be installed" and not "You will need the CLI".
- As few words as possible. Introduce as few distinct nouns as possible and keep them consistent: one name per thing through the whole flow.
- Positive language even for errors. Say what to do next.

## Casing

- **Headings and buttons: Title Case** (Chicago style): `Deploy Project`, `Invite Member`, `Rotate Key`. Marketing pages use sentence case.
- Description keys are Title Case nouns (`Last Deployed`, `Plan`); the values are sentence case unless they are identifiers or timestamps.
- Empty State: the title is Title Case, the description is sentence case.
- Note: a 1–2 word Title Case label that names the topic and one sentence in active voice that names the impact (`Region Change`, `Changing this region restarts all functions.`).
- Prefer `&` over "and".

## Labels and buttons

- A button names what happens: `Save API Key`, not `Continue`; `Deploy Project`, not `Submit`; never `OK` or `Confirm` alone.
- Destructive buttons are `Verb + Noun` and pair with their toast: `Delete Project` then `Project deleted`.
- A button that switches mode ends with `Instead`: `Use a Recovery Code Instead`.
- Icon-only buttons need an accessible name that names the action and the target (`Copy deployment URL`), not the icon.
- Do not give a button with visible text a separate accessible label; it overrides the visible label.

## Errors and empty states

- An error says what happened and how to fix it. Not "Invalid API key" but "Your API key is incorrect or expired. Generate a new key in your account settings."
- Use `Couldn't` / `Can't` for a problem tied to the user's state (`Couldn't verify your passkey. Try again.`) and `Failed to` for system or infrastructure errors that echo a CLI (`Build failed. Bundle exceeds 50 MB.`). `Unable to` is not used. Do not switch forms in one flow.
- Name the resource that failed (`Couldn't Load Deployments`), not `Something Went Wrong`.
- Empty State: a title that names the situation (`No Logs Match Your Filter`), a description that adds new information instead of restating the title, and one primary call to action named `Verb + Noun`, never `Get Started`, `Continue` or `OK`.
- Never use `N/A` or `null` for an unknown value; use the em dash `—`.

## Toasts and notes

- Toast copy is short and confirms what the user just did (`Domain added`, `Project archived`). Error toasts are two sentences ending with a recovery step (`Couldn't verify domain. Try again.`).
- A build or billing failure is not a toast alone: pair a toast of six words at most (`Build failed`) with a persistent row that carries the recovery step.

## Numbers, units, dates and symbols

- Numerals for counts: "8 deployments".
- A space between a number and its unit, kept together with a non-breaking space: `10 MB`, `⌘ K`.
- In any one context show currency with 0 or 2 decimals, not both.
- Relative time in dense surfaces (`2m ago`, `5h ago`), a full date such as `Mar 14, 2026` after about 7 days, and a `Relative Time Card` with the exact time.
- Use `…` (one character) for ellipses and curly quotes “ ”.
- A menu item that opens a follow-up step, and any loading text, ends with an ellipsis: `Rename…`, `Saving…`.

## Placeholders

- A placeholder shows an example value or pattern and ends with `…`; it is never an instruction: `my-awesome-project…`, not `Enter your project name`.
- Use consistent placeholder tokens: strings `YOUR_API_TOKEN_HERE`, numbers `0123456789`.

## Status vocabulary

- Deployment states use one set of words, sentence-cased by the Status Dot: `Queued`, `Building`, `Ready`, `Error`, `Canceled`, `Deleted`.
- Other states (workflow runs, queue messages, sandboxes, cron jobs) go on a Badge with the canonical state words of that product.
- Lifecycle badges (`Alpha`, `Beta`, `Early Access`) get a Tooltip: `{Label}: {one-line meaning}. {Specific limit}.`
