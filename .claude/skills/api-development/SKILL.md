---
name: api-development
description: Backend API development with Express, Zod validation, permissions, and security. Use when creating or modifying API endpoints, adding route handlers, implementing validation, or working with authentication/authorization.
---

# API Development Standards

Standards for creating and modifying backend API endpoints with type safety, validation, and security.

## Required Standards

Every API endpoint MUST include:
- **Zod validation schemas** for request params, body, and responses
- **Authentication middleware** (`authenticateToken`)
- **Permission middleware** (`requirePermission()`) where needed
- **Standardized response format**: `{ success: boolean, data?: any, message?: string }`

## Quick Reference

### Route Pattern

```typescript
router.post('/:id/items',
  authenticateToken,
  requirePermission(['MANAGE_ITEMS']),
  validateRequest({
    params: APISchemas.CreateItemParams,
    body: APISchemas.CreateItemRequest
  }),
  validateResponse(APISchemas.CreateItemResponse),
  controller.createItem
);
```

### Schema Pattern

```typescript
// In src/schemas/api.schemas.ts
export const CreateItemParamsSchema = z.object({
  id: UUIDSchema
});

export const CreateItemRequestSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional()
});

export const CreateItemResponseSchema = z.object({
  success: z.boolean().default(true),
  data: ItemSchema,
  message: z.string().optional()
});
```

### Response Pattern

```typescript
// Success
return res.status(200).json({
  success: true,
  data: result
});

// Error
return res.status(400).json({
  success: false,
  error: "Validation failed",
  message: "File size exceeds 50MB limit"
});
```

## Implementation Checklist

### Step 1: Design API Contract
- [ ] Define request/response structure
- [ ] Identify validation requirements
- [ ] Consider security implications
- [ ] Plan error scenarios

### Step 2: Create Zod Schemas
- [ ] Add schemas to `backend/src/schemas/api.schemas.ts`
- [ ] Follow naming: `[Action][Resource][Type]Schema`
- [ ] Add to `APISchemas` export object

### Step 3: Implement Route Handler
- [ ] Add route to appropriate router file
- [ ] Apply `authenticateToken` middleware
- [ ] Apply `requirePermission()` if needed
- [ ] Apply `validateRequest/Response` middleware
- [ ] Return standardized response format

### Step 4: Test Endpoint
- [ ] Parameter validation tests
- [ ] Request body validation tests
- [ ] Authentication/authorization tests
- [ ] Error scenario tests (400, 401, 403, 404, 500)

## Permission System

### Adding New Permissions

1. **Add constant**: `backend/src/constants/permissions.ts`
2. **Update default roles**: `DEFAULT_ROLE_PERMISSIONS`
3. **Update seed script** if needed
4. **Apply middleware**: `requirePermission(['NEW_PERMISSION'])`

### Common Permissions

- `MANAGE_COMPANY` - Company admin operations
- `MANAGE_USERS` - User management
- `MANAGE_AUDITS` - Audit operations
- `VIEW_*` - Read-only access

## Security Practices

- **Input validation**: All inputs validated with Zod
- **Authorization**: Every route has permission check
- **No sensitive data in responses**: Filter passwords, tokens
- **Error messages**: Don't leak internal details
- **Rate limiting**: Applied to external endpoints

## External API Integration

When integrating with third-party APIs:

### Anti-Patterns to Avoid

| Pattern | Why It's Bad | What To Do Instead |
|---------|--------------|-------------------|
| Assuming response formats | API endpoints vary wildly | Verify EACH endpoint's response structure |
| Guessing endpoint paths | `/resource/{id}/action` may not exist | Read official docs for actual paths |
| Treating all endpoints the same | GET vs POST often return different shapes | Test each endpoint individually |
| Committing without testing | Bugs found only during user testing | Make real API calls before committing |

### Required Steps

1. **Read API documentation** for EACH endpoint you'll use
2. **Make test API calls** to verify actual response formats
3. **Document response structures** in code comments
4. **Test error cases** (invalid input, auth failures, rate limits)
5. **Handle provider-specific errors** with clear messages

## Prisma Relation Fields

When creating records with relations, use Prisma's **connect syntax**, not scalar ID fields:

```typescript
// WRONG - causes PrismaClientValidationError
await prisma.task.create({
  data: {
    description: 'Task',
    assignedToId: userId,  // ❌ Scalar field doesn't work in create
  }
});

// CORRECT - use relation connect syntax
await prisma.task.create({
  data: {
    description: 'Task',
    ...(userId ? { assignedTo: { connect: { id: userId } } } : {}),  // ✓
  }
});
```

For **updates**, either works but relation syntax is clearer:
```typescript
// For updates - relation syntax allows disconnect
updateData.assignedTo = userId
  ? { connect: { id: userId } }
  : { disconnect: true };
```

## Error Handling

```typescript
try {
  const result = await service.doThing();
  return res.json({ success: true, data: result });
} catch (error) {
  debug.error('Operation failed', { error, context });

  if (error instanceof PrismaClientKnownRequestError) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: 'Not found',
        message: 'Resource not found'
      });
    }
  }

  return res.status(500).json({
    success: false,
    error: 'Internal error',
    message: 'An unexpected error occurred'
  });
}
```

## Files Reference

- `backend/src/schemas/api.schemas.ts` - Zod schemas
- `backend/src/routes/` - Route handlers
- `backend/src/constants/permissions.ts` - Permission definitions
- `backend/src/middleware/validation.middleware.ts` - Validation middleware
- `backend/src/middleware/auth.middleware.ts` - Auth middleware

## See Also

- [reference.md](reference.md) - Detailed patterns and examples
