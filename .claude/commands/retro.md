---
title: "Retrospective"
description: "Analyze completed project to capture learnings and improve the workflow"
---

You are running a retrospective on a completed project. Your goal is to analyze what happened, capture learnings, and update the workflow system for future improvement.

## Philosophy

1. **Learn from every project** - Good and bad experiences are valuable
2. **Update the system** - Learnings should change agent specs and templates
3. **Be specific** - Vague learnings don't help
4. **No blame** - Focus on process improvement, not fault

## Input

The user provides a path to a completed project folder:
- `documentation/planning/current/YYMMDD_feature_name/`

## Process

### Phase 1: Gather Information

Read all state files from the project folder:
- `orchestrator.md` - Overall execution timeline
- `database.md` - Database agent's experience
- `backend.md` - Backend agent's experience
- `frontend.md` - Frontend agent's experience
- `test.md` - Test agent's experience

Also read:
- The original planning document
- Git log for the commits made

### Phase 2: Analyze

Answer these questions:

**Planning Phase**
- Were the questions asked during `/spec` sufficient?
- Were there surprises that better questions would have caught?
- Were acceptance criteria clear enough for agents?
- Were key decisions helpful or constraining?

**Execution Phase**
- Did agents complete without blockers?
- What blockers occurred and how were they resolved?
- Did agents make good autonomous decisions?
- Were there miscommunications between agents?

**Quality**
- Did the feature work correctly?
- Were there bugs found after completion?
- Was test coverage adequate?
- Did all quality gates pass on first try?

**Timing**
- How long did planning take?
- How long did execution take?
- Were there delays? Why?

### Phase 3: Identify Learnings

Categorize findings:

**Planning Learnings**
- Questions that should be added
- Questions that weren't useful
- Template improvements needed

**Agent Learnings**
- Patterns that worked well
- Patterns that failed
- New anti-patterns discovered
- Agent spec updates needed

**Workflow Learnings**
- Process improvements
- Hook adjustments
- Coordination improvements

### Phase 4: Update System

**CRITICAL: Integrate learnings into the system, don't just log them.**

The goal is to update the actual skills/agents so future work benefits automatically.

**Step 1: Identify where learning belongs**

| Learning Type | Integrate Into |
|---------------|----------------|
| Database pattern/anti-pattern | `prisma-migrations` skill |
| API development issue | `api-development` skill |
| Commit/git issue | `git-commits` skill |
| Testing issue | `tdd-workflow` skill |
| Code quality issue | `code-quality` skill |
| Agent coordination issue | Relevant agent spec |
| Planning issue | `spec` command or planning template |

**Step 2: Update the skill/agent directly**

Add to the relevant section:
- Add to "Anti-Patterns" or "Never Do" sections
- Add to "Quality Checks" if it's a validation step
- Add to workflow steps if it's a process change

**Step 3: Log in learnings.md for tracking**

Only add to `documentation/workflow/learnings.md` as a record of what was changed:
```markdown
| Date | Learning | Integrated Into | Section Updated |
|------|----------|-----------------|-----------------|
| 2026-01-03 | Don't over-ask for confirmation | git-commits skill | CRITICAL: Data Loss Prevention |
```

The learnings.md file is a **changelog**, not the source of truth. The skill/agent IS the source of truth.

**Step 4: Update other files if needed**

- Planning template (`documentation/workflow/planning-template.md`)
- `/spec` command (`.claude/commands/spec.md`)
- Agent specs (`.claude/agents/*.md`)

### Phase 5: Create Retro Summary

Write a summary to the project folder:

```markdown
# Retrospective: YYMMDD_feature

**Date**: YYYY-MM-DD
**Feature**: [Feature name]

## Timeline
- Planning: [duration]
- Execution: [duration]
- Total: [duration]

## What Went Well
- [Specific positive things]

## What Could Be Better
- [Specific improvement areas]

## Blockers Encountered
- [Blocker 1]: [How resolved]
- [Blocker 2]: [How resolved]

## Learnings Captured

### Added to Agent Specs
- [Agent]: [What was added]

### Added to Anti-Patterns
- [Pattern]: [Why it's bad]

### Planning Template Updates
- [What was changed]

## Recommendations for Next Project
- [Specific recommendations]
```

Save as `[project_folder]/RETRO.md`

### Phase 6: Archive Planning Folder

**Move the planning folder from `current/` to `completed/`** to mark the feature as done.

```bash
# If project is in documentation/planning/current/
git mv documentation/planning/current/YYMMDD_feature_name/ documentation/planning/completed/

# Update the PLAN.md status
# Change: **Status**: Approved (or Complete)
# To: **Status**: Archived
```

**Update cross-references:**
- If any other docs reference the planning folder path, update them
- The retro summary should note the new location

**Commit the move:**
```bash
git add -A
git commit -m "chore: archive YYMMDD_feature_name planning docs after retro

Move planning folder to completed/ after successful implementation
and retrospective analysis.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

**Note**: Only archive if the feature is truly complete. If there's follow-up work planned, keep in `current/` and note in the retro summary.

### Phase 7: Report to User

Summarize:
1. Key findings
2. What was updated in the system
3. Planning folder archived location
4. Recommendations for future projects

## Example Learnings

**Good learning (specific)**:
> "The database agent created an index on `companyId` but forgot to add one on `status`, causing slow queries. Added guidance to database.md to always index enum fields used in filters."

**Bad learning (vague)**:
> "Things could be faster."

## Quality Checklist

Before completing retro:
- [ ] All agent state files reviewed
- [ ] Planning doc reviewed
- [ ] Specific learnings identified
- [ ] Skills/agents updated with learnings (list files modified)
- [ ] Learnings logged to learnings.md as changelog
- [ ] Retro summary written to project folder
- [ ] Planning folder moved to `completed/` (if feature is done)
- [ ] PLAN.md status updated to "Archived"

## References

- `documentation/workflow/learnings.md` - Where learnings are stored
- `documentation/workflow/planning-template.md` - Planning template to update
- `.claude/agents/*.md` - Agent specs to update

$ARGUMENTS
