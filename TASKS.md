# Tasks

**Now** is 1–2 items. **Next** is what the agent proposes at the start of a
session. **Later** is a holding pen, not a backlog.

Keep Now + Next under ~10 items between them. Later can breathe, but anything
sitting there untouched across two milestones gets deleted, not re-filed.

When Done gets long, move it to `project/status/` history or drop it — git log
is the real record. Don't let this file become the project's second STATE.md.

## Now

Actively being worked on right now.

- [ ]

## Next

The next handful, ordered.

- [ ] Run `npm run dev`; confirm launch + DB init (better-sqlite3 may need rebuild for Electron 35)
- [ ] Payee URL: replace `window.open` with `shell.openExternal` via preload/IPC
- [ ] Log a payment, restart, confirm it persists and next_due rolls forward
- [ ] Dashboard: order by next_due, flag overdue
- [ ] Verify CSV export round-trip

## Later

Small near-term ideas that don't deserve an issue yet.

- [ ]
- [ ]

## Done (recent)

Cleared at each milestone.

- [x]

---

**Bigger than a session?** Most work doesn't need more than a line here. But if
an item will run for several sessions, has hard out-of-scope boundaries, or will
be driven by `/goal`, copy `optional/subtask.md` to `tasks/<slug>.md` and link
it from the section above:

```
- [ ] Auth migration → tasks/auth-migration.md
```

Don't create the `tasks/` folder until something actually needs it.
