# State

*Last updated: 2026-10-06*

## Summary

Paused. Local-first desktop bill management app built with Electron + React + SQLite. Privacy-focused (all data stays local). Recent commits have been tooling and CI only — no active feature work. Not a current priority.

2026-10-06: status refresh only (project/status/status-2026-10-06.html). src/ still untouched since 2025-12-04; app still never verified running. Payee URL uses `window.open` (BillDetails.js:40) — likely opens an Electron window, not the browser.

## What's working

- Electron + React + SQLite stack is set up and running
- Basic bill management functionality exists
- CI pipeline in place
- Privacy-first architecture (local data, no cloud sync)

## In progress

Nothing active.

## Known gaps

- Feature-incomplete relative to what a daily-use bill tracker would need
- UX needs polish
- No export or backup functionality

## Open questions

- PROJECT.md, PLAN.md, TASKS.md, DECISIONS.md are unfilled templates (untracked). Fill at resume or drop if staying paused.
- Resume vs stay paused is Rob's call (in STATUS-SUMMARY questions_for_rob).

## Next actions (when resumed)

1. Run the app and document current state — what's actually implemented?
2. Define the minimum feature set for personal daily use
3. Assess whether to continue as Electron or consider a simpler approach

## Priority

Low. Personal project bumped by revenue work.

---

*Updated at the end of every session. Keep it current — this is the file the agent reads first next session.*
