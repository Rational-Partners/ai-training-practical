---
name: render-infrastructure
description: Render deployment infrastructure reference. Use when accessing production/staging services, checking logs, SSH access, or deployment operations.
---

# Render Infrastructure

Reference for accessing and managing Render-hosted services.

## Service IDs

| Environment | Service | ID |
|-------------|---------|-----|
| Production | Backend | `<your-prod-backend-service-id>` |
| Production | Frontend | `<your-prod-frontend-service-id>` |
| Staging | Backend | `<your-staging-backend-service-id>` |
| Staging | Frontend | `<your-staging-frontend-service-id>` |

**Render Account**: `<your-account-id>`

---

## Database Access

### Database IDs

| Environment | Database | ID |
|-------------|----------|-----|
| Production | backend-postgres | `<your-prod-database-id>` |
| Staging | staging-postgres | `<your-staging-database-id>` |

### Getting Connection Credentials

The Render CLI doesn't expose database credentials directly. **Use SSH to retrieve them**:

```bash
# Get production DATABASE_URL
ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o ConnectTimeout=30 \
  <your-prod-backend-service-id>@ssh.frankfurt.render.com 'echo $DATABASE_URL'

# Get staging DATABASE_URL
ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o ConnectTimeout=30 \
  <your-staging-backend-service-id>@ssh.frankfurt.render.com 'echo $DATABASE_URL'
```

The DATABASE_URL format is:
```
postgresql://<user>:<password>@<host>/<database>
```

- **Internal host** (for Render services): `dpg-xxxxx-a` (database ID)
- **External host** (for local access): `dpg-xxxxx-a.frankfurt-postgres.render.com`

### Querying the Database

#### Option 1: Via SSH + Prisma (Recommended)

Use Prisma client through SSH for type-safe queries:

```bash
# Simple query
ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o ConnectTimeout=30 \
  <your-prod-backend-service-id>@ssh.frankfurt.render.com \
  "node -e 'const{PrismaClient}=require(\"@prisma/client\");const p=new PrismaClient();p.company.findMany({take:5}).then(r=>console.log(JSON.stringify(r,null,2))).finally(()=>p.\$disconnect())'"

# Count records
ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o ConnectTimeout=30 \
  <your-prod-backend-service-id>@ssh.frankfurt.render.com \
  "node -e 'const{PrismaClient}=require(\"@prisma/client\");const p=new PrismaClient();p.user.count().then(r=>console.log(\"Users:\",r)).finally(()=>p.\$disconnect())'"

# Raw SQL query
ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o ConnectTimeout=30 \
  <your-prod-backend-service-id>@ssh.frankfurt.render.com \
  "node -e 'const{PrismaClient}=require(\"@prisma/client\");const p=new PrismaClient();p.\$queryRaw\`SELECT tablename FROM pg_tables WHERE schemaname=\\\"public\\\"\`.then(r=>console.log(r)).finally(()=>p.\$disconnect())'"
```

#### Option 2: Via Render CLI psql (Interactive)

