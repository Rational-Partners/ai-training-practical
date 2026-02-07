# Adding Database Fields - Complete Reference

## Overview

When adding a new field to a database model, multiple locations need updating. Missing any step can cause fields to be stripped from API responses or cause validation errors.

## The Problem

Our backend uses strict response validation via Zod schemas. Even if a field exists in the database and is returned by Prisma, it will be **stripped from the response** if not defined in the validation schema.

## Complete Checklist

### 1. Database Schema (Prisma)

**File:** `backend/prisma/schema.prisma`

```prisma
model User {
  // ... existing fields
  calendarBookingLink String? // New field
}
```

### 2. Create and Apply Migration

```bash
cd backend
npx prisma migrate dev --name add_field_name

# This automatically:
# - Creates migration file
# - Applies migration to database
# - Regenerates Prisma client
```

### 3. Update API Validation Schemas (MOST COMMONLY MISSED)

**File:** `backend/src/schemas/api.schemas.ts`

#### Response Schemas:
```typescript
// Base schema (if exists)
const BaseUserSchema = z.object({
  // ... existing fields
  calendarBookingLink: z.string().url().nullable(), // ADD THIS
});

// Response schemas - UPDATE ALL OF THESE
export const GetCurrentUserResponseSchema = z.object({
  data: z.object({
    // ... existing fields
    calendarBookingLink: z.string().url().nullable(), // ADD THIS
  })
});
```

#### Request Schemas (if field is updatable):
```typescript
export const UpdateUserRequestSchema = z.object({
  // ... existing fields
  calendarBookingLink: z.string().url().nullable().optional(), // ADD THIS
});
```

### 4. Update Route Handlers

**Files:** `backend/src/routes/*.routes.ts`

#### GET Endpoints - Add to select statement:
```typescript
const user = await prisma.user.findUnique({
  where: { id: userId },
  select: {
    // ... existing fields
    calendarBookingLink: true, // ADD THIS
  }
});
```

#### PATCH/PUT Endpoints - Add to update logic:
```typescript
const { name, calendarBookingLink } = req.body;

const updatedUser = await prisma.user.update({
  where: { id: userId },
  data: {
    // ... existing fields
    ...(calendarBookingLink !== undefined && { calendarBookingLink })
  }
});
```

### 5. Update Frontend Components

#### Form Components:
```jsx
const [formData, setFormData] = useState({
  // ... existing fields
  calendarBookingLink: user?.calendarBookingLink || ""
});

<Form.Control
  value={formData.calendarBookingLink}
  onChange={(e) => setFormData({
    ...formData,
    calendarBookingLink: e.target.value
  })}
/>
```

#### Display Components:
Update any components that display the model to include the new field.

### 6. Restart Services

- Backend server should auto-restart with nodemon
- If not, manually restart
- Clear any caches if applicable

## Common Pitfalls

### 1. Response Validation Stripping Fields
**Symptom:** Field exists in database, returned by Prisma, but not in API response
**Cause:** Field not in response validation schema
**Fix:** Update all relevant schemas in `api.schemas.ts`

### 2. Multiple Route Files
**Symptom:** Changes don't take effect
**Cause:** Multiple route files exist (e.g., `user.routes.ts` vs `users.routes.ts`)
**Fix:** Check which file is imported in `src/routes/index.ts`

### 3. Nested Schemas
**Symptom:** Field missing from some endpoints but not others
**Cause:** Schema inheritance/composition not updated
**Fix:** Update base schemas that other schemas extend from

### 4. TypeScript Types Out of Sync
**Symptom:** TypeScript errors in frontend
**Cause:** Prisma client types not regenerated
**Fix:** Run `npx prisma generate`

## Quick Debugging Steps

1. **Check database directly:**
   ```typescript
   const user = await prisma.user.findFirst();
   console.log(user.newField); // Should show value
   ```

2. **Check API response headers** for validation errors

3. **Add debug logging:**
   ```typescript
   debug.info('Before validation:', { hasField: 'newField' in data });
   ```

4. **Temporarily disable validation** to confirm it's a validation issue

## Validation Schema Patterns

```typescript
// Optional nullable field
fieldName: z.string().nullable().optional()

// Required field with validation
fieldName: z.string().min(1).max(255)

// URL field
fieldName: z.string().url().nullable()

// Allow empty string to clear
fieldName: z.string().nullable().optional()
  .or(z.literal('').transform(() => null))
```

## Testing Checklist

After adding a new field:
- [ ] GET endpoint returns the field
- [ ] PATCH/PUT endpoint accepts the field
- [ ] Field persists in database
- [ ] Frontend displays the field
- [ ] Frontend can update the field
- [ ] No TypeScript errors
- [ ] No validation errors in console

## Command Reference

```bash
# Regenerate Prisma client
npx prisma generate

# Create migration
npx prisma migrate dev --name descriptive_name

# Reset database (warning: data loss)
npx prisma migrate reset

# View current database schema
npx prisma db pull --print
```
