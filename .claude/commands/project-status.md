---
description: Generate a dated HTML status page (project/status/status-YYYY-MM-DD.html) summarising facturel — what it is, what exists in the codebase, what's missing, and what to do next session.
---

Generate a project status HTML report for facturel.

## What to read first (do all reads in parallel)

**Core context:**
1. `README.md` — app overview, features, commands
2. `CLAUDE.md` — tech stack, key features, privacy requirements, project structure
3. `docs/PRDs/PRD-01-base.md` — full PRD: problem statement, features, MVP scope

**Activity:**
4. `project/diary/` — list files, read all diary entries (there are only a few)
5. Run `git log --oneline -10` for recent commits
6. Run `git log --oneline --no-merges -- src/ | head -5` to see last actual code changes

**Check what actually exists:**
7. Run `ls src/components/` to see which React components have been written
8. Run `ls src/` to see overall source structure

## Output

Create a single self-contained HTML file at:

```
project/status/status-YYYY-MM-DD.html
```

where `YYYY-MM-DD` is today's date. No external dependencies — all CSS and SVG inline.

## Section order and content

The page answers: "What does the app do, how much of it runs today, and what's the next thing to work on?"

### 1. Header bar
- App name: **facturel**
- Tagline: Local bill management — privacy-first, no cloud, no banking connections
- Platform badge: Electron + React · Mac + Windows
- Type badge: "Personal Project — No Deadline"
- Current date
- Palette: slate `#1e293b` + teal `#0d9488` + amber `#f59e0b` — clean, minimal, privacy-feel

### 2. Snapshot pills
Pull from CLAUDE.md and package.json:
- Stack: Electron + React + SQLite (better-sqlite3)
- Styling: Tailwind CSS
- Version: 1.0.0
- Storage: Local SQLite — no cloud
- Priority: "Personal — low priority"
- Last code change: derive from `git log --no-merges -- src/ | head -1`

### 3. Current Truth
A single honest paragraph (3–5 sentences). What the app does, what the codebase contains today, and what has actually been worked on recently.

Derive from git log: if recent commits are all tooling/CI (dependabot, GitHub Actions, Electron version bumps) with no `src/` changes, say so plainly. Reference the March 2026 diary which documents the Chronicle Pro workflow the app aims to replace — this is the clearest picture of what the app needs to do.

Example: "Facturel is a local Electron app for tracking bills and payment history without any cloud connectivity. The codebase has a basic scaffold — [list components from ls src/components/]. Recent commits are tooling-only (Electron updates, CI workflows). The app's reference workflow was documented in March 2026 using Chronicle Pro: start the app, review active bills, click through to each payee URL, log the payment date/amount/notes. That workflow is what facturel needs to replace."

### 4. What It Does (one paragraph)
From README.md and CLAUDE.md:
- Local-only bill management: add payees, set due dates, log payments, add notes
- No cloud, no banking API, no login required — all data in SQLite on device
- Recurring billing support: monthly, quarterly, yearly
- Tags, archiving, payment history, CSV export
- Target: privacy-conscious users who use a tool like Chronicle Pro but want full local control
- Cross-platform: Mac and Windows via Electron

### 5. The Reference Workflow (what it needs to do)
Pull from the March 2026 diary entry — this is the most concrete description of the app's job:

The bill-paying workflow this app should support:
1. Open app → see list of active bills
2. For each bill: review last payment date and amount
3. Click through to payee website (payment URL)
4. Pay the bill
5. Log the payment: date + amount + notes
6. Repeat for all bills

Reference apps noted in diary/PRD: **Chronicle Pro** (the current tool), visual simplicity as the UX target.

### 6. What Exists vs. What's Needed

Two columns:

**What's in the codebase (derive from `ls src/components/`):**
List each component found and what it likely does:
- `Dashboard.js` — main view, probably bill list
- `BillForm.js` — add/edit bill form
- `BillDetails.js` — bill detail view with payment history
- `PaymentForm.js` — log a payment
- `Sidebar.js` — navigation

Note: list any that are present. Mark as "scaffold" if recent code changes to `src/` are absent from git log.

