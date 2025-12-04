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

- `npm run dev` - Start development mode with hot reload
- `npm run build` - Build React app for production
- `npm run build-electron` - Package Electron app for distribution
- `npm run test` - Run tests
- `npm run lint` - Check code quality
- `npm run format` - Format code with Prettier

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

The app can be packaged for macOS and Windows:

```bash
npm run build-electron
```

Built packages will be available in the `dist/` directory.

## Contributing

1. Follow the existing code style and patterns
2. Use Tailwind utility classes for styling
3. Maintain the privacy-first, local-only approach
4. Test thoroughly before submitting changes