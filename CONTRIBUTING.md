# Contributing to Facturel

Thank you for your interest in contributing to Facturel! This document provides guidelines and information for contributors.

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Install dependencies: `npm install`
4. Start development mode: `npm run dev`

## Development Workflow

### Branch Naming

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring

### Code Style

- Run `npm run lint` to check for linting issues
- Run `npm run format` to format code with Prettier
- Follow existing code patterns and conventions

### Commit Messages

Write clear, concise commit messages that describe what changed and why.

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes
3. Run linting and ensure no errors: `npm run lint`
4. Test your changes thoroughly
5. Submit a pull request with a clear description

## Core Principles

When contributing, please keep these principles in mind:

### Privacy First
- Never add features that transmit data externally
- All data must remain on the user's device
- No analytics, telemetry, or cloud integrations

### Simplicity
- Keep the UI clean and intuitive
- Avoid over-engineering solutions
- Focus on core bill management functionality

### Cross-Platform
- Ensure changes work on both macOS and Windows
- Test Electron-specific features on target platforms

## Reporting Issues

When reporting bugs, please include:

- Operating system and version
- Steps to reproduce the issue
- Expected vs actual behavior
- Screenshots if applicable

## Feature Requests

Feature requests are welcome! Please open an issue describing:

- The problem you're trying to solve
- Your proposed solution
- Any alternatives you've considered

## Questions?

Feel free to open an issue for any questions about contributing.
