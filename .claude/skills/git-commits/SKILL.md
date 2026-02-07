---
name: git-commits
description: Git commit workflow and standards. Use when committing code, batching changes, or verifying builds before commits. Covers build verification, commit message format, and quality gates.
---

# Git Commit Standards

Standards for creating clean, well-organized commits.

## CRITICAL: Build Verification First

**BEFORE ANY COMMIT**, verify builds pass:

```bash
# Frontend
cd frontend && npm run build

# Backend
cd backend && npm run build:typecheck
```

**BUILD FAILURE = NO COMMIT**. A broken build means code cannot be deployed.

## Quality Gates (ALL MUST PASS)

1. **Production builds** - Zero errors in frontend AND backend
2. **Type checking** - No TypeScript errors
3. **Tests** - All tests passing
4. **Linting** - Clean lint (or acceptable warnings only)
5. **No secrets** - No credentials in code

## Commit Message Format

```
<type>: <subject> (50 chars max)

<body> (optional, wrap at 72 chars)
- Bullet points for multiple changes
- Focus on WHY, not just WHAT
```

### Types

| Type | Use For |
|------|---------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no code change |
| `refactor` | Code change, no feature/fix |
| `test` | Adding/updating tests |
| `chore` | Build, deps, config |

### Examples

```bash
# Feature
git commit -m "feat: add company document upload"

# Bug fix
git commit -m "fix: prevent duplicate document names"

# With body
git commit -m "feat: add document type validation

- Added DocumentType enum
- Validate file types on upload
- Return 400 for invalid types"
```

## Batching Strategy

Each commit should:
- Represent a small/medium feature or logical unit
- Leave codebase in a working state
- Build successfully
- Not mix unrelated changes

### Good Batching

```
Commit 1: feat: add Document database model
Commit 2: feat: add document upload API endpoint
Commit 3: feat: add document list UI component
Commit 4: test: add document management tests
```

### Bad Batching

```
Commit 1: add document feature, fix auth bug, update readme
```

## Strategic Commit Points

Commit when you complete:
- **Database changes** - Schema + migration together
- **API endpoint** - Routes + service + schemas
- **UI component** - Component + integration
- **Test suite** - Related tests together
- **Phase completion** - All phase work

## Complex Changes

For multiple commits or complex batching:
- Plan the full batch strategy before starting any commits
- Each commit should still leave codebase in working state
- Execute commits sequentially, verifying each succeeds

## Handling Concurrent Changes

Minimize interference from other agents:

```bash
# Chain operations to reduce window
git reset HEAD unwanted-file && \
git add wanted-file && \
git commit -m "fix: resolve issue"
```

## CRITICAL: Data Loss Prevention

**NEVER discard changes without explicit user permission.**

- NEVER run `git restore`, `git reset --hard`, `git checkout -- file` without asking
- NEVER assume a file is a "build artifact" - ASK before discarding
- If files look like they shouldn't be committed, ASK the user first
- When uncertain, **commit everything** - data loss is worse than an extra commit
- User may have intentionally modified large files, images, or generated files

**When encountering conflicts or unexpected issues: STOP and ask the user.**

## Never Do

- Commit code that doesn't build
- Commit code with failing tests
- Commit secrets or credentials
- Force push to main/master
- Skip pre-commit hooks without permission
- Mix unrelated changes in one commit
- Discard changes without explicit permission

## Build Failure Recovery

If build fails:

1. **STOP** - Don't proceed with commits
2. **FIX** - Fix ALL build errors (even pre-existing)
3. **VERIFY** - Re-run builds until all pass
4. **THEN** - Proceed with commits

```bash
# Verify both pass
cd frontend && npm run build && cd ../backend && npm run build:typecheck
```

## Files Special Cases

```bash
# Files with special characters
git add "path/with spaces/file.txt"

# Database changes - ALWAYS together
git add backend/prisma/schema.prisma
git add backend/prisma/migrations/[new_folder]/
git commit -m "feat: add [description] to database"
```

## Pre-Commit Checklist

- [ ] Frontend build passes
- [ ] Backend build passes
- [ ] Type-check passes
- [ ] Tests pass
- [ ] Changes are logically grouped
- [ ] Commit message follows format
- [ ] No secrets in code
- [ ] No unrelated changes mixed in
