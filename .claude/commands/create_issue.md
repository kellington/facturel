You are an AI assistant that creates well-structured GitHub issues for the BI Service Desk project.

## Defaults
- **Repo:** https://github.com/skyideas/biservicedesk
- **Project:** https://github.com/orgs/skyideas/projects/2/views/1

## Feature Description
$ARGUMENTS

## Available Labels

### Issue Types (required - pick one)
| Label | Color | Description |
|-------|-------|-------------|
| `type: bug` | Red (#d73a4a) | Bug - something isn't working |
| `type: feature` | Cyan (#a2eeef) | Feature - new functionality |
| `type: task` | Blue (#0052cc) | Task - maintenance or chore |

### Priority (required - pick one)
| Label | Color | Description |
|-------|-------|-------------|
| `priority: high` | Red (#FF0000) | Address immediately |
| `priority: medium` | Orange (#FFA500) | Address soon |
| `priority: low` | Green (#008000) | Address when time permits |

### Available Milestones
| Milestone | Description |
|-----------|-------------|
| `Code Review: Critical Blockers` | Phase 1A - Must fix before production |
| `Code Review: Test Suite` | Phase 1B - Test reliability improvements |
| `Code Review: Quality` | Phase 1C - Code quality improvements |
| `Phase 2 Prep: Foundation` | Phase 2A - Critical planning work |
| `Phase 2 Prep: Organization` | Phase 2B - Structural improvements |
| `Phase 2 Prep: Automation` | Phase 2C - Ongoing improvements |

## Instructions

### Step 1: Plan
Analyze the feature description and present a plan:
- Proposed title (clear, concise, actionable)
- Issue type: `bug`, `feature`, or `task`
- Priority: `high`, `medium`, or `low`
- Milestone (if applicable)
- Key points to cover
- Any clarifying questions

Wait for approval before proceeding.

### Step 2: Create the Issue
Once approved, generate the issue using the appropriate template:

**For bugs (`type: bug`):**
```markdown
## Summary
[One-paragraph description of the bug]

## Problem
**Current State:**
- [What's happening now - be specific with file names and line numbers]

**Impact:**
- [Who/what is affected]

## Solution
[Proposed fix with code examples if applicable]

## Acceptance Criteria
- [ ] [Specific, testable criteria]
- [ ] [Each criterion should be verifiable]

## Verification Steps
```bash
# Commands to verify the fix works
```

## References
- Source: [Link to review document or original issue]
- Related: [Links to related issues]
- Files: [List of files to modify]
```

**For features (`type: feature`):**
```markdown
## Summary
[One-paragraph description of the feature]

## Motivation / Problem
[Why this feature is needed]

## Proposed Solution
[How to implement it]

## Acceptance Criteria
- [ ] [Specific, testable criteria]
- [ ] [Each criterion should be verifiable]

## Technical Notes
[Optional: Architecture decisions, dependencies, etc.]

## References
- Source: [Link to PRD or design document]
- Related: [Links to related issues]
```

**For tasks (`type: task`):**
```markdown
## Summary
[One-paragraph description of the task]

## Background
[Context and why this task is needed]

## Tasks
- [ ] [Subtask 1]
- [ ] [Subtask 2]
- [ ] [Subtask 3]

## Acceptance Criteria
- [ ] [How to verify the task is complete]

## References
- Related: [Links to related issues or documents]
```

### Step 3: Create in GitHub

Use the GitHub CLI to create the issue:

```bash
# 1. Create the issue
gh issue create \
  --title "<title>" \
  --label "type: <bug|feature|task>" \
  --body "$(cat <<'EOF'
<issue body here>
EOF
)"

# 2. Add priority label
gh issue edit <issue_number> --add-label "priority: <high|medium|low>"

# 3. Add milestone (if applicable)
gh issue edit <issue_number> --milestone "<milestone_name>"
```

### Step 4: Verify
After creating, verify with:
```bash
gh issue view <issue_number>
```

## Example: Complete Issue Creation

```bash
# Create bug issue
gh issue create \
  --title "Fix Docker Compose CONFIG_DIR environment variable" \
  --label "type: bug" \
  --body "$(cat <<'EOF'
## Summary

Docker Compose fails to start the backend container because the `CONFIG_DIR` environment variable is missing.

## Problem

**Current State:**
- `docker-compose.yml` does not define `CONFIG_DIR`
- `backend/app/main.py` treats `CONFIG_DIR` as mandatory
- Result: Backend container crashes on startup

**Impact:**
- Cannot test locally with Docker Compose
- Cannot deploy to production via Docker

## Solution

Add to docker-compose.yml:
```yaml
backend:
  environment:
    CONFIG_DIR: /config
  volumes:
    - ./config:/config
```

## Acceptance Criteria

- [ ] `CONFIG_DIR=/config` added to docker-compose.yml
- [ ] `docker-compose up` starts without errors
- [ ] Backend health check returns 200

## References

- Source: PHASE1-CODE_REVIEW_SUMMARY.md
- Files: `docker-compose.yml`
EOF
)"

# Add priority and milestone
gh issue edit 33 --add-label "priority: high"
gh issue edit 33 --milestone "Code Review: Critical Blockers"
```
