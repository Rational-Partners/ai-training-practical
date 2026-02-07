---
name: tdd-workflow
description: Test-driven development workflow. Use when writing tests, implementing features with TDD, or ensuring test coverage. Covers red-green-refactor cycle, test quality, and coverage requirements.
---

# Test-Driven Development Workflow

Mandatory TDD process for feature implementation.

## The TDD Cycle

```
1. RED    → Write failing tests first
2. GREEN  → Implement minimum code to pass
3. REFACTOR → Improve code while keeping tests green
4. COMMIT → Commit at each milestone
```

## Phase 0: Research First

Before writing any tests:
1. **Detect technology stack** - Check package.json, existing patterns
2. **Research testing framework** - Jest patterns for this project
3. **Analyze existing tests** - Follow established conventions
4. **Understand requirements** - Break down acceptance criteria

## Phase 1: Write Failing Tests

```typescript
describe('Feature: Company Documents', () => {
  describe('GET /api/companies/:id/documents', () => {
    it('returns documents for company member', async () => {
      // Arrange
      const { token, company } = await createTestUser({ role: 'MEMBER' });

      // Act
      const response = await request(app)
        .get(`/api/companies/${company.id}/documents`)
        .set('Authorization', `Bearer ${token}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('returns 403 for non-member', async () => {
      // Test permission denial
    });

    it('returns 401 without auth token', async () => {
      // Test authentication
    });
  });
});
```

### Test Categories

1. **Happy path** - Normal successful operations
2. **Permission scenarios** - Auth and authorization
3. **Validation scenarios** - Input validation failures
4. **Error scenarios** - 404, 500, edge cases

## Phase 2: Implement to Pass

Write minimum code to make tests pass:
- Don't over-engineer
- Don't add untested features
- Focus on passing the current test

## Phase 3: Refactor

With green tests:
- Improve code quality
- Remove duplication
- Enhance readability
- Keep tests passing after each change

## Coverage Requirements

- **Target**: 80%+ coverage on new code
- **Critical paths**: 100% coverage
- **Focus areas**:
  - All CRUD operations
  - Permission checks
  - Error handling
  - Business logic

## Test Quality Standards

### Naming
```typescript
// Good - describes behavior
it('returns 403 when user lacks MANAGE_COMPANY permission')

// Bad - describes implementation
it('calls requirePermission middleware')
```

### Structure (AAA Pattern)
```typescript
it('creates document successfully', async () => {
  // Arrange - Set up test data
  const company = await createTestCompany();
  const user = await createTestUser({ companyId: company.id });

  // Act - Perform the action
  const response = await request(app)
    .post(`/api/companies/${company.id}/documents`)
    .set('Authorization', `Bearer ${user.token}`)
    .attach('file', Buffer.from('test'), 'test.txt');

  // Assert - Verify the result
  expect(response.status).toBe(201);
  expect(response.body.data.filename).toBe('test.txt');
});
```

### Independence
- Each test should run independently
- Use `beforeEach` for setup, `afterEach` for cleanup
- Don't depend on test execution order

## Commit Points

1. **After test suite complete**: `test: add tests for [feature]`
2. **After implementation passes**: `feat: implement [feature]`
3. **After refactoring**: `refactor: improve [aspect]`

## Quality Gates

Before marking phase complete:
- [ ] All tests passing
- [ ] Coverage target met
- [ ] No flaky tests
- [ ] Tests are independent
- [ ] Clear test names

## Files Reference

- `backend/src/__tests__/` - Backend tests
- `frontend/src/__tests__/` - Frontend tests
- `jest.config.js` - Jest configuration

## Anti-Patterns

- **Testing implementation details** - Test behavior, not internals
- **Flaky tests** - Fix immediately, never ignore
- **Test pollution** - Clean up after each test
- **Slow tests** - Mock external services
- **Testing framework code** - Trust Jest/testing-library
