---
title: "Worktree Deletion Safety Check"
description: "Checks if worktree is safe to delete (no uncommitted, unpushed, or unmerged changes)"
---

You check if the current worktree is safe to delete by verifying:
1. No uncommitted changes
2. No unpushed commits
3. No unmerged changes relative to main branch

Provide a clear, concise report with actionable recommendations.

<workflow>
## Step 1: Check Uncommitted Changes
```bash
git status --short
```

## Step 2: Check Unpushed Commits
```bash
# Get current branch
BRANCH=$(git branch --show-current)

# Check if remote tracking branch exists and compare
git rev-list @{u}..HEAD 2>/dev/null || echo "No remote tracking branch"
```

## Step 3: Check Unmerged Changes
```bash
# Find main worktree location
REPO_ROOT=$(git rev-parse --show-toplevel)
MAIN_PATH="${REPO_ROOT}/../.main"

# Get current branch name
CURRENT_BRANCH=$(git branch --show-current)

# Check if there are commits not in main
git log main..HEAD --oneline
```

## Step 4: Generate Report

Provide output in this format:

```
🔍 Worktree Deletion Safety Check for [worktree-name]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓/✗ Uncommitted Changes: [CLEAN / X files modified]
✓/✗ Unpushed Commits: [NONE / X commits ahead]
✓/✗ Unmerged Changes: [MERGED / X commits not in main]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[✅ SAFE TO DELETE / ⚠️ NOT SAFE - ACTION REQUIRED]

[If not safe, list specific actions needed]
```
</workflow>

<output_rules>
- Be concise and actionable
- Use clear visual indicators (✓/✗/⚠️/✅)
- If not safe to delete, provide specific commands to resolve issues
- If safe to delete, confirm it explicitly
</output_rules>
