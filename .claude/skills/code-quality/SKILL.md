---
name: code-quality
description: Code quality standards, complexity management, and anti-over-engineering. Use when reviewing code, implementing features, or ensuring quality standards. Covers complexity limits, linting, and simplicity principles.
---

# Code Quality Standards

Standards for maintaining high-quality, maintainable code.

## Complexity Limits

| Metric | Warning | Error |
|--------|---------|-------|
| Cyclomatic complexity | 8 | 15 |
| Function length | 30 lines | 60 lines |
| Class/module length | 200 lines | 500 lines |

## Quality Gates

Run these throughout implementation:

```bash
# Type checking
cd backend && npm run type-check
cd frontend && npm run type-check

# Linting
npm run lint

# Tests
npm run test

# Build verification
npm run build
```

## Anti-Over-Engineering Principles

### Question Every Abstraction
- Only add abstractions with clear, immediate value
- "Will I use this in 3+ places?" - if no, don't abstract
- Prefer inline code over premature abstraction

### Prefer Composition Over Inheritance
- Use simple composition patterns
- Avoid deep inheritance hierarchies
- Favor interfaces over base classes

### Avoid Premature Optimization
- Implement the simplest working solution first
- Only optimize when you have measured performance issues
- "Make it work, make it right, make it fast" - in that order

### Challenge Requirements
- Question complex requirements
- Ask: "Is there a simpler way to achieve this?"
- Push back on "just in case" functionality

### Seek Existing Solutions
- Check if the framework provides this already
- Look for established patterns in the codebase
- Use libraries instead of reimplementing

## Simplicity Checks

Before implementing, ask:
- [ ] Is this the simplest solution that works?
- [ ] Can I remove any code and still meet requirements?
- [ ] Am I adding "just in case" functionality?
- [ ] Does this abstraction have immediate value?
- [ ] Would a new team member understand this easily?

## Code Smells to Avoid

### Complexity
- Deep nesting (> 3 levels)
- Long parameter lists (> 4 params)
- Magic numbers without constants
- Complex conditional logic

### Duplication
- Copy-pasted code blocks
- Similar methods with slight variations
- Repeated validation logic

### Poor Naming
- Single-letter variables (except loop counters)
- Abbreviations that aren't obvious
- Names that don't describe purpose

## Idiomatic Patterns

### TypeScript
```typescript
// Good - clear types
interface User {
  id: string;
  name: string;
  email: string;
}

// Good - null handling
const name = user?.name ?? 'Unknown';

// Good - explicit returns
function getUser(id: string): User | null {
  return users.find(u => u.id === id) ?? null;
}
```

### Error Handling
```typescript
// Good - structured errors
try {
  await service.operation();
} catch (error) {
  debug.error('Operation failed', { error, context });
  throw new AppError('Operation failed', { cause: error });
}
```

### Logging
```typescript
// Good - structured logging with context
debug.info('Document uploaded', {
  documentId: doc.id,
  companyId: company.id,
  size: file.size
});

// Bad - string concatenation
console.log('Document ' + doc.id + ' uploaded');
```

## Security Practices

- Input validation at boundaries
- Never trust user input
- Sanitize before database queries
- No sensitive data in logs
- No secrets in code

## Performance Awareness

- Don't pre-optimize, but don't be wasteful
- Use appropriate data structures
- Avoid N+1 queries
- Consider pagination for lists
- Cache expensive operations

## Common ESLint False Positives

### Unused Variables That Are Actually Used

ESLint may flag variables as unused when:
- Variable is passed as prop to child component
- Function is passed as callback (e.g., onEnrich={handleEnrich})
- Destructured value used in template but not in JS

**Don't Fix These By**:
- Adding `// eslint-disable-next-line` everywhere
- Renaming variables with underscore prefix
- Removing variables that are actually needed

**Instead**:
- Verify the variable IS actually used (trace through render)
- If used as prop/callback, it's not unused - ignore ESLint
- If genuinely unused, remove it

**Pattern Example**:
```javascript
const [enrichingCompanyId, setEnrichingCompanyId] = useState(null);
// ESLint: "enrichingCompanyId is unused" ← FALSE POSITIVE
// Reality: Passed to <CompanyRow enrichingCompanyId={enrichingCompanyId} />
```

## Review Checklist

Before considering code complete:
- [ ] Meets complexity limits
- [ ] No code smells
- [ ] Follows existing patterns
- [ ] Has appropriate error handling
- [ ] Has appropriate logging
- [ ] Type-check passes
- [ ] Lint passes (verify false positives are actually false)
- [ ] Tests pass
