---
title: "Feature Scope"
description: "Quick feasibility assessment before committing to full planning"
---

You are performing a lightweight feasibility assessment for a feature idea. Your goal is to help the user understand complexity and viability BEFORE committing to full planning with `/spec`.

## Philosophy

1. **Fast and lightweight** - This is a quick assessment, not a full plan
2. **Codebase-informed** - Understand what exists before estimating complexity
3. **Few key questions** - 3-5 questions max, not 15-25
4. **Clear recommendation** - Help user decide: proceed, research more, or reconsider
5. **No files created** - Output stays in conversation only

## Process

### Phase 1: Understand the Feature Idea

Read the user's feature description. If it's vague, ask ONE clarifying question to understand the basic intent before proceeding.

### Phase 2: Codebase Exploration

Use the **Explore agent** to quickly research the codebase:

```
Task tool with subagent_type="Explore"

Prompt: "Research the codebase for [feature area]. Find:
1. Existing related code or similar implementations
2. Patterns that would apply to this feature
3. What areas would be touched (database, backend services, frontend pages)
4. Any obvious blockers or dependencies

Be quick - this is a feasibility check, not exhaustive research."
```

### Phase 3: Clarifying Questions

Based on the codebase findings, ask **3-5 targeted questions** to understand scope boundaries:

**Good questions for scoping:**
- What's the minimum viable version of this? (MVP boundaries)
- What's explicitly OUT of scope? (Avoid scope creep)
- Is this for all users or a specific subset? (Permission implications)
- Does this need to integrate with external services? (Dependency risk)
- Is there existing data that needs migration? (Complexity factor)

**Avoid spec-style questions** like detailed field lists, specific UI layouts, or comprehensive error handling. Save those for `/spec`.

Wait for answers before proceeding.

### Phase 4: Complexity Assessment

Synthesize findings into a clear assessment:

```markdown
## Feature Scope: [Name]

### What Already Exists
- [Existing code/patterns that support this]
- [Related features we can learn from]
- [Reusable components or services]

### Areas Touched
- **Database**: [Yes/No - brief description if yes]
- **Backend**: [Services, routes, integrations affected]
- **Frontend**: [Pages, components, navigation changes]
- **External**: [Third-party APIs, services]

### Complexity Estimate

**Rating**: [Trivial / Small / Medium / Large / Huge]

| Factor | Assessment |
|--------|------------|
| New code vs modification | [Mostly new / Mixed / Mostly modification] |
| Database changes | [None / Additive only / Schema changes] |
| External dependencies | [None / Existing integrations / New integrations] |
| UI complexity | [None / Simple / Moderate / Complex] |
| Testing effort | [Unit tests only / Integration needed / E2E needed] |

### Key Unknowns
- [Questions that would need answering in full planning]
- [Technical uncertainties]
- [Business logic gaps]

### Risks
- [Potential blockers]
- [Dependencies on other work]
- [Areas of uncertainty]

### Recommendation

[One of the following:]

**Proceed to /spec** - Scope is clear, complexity is manageable, foundation exists.

**Needs more research** - [Specific unknowns to resolve first, e.g., "Test the external API", "Clarify business rules for X"]

**Reconsider** - [Why: too complex, dependencies not ready, conflicts with other work, better alternatives exist]
```

## Complexity Rating Guide

| Rating | Description | Typical Effort |
|--------|-------------|----------------|
| **Trivial** | Single file change, no new patterns | < 1 hour |
| **Small** | Few files, follows existing patterns exactly | 1-4 hours |
| **Medium** | Multiple areas, some new patterns needed | 4-16 hours |
| **Large** | Significant new functionality, multiple domains | 1-3 days |
| **Huge** | Major feature, new architecture, external integrations | 3+ days |

## What This Command Does NOT Do

- Create planning documents or folders
- Ask exhaustive questions about every detail
- Make implementation decisions
- Commit to building the feature

This is purely an assessment to inform the go/no-go decision.

## Examples

### Good /scope usage:
- "I want to add a way for users to export their data as CSV"
- "What would it take to integrate with Slack for notifications?"
- "Could we add a dashboard widget showing recent activity?"

### Better suited for other commands:
- "Build me a CSV export feature" → Use `/spec` then `/build`
- "How does the notification system work?" → Use Explore agent directly
- "What's our tech stack?" → Use codebase exploration

## Output

After presenting the assessment, ask:

> "Based on this assessment, would you like to:
> 1. **Proceed** - Run `/spec` to create a full implementation spec
> 2. **Research more** - Investigate specific unknowns before deciding
> 3. **Park it** - Save the idea for later consideration"

$ARGUMENTS
