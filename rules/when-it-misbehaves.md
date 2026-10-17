# When something does not behave

Use this when a build does not do what you expect: a state that sticks, an overlay that opens in the wrong place, a property that does not take, a script that succeeds and changes nothing. The method is the one that works for any fault: find the cause before the next fix, because a fix on top of an unexplained symptom hides the symptom and keeps the cause.

## Contents
- The steps
- Example
- Signs that you are guessing

## The steps

1. **Reproduce it on purpose.** Name the exact state that shows the fault: which variant, which variable value, which mode, which action. If you cannot show it, you do not yet know what you are fixing.
2. **Read before you guess.** Read an error message to the end. Then read the layers involved from the file: reactions, variable bindings, overrides, layer order, sizes. Take values from the nodes, not from your script.
3. **Compare with a clean instance.** Place the same library component alone in an empty frame and bring it to the same state. If it behaves, the cause is in what you added or in a combination of parts. If it does not, the cause is the component, and the card or the file is the place to look.
4. **Change one thing at a time, on a copy.** Remove or restore one reaction, override or layer, look at the same state again, and note what that change did. Two changes at once tell you nothing about either.
5. **Fix at the cause, then check the same state again.** Run the audit and look at the state that showed the fault.
6. **Stop after three failed attempts.** The structure is probably wrong. Read `rules/figma-model.md`, say what you tried and what you saw, and ask the user.

## Example

Menu items stayed gray after the pointer left them when the menu sat inside a table row. A clean menu alone behaved, and a clean table alone behaved, so the cause was the combination. Removing the hover reaction of the rows on one of two copies of the screen made the items return to rest on that copy, and the rows with the hover were the cause. The fix was one change at the cause, and the audit now reports a layer that reacts to hover around an overlay whose items react to hover.

## Signs that you are guessing

- You write "probably", "it might be" or "let me try" before you have read the nodes.
- You change a second thing because the first change did not help.
- It works now and you do not know which of your changes made it work. Undo the others one at a time until you do.
- You are repairing the same area for the third time.
