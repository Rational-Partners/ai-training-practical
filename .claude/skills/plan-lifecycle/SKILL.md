---
name: plan-lifecycle
description: Planning document lifecycle management. Use when implementing features from plans, updating planning document status, moving completed plans, or managing cross-references between plans.
---

# Plan Lifecycle Management

Standards for managing planning documents through their lifecycle.

## Document Lifecycle

```
Upcoming → Current → Completed
```

### Status Transitions

1. **Upcoming → Current**: When implementation begins
2. **Current → Completed**: When ALL phases and acceptance criteria are met

## File Locations

| Status | Location |
|--------|----------|
| Upcoming | `documentation/planning/upcoming/` |
| Current | `documentation/planning/current/` |
| Completed | `documentation/planning/completed/` |

## During Implementation

Update planning documents continuously:

### Mark Completed Actions
```markdown
- [x] ✅ Create user model - Commit: abc123f
- [x] ✅ Add API endpoints - Commit: def456a
- [ ] Implement frontend form
```

### Record Discoveries
- Dependencies discovered during implementation
- Architectural decisions made
- Scope adjustments with rationale
- Timeline changes

### Add Implementation Notes
```markdown
**Implementation Notes**:
- Chose Passport.js for OAuth due to security maintenance
- Added Redis caching for session performance
- See `documentation/technical/auth/` for patterns
```

## Completion Workflow

When all phases complete:

### 1. Verify Completion
- [ ] All phases marked complete
- [ ] All acceptance criteria met
- [ ] All tests passing
- [ ] Final validation run

### 2. Add Completion Summary
```markdown
## Completion Summary

**Completed**: [Date]
**Final Commit**: [hash]

### Results
- [Key outcomes and deliverables]

### Lessons Learned
- [Insights for future work]

### Follow-up Tasks
- [Any identified follow-up work]
```

### 3. Update Status
Change the Status field:
```markdown
**Status**: Completed  <!-- was: Current -->
```

### 4. Move File
```bash
mv documentation/planning/current/[plan].md \
   documentation/planning/completed/[plan].md
```

### 5. Update Cross-References
Check other planning documents that reference this plan:
- Update links to new location
- Update status references

### 6. Final Commit
Commit must include:
- Planning document with completion summary
- File move to completed folder
- Any cross-reference updates

```bash
git add documentation/planning/
git commit -m "docs: complete [feature] implementation - move plan to completed"
```

## Progress Tracking Template

```markdown
## Implementation Progress

### Phase 1: [Name]
**Status**: ✅ Complete | 🔄 In Progress | ⏳ Pending
**Started**: [Date]
**Completed**: [Date]

**Actions**:
- [x] ✅ Action 1 - [Notes]
- [x] ✅ Action 2 - [Notes]
- [ ] Action 3

### Phase 2: [Name]
**Status**: ⏳ Pending
...
```

## Quality Gates Before Completion

Before marking any phase complete:
- [ ] All tests passing
- [ ] Build succeeds
- [ ] Code reviewed
- [ ] Documentation updated

Before marking plan complete:
- [ ] All phase quality gates passed
- [ ] Acceptance criteria verified
- [ ] No blocking issues remain
- [ ] Completion summary added

## Anti-Patterns

- **Forgetting to update status**: Always update Status field
- **Leaving stale cross-references**: Check other plans for references
- **Missing completion summary**: Required for knowledge capture
- **Incomplete moves**: File must actually move to completed/
- **Skipping final commit**: Changes must be committed

## Files Reference

- `documentation/planning/current/` - Active plans
- `documentation/planning/completed/` - Finished plans
- `documentation/planning/upcoming/` - Future plans
- `documentation/workflow/planning-template.md` - Plan template
