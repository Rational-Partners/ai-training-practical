---
name: documentation
description: Documentation standards and decision criteria. Use when deciding whether to document, creating documentation, or maintaining existing docs. Covers significance thresholds, structure, and cross-referencing.
---

# Documentation Standards

Standards for creating and maintaining project documentation.

## Documentation Decision Criteria

### Document When

| Criteria | Examples |
|----------|----------|
| New user-facing feature | Document upload, new dashboard |
| New API pattern/category | New authentication flow, webhook system |
| Architectural change | New service layer, caching system |
| Complex workflow | Multi-step process, state machine |
| Reusable pattern | New utility pattern, component pattern |
| External integration | Third-party API, OAuth provider |
| Significant configuration | New environment setup, deployment config |

### Don't Document When

| Criteria | Examples |
|----------|----------|
| Bug fix | Fixing null pointer, correcting logic |
| Single endpoint (existing pattern) | Adding GET /items/:id like other resources |
| Refactoring | Renaming, restructuring without behavior change |
| Simple CRUD | Basic create/read/update/delete |
| One-off implementation | Special case handling |
| Minor UI tweaks | Button styling, text changes |
| Test additions | Adding test coverage |

### Decision Flowchart

```
Is this a new capability users interact with?
  └─ Yes → Document
  └─ No → Does it introduce a new pattern?
            └─ Yes → Document
            └─ No → Does someone else need to understand how it works?
                      └─ Yes → Document
                      └─ No → Skip documentation
```

## Documentation Types

| Type | Location | Purpose |
|------|----------|---------|
| Reference docs | `documentation/reference/` | How features work (evergreen) |
| Technical docs | `documentation/technical/` | Implementation details |
| Planning docs | `documentation/planning/` | Decisions and context (ephemeral) |
| Process docs | `.claude/skills/` | How to do things (skills) |

## Evergreen Documentation Structure

```markdown
# Feature Name

## Introduction
2-sentence summary of what this does.

## See Also
- `related/doc.md` - How it relates
- `src/path/file.ts` - Implementation
- https://external.url - Additional context

## Key Concepts
[Core ideas needed to understand the feature]

## How It Works
[Architecture, flow, or process]

## Usage Examples
[Code or workflow examples]

## Configuration
[Options and settings]

## Troubleshooting
[Common issues and solutions]
```

## Cross-Referencing Rules

### Always Link To
- Related documentation
- Implementation files
- External resources (APIs, libraries)
- Planning docs with historical context

### Always Link From
- Parent/overview documentation
- Related features
- README or index files

### Link Format
```markdown
- `documentation/reference/FEATURE.md` - Brief description of relevance
- `backend/src/services/feature.service.ts` - Core implementation
- [External Docs](https://example.com) - Official reference
```

## Single Source of Truth

### Do
- Keep information in ONE canonical location
- Link to the source, don't copy
- Update in one place when things change

### Don't
- Duplicate content across files
- Copy configuration details into multiple docs
- Maintain parallel descriptions of the same thing

## Documentation Quality Checklist

Before committing documentation:
- [ ] Accurately reflects current implementation
- [ ] Has "See Also" section with relevant links
- [ ] No duplication with existing docs
- [ ] Examples are current and working
- [ ] Cross-references are bidirectional
- [ ] Status indicators are accurate (if used)

## Status Indicators

Use consistently when documenting feature status:

| Indicator | Meaning |
|-----------|---------|
| ✓ | Implemented and working |
| 🚧 | In progress |
| 📋 | Planned but not started |
| ⚠️ | Deprecated, avoid using |

## Maintenance Triggers

Update documentation when:
- Feature behavior changes
- API contracts change
- Configuration options change
- During regular housekeeping reviews
- When you notice something outdated

## Files Reference

- `documentation/reference/` - Evergreen feature docs
- `documentation/technical/` - Implementation details
- `documentation/planning/` - Decisions and history
- `documentation/DOCUMENTATION_ORGANISATION.md` - Organization guide (if exists)
