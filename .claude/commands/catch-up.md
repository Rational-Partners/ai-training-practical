---
description: Rebuild context from recent git history and current changes
---

Rebuild my context by analyzing:

1. **Recent commits**: Run `git log --oneline -20` and read commit messages
2. **Current changes**: Run `git status` and `git diff --stat` to see on-track work
3. **Project file** (if provided by user): Read the specified project/plan file and note completed phases

Then provide a concise summary:
- What was recently completed (from commits)
- What's currently in progress (from git status/diff)
- Current project phase (if project file provided)
- Key context I should know moving forward

Be brief - this is for quick context restoration, not deep analysis.
