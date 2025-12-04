# Product Requirements Document (PRD)  

## Product Name: Facturel

**Local Bill Management App**

---

## Background

### Problem Statement
Managing household or small business bills without cloud-based software or banking integrations can be disorganized and time-consuming. Many users prefer simple, private, and locally stored solutions to avoid security concerns and over-complexity.

### Market Opportunity
Most bill management solutions rely on bank connectivity or online accounts. There is a niche but significant demand for lightweight, offline tools—especially from privacy-conscious users, freelancers, or small business owners seeking basic bill tracking without automation or third-party syncing.

### User Personas
- **Privacy-Conscious Homeowners**: Prefer not to link bank accounts but want to track recurring bills.
- **Freelancers/Sole Proprietors**: Need lightweight tracking for utilities, subscriptions, and supplier payments.
- **Digital Minimalists**: Want simple interfaces and control over their data with no cloud reliance.

### Vision Statement
Create a secure, easy-to-use, local-only bill tracking application that offers clarity, control, and simplicity in managing recurring payments.

### Product Origin
Inspired by the limitations of bloated or online-only bill-tracking platforms, this app builds on visual simplicity (like the "Chronicle" UI example) and a focus on full user control through local storage.

---

## Objectives

### SMART Goals
- Launch an MVP within 4 weeks.
- Allow user to create and tag 10+ bills.
- Support recurring billing logic with due date tracking.
- Enable logging of at least 20 payments per user session without errors.
- Provide local storage persistence across app restarts.

### Key Performance Indicators (KPIs)
- Time-to-create first bill: < 2 minutes
- Monthly active users (for packaged releases): 100+ (post-release)
- App load speed: < 2 seconds
- Error rate in saving/retrieving bills: < 1%

### Qualitative Objectives
- Users feel in control of their financial tracking.
- UI is intuitive and distraction-free.
- No requirement for user login or internet connectivity.

### Strategic Alignment
Aligns with trends in digital privacy, local-first software, and minimalist tooling.

### Risk Mitigation
- Backup/export feature to allow users to save their data manually.
- Offer simple UI/UX tutorials or tooltips.
- Electron-based packaging for platform compatibility.

---

## Features

### Core Features
- **Bill/Payee Management**: Add/edit payees with name, logo, due date, link to pay site, and notes.
- **Recurring Billing**: Mark as monthly, quarterly, or custom interval with automatic "Next Due" updates.
- **Payment Logging**: Enter amount, date, and notes per payment.
- **Tagging System**: Apply and filter tags (e.g., Utilities, Business, Personal).
- **Archiving Bills**: Move inactive bills out of the main dashboard but allow reactivation.
- **Payment Statistics**: Show summaries: highest, lowest, average payments, total this year vs last year.
- **Bill Calendar View (Future)**: Visualize upcoming due dates.


### User Benefits
- Full control over data with no external syncing.
- Fast and responsive performance.
- Visual clarity with summary statistics and history.

### Technical Specifications
See **Technical Requirements** section below.

### Feature Prioritization
1. Bill creation/editing  
2. Payment logging and history  
3. Recurrence & due tracking  
4. Tagging  
5. Archiving  
6. Summary stats view  
7. (Future) Calendar view  

### Future Enhancements
- CSV export of bill/payment history.
- Data backup/restore.
- Multiple profile support.

---

## User Experience

### User Interface (UI) Design
- Sidebar navigation for bills and archived items.
- Main dashboard with visual stats.
- Modal or sidebar forms for bill entry/editing.

### User Journey
1. User opens app → Sees list of active bills with next due dates.
2. Clicks “+ Add Bill” → Fills in payee info and tags.
3. Logs a payment when made → Stats and history update.
4. Archives bills when no longer needed.

### Usability Testing
- Internal MVP testing with feedback form.
- Manual validation of data persistence after restart.

### Accessibility
- Keyboard navigable forms.
- High-contrast mode option (future enhancement).

### Feedback Loops
- Simple feedback form (local or email link).
- Usage stats (optional, opt-in for diagnostic mode).

---

## Milestones

### Development Phases
- **Week 1:** UI mockups, local storage structure
- **Week 2:** Core bill CRUD, recurring logic
- **Week 3:** Payment logging + stats
- **Week 4:** Tagging, archiving, UI polish

### Critical Path
- Local data persistence
- Bill + payment logic
- UI rendering of due dates and summaries

### Review Points
- End of Week 2: Functional Bill CRUD
- End of Week 3: Full payment cycle complete
- End of Week 4: All features testable

### Launch Plan
- Release as downloadable Electron app (Mac + Windows)
- Optional ZIP archive for raw JS+HTML local launch

### Post-Launch Evaluation
- Collect bug reports
- Feature request list for v2 planning

---

## Technical Requirements

### Tech Stack
- JavaScript (ES6+)
- HTML/CSS (Tailwind optional)
- Electron (for desktop app packaging)
- SQLite (via better-sqlite3 or sqlite3 for local storage)
- Optional: Dexie.js if switching to IndexedDB for full browser local-only mode

### System Architecture
- Local-only application (no backend or server)
- Electron app shell runs web UI and JS logic
- SQLite database stored in user’s app data directory
- All data read/written locally—no remote API calls

### Security Measures
- No external data sent or stored
- Option to store data in user-defined encrypted location (advanced setting, v2)

### Performance Metrics
- App load time: < 2s
- Save/retrieve actions: < 100ms for typical bill volume

---

## Integration Requirements
- None (local only)
- Optional: link handling to open payee sites in system browser