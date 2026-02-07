---
name: local-debugging
description: Debug local development issues by analyzing logs, checking processes, and diagnosing errors. Use when servers won't start, errors occur, or behavior is unexpected.
---

# Local Development Debugging

Knowledge for debugging local development environment issues.

## Log File Locations

### Worktree Log Files
For worktrees (non-main branches), logs are written to the worktree's `logs/` directory:

```
<worktree>/logs/
├── backend.log    # Backend server output (nodemon/ts-node)
├── frontend.log   # Frontend server output (vite)
```

**Reading logs:**
```bash
# Tail logs in real-time
tail -f logs/backend.log
tail -f logs/frontend.log

# View last N lines
tail -100 logs/backend.log

# Search for errors
grep -i "error\|fail\|exception" logs/backend.log
```

### Main Branch (PM2)
Main branch uses PM2 for process management:

```bash
# View PM2 logs
pm2 logs                           # All logs
pm2 logs app-backend               # Backend only
pm2 logs app-frontend              # Frontend only
pm2 logs --lines 100               # Last 100 lines

# PM2 log file locations
~/.pm2/logs/app-backend-out.log
~/.pm2/logs/app-backend-error.log
~/.pm2/logs/app-frontend-out.log
~/.pm2/logs/app-frontend-error.log
```

## Common Error Patterns

### Backend Won't Start

| Error | Cause | Fix |
|-------|-------|-----|
| `EADDRINUSE` | Port already in use | `lsof -ti:PORT \| xargs kill` |
| `TS1005: ')' expected` | TypeScript syntax error | Check for merge conflicts in index.ts |
| `P2021: Table does not exist` | Missing migration | `npx prisma migrate dev` |
| `Cannot find module` | Missing dependency | `npm install` in backend/ |
| `ECONNREFUSED` to DB | Database not running | Check DATABASE_URL, start postgres |

### Frontend Won't Start

| Error | Cause | Fix |
|-------|-------|-----|
| `EADDRINUSE` | Port already in use | `lsof -ti:PORT \| xargs kill` |
| `spawn xdg-open ENOENT` | Trying to open browser on headless server | Remove `--open` flag from vite command |
| `Module not found` | Missing dependency | `npm install` in frontend/ |
| `VITE_* undefined` | Missing env var | Check frontend/.env |

### Database Errors

| Error Code | Meaning | Fix |
|------------|---------|-----|
| P2002 | Unique constraint violation | Check for duplicate data |
| P2003 | Foreign key constraint failed | Referenced record doesn't exist |
| P2021 | Table does not exist | Run migrations |
| P2022 | Column does not exist | Schema/migration mismatch - run migration |
| P2025 | Record not found | Query for non-existent record |

## Process Debugging

### Check Running Processes
```bash
# Check what's using a port
lsof -i:3001                    # Backend default
lsof -i:3100                    # Frontend default (local)
lsof -i:4001                    # Backend (remote dev)
lsof -i:4100                    # Frontend (remote dev)

# Kill process on port
lsof -ti:PORT | xargs kill

# Check Node processes
ps aux | grep node | grep -v grep

# Check PM2 processes (main branch)
pm2 status
```

### Check Worktree Port Allocation
```bash
# View worktree info
cat .worktree-info

# View all port allocations
cat ../.worktree-configs/ports.json

# Check DEV_ENV mode
cat ../.worktree-configs/dev-env.json
```

## Quick Diagnostics

### Full Health Check
```bash
# 1. Check processes
ps aux | grep -E "node|vite|nodemon" | grep -v grep

# 2. Check ports
lsof -i:3001 -i:3100 -i:4001 -i:4100 2>/dev/null | head -10

# 3. Check log files exist
ls -la logs/*.log 2>/dev/null || echo "No log files"

# 4. Check last errors
tail -20 logs/backend.log 2>/dev/null | grep -i error
tail -20 logs/frontend.log 2>/dev/null | grep -i error
```

### Backend Startup Verification
```bash
# Check TypeScript compiles
cd backend && npm run type-check

# Check database connection
cd backend && npx prisma db pull --print
```

### Frontend Startup Verification
```bash
# Check vite config
cd frontend && npx vite --version

# Check env vars are set
grep VITE_ frontend/.env | head -5
```

## Debugging Workflow

1. **Identify the symptom** - What's not working?
2. **Check the logs** - Read relevant log file for errors
3. **Check processes** - Is the server even running? Port conflicts?
4. **Check recent changes** - What was modified? Merge conflicts?
5. **Verify dependencies** - `npm install`, `prisma generate`
6. **Check configuration** - `.env` files, `.worktree-info`

## TMux Pane Layout

For worktrees, the tmux session has 3 panes:
```
+---------------------------+
|     Claude (pane 1)       |
+-------------+-------------+
| Frontend(2) | Backend (3) |
+-------------+-------------+
```

Panes 2 and 3 tail the log files. Refresh with:
```bash
dev-refresh <worktree-name>
```

## Anti-Patterns

**Never Do:**
- Kill processes without knowing what they are
- Delete log files while debugging
- Restart everything without understanding the error
- Ignore TypeScript errors and hope they go away

**Always Do:**
- Read the actual error message first
- Check if the error relates to recent changes
- Verify builds pass before assuming other issues
- Check for merge conflicts after pulls/merges

---

## Production Debugging

If the issue isn't local, use these skills for production:

| Skill | Use For |
|-------|---------|
| `betterstack-logs` | Query production logs via BetterStack MCP |
| `render-infrastructure` | SSH into production/staging instances |
| `/debug-production` | Combined production debugging workflow |

### Quick Production Log Check

```
1. Create BetterStack connection:
   mcp__betterstack__telemetry_create_cloud_connection_tool
   team_id: <your-team-id>, source_id: <your-source-id>

2. Query recent errors:
   SELECT dt, JSONExtract(raw, 'message', 'Nullable(String)') AS message
   FROM remote(<your-table>_logs)
   WHERE JSONExtract(raw, 'level', 'Nullable(String)') = 'error'
   ORDER BY dt DESC LIMIT 20
```

### Quick SSH Check

```bash
# Production backend
ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o ConnectTimeout=30 \
  <your-production-service-id>@ssh.frankfurt.render.com "whoami && pwd"

# Staging backend
ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o ConnectTimeout=30 \
  <your-staging-service-id>@ssh.frankfurt.render.com "whoami && pwd"
```
