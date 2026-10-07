# Plan

*Last rewritten: 2026-10-06*

## Current milestone

**M1 — Chronicle workflow end-to-end** — Facturel can run Rob's real bill-paying
routine (diary 2026-03-27) from launch to logged payment.

Project is **paused** (STATE.md); this milestone starts when Rob resumes it.

### Definition of done

- [ ] `npm run dev` launches the app and the SQLite DB initialises (better-sqlite3 rebuilt for Electron 35 if needed)
- [ ] Payee URL opens in the system browser (`shell.openExternal` via preload/IPC, not `window.open`)
- [ ] A logged payment persists across restart and shows in the bill's history
- [ ] Logging a payment rolls `next_due` forward per the bill's recurrence
- [ ] Dashboard lists active bills by next due date with an overdue flag
- [ ] Rob's real bills entered and one monthly cycle paid through Facturel

### In scope

- Run-check and fixing whatever blocks launch
- Bill CRUD, payment logging, recurrence roll-forward, due-first dashboard
- Minimal tests for the payment → persistence path

### Out of scope for this milestone

- Logo upload, tag filtering, stats views, archive/reactivate polish
- Packaged/signed release builds
- Calendar view, multiple profiles, backup/restore

## Roadmap

1. **M2 — Data safety & polish** — CSV export round-trip, archive → reactivate, tags, payment stats.
2. **M3 — Packaged app** — Mac/Windows builds via CI that Rob installs and uses daily.
3. **Maybe** — "Monthly Money Date" review view (diary 2026-02-10), calendar view, credit-card transaction detail (diary 2026-03-27).

## Open risks

- The Dec 2025 scaffold has never been verified running; it may need significant rework.
- Electron may be heavier than a personal utility needs — stack question still open (STATE.md).
- Low priority: may stay paused indefinitely while revenue work takes precedence.

---

*Overwrite this file at milestone boundaries. Git keeps the history. If a
decision caused the rewrite, log it in DECISIONS.md.*
