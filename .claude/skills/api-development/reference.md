# API Development - Complete Reference

## Step-by-Step Implementation Process

### Step 1: Design API Contract
1. Define request/response structure
2. Identify validation requirements
3. Consider security implications
4. Plan error scenarios

### Step 2: Create Zod Schemas

**File:** `backend/src/schemas/api.schemas.ts`

Follow naming convention: `[Action][Resource][Type]Schema`

```typescript
// Params schema
export const CreateItemParamsSchema = z.object({
  id: UUIDSchema
});

// Request schema
export const CreateItemRequestSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional()
});

// Response schema
export const CreateItemResponseSchema = z.object({
  success: z.boolean().default(true),
  data: ItemSchema,
  message: z.string().optional()
});
```

Add to `APISchemas` export object.

### Step 3: Implement Route Handler

**File:** `backend/src/routes/[domain].routes.ts`

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

### Step 4: Implement Controller

**File:** `backend/src/routes/[domain].routes.ts` or separate controller file

```typescript
// Success response
return res.status(200).json({
  success: true,
  data: result
});

// Error response
return res.status(400).json({
  success: false,
  error: "Validation failed",
  message: "Request validation failed"
});
```

### Step 5: Write Tests

**File:** `backend/src/__tests__/[domain]-[feature].test.ts`

Required test scenarios:
- Parameter validation tests (invalid UUIDs, missing required fields)
- Request body validation tests (field lengths, data types, constraints)
- Response schema validation tests using Zod schemas
- Authentication/authorization tests
- Error scenario tests (404, 400, 401, 403, 500 status codes)

## Quality Gates Checklist

### Before Code Review

**Developer Checklist:**
- [ ] Zod schemas created and exported
- [ ] Validation middleware applied to route
- [ ] Controller returns standardized response format
- [ ] Comprehensive tests written and passing
- [ ] No TypeScript compilation errors

### During Code Review

**Reviewer Checklist:**
- [ ] Validation schemas follow established patterns
- [ ] Security considerations addressed (input sanitization, authorization)
- [ ] Error handling is comprehensive and user-friendly
- [ ] Tests cover edge cases and security scenarios

### Before Deployment

**Final Verification:**
- [ ] All tests passing including new endpoint tests
- [ ] Type-check passes
- [ ] Lint passes

## Common Patterns

### Standard CRUD Operations

Reference existing implementations:
- **GET endpoints**: `/api/audits` (list) and `/api/audits/:id` (single)
- **POST endpoints**: `/api/audits` (create)
- **PUT endpoints**: `/api/audits/:id` (update)
- **DELETE endpoints**: Follow pattern in external access management

### Security-Critical Endpoints

For external-facing endpoints:
- Input sanitization patterns
- Access control validation
- Error handling that doesn't leak sensitive information

### File Operations

For file handling:
- File validation (filename, type, size)
- Path traversal prevention
- Secure file handling

## Validation Schema Patterns

```typescript
// Optional nullable field
fieldName: z.string().nullable().optional()

// Required field with validation
fieldName: z.string().min(1).max(255)

// URL field
fieldName: z.string().url().nullable()

// UUID field
fieldName: UUIDSchema

// Enum field
fieldName: z.enum(['VALUE1', 'VALUE2'])

// Allow empty string to clear
fieldName: z.string().nullable().optional()
  .or(z.literal('').transform(() => null))
```

## Error Handling Patterns

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

- **Schemas:** `backend/src/schemas/api.schemas.ts`
- **Routes:** `backend/src/routes/*.routes.ts`
- **Route Index:** `backend/src/routes/index.ts`
- **Permissions:** `backend/src/constants/permissions.ts`
- **Validation Middleware:** `backend/src/middleware/validation.middleware.ts`
- **Tests:** `backend/src/__tests__/*.test.ts`