For interactive SQL sessions (requires TTY - won't work in automated scripts):

```bash
# Opens interactive psql session
render psql <your-prod-database-id>
```

### Common Database Queries via SSH

#### List all tables
```bash
ssh ... "node -e 'const{PrismaClient}=require(\"@prisma/client\");const p=new PrismaClient();p.\$queryRaw\`SELECT tablename FROM pg_tables WHERE schemaname=\\\"public\\\" ORDER BY tablename\`.then(r=>console.log(r.map(t=>t.tablename).join(\"\\n\"))).finally(()=>p.\$disconnect())'"
```

#### Check record counts
```bash
ssh ... "node -e 'const{PrismaClient}=require(\"@prisma/client\");const p=new PrismaClient();Promise.all([p.user.count(),p.company.count(),p.engagement.count()]).then(([u,c,e])=>console.log({users:u,companies:c,engagements:e})).finally(()=>p.\$disconnect())'"
```

#### Find specific records
```bash
ssh ... "node -e 'const{PrismaClient}=require(\"@prisma/client\");const p=new PrismaClient();p.user.findFirst({where:{email:\"test@example.com\"}}).then(r=>console.log(JSON.stringify(r,null,2))).finally(()=>p.\$disconnect())'"
```

#### Update records (USE WITH CAUTION)
```bash
ssh ... "node -e 'const{PrismaClient}=require(\"@prisma/client\");const p=new PrismaClient();p.enrichment.updateMany({where:{status:\"FAILED\"},data:{status:\"PENDING\"}}).then(r=>console.log(\"Updated:\",r.count)).finally(()=>p.\$disconnect())'"
```

### Database Query Best Practices

1. **Always use `-o ConnectTimeout=30`** - SSH connections can be slow
2. **Use Prisma over raw SQL** - Type safety and schema awareness
3. **Always call `$disconnect()`** - Prevents connection leaks
4. **Use `JSON.stringify` for output** - Makes results readable
5. **Test queries on staging first** - Before running on production
6. **Ask user before updates** - Never modify production data without permission

---

## MCP Tools (Preferred)

When the Render MCP server is available, **prefer MCP tools over CLI** for programmatic access. MCP tools provide structured responses and better error handling.

### Available MCP Tools

```
mcp__render__list_services      - List all services in the workspace
mcp__render__get_service        - Get details of a specific service
mcp__render__list_deploys       - List deployment history for a service
mcp__render__get_deploy         - Get details of a specific deployment
mcp__render__create_deploy      - Trigger a new deployment
mcp__render__cancel_deploy      - Cancel an in-progress deployment
mcp__render__list_jobs          - List jobs for a service
mcp__render__run_job            - Trigger a job run
mcp__render__list_logs          - Fetch logs with filters
mcp__render__list_env_vars      - List environment variables
mcp__render__update_env_var     - Update an environment variable
mcp__render__restart_service    - Restart a running service
mcp__render__scale_service      - Scale service instances
mcp__render__get_bandwidth      - Get bandwidth metrics
mcp__render__select_workspace   - Set workspace context
```

### MCP Usage Examples

#### Check Service Health
```
mcp__render__get_service with:
  serviceId: "<your-prod-backend-service-id>"
```

#### List Recent Deployments
```
mcp__render__list_deploys with:
  serviceId: "<your-prod-backend-service-id>"
  limit: 5
```

#### Fetch Error Logs
```
mcp__render__list_logs with:
  serviceId: "<your-prod-backend-service-id>"
  type: "app"
  level: "error"
  direction: "backward"
  limit: 100
```

#### Trigger Deployment
```
mcp__render__create_deploy with:
  serviceId: "<your-prod-backend-service-id>"
  clearCache: false
```

#### Get Environment Variables
```
mcp__render__list_env_vars with:
  serviceId: "<your-prod-backend-service-id>"
```

---

## Render CLI

The Render CLI (`render`) is installed locally. **Always use `-o json` for scripting**.

### Correct Command Syntax

```bash
# List all services
render services list -o json

# View deploys - NOTE: serviceId is positional, not a flag
render deploys list <your-prod-backend-service-id> -o json

# View logs - NOTE: use -r flag for resources
render logs -r <your-prod-backend-service-id> -o json
render logs -r <your-prod-backend-service-id> --type build -o text  # Build logs

# Trigger manual deploy
render deploys create <your-prod-backend-service-id> -o json

# Cancel a deploy
render deploys cancel <deploy-id> -o json
```

### Common CLI Patterns

#### Check Deploy Status
```bash
render deploys list <your-prod-backend-service-id> -o json | head -30
```

#### Get Build Logs (for failed deploys)
```bash
render logs -r <your-prod-backend-service-id> --type build -o text | tail -100
```

#### Wait for Deploy to Complete
```bash
# Check status, wait, check again
render deploys list <your-prod-backend-service-id> -o json | jq '.[0].status'
sleep 60
render deploys list <your-prod-backend-service-id> -o json | jq '.[0].status'
```

---

## SSH Access

### Verified Working

All instances tested and confirmed working:

| Service | ID | SSH Status | Working Dir |
|---------|-----|------------|-------------|
| Production Backend | `<your-prod-backend-service-id>` | OK | `/opt/render/project/src/backend` |
| Production Frontend | `<your-prod-frontend-service-id>` | OK | `/opt/render/project/src/frontend` |
| Staging Backend | `<your-staging-backend-service-id>` | OK | `/opt/render/project/src/backend` |
| Staging Frontend | `<your-staging-frontend-service-id>` | OK | `/opt/render/project/src/frontend` |

### Connection Pattern

```bash
# Always use these flags to avoid host key issues
# Use ConnectTimeout to handle slow connections (staging can take 20+ seconds)
ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o ConnectTimeout=30 \
  <service-id>@ssh.frankfurt.render.com "command"

# Examples:
# Staging Backend
ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o ConnectTimeout=30 \
  <your-staging-backend-service-id>@ssh.frankfurt.render.com "whoami && pwd"

# Production Backend (ask user before accessing)
ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o ConnectTimeout=30 \
  <your-prod-backend-service-id>@ssh.frankfurt.render.com "whoami && pwd"
```

### Why SSH Might Fail

| Issue | Cause | Solution |
|-------|-------|----------|
| Timeout | Connection too short | Use `-o ConnectTimeout=30` |
| Hang on connect | Service cold start / sleeping | Wait, or trigger activity first |
| Memory error | SSH needs ~2-5MB from service pool | Check service isn't memory-constrained |
| TTY required | Using `render ssh` command | Use direct `ssh ... "command"` instead |

### Environment Details

Once connected:
- **Working directory**: `/opt/render/project/src/backend` (for backend services)
- **Project root**: `/opt/render/project/src/`
- **Environment vars**: Available (`$DATABASE_URL`, etc.)
- **Runtime**: Node.js v22.22.0, npm 10.9.4
- **Prisma**: Client installed and working
- **Project type**: ES modules (`"type": "module"` in package.json)

### CRITICAL: SSH Command Execution Patterns

The Render SSH shell has specific requirements. **Use these patterns**:

#### Pattern 1: Simple Commands (WORKS)
```bash
ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null \
  <your-prod-backend-service-id>@ssh.frankfurt.render.com \
  "whoami && pwd && ls -la"
```

#### Pattern 2: Node One-Liners with Single Quotes (WORKS)
```bash
ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null \
  <your-prod-backend-service-id>@ssh.frankfurt.render.com \
  "node -e 'console.log(\"Hello from Render\")'"
```

#### Pattern 3: Prisma Queries (WORKS)
```bash
# Query the database
ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null \
  <your-prod-backend-service-id>@ssh.frankfurt.render.com \
  "node -e 'const{PrismaClient}=require(\"@prisma/client\");const p=new PrismaClient();p.company.findMany({take:5}).then(r=>console.log(JSON.stringify(r,null,2))).finally(()=>p.\$disconnect())'"
```

#### Pattern 4: Update Data (WORKS)
```bash
# Update records
ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null \
  <your-prod-backend-service-id>@ssh.frankfurt.render.com \
  "node -e 'const{PrismaClient}=require(\"@prisma/client\");const p=new PrismaClient();p.company.updateMany({where:{name:\"Example\"},data:{type:\"CLIENT\"}}).then(r=>console.log(\"Updated:\",r.count)).finally(()=>p.\$disconnect())'"
```

### Patterns That DON'T Work

```bash
# DON'T: Interactive shell commands
render ssh <your-prod-backend-service-id>  # Requires TTY

# DON'T: Heredoc input
ssh server << 'EOF'
commands
EOF

# DON'T: bash -c with complex quoting
ssh server 'bash -c "complex command"'

# DON'T: ES module syntax (project uses ES modules)
# Instead, use require() in node -e one-liners

# DON'T: Run scripts from /tmp without copying to project dir first
# Prisma client won't be found
```

### File Transfer (SCP)

```bash
# Upload a file
scp -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null \
  /local/file.js \
  <your-prod-backend-service-id>@ssh.frankfurt.render.com:/tmp/file.js

# Then copy to project and run (for CommonJS scripts)
ssh ... "cp /tmp/file.cjs /opt/render/project/src/backend/ && \
  cd /opt/render/project/src/backend && \
  node file.cjs && \
  rm file.cjs"
```

**Note**: Scripts must use `.cjs` extension or CommonJS `require()` syntax because the project has `"type": "module"` in package.json.

---

## Common Operations

### Check Deployment Status
```bash
# Using CLI
render deploys list <your-prod-backend-service-id> -o json | head -30

# Using MCP (preferred)
mcp__render__list_deploys with serviceId, limit: 5
```

### Debug Failed Deployment
```bash
# Get build logs
render logs -r <your-prod-backend-service-id> --type build -o text | tail -100

# Check for migration errors
render logs -r <your-prod-backend-service-id> --type build -o text | grep -i "error\|failed"
```

### Resolve Failed Migration
```bash
# SSH in and mark migration as rolled back
ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null \
  <your-prod-backend-service-id>@ssh.frankfurt.render.com \
  "cd /opt/render/project/src/backend && npx prisma migrate resolve --rolled-back <migration_name>"
```

### Query Production Database
```bash
ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null \
  <your-prod-backend-service-id>@ssh.frankfurt.render.com \
  "node -e 'const{PrismaClient}=require(\"@prisma/client\");const p=new PrismaClient();p.\$queryRaw\`SELECT COUNT(*) FROM \"Company\"\`.then(r=>console.log(r)).finally(()=>p.\$disconnect())'"
```

### Update Production Data
```bash
# Example: Update a company type
ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null \
  <your-prod-backend-service-id>@ssh.frankfurt.render.com \
  "node -e 'const{PrismaClient}=require(\"@prisma/client\");const p=new PrismaClient();p.company.updateMany({where:{name:\"Company Name\"},data:{type:\"NEW_TYPE\"}}).then(r=>console.log(\"Updated:\",r.count)).finally(()=>p.\$disconnect())'"
```

---

## Production Logs (BetterStack)

For log analysis, use the **betterstack-logs** skill which provides:
- Real-time log queries via ClickHouse SQL
- Error pattern analysis
- HTTP request/response analysis
- Database connection monitoring

**Quick log check:**
```
1. Create connection: mcp__betterstack__telemetry_create_cloud_connection_tool
   team_id: <your-team-id>, source_id: <your-source-id>

2. Query errors: mcp__betterstack__telemetry_query with SQL like:
   SELECT dt, JSONExtract(raw, 'message', 'Nullable(String)') AS message
   FROM remote(<your-table>_render_production_5_logs)
   WHERE JSONExtract(raw, 'level', 'Nullable(String)') = 'error'
   ORDER BY dt DESC LIMIT 20
```

**Log source identifiers:**
| Hostname | Environment |
|----------|-------------|
| `<your-prod-backend-hostname>` | Production backend |
| `<your-staging-backend-hostname>` | Staging backend |

See `betterstack-logs` skill for full query patterns.

---

## Related Commands

- `/debug-production` - Analyze production runtime errors
- `/debug-production-deploy` - Debug failed deployments
- `/env-diff` - Compare local vs production env vars

## Related Skills

- `betterstack-logs` - Query production logs via BetterStack MCP
- `local-debugging` - Debug local development issues

## Documentation

- https://render.com/docs/cli
- https://render.com/docs/ssh
- https://render.com/docs/mcp-server

---

## Quick Reference Card

| Task | Tool | Command/Pattern |
|------|------|-----------------|
| List deploys | MCP | `mcp__render__list_deploys` |
| List deploys | CLI | `render deploys list <service-id> -o json` |
| Get logs | MCP | `mcp__render__list_logs` |
| Get logs | CLI | `render logs -r <service-id> -o json` |
| Build logs | CLI | `render logs -r <service-id> --type build -o text` |
| SSH query | SSH | `ssh ... "node -e 'prisma one-liner'"` |
| Trigger deploy | MCP | `mcp__render__create_deploy` |
| Trigger deploy | CLI | `render deploys create <service-id>` |
| Get DB credentials | SSH | `ssh ... 'echo $DATABASE_URL'` |
| Query DB | SSH | `ssh ... "node -e 'PrismaClient query'"` |
| Interactive psql | CLI | `render psql <database-id>` |
