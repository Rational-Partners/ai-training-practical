---
title: "Documentation"
description: "Manually trigger documentation updates for recent changes or specific areas"
---

You are triggering a documentation update. Your goal is to ensure documentation stays current with recent code changes.

## Philosophy

1. **Documentation follows implementation** - Code first, docs after
2. **Apply significance threshold** - Not everything needs documenting
3. **Right location, right type** - Reference vs technical vs planning
4. **Cross-reference always** - Link bidirectionally

## Usage

```
/docs                    # Check what needs documenting based on recent changes
/docs [area]             # Focus on specific area (api, frontend, database, etc.)
/docs sync               # Sync documentation with recent commits
/docs audit              # Full documentation health check
```

## Process

### No Arguments: Recent Changes Check

1. Check recent commits (last 10-20)
2. Identify what was changed
3. Apply documentation criteria
4. Report what needs documenting
5. Ask if you should proceed

### With Area Argument

Focus documentation effort on specific area:

| Area | Scope |
|------|-------|
| `api` | Backend API endpoints, routes, schemas |
| `frontend` | Frontend components, pages, state |
| `database` | Schema, migrations, models |
| `services` | Backend services, business logic |
| `infrastructure` | Deployment, monitoring, config |
| `[feature]` | Specific feature by name |

### Sync Mode

1. Read recent commits since last documentation update
2. Identify significant changes that warrant documentation
3. Spawn documentation agent to create/update docs
4. Report what was documented

### Audit Mode

Full documentation health check:
1. Compare documentation against codebase
2. Find outdated content
3. Identify missing documentation
4. Check cross-reference integrity
5. Report issues with recommendations

## Documentation Decision Criteria

Use the `documentation` skill criteria:

**Document when:**
- New user-facing feature
- New API pattern or endpoint category
- Architectural change
- Complex workflow
- Reusable pattern introduced
- External integration

**Skip when:**
- Bug fixes
- Single endpoints following existing patterns
- Refactoring without behavior change
- Simple CRUD operations
- Minor UI tweaks

## Spawning Documentation Agent

For significant documentation work, spawn the documentation agent:

```
Task tool with subagent_type="general-purpose"

Prompt: "You are the documentation agent. Read .claude/agents/documentation.md for your role.

Context:
- [What was built/changed]
- [Plan reference if applicable]
- [Recent commits]

Create/update documentation following the agent workflow and documentation skill guidelines."
```

## Output Format

### Recent Changes Check
```markdown
## Documentation Status

### Recent Changes (last N commits)
- [commit] [description] → [Needs doc / Skip - reason]

### Recommended Documentation
1. **[Feature/Area]** - [What to document]
   - Type: Reference / Technical
   - Location: `documentation/[path]/`

### Skipped (Below Threshold)
- [change] - [reason for skipping]

Would you like me to proceed with documentation?
```

### Audit Report
```markdown
## Documentation Audit

### Coverage
- Features documented: X/Y (Z%)
- API endpoints: A/B (C%)

### Issues Found
**Critical:**
- [Outdated/missing documentation]

**Important:**
- [Cross-reference issues]

**Minor:**
- [Formatting, minor updates]

### Recommendations
1. [Priority action]
2. [Secondary action]
```

## References

- `.claude/agents/documentation.md` - Documentation agent specification
- `.claude/skills/documentation/SKILL.md` - Documentation standards
- `documentation/DOCUMENTATION_ORGANISATION.md` - Folder structure guide

$ARGUMENTS
