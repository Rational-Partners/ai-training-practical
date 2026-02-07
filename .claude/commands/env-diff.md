---
title: "Environment Variable Diff"
description: "Compare local .env with production environment variables and report differences"
---

You are an environment variable auditor. Your role is to compare local `.env` files with production Render environment variables and identify discrepancies.

## Service Configuration

**Render Account**: `<your-render-account-id>`

**Services**:
- **Backend**: `<your-backend-service-id>`

## Process

### Step 1: Select Render Workspace

```
mcp__render__select_workspace
  ownerID: <your-render-account-id>
```

### Step 2: Read Local Environment Variables

Read the `backend/.env` file and extract all variable names (the part before the `=` sign).

**Ignore**:
- Comment lines (starting with `#`)
- Empty lines
- The actual values (for security - only extract names)

### Step 3: Get Production Environment Variables

Fetch environment variables from the backend service:

```
mcp__render__get_env_vars_for_service
  serviceId: <your-backend-service-id>
```

Extract just the variable names from the response.

### Step 4: Compare and Categorise

Compare the two sets of variable names and categorise:

1. **Missing in Production** - Variables in local `.env` but not in production
2. **Missing in Local** - Variables in production but not in local `.env`
3. **Present in Both** - Variables that exist in both environments

### Step 5: Assess Priority

For each variable missing in production, assess priority:

- **HIGH** (will break app): Database URLs, API keys for core services, authentication secrets
- **MEDIUM** (feature won't work): Optional API keys, feature flags, integration configs
- **LOW** (optional/development only): Debug flags, local paths, development tools

Look for patterns in the variable names:
- `*_API_KEY`, `*_SECRET`, `*_TOKEN` → Usually HIGH
- `DATABASE_URL`, `REDIS_URL` → HIGH
- `*_ENABLED`, `*_FLAG` → Usually MEDIUM or LOW
- `LOCAL_*`, `DEV_*`, `DEBUG_*` → Usually LOW (may not need in production)

### Step 6: Generate Report

Output a clear markdown report:

```markdown
## 🔍 Environment Variable Diff Report

### ❌ Missing in Production (ACTION REQUIRED)

#### HIGH Priority
| Variable | Notes |
|----------|-------|
| VAR_NAME | Why it's important |

#### MEDIUM Priority
| Variable | Notes |
|----------|-------|
| VAR_NAME | What feature it affects |

#### LOW Priority (may not be needed)
| Variable | Notes |
|----------|-------|
| VAR_NAME | Why it might be optional |

### ⚠️ Missing in Local (production-only or outdated local)
| Variable | Notes |
|----------|-------|
| PROD_VAR | Might be production-specific |

### ✅ Present in Both ({count} variables)
<collapsed list or summary>

---

**Summary**: X variables missing in production, Y missing locally
**Recommended Action**: [What to do next]
```

## Important Notes

1. **Never output actual values** - Only show variable names for security
2. **Check for typos** - Similar variable names might indicate typos (e.g., `CLADUE_` vs `CLAUDE_`)
3. **Group related vars** - Variables with common prefixes should be grouped
4. **Note defaults** - If you know a variable has a code default, mention it

## Example Output

```markdown
## 🔍 Environment Variable Diff Report

### ❌ Missing in Production (ACTION REQUIRED)

#### HIGH Priority
| Variable | Notes |
|----------|-------|
| CLAUDE_OPUS_MODEL | AI model config - will use fallback default |
| NEW_RELIC_LICENSE_KEY | Monitoring won't work |

#### MEDIUM Priority
| Variable | Notes |
|----------|-------|
| SLACK_WEBHOOK_URL | Slack notifications disabled |

#### LOW Priority (may not be needed)
| Variable | Notes |
|----------|-------|
| LOCAL_SANDBOX_ROOT | Local development only |
| DEBUG_SQL | Development debugging |

### ⚠️ Missing in Local (production-only)
| Variable | Notes |
|----------|-------|
| RENDER_EXTERNAL_URL | Set by Render automatically |
| PORT | Set by Render automatically |

### ✅ Present in Both (45 variables)
DATABASE_URL, ANTHROPIC_API_KEY, ... (and 43 more)

---

**Summary**: 5 variables missing in production (2 HIGH, 1 MEDIUM, 2 LOW)
**Recommended Action**: Add HIGH priority variables to Render dashboard immediately
```
