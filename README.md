# Facturel - Local Bill Management App

A privacy-focused, local-only bill management application built with React and Electron. Track your bills, log payments, and manage recurring expenses without cloud connectivity or banking integrations.

## Features

- **Local-Only Storage**: All data stays on your device using SQLite
- **Bill Management**: Add, edit, and organize bills with custom tags
- **Payment Tracking**: Log and edit payment history with notes
- **Recurring Bills**: Set monthly, quarterly, or yearly recurrence
- **Statistics**: View payment summaries and yearly comparisons
- **CSV Export**: Export your data for backup or analysis
- **Privacy First**: No external data transmission or cloud dependency

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run in Development Mode**
   ```bash
   npm run dev
   ```
   This starts the React development server and Electron simultaneously.

3. **Build for Production**
   ```bash
   npm run build
   npm run build-electron
   ```

## Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development mode with hot reload |
| `npm run build` | Build React app for production |
| `npm run build-electron` | Package Electron app for current platform |
| `npm run build-mac` | Build macOS app (.dmg) |
| `npm run build-win` | Build Windows app (.exe) |
| `npm run build-all` | Build for both macOS and Windows |
| `npm run test` | Run tests |
| `npm run lint` | Check code quality |
| `npm run format` | Format code with Prettier |

## Project Structure

```
src/
├── components/          # React components
│   ├── Dashboard.js     # Main dashboard view
│   ├── BillForm.js      # Add/edit bill form
│   ├── BillDetails.js   # Bill details and payment history
│   ├── PaymentForm.js   # Log/edit payment form
│   └── Sidebar.js       # Navigation sidebar
├── context/             # React context for state management
│   └── BillContext.js   # Global bill and payment state
├── main.js              # Electron main process
├── preload.js           # Electron preload script
├── database.js          # SQLite database manager
└── index.js             # React entry point
```

## Tech Stack

- **Frontend**: React 18 with Hooks
- **Styling**: Tailwind CSS for utility-first styling
- **Desktop**: Electron for cross-platform desktop app
- **Database**: SQLite with better-sqlite3 for local storage
- **Date Handling**: date-fns for date manipulation

## Data Privacy

- All data is stored locally in SQLite database
- No external API calls or data transmission
- Database location: User's app data directory
- Optional CSV export for manual backup

## Building for Distribution

### Local Builds

Build for your current platform:

```bash
npm run build-electron
```

Build for a specific platform:

```bash
npm run build-mac    # macOS (.dmg)
npm run build-win    # Windows (.exe) - requires Wine on macOS
npm run build-all    # Both platforms
```

Built packages will be available in the `dist/` directory.

### Automated Builds (GitHub Actions)

The repository includes a GitHub Actions workflow that builds for both macOS and Windows on native runners. This is the recommended way to create release builds since native modules (like better-sqlite3) compile correctly for each platform.

To trigger a build:

1. **Tag a release:**
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. **Or manually trigger** from the [Actions tab](../../actions) on GitHub

Build artifacts are uploaded and downloadable from the workflow run.

### macOS Installation Note

Downloaded macOS builds are not code-signed. macOS may show "app is damaged" when opening. To fix this, run:

```bash
xattr -cr /path/to/Facturel.app

e.g. 
xattr -cr /Applications/Facturel.app
```

Or right-click the app, select "Open", and confirm in the dialog.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on:

- Setting up your development environment
- Code style and conventions
- Submitting pull requests
- Reporting issues