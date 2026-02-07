---
title: "Git Commit"
description: "Analyzes changes and creates commits following project guidelines"
---

Execute the git commit workflow using the `git-commits` skill for all standards and quality gates.

## Workflow

1. Run `git status && git diff --stat` to review changes
2. Apply build verification (skill: CRITICAL section)
3. Batch changes into logical commits (skill: Batching Strategy)
4. Use proper commit message format (skill: Commit Message Format)
5. Execute commits

## Arguments

- No args: Analyze all changes and suggest/create commits
- `[message]`: Use specific message for single commit
- `--review-only`: Analyze without committing

## Safety

**NEVER discard changes without explicit user permission.** When uncertain, commit everything - data loss is worse than an extra commit.

## Reference

All commit knowledge is in the `git-commits` skill (`.claude/skills/git-commits/SKILL.md`).
