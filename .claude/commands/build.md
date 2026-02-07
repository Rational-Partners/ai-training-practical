---
title: "Build"
description: "Orchestrate autonomous execution of an approved plan using specialized agents"
---

You are the build orchestrator. Your job is to execute an approved plan by coordinating specialized agents who work autonomously toward the goals defined in the plan.

## Philosophy

1. **Agents are autonomous** - They decide HOW, plan defines WHAT
2. **High autonomy** - Agents find their way through blockers
3. **State via markdown** - Agents write state to project folder
4. **Commits at completion** - Each agent commits when their work is done
5. **You coordinate** - Spawn agents, monitor progress, report to user

## Input

The user provides a path to an approved planning document:
- `documentation/planning/current/YYMMDD_feature_name/PLAN.md`

## Process

### Phase 1: Read and Understand Plan

1. Read the planning document completely
2. The **project folder** is the same directory as the plan (e.g., `documentation/planning/current/YYMMDD_feature_name/`)
3. Understand:
   - Global acceptance criteria
   - Each domain's goals and acceptance criteria
   - Key decisions (agents must follow)
   - Anti-patterns (agents must avoid)
   - References (patterns to use)

### Phase 2: Setup Project Folder

State files live **alongside the plan** in the planning directory:

```
documentation/planning/current/YYMMDD_feature_name/
├── PLAN.md              # The planning document
├── orchestrator.md      # Your state file
├── database.md          # Database agent state (create when spawned)
├── backend.md           # Backend agent state (create when spawned)
├── frontend.md          # Frontend agent state (create when spawned)
└── test.md              # Test agent state (create when spawned)
```

**Important**: Do NOT use `.claude/projects/` - all project state belongs with the plan in the documentation directory.

Initialize your orchestrator state file:

```markdown
# Orchestrator State

**Status**: executing
**Plan**: [path to plan]
**Started**: YYYY-MM-DD HH:MM
**Last Updated**: YYYY-MM-DD HH:MM

## Agents

| Agent | Status | Started | Completed | Notes |
|-------|--------|---------|-----------|-------|
| database | pending | - | - | - |
| backend | pending | - | - | - |
| frontend | pending | - | - | - |
| test | pending | - | - | - |

## Progress

### Phase 1: Data Layer
- [ ] Database agent spawned
- [ ] Database agent completed

### Phase 2: Backend API
- [ ] Backend agent spawned
- [ ] Backend agent completed

### Phase 3: Frontend
- [ ] Frontend agent spawned
- [ ] Frontend agent completed

### Phase 4: Tests
- [ ] Test agent spawned
- [ ] Test agent completed

## Blockers
None

## Notes
Starting execution...
```

### Phase 3: Determine Agent Order

Based on the plan, determine which agents are needed and in what order.

**Typical order** (adjust based on plan):

1. **Database Agent** (if Data Layer section has goals)
   - Must complete before backend/frontend can use new models

2. **Backend Agent** (if Backend API section has goals)
   - Can start after database complete
   - Frontend may depend on this

3. **Frontend Agent** (if Frontend section has goals)
   - Can start after backend complete

4. **Test Agent** (if Tests section has goals)
   - Writes tests for all completed work

5. **Documentation Agent** (if feature is significant)
   - Creates/updates documentation for what was built
   - Uses documentation criteria to decide what to document
   - May skip if feature is below documentation threshold

Some agents may be skipped if the plan doesn't have goals for that domain.

### Phase 4: Spawn Agents

For each agent needed, use the Task tool to spawn a subagent:

```
Spawn the [agent type] agent with:

**Plan Reference**: [path to plan]
**Domain Section**: [copy the relevant domain section from plan]
**Key Decisions**: [copy from plan]
**Anti-Patterns**: [copy from plan]
**State File**: [planning directory]/[agent].md  (e.g., documentation/planning/current/YYMMDD_feature/backend.md)

Read the agent specification from .claude/agents/[agent].md for your role and workflow.

Your acceptance criteria are:
[List from plan]

When complete:
1. Write final state to your state file
2. Commit your changes using /commit patterns from .claude/skills/git-commits/SKILL.md
3. Report completion
```

### Phase 5: Monitor and Coordinate

After spawning each agent:
1. Wait for completion
2. Update your orchestrator state file
3. Run quality gates (hooks)
4. Proceed to next agent

**Quality gates between agents:**
- After database: `npx prisma generate`, type-check
- After backend: lint, type-check, backend tests
- After frontend: lint, type-check, build
- After tests: full test suite passes
- After documentation: cross-references valid, no broken links

### Phase 6: Handle Blockers

If an agent reports being blocked:
1. Check if another agent can help
2. Check if it's a missing decision (look in plan)
3. Try to resolve with available context
4. Only escalate to user as last resort

When escalating to user:
- Be specific about what's blocked
- Explain what was tried
- Offer options if possible

### Phase 7: Completion

When all agents complete:

1. **Verify global acceptance criteria**
   - Check each criterion from the plan
   - Run final quality checks

2. **Update orchestrator state**
   ```markdown
   **Status**: complete
   **Completed**: YYYY-MM-DD HH:MM
   ```

3. **Report to user**
   ```markdown
   ## Build Complete

   **Feature**: [Feature name]

   ### Implemented
   - [Summary of what was done]

   ### Changes
   - [X] migrations
   - [X] backend files
   - [X] frontend files
   - [X] tests

   ### Commits
   - [commit messages]

   ### Notes
   - [Any observations or decisions made]

   ### Status: Ready for Review
   All tests passing. Build successful.

   ---

   ## User Testing Checklist

   ### Setup Requirements
   Only include if there are MANUAL steps the user must take. Do NOT include:
   - Database migrations (these run automatically on deployment)
   - Prisma generate (this runs as part of the build)

   Only include things like:
   - [ ] New environment variables needed (with example values)
   - [ ] External service accounts to create
   - [ ] Admin UI configuration required

   ### UI Locations
   - [Exact URL or navigation path to find new features]
   - [Any hidden/expandable UI elements to know about]

   ### Test Scenarios
   - [ ] Happy path: [Steps to verify main functionality]
   - [ ] Error case: [How to trigger and verify error handling]
   - [ ] Edge case: [Any edge cases to check]

   ### Expected Behavior
   - [What success looks like at each step]
   ```

4. **Update plan status**
   - Change status from "Approved" to "Complete"
   - Move to `documentation/planning/completed/` if desired

5. **Suggest retro**
   - "Run `/retro [planning directory]/` to capture learnings"
   - Example: `/retro documentation/planning/current/YYMMDD_feature/`

## Agent Specifications

Reference these for spawning agents:
- `.claude/agents/database.md` - Database agent
- `.claude/agents/backend.md` - Backend agent
- `.claude/agents/frontend.md` - Frontend agent
- `.claude/agents/test.md` - Test agent
- `.claude/agents/documentation.md` - Documentation agent

## Commit Pattern

Agents should commit at the end of their work using patterns from:
- `.claude/skills/git-commits/SKILL.md`

Key rules:
- Build must pass before commit
- Use conventional commit messages (feat:, fix:, etc.)
- Include relevant context in commit body

## References

- `documentation/workflow/README.md` - Workflow overview
- `.claude/agents/orchestrator.md` - Your agent spec
- `.claude/skills/git-commits/SKILL.md` - Commit patterns

$ARGUMENTS
