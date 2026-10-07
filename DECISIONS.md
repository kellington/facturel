# Decisions

Append-only log of meaningful decisions. Never edit past entries — if a
decision is reversed, add a new entry that references the old one.

## How to write an entry

```
## [YYYY-MM-DD] — Short title

**Decision:** What we decided, in one sentence.
**Why:** The reasoning that drove it.
**Trade-off:** What we're giving up.
**Impact:** What changes because of this (code, scope, process).
```

Keep entries short. If you need more than ~8 lines, you're probably
writing a design doc, which belongs elsewhere.

---

*Entries dated before 2026-10-06 were reconstructed on 2026-10-06 from the
PRD, git history, diary and STATE.md.*

## [2025-12-04] — Local-only Electron + React + SQLite

**Decision:** Build as a local-only Electron desktop app with React/Tailwind and SQLite (better-sqlite3), no backend.
**Why:** Privacy first — no cloud, banking link or login; single user, single writer; cross-platform Mac + Windows (PRD-01).
**Trade-off:** Heavier runtime than a web or native app; native module rebuilds per Electron version; no sync between devices.
**Impact:** All data in the user's app-data directory; feature must never send data externally (CLAUDE.md).

## [2026-03-27] — Chronicle Pro routine is the reference spec

**Decision:** Facturel's first target is to replicate the Chronicle Pro bill-paying routine (review → click payee URL → pay → log).
**Why:** It's the workflow actually in use today (diary 2026-03-27); matching it is what lets Facturel replace Chronicle.
**Trade-off:** Broader PRD features (stats, tags, calendar) wait.
**Impact:** Payee-URL launch and payment logging rank above other backlog items; shapes PLAN.md M1.

## [2026-06-08] — Pause the project

**Decision:** Pause Facturel; no active feature work.
**Why:** Personal utility with low priority, bumped by revenue work (STATE.md).
**Trade-off:** Chronicle Pro stays in use; the scaffold stays unverified.
**Impact:** Only tooling/status commits since; M1 starts when Rob resumes.
