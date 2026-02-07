---
title: "Quick Fix"
description: "Make small changes using domain agents without full planning overhead"
---

You are executing a quick fix - a small change that uses domain agents but skips the full planning workflow.

## Philosophy

1. **Agent knowledge, not plan overhead** - Spawn real agents to get their expertise
2. **Minimal coordination** - No orchestrator state, no project folders
3. **Right-sized** - For bug fixes, small features, tweaks
4. **Quality preserved** - Agents still follow their specs and quality checks

## When to Use /quick

**Good for:**
- Bug fixes
- Adding a field to a model
- Small API changes
- UI tweaks
- Minor refactoring
- Adding validation

**Use /spec + /build instead for:**
- New features with multiple user stories
- Architectural changes
- External integrations
- Anything needing acceptance criteria discussion

## Process

### Phase 0: Check Conversation Context

**IMPORTANT**: Before analyzing the request, check the conversation history for recent context:

1. **Recent /build execution**: Was a feature just built? If so:
   - Read the plan that was executed (path usually mentioned in /build command)
   - The quick fix likely relates to a gap or missing feature from that build
   - Understanding the plan helps identify what was intended vs what's missing

2. **Recent /spec session**: Was planning just completed? If so:
   - The fix may address something discovered during planning
   - Reference the plan for context on related features

3. **Related recent commits**: Check `git log -5 --oneline` for context on what was just changed

**Why This Matters**:
Quick fixes after a build often expose gaps in the original spec. Understanding what was planned helps:
- Identify the root cause (spec gap vs implementation bug)
- Ensure the fix aligns with the feature's intent
- Avoid creating inconsistencies with just-built code

**Example**:
```
User just ran: /build @documentation/planning/current/recruitment_pipeline/PLAN.md
User now says: /quick Add available days field to candidates

Context tells us:
- This relates to the recruitment feature just built
- Check the plan for references to "availability" or "days"
- The plan mentioned warning about missing availability but didn't include capturing it
- Fix should add field to candidate AND update conversion to use it
```

### Phase 1: Analyze the Request

Parse the user's description to identify:
- What domains are affected (database, backend, frontend)
- What the change actually is
- Any implicit requirements
- **How it relates to recent conversation context** (from Phase 0)

**Domain Detection:**

| Keywords/Patterns | Domain |
|-------------------|--------|
| model, field, schema, migration, table, column | database |
| API, endpoint, route, service, validation | backend |
| UI, component, page, button, form, display | frontend |
| test, spec, coverage | test |

### Phase 2: Spawn Domain Agents

For each affected domain, spawn the agent with a focused task.

**Spawning pattern:**

```
Task tool with subagent_type="general-purpose"

Prompt: "You are the [domain] agent. Read your specification at .claude/agents/[domain].md

Your task: [specific task from user request]

Context:
- This is a quick fix, not a full build
- No plan document exists - work from this description
- Follow all quality checks from your agent spec
- Commit your changes when complete using /commit patterns

Do NOT:
- Create state files or project folders
- Wait for other agents
- Ask for approval to proceed

DO:
- Read your agent spec thoroughly
- Apply all quality checks
- Run required validations (migrations, type-check, etc.)
- Commit with descriptive message"
```

### Phase 3: Sequential Execution

Spawn agents in dependency order:

1. **Database agent** (if schema changes needed)
   - Wait for completion before backend

2. **Backend agent** (if API/service changes needed)
   - Can reference new schema from database agent
   - Wait for completion before frontend

3. **Frontend agent** (if UI changes needed)
   - Can reference new API from backend agent

4. **Test agent** (only if explicitly requested)
   - User must ask for tests to be added

### Phase 4: Report Completion

Summarize what was done:

```markdown
## Quick Fix Complete

**Request**: [Original description]

### Changes Made

**Database** (if applicable):
- [What was changed]
- Migration: [migration name]

**Backend** (if applicable):
- [What was changed]
- Files: [list]

**Frontend** (if applicable):
- [What was changed]
- Files: [list]

### Commits
- [commit hash] [message]
- [commit hash] [message]

### Quality Checks Passed
- [ ] Migrations applied
- [ ] Type check passed
- [ ] Build succeeded
```

## Examples

### Example 1: Add a field

```
User: /quick Add a taxId field to the Company model and show it in the company form

Analysis:
- Database: Add taxId field to Company model
- Frontend: Add taxId input to company form
- Backend: Not needed (field auto-exposed via existing endpoints)

Execution:
1. Spawn database agent → adds field, creates migration
2. Spawn frontend agent → adds input to form
```

### Example 2: Fix a bug

```
User: /quick Fix the bug where opportunity status isn't updating correctly

Analysis:
- Backend: Fix status update logic in opportunity service
- Database: Not needed
- Frontend: Not needed

Execution:
1. Spawn backend agent → investigates and fixes the bug
```

### Example 3: API change

```
User: /quick Add validation to ensure email is unique when creating users

Analysis:
- Backend: Add unique validation to user creation endpoint
- Database: Maybe add unique constraint
- Frontend: Not needed

Execution:
1. Spawn database agent → adds unique constraint if missing
2. Spawn backend agent → adds validation with proper error message
```

## Agent Spawn Templates

### Database Agent

```
You are the database agent. Read .claude/agents/database.md for your full specification.

TASK: [specific database task]

CRITICAL REQUIREMENTS (from your spec):
- ALWAYS create a migration for schema changes
- Run `npx prisma migrate dev --name [descriptive_name]`
- Run `npx prisma generate` after migration
- Verify with `npx prisma validate`
- NEVER use `prisma db push` or `prisma migrate reset`

When complete:
- Commit your changes
- Report what migration was created
```

### Backend Agent

```
You are the backend agent. Read .claude/agents/backend.md for your full specification.

TASK: [specific backend task]

CRITICAL REQUIREMENTS (from your spec):
- All endpoints need authentication
- All endpoints need permission checks
- Use Zod for request/response validation
- Follow existing patterns in the codebase
- Run type-check before committing

When complete:
- Commit your changes
- Report what files were modified
```

### Frontend Agent

```
You are the frontend agent. Read .claude/agents/frontend.md for your full specification.

TASK: [specific frontend task]

CRITICAL REQUIREMENTS (from your spec):
- Check if this is Portal (Tailwind tw-) or Dashboard (Bootstrap)
- Follow existing component patterns
- Add loading and error states
- Run type-check and build before committing

When complete:
- Commit your changes
- Report what files were modified
```

## Quality Gates

Even for quick fixes, ensure:

- [ ] Database: Migration created and applied (if schema changed)
- [ ] Backend: Type check passes
- [ ] Frontend: Build succeeds
- [ ] All: Lint passes
- [ ] All: Each agent committed their changes

## What This Command Does NOT Do

- Create plan documents
- Create project folders or state files
- Spawn documentation agent
- Run full test suite (unless requested)
- Track orchestrator state
- Require approval between phases

## References

- `.claude/agents/database.md` - Database agent spec
- `.claude/agents/backend.md` - Backend agent spec
- `.claude/agents/frontend.md` - Frontend agent spec
- `.claude/agents/test.md` - Test agent spec (only if requested)

$ARGUMENTS
