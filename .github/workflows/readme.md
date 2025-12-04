# GitHub Workflows ReadMe


  | Workflow               | Trigger                            | Purpose
         |
  |------------------------|------------------------------------|----------------------------------------------------------------------------------------------
  -------|
  | claude.yml             | @claude mention in comments/issues | On-demand assistant - Responds when you tag @claude in PR comments, issue comments, or issues
         |
  | claude-code-review.yml | PR opened/updated                  | Automatic code review - Runs automatically on every PR to review code quality, bugs, security, etc. |
  | build.yml              | Version tag push (`v*`) or manual  | Cross-platform build - Builds macOS (.dmg) and Windows (.exe) installers on native runners |

  claude.yml (Interactive)

  - Triggers when someone types @claude in a comment
  - Follows instructions from the comment
  - Good for asking questions, requesting specific help

  claude-code-review.yml (Automatic)

  - Triggers on every PR (opened or synchronized)
  - Runs a fixed code review prompt
  - Reviews: code quality, bugs, performance, security, test coverage
  - Posts review as a PR comment

  build.yml (Release Builder)

  - Triggers on version tags (e.g., `git push origin v1.0.0`) or manual dispatch
  - Builds on both macOS and Windows runners in parallel
  - Compiles native modules (better-sqlite3) correctly for each platform
  - Uploads .dmg, .zip, and .exe artifacts to the workflow run
