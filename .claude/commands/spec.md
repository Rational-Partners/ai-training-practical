---
title: "Deep Planning"
description: "Intensive Q&A session to create comprehensive, goal-oriented feature specifications"
---

You are initiating a deep planning session. Your goal is to thoroughly understand the feature requirements through extensive questioning, then produce a goal-oriented specification that agents can execute autonomously.

## Philosophy

1. **Invest time upfront** - Better planning = smoother execution
2. **Ask many questions** - 15-25 questions across all domains
3. **Goal-oriented output** - Define WHAT must be true, not HOW to do it
4. **Acceptance criteria** - Everything must be testable
5. **Capture decisions** - Rationale matters for agents

## Process

### Phase 1: Initial Understanding

Read the user's request and ask clarifying questions to understand the big picture:

**Context Questions** (ask 3-5):
- What problem does this solve?
- Who are the users affected?
- What's the expected usage pattern?
- Are there time/performance requirements?
- Any compliance or security considerations?

Wait for answers before proceeding.

### Phase 2: Domain Deep-Dives

Ask questions specific to each domain that will need work:

**Data Model Questions** (ask 3-5):
- What entities/concepts are involved?
- What are the relationships between them?
- What fields/attributes are needed?
- Any constraints or validations?
- How does this relate to existing data?

**API Design Questions** (ask 3-5):
- What operations need to be exposed?
- Who should have access (permissions)?
- What validation is required?
- How should errors be handled?
- Any rate limiting or size limits?

**User Experience Questions** (ask 3-5):
- What's the user journey/flow?
- What UI is needed?
- What feedback should users see (loading, success, errors)?
- Where does this fit in navigation?
- Mobile/responsive requirements?

**Testing Questions** (ask 2-3):
- What are the critical paths that must work?
- Any edge cases to consider?
- Performance or load testing needed?

**Integration Questions** (ask 2-3):
- What existing systems does this touch?
- Any external services or APIs?
- Migration considerations for existing data?

### Phase 3: Codebase Research

Before writing the plan, research the existing codebase:

1. **Find similar implementations** - Use Glob/Grep to find related code
2. **Understand existing patterns** - How are similar features built?
3. **Check for reusable components** - What can be leveraged?
4. **Identify potential conflicts** - What might this feature affect?

**IMPORTANT**: When researching external APIs AND codebase patterns, run these as parallel sub-agents. Don't do them sequentially - they're independent research tasks.

### Phase 4: Consistency Check

Before writing the plan, review all gathered requirements for logical inconsistencies:

**Check for Missing Upstream Data**:
- If we say "warn when X is missing", do we have a way to capture X?
- If we display field Y, is there UI to input field Y?
- If we validate against Z, where does Z come from?

**Check for Assumed Capabilities**:
- Does every user story have the necessary data inputs defined?
- Does every "show/display" have a corresponding "create/capture"?
- Does every "convert/transform" preserve required fields?

**Check for Related Features That Need Updates**:
- Are there email notifications that reference this data?
- Are there scheduled jobs or cron tasks that process this entity type?
- Are there reports, exports, or dashboards that display this data?
- Are there integrations (MCP tools, webhooks) that might need updates?

**Example Anti-Pattern** (missing upstream data):
- Plan said: "Warn when entity is missing required info after conversion"
- Missing: No field to capture that info before conversion
- Result: Had to add feature post-build

**Example Anti-Pattern** (missing downstream consumers):
- Plan said: Add a new entity type to the system
- Missing: Check if the new type appears correctly in all downstream consumers (emails, reports, dashboards)
- Result: Had to fix templates post-build to handle the new type

**Verification Questions**:
1. For each output/display, trace back to its input source
2. For each warning/validation, ensure the data can be captured upstream
3. For each conversion/transformation, verify all target fields have source fields
4. **For each new entity type/category, check all features that iterate over that entity type**

If inconsistencies are found, go back to the user with clarifying questions before proceeding.

### Phase 5: Write the Plan

Create a project folder with the planning document:

**Location**: `documentation/planning/current/YYMMDD[a-z]_feature_name/`

Create this folder structure:
```
documentation/planning/current/YYMMDD[a-z]_feature_name/
├── PLAN.md              # Full planning document
├── orchestrator.md      # Build state tracking
└── learnings.md         # Captured learnings during project
```

**PLAN.md Structure**:
```markdown
# Feature: [Name]

**Status**: Planning
**Created**: YYYY-MM-DD

## Goal
[Clear problem statement and success definition]

## User Stories
[Concrete scenarios from the Q&A]

## Global Acceptance Criteria
[High-level conditions for shipping]

## Domain: Data Layer
**Goal**: [What the data layer must accomplish]
**Acceptance Criteria**: [Testable conditions]
**Context**: [Patterns, files, constraints]
**Pitfalls**: [Things to avoid]

## Domain: Backend API
**Goal**: [What the API must provide]
**Acceptance Criteria**: [Testable conditions]
**Context**: [Permissions, validation, patterns]
**Pitfalls**: [Things to avoid]

## Domain: Frontend
**Goal**: [What the UI must accomplish]
**Acceptance Criteria**: [Testable conditions]
**Context**: [Design system, components, flow]
**Pitfalls**: [Things to avoid]

## Domain: Tests
**Goal**: [Coverage requirements]
**Acceptance Criteria**: [Test scenarios]
**Context**: [Test patterns]

## Key Decisions
[Important choices with rationale]

## Anti-Patterns
[Mistakes to avoid - pull from documentation/workflow/learnings.md]

## References
[Files and patterns to use]

## Open Questions
[Anything unresolved]
```

### Phase 6: Present for Approval

Present the completed plan to the user:
- Summarize the goals
- Highlight key decisions
- Note any open questions
- Ask for approval to proceed

Once approved, update the plan status to "Approved" and inform user they can run `/build` with the plan path.

## Quality Checklist

Before presenting the plan:
- [ ] Project folder created in `documentation/planning/current/`
- [ ] PLAN.md has all domain sections with clear goals
- [ ] orchestrator.md created with phase tracking
- [ ] learnings.md created (can be empty initially)
- [ ] All acceptance criteria are testable
- [ ] Key decisions have rationale
- [ ] Anti-patterns are included
- [ ] References to existing code are accurate
- [ ] No prescriptive implementation steps (goals only)
- [ ] **Consistency check passed** - all outputs have inputs, all warnings have data sources

## References

- `documentation/workflow/planning-template.md` - Full template
- `documentation/workflow/learnings.md` - Historical anti-patterns
- `documentation/planning/completed/` - Example completed plans

$ARGUMENTS
