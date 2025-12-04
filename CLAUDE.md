# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Facturel** is a local bill management app designed for privacy-conscious users who want to track bills without cloud integration or banking connectivity. The application stores all data locally using SQLite and provides a clean, simple interface for managing recurring bills and payment history.

## Tech Stack & Architecture

- **Frontend**: React with Tailwind CSS for styling
- **Desktop App**: Electron for cross-platform packaging 
- **Database**: SQLite (via better-sqlite3) for local data storage
- **Storage Location**: User's app data directory
- **Architecture**: Local-only application with no backend or server dependencies

## Key Features to Implement

### Core Functionality
- Bill/payee management with name, logo upload, due date, payment URL, notes
- Recurring billing (monthly, quarterly, yearly intervals)
- Payment logging with amount, date, and notes
- User-defined tagging system (bills can have multiple tags)
- Bill archiving/reactivation
- Payment statistics and summaries
- CSV export functionality

### Data Requirements
- All data stored locally in SQLite database
- Support for image uploads (payee logos) stored locally
- No external API calls or data transmission
- Editable payment history

## Development Setup

1. Install dependencies: `npm install`
2. Run in development mode: `npm run dev`
3. Build for production: `npm run build && npm run build-electron`

## Project Structure

```
src/                   # React components and application logic
  ├── components/      # React UI components
  ├── context/         # React context for state management
  ├── main.js          # Electron main process
  ├── preload.js       # Electron preload script
  └── database.js      # SQLite database manager
public/                # Static files and Electron entry points
docs/                  # Architecture documentation
  └── PRDs/            # Product requirements and specifications
tests/                 # Unit and integration tests
  ├── unit/            # Component and function tests
  └── integration/     # Full workflow tests
scripts/               # Build and utility scripts
```

## Important Notes

- **Privacy First**: Never implement features that send data externally
- **Local Storage**: All data must remain on user's device
- **Performance**: Target <2s app load time, <100ms for save/retrieve operations
- **Cross-Platform**: Electron app should work on Mac and Windows
- **User Control**: Users should be able to edit all data including payment history

## Development Guidelines

- Use React functional components with hooks
- Leverage Tailwind's utility classes for styling
- Implement proper error handling for database operations
- Ensure data persistence across app restarts