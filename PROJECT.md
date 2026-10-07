# Facturel

> A privacy-first, local-only desktop app (Electron + React + SQLite) for tracking recurring bills and payment history — no cloud, no banking connections, no login.

## Why this exists

Bills get paid today with Chronicle Pro: open it, review each active bill's last
payment, click through to the payee site, pay, then log date/amount/notes
(diary 2026-03-27). Most alternatives need bank connectivity or an online
account. Facturel aims to do that same routine with all data in a local SQLite
file the user fully controls — and doubles as practice in Electron/React
desktop development, with AI as the developer.

## Who it's for

- Primary user: Rob — replacing the Chronicle Pro bill-paying routine.
- Secondary users (if any): privacy-conscious homeowners, freelancers/sole
  proprietors and digital minimalists (PRD personas) — only if it's ever packaged
  for release.

## Success criteria

- [ ] The Chronicle routine works end-to-end in Facturel: open → see active bills
      by next due date → review last payment → click payee URL (opens system
      browser) → pay → log date, amount, notes.
- [ ] Data survives app restarts; payment history is editable; CSV export
      round-trips so data is never trapped.
- [ ] Rob uses it for one full month of bills instead of Chronicle Pro.
- [ ] Performance: app load < 2s; save/retrieve < 100ms (PRD).

## Non-goals

- Any cloud sync, server, account/login, or external data transmission.
- Bank or card integrations / automatic transaction import.
- Paying bills from inside the app — it links to the payee site only.

## Constraints

- Local-only: all data in SQLite in the user's app-data directory (CLAUDE.md "Privacy First").
- Stack: Electron + React + Tailwind + better-sqlite3 (in place since Dec 2025;
  whether to stay on Electron is an open question in STATE.md).
- Mac + Windows; macOS builds are unsigned.
- Low priority (portfolio #14): personal project, bumped by revenue work, no deadline.

---

*This file changes rarely. If you find yourself editing it often, something
is wrong — either the scope is actually shifting (record that in
DECISIONS.md) or you're putting the wrong content here.*