**What's missing (from CLAUDE.md "Key Features to Implement"):**
- Bill/payee management with logo upload
- Recurring billing logic (due date calculation)
- User-defined tagging system
- Bill archiving / reactivation
- Payment statistics and yearly summaries
- CSV export
- Payee URL quick-launch (the "click through to website" step from the Chronicle workflow)

### 7. Known Gaps / Top 5 Backlog Items
Derive from CLAUDE.md features and diary. Rank by what blocks actual use:

1. **Payee URL quick-launch** — the core workflow step; without it the app doesn't replace Chronicle
2. **Recurring due date calculation** — so the bill list shows what's due soon
3. **Payment logging that persists across restarts** — SQLite wiring to PaymentForm
4. **Bill list sorted by due date / overdue status** — Dashboard needs this to be useful
5. **CSV export** — so data isn't trapped if user wants to switch tools

### 8. Priority & Context
One compact paragraph:
- Personal project, no deadline, bumped by revenue work
- Currently using Chronicle Pro as the actual bill tracking tool (documented in Mar 2026 diary)
- The gap: facturel doesn't yet replace it — the workflow overlap would be the trigger to use it
- Learning value: Electron + React desktop development
- Lower priority than WhackFun (which at least has a clear gaming audience); this is pure personal utility

### 9. Next Session — What to Do First
A single card with the suggested starting focus:

**Wire up the core workflow end-to-end:**
1. Confirm the app launches (`npm run dev`) and the basic scaffold renders
2. Check that SQLite database initializes and persists across restarts
3. Add a payee URL field to BillForm (if missing) — this is the most-used feature
4. Wire Dashboard to show bills sorted by next due date
5. Confirm PaymentForm saves to SQLite and BillDetails shows the history

The goal: be able to open the app, see a bill, click its URL, pay it, and log the payment — the Chronicle workflow from the March 2026 diary — without leaving facturel.

### 10. Tech Reference (compact card)
- **Dev:** `npm run dev` (React + Electron with hot reload)
- **Build Mac:** `npm run build-mac` → `.dmg`
- **Build Win:** `npm run build-win` → `.exe`
- **Test:** `npm run test`
- **Lint:** `npm run lint`
- **DB:** SQLite via `better-sqlite3` — stored in user's app data directory
- **Key rule:** Never implement features that send data externally

### 11. Footer
"Generated YYYY-MM-DD · facturel · Personal Electron app · derived from README.md, CLAUDE.md, PRD, diary, git log"

## Visual style

- Background: `#f9fafb`; cards: white with `1px solid #e5e7eb` and light shadow
- Palette: slate `#1e293b`, teal `#0d9488`, amber `#f59e0b`, green `#16a34a`, red `#dc2626`
- "What Exists vs. What's Needed": two-column layout — teal left border for exists, amber left border for missing
- Backlog items: numbered list, first item highlighted (most blocking)
- "Next Session" card: amber left border — most actionable element
- Reference workflow (step list): compact numbered steps, clean typography
- Priority badge: grey — personal, no urgency
- No external fonts or images — system font stack only
- Responsive (single-column on narrow viewports)

## Rules

- Write the file directly — do not ask for confirmation first
- Derive actual code state from `ls src/components/` and git log — do not assume features are working just because component files exist
- If recent git commits are tooling-only (dependabot, CI), say so plainly — it means no feature work has happened recently
- The March 2026 diary Chronicle workflow is the clearest spec for what the app needs to do — surface it
- After writing the file, confirm the path and list the sections included
- Tone: honest and practical — this is a personal utility app, not a product

## Also write STATUS-SUMMARY.md

After writing the HTML file, write (or overwrite) a summary file at `project/status/STATUS-SUMMARY.md` (create the directory if it doesn't exist).

Use this exact format — YAML frontmatter only, no markdown body:

```
---
name: facturel
tagline: <one sentence — what this project is, derived from the files you just read>
group: Personal
profile: Personal Project
priority: 9
status: <one sentence — the most important thing about current state right now>
generated: <today's date YYYY-MM-DD>
---
```

- `tagline`: purpose of the project — stable, changes rarely
- `status`: current state — something that could change next week (active work, priority changes, next session plan)
- Overwrite every run — no date suffix, always one file
