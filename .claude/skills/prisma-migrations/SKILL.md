---
name: prisma-migrations
description: Database schema changes with Prisma. Use when modifying schema.prisma, creating migrations, adding database fields, or working with Prisma models. Prevents production crashes from forgotten migrations.
---

# Prisma Migrations

**CRITICAL**: Never modify `schema.prisma` without creating a migration. This causes production crashes with error P2022.

## ⛔ BANNED COMMAND

```bash
# NEVER USE THIS - it's interactive and can WIPE THE DATABASE
npx prisma migrate dev --name <name>
```

In a past incident, an agent ran this command, Prisma prompted to reset the database, agent accepted, and **ALL DATA WAS LOST**.

## Quick Reference - SAFE Workflow

```bash
cd backend

# Step 1: Create migration file ONLY (does not apply)
npx prisma migrate dev --create-only --name descriptive_name

# Step 2: Apply migration (non-interactive, NEVER resets)
npx prisma migrate deploy

# Step 3: Regenerate client
npx prisma generate

# Step 4: Verify
npx prisma migrate status
# Should show: "Database schema is up to date"
```

## Mandatory Workflow

1. **READ** the complete guide first: [reference.md](reference.md)
2. **MODIFY** `backend/prisma/schema.prisma`
3. **CREATE** migration: `npx prisma migrate dev --create-only --name add_feature_name`
4. **APPLY** migration: `npx prisma migrate deploy`
5. **REGENERATE** client: `npx prisma generate`
6. **VERIFY** migration folder created with `migration.sql`
7. **UPDATE** all required locations (see reference.md checklist)
8. **TEST** locally - run app, verify no P2022 errors
9. **COMMIT** schema AND migration together (same commit)

## Validation Gate

Your work is NOT complete until:
- [ ] Read reference.md completely
- [ ] Migration folder exists: `backend/prisma/migrations/[timestamp]_[name]/`
- [ ] `migration.sql` contains correct SQL DDL
- [ ] All locations updated per checklist
- [ ] Schema and migration committed together
- [ ] Local testing confirms no P2022 errors

## Warning Signs of Forgotten Migration

- Only `schema.prisma` modified, no new migration folder
- Ran `npx prisma generate` but NOT `migrate dev --create-only` + `migrate deploy`
- Git diff shows schema changes but no migration files
- Production error: `P2022: column does not exist in current database`

## Recovery If Migration Forgotten

1. STOP immediately
2. Create migration: `npx prisma migrate dev --create-only --name fix_missing_migration_for_[feature]`
3. Apply migration: `npx prisma migrate deploy`
4. Regenerate client: `npx prisma generate`
5. Commit migration in separate commit with clear message
6. Continue work

## Good Migration Names

```bash
npx prisma migrate dev --create-only --name add_company_documents
npx prisma migrate dev --create-only --name add_billing_frequency_to_engagement
npx prisma migrate dev --create-only --name create_lead_enrichment_tables
npx prisma migrate dev --create-only --name remove_deprecated_status_field
# Then: npx prisma migrate deploy
```

## Adding Enum Values Checklist

When adding a new value to a Prisma enum, you must update ALL of these locations:

### 1. Database Layer
- [ ] `backend/prisma/schema.prisma` - Add value to enum definition
- [ ] Create migration: `ALTER TYPE "EnumName" ADD VALUE 'NEW_VALUE';`
- [ ] Run `npx prisma generate` to update Prisma client

### 2. Backend Validation
- [ ] **Zod schemas** - Search for `z.enum([` containing the enum values
- [ ] **Manual validation arrays** - Search for arrays like `['VALUE1', 'VALUE2']` that validate the enum
- [ ] **TypeScript Record types** - Search for `Record<EnumName, string>` mappings (will cause type errors if missed)

### 3. Frontend
- [ ] **Dropdown/select options** - Search for arrays of `{ value: 'ENUM_VALUE', label: '...' }`
- [ ] **Display name mappings** - Search for objects mapping enum values to labels

### 4. Search Commands

```bash
# Find all places referencing the enum by searching for existing values
grep -rn "EXISTING_VALUE.*OTHER_VALUE\|z.enum.*EXISTING_VALUE" backend/src/ --include="*.ts"
grep -rn "EXISTING_VALUE.*OTHER_VALUE\|value:.*EXISTING_VALUE" frontend/src/ --include="*.jsx" --include="*.tsx"

# Find Record types that must include all enum values (TypeScript will catch these)
grep -rn "Record<EnumName," backend/src/ --include="*.ts"
```

### 5. Common Locations for This Codebase

Update this section with your project's common enum/type locations. Example format:

| Enum | Locations to Update |
|------|---------------------|
| `YourEnum` | List files that reference this enum |

### 6. Why TypeScript Doesn't Catch Everything

- `z.enum(['A', 'B'])` - Zod schemas are runtime validation, TypeScript sees as `string`
- `['A', 'B'].includes(x)` - Manual arrays are just `string[]`, no enum connection
- `Record<Enum, T>` - **DOES** get caught by TypeScript (must include all keys)

**Pro tip**: Use `Object.values(EnumName)` from Prisma client instead of hardcoded arrays.

## After Migration Checklist

After applying migrations that add new models or fields:

1. **Run Prisma generate**
   ```bash
   npx prisma generate
   ```

2. **IMPORTANT: Restart IDE/TypeScript server**
   - VS Code: `Developer: Reload Window` or restart IDE
   - This clears the TypeScript language server's type cache
   - Without this, IDE will show errors on new Prisma fields even though types are correct

3. **Verify types loaded**
   - Check that autocomplete shows new fields
   - If IDE still shows errors after restart, try: `Developer: Reload Window`

4. **Note**: Runtime TypeScript compilation works even if IDE shows errors
   - The generated types in `node_modules/.prisma/` are correct
   - IDE cache issues don't affect actual code execution
   - Tests can run successfully despite IDE complaints

## Commit Pattern

```bash
git add backend/prisma/schema.prisma
git add backend/prisma/migrations/[new_migration_folder]/
git commit -m "feat: add [description] to database schema"
```

**NEVER** commit schema.prisma without the migration folder.

## See Also

- [reference.md](reference.md) - Complete checklist with all locations to update
- `backend/prisma/schema.prisma` - Database schema
- `backend/prisma/migrations/` - Migration history
