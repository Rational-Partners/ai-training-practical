---
name: betterstack-logs
description: Query and analyze production logs via BetterStack MCP. Use when diagnosing production issues, investigating errors, analyzing patterns, or monitoring system health.
---

# BetterStack Production Logs

Query and analyze production logs using the BetterStack MCP integration.

## Source Configuration

| Property | Value |
|----------|-------|
| Source ID | `<your-source-id>` |
| Source Name | Render Production |
| Table Name | `<your-table>.render_production_5` |
| Team ID | `<your-team-id>` |
| Data Region | eu-nbg-2 |
| Logs Retention | 3 days |
| Metrics Retention | 30 days |

## Log Sources (appname)

| appname Pattern | Service | Description |
|-----------------|---------|-------------|
| `web-*` | Backend App | Application logs from Winston logger |
| `http-request` | Render Proxy | HTTP request/response logs |
| `dpg-*` | PostgreSQL | Database connection and query logs |
| `bld-*` | Build | Deployment build logs |

**Production backend**: `hostname = '<your-prod-backend-hostname>'`
**Staging backend**: `hostname = '<your-staging-backend-hostname>'`

## Quick Reference: MCP Tools

### Essential Tools

| Tool | Purpose |
|------|---------|
| `mcp__betterstack__telemetry_query` | Execute ClickHouse SQL queries |
| `mcp__betterstack__telemetry_build_explore_query_tool` | Generate query from natural language |
| `mcp__betterstack__telemetry_get_source_fields_tool` | List available fields |
| `mcp__betterstack__telemetry_create_cloud_connection_tool` | Create connection credentials (expires 1hr) |

### Before Querying

**You must create a cloud connection first** to get credentials:

```
mcp__betterstack__telemetry_create_cloud_connection_tool
  team_id: <your-team-id>
  source_id: <your-source-id>
```

This returns `host`, `username`, `password` valid for 1 hour.

## Query Syntax

### Data Collections

| Collection | Description | Use For |
|------------|-------------|---------|
| `remote(<your-table>_render_production_5_logs)` | Recent logs (hot storage, ~30 min) | Real-time debugging |
| `s3Cluster(primary, <your-table>_render_production_5_s3)` | Historical logs (cold storage) | Historical analysis |

**CRITICAL**: For historical queries, add `WHERE _row_type = 1` to filter for logs only.

### Available Fields

```
dt                     - Timestamp (DateTime)
level                  - Log level (String)
message                - Log message (String)
message.clientIP       - Client IP (for HTTP requests)
message.method         - HTTP method
message.path           - Request path
message.statusCode     - HTTP status code (Int64)
message.responseTimeMS - Response time in ms (Int64)
syslog.appname         - Source identifier (web-*, dpg-*, bld-*)
syslog.hostname        - Service hostname
_pattern               - Log pattern (dynamic values stripped)
```

### JSON Extraction

All fields are in the `raw` JSON column. Use `JSONExtract`:

```sql
-- Always use Nullable types!
JSONExtract(raw, 'level', 'Nullable(String)') AS level
JSONExtract(raw, 'message', 'Nullable(String)') AS message
JSONExtract(raw, 'syslog', 'appname', 'Nullable(String)') AS appname
JSONExtract(raw, 'syslog', 'hostname', 'Nullable(String)') AS hostname
```

## Common Query Patterns

### 1. Recent Application Logs (Production)

```sql
SELECT
  dt,
  JSONExtract(raw, 'level', 'Nullable(String)') AS level,
  JSONExtract(raw, 'message', 'Nullable(String)') AS message
FROM remote(<your-table>_render_production_5_logs)
WHERE
  JSONExtract(raw, 'syslog', 'hostname', 'Nullable(String)') = '<your-prod-backend-hostname>'
  AND JSONExtract(raw, 'syslog', 'appname', 'Nullable(String)') LIKE 'web-%'
  AND dt > now() - INTERVAL 30 MINUTE
ORDER BY dt DESC
LIMIT 100
```

### 2. Error Logs Only

```sql
SELECT
  dt,
  JSONExtract(raw, 'message', 'Nullable(String)') AS message
FROM remote(<your-table>_render_production_5_logs)
WHERE
  JSONExtract(raw, 'level', 'Nullable(String)') = 'error'
  AND JSONExtract(raw, 'syslog', 'hostname', 'Nullable(String)') = '<your-prod-backend-hostname>'
  AND dt > now() - INTERVAL 1 HOUR
ORDER BY dt DESC
LIMIT 50
```

### 3. HTTP Request Analysis

```sql
SELECT
  dt,
  JSONExtract(raw, 'message', 'path', 'Nullable(String)') AS path,
  JSONExtract(raw, 'message', 'method', 'Nullable(String)') AS method,
  JSONExtract(raw, 'message', 'statusCode', 'Nullable(Int64)') AS status,
  JSONExtract(raw, 'message', 'responseTimeMS', 'Nullable(Int64)') AS response_ms
FROM remote(<your-table>_render_production_5_logs)
WHERE
  JSONExtract(raw, 'syslog', 'appname', 'Nullable(String)') = 'http-request'
  AND JSONExtract(raw, 'syslog', 'hostname', 'Nullable(String)') = '<your-prod-backend-hostname>'
  AND dt > now() - INTERVAL 1 HOUR
ORDER BY dt DESC
LIMIT 100
```

### 4. Slow Requests (>1 second)

```sql
SELECT
  dt,
  JSONExtract(raw, 'message', 'path', 'Nullable(String)') AS path,
  JSONExtract(raw, 'message', 'method', 'Nullable(String)') AS method,
  JSONExtract(raw, 'message', 'responseTimeMS', 'Nullable(Int64)') AS response_ms
FROM remote(<your-table>_render_production_5_logs)
WHERE
  JSONExtract(raw, 'syslog', 'appname', 'Nullable(String)') = 'http-request'
  AND JSONExtract(raw, 'message', 'responseTimeMS', 'Nullable(Int64)') > 1000
  AND dt > now() - INTERVAL 1 HOUR
ORDER BY response_ms DESC
LIMIT 50
```

### 5. Failed HTTP Requests (5xx errors)

```sql
SELECT
  dt,
  JSONExtract(raw, 'message', 'path', 'Nullable(String)') AS path,
  JSONExtract(raw, 'message', 'statusCode', 'Nullable(Int64)') AS status
FROM remote(<your-table>_render_production_5_logs)
WHERE
  JSONExtract(raw, 'syslog', 'appname', 'Nullable(String)') = 'http-request'
  AND JSONExtract(raw, 'message', 'statusCode', 'Nullable(Int64)') >= 500
  AND dt > now() - INTERVAL 1 HOUR
ORDER BY dt DESC
LIMIT 50
```

### 6. Database Connection Issues

```sql
SELECT
  dt,
  JSONExtract(raw, 'message', 'Nullable(String)') AS message
FROM remote(<your-table>_render_production_5_logs)
WHERE
  JSONExtract(raw, 'syslog', 'appname', 'Nullable(String)') LIKE 'dpg-%'
  AND (
    JSONExtract(raw, 'message', 'Nullable(String)') LIKE '%error%'
    OR JSONExtract(raw, 'message', 'Nullable(String)') LIKE '%timeout%'
    OR JSONExtract(raw, 'message', 'Nullable(String)') LIKE '%Connection reset%'
  )
  AND dt > now() - INTERVAL 1 HOUR
ORDER BY dt DESC
LIMIT 50
```

### 7. Search Logs by Keyword

```sql
SELECT
  dt,
  JSONExtract(raw, 'level', 'Nullable(String)') AS level,
  JSONExtract(raw, 'message', 'Nullable(String)') AS message
FROM remote(<your-table>_render_production_5_logs)
WHERE
  JSONExtract(raw, 'message', 'Nullable(String)') LIKE '%KEYWORD%'
  AND JSONExtract(raw, 'syslog', 'hostname', 'Nullable(String)') = '<your-prod-backend-hostname>'
  AND dt > now() - INTERVAL 1 HOUR
ORDER BY dt DESC
LIMIT 100
```

### 8. Error Patterns (Group Similar Errors)

```sql
SELECT
  _pattern,
  count(*) AS occurrence_count,
  any(JSONExtract(raw, 'message', 'Nullable(String)')) AS example_message
FROM remote(<your-table>_render_production_5_logs)
WHERE
  JSONExtract(raw, 'level', 'Nullable(String)') = 'error'
  AND JSONExtract(raw, 'syslog', 'hostname', 'Nullable(String)') = '<your-prod-backend-hostname>'
  AND dt > now() - INTERVAL 1 HOUR
GROUP BY _pattern
ORDER BY occurrence_count DESC
LIMIT 20
```

### 9. Logs Per Minute (Time Series)

```sql
SELECT
  toStartOfMinute(dt) AS minute,
  JSONExtract(raw, 'level', 'Nullable(String)') AS level,
  count(*) AS count
FROM remote(<your-table>_render_production_5_logs)
WHERE
  JSONExtract(raw, 'syslog', 'hostname', 'Nullable(String)') = '<your-prod-backend-hostname>'
  AND dt > now() - INTERVAL 1 HOUR
GROUP BY minute, level
ORDER BY minute DESC, level
```

### 10. Historical Query (Last 24 Hours)

```sql
SELECT * FROM (
  -- Recent logs (hot storage)
  SELECT
    dt,
    JSONExtract(raw, 'level', 'Nullable(String)') AS level,
    JSONExtract(raw, 'message', 'Nullable(String)') AS message
  FROM remote(<your-table>_render_production_5_logs)
  WHERE
    JSONExtract(raw, 'level', 'Nullable(String)') = 'error'
    AND dt > now() - INTERVAL 24 HOUR

  UNION ALL

  -- Historical logs (cold storage)
  SELECT
    dt,
    JSONExtract(raw, 'level', 'Nullable(String)') AS level,
    JSONExtract(raw, 'message', 'Nullable(String)') AS message
  FROM s3Cluster(primary, <your-table>_render_production_5_s3)
  WHERE
    _row_type = 1
    AND JSONExtract(raw, 'level', 'Nullable(String)') = 'error'
    AND dt > now() - INTERVAL 24 HOUR
)
ORDER BY dt DESC
LIMIT 100
```

## Understanding Our Log Format

### Winston Logger Output

Our backend uses Winston with this format:
```
YYYY-MM-DD HH:mm:ss:ms LEVEL: message - {single-line JSON metadata}
```

**Important**: Multi-line metadata gets split into separate log entries in BetterStack because logs are sent via syslog line-by-line. When you see logs like:
```
2026-01-25 17:16:48 info: Portal Controller: Successfully retrieved - {
2026-01-25 17:16:48 info: "userId": "abc123",
2026-01-25 17:16:48 info: }
```

This is ONE logical log entry split across multiple lines. Search for the main message to find related context lines.

### Log Levels

| Level | Numeric | Usage |
|-------|---------|-------|
| error | 0 | Errors requiring attention |
| warn | 1 | Warnings, potential issues |
| info | 2 | Normal operations (default in production) |
| http | 3 | HTTP request logging |
| debug | 4 | Detailed debugging (dev only) |

### Common Log Patterns

| Pattern | Example Message |
|---------|-----------------|
| Controller actions | `Portal Controller: Successfully retrieved...` |
| Enrichment pipeline | `[ENRICHMENT TRIGGER] HTTP POST...` |
| Agent operations | `[ClaudeSDKAgent] Reminder set: DEADLINE` |
| Email operations | `Email sent successfully via SES` |
| Validation errors | `Request body validation failed` |
| Webhooks | `Received webhook` |

## Debugging Workflow

### 1. Start with Recent Errors
```sql
-- Get last hour of errors
SELECT dt, JSONExtract(raw, 'message', 'Nullable(String)') AS message
FROM remote(<your-table>_render_production_5_logs)
WHERE JSONExtract(raw, 'level', 'Nullable(String)') = 'error'
  AND JSONExtract(raw, 'syslog', 'hostname', 'Nullable(String)') = '<your-prod-backend-hostname>'
  AND dt > now() - INTERVAL 1 HOUR
ORDER BY dt DESC LIMIT 50
```

### 2. Find Context Around an Error
```sql
-- Get logs +/-5 minutes around a specific time
SELECT dt, JSONExtract(raw, 'level', 'Nullable(String)') AS level,
       JSONExtract(raw, 'message', 'Nullable(String)') AS message
FROM remote(<your-table>_render_production_5_logs)
WHERE dt BETWEEN '2026-01-25 17:15:00' AND '2026-01-25 17:25:00'
  AND JSONExtract(raw, 'syslog', 'hostname', 'Nullable(String)') = '<your-prod-backend-hostname>'
ORDER BY dt
LIMIT 200
```

### 3. Track a Specific Operation
```sql
-- Find enrichment-related logs
SELECT dt, JSONExtract(raw, 'message', 'Nullable(String)') AS message
FROM remote(<your-table>_render_production_5_logs)
WHERE JSONExtract(raw, 'message', 'Nullable(String)') LIKE '%ENRICHMENT%'
  AND dt > now() - INTERVAL 1 HOUR
ORDER BY dt DESC LIMIT 100
```

### 4. Check HTTP Traffic Patterns
```sql
-- Request volume by endpoint
SELECT
  JSONExtract(raw, 'message', 'path', 'Nullable(String)') AS path,
  count(*) AS requests,
  avg(JSONExtract(raw, 'message', 'responseTimeMS', 'Nullable(Int64)')) AS avg_ms
FROM remote(<your-table>_render_production_5_logs)
WHERE JSONExtract(raw, 'syslog', 'appname', 'Nullable(String)') = 'http-request'
  AND JSONExtract(raw, 'syslog', 'hostname', 'Nullable(String)') = '<your-prod-backend-hostname>'
  AND dt > now() - INTERVAL 1 HOUR
GROUP BY path
ORDER BY requests DESC
LIMIT 20
```

## Uptime & Incident Tools

BetterStack also provides uptime monitoring tools:

| Tool | Purpose |
|------|---------|
| `mcp__betterstack__uptime_list_incidents_tool` | List recent incidents |
| `mcp__betterstack__uptime_get_incident_tool` | Get incident details |
| `mcp__betterstack__uptime_list_monitors_tool` | List monitors |
| `mcp__betterstack__uptime_get_monitor_availability_tool` | Get uptime SLA |

## Best Practices

1. **Always use LIMIT** - Prevent fetching too much data
2. **Use Nullable types** - `JSONExtract(raw, 'field', 'Nullable(String)')` prevents errors
3. **Filter by hostname** - Distinguish production (`<your-prod-backend-hostname>`) from staging
4. **Filter by appname** - `web-*` for app logs, `http-request` for requests
5. **Order by dt DESC** - Most recent first for debugging
6. **Create connection first** - Run `telemetry_create_cloud_connection_tool` before queries

## Natural Language Queries

For quick queries, use the explore query builder:

```
mcp__betterstack__telemetry_build_explore_query_tool
  source_id: <your-source-id>
  prompt: "show me all errors in the last hour"
```

This generates a query you can then execute with `telemetry_query`.

## Combined Debugging Workflow

When debugging production issues, combine BetterStack logs with SSH access:

### 1. Identify the Problem (BetterStack)
```sql
-- Find recent errors
SELECT dt, JSONExtract(raw, 'message', 'Nullable(String)') AS message
FROM remote(<your-table>_render_production_5_logs)
WHERE JSONExtract(raw, 'level', 'Nullable(String)') = 'error'
  AND JSONExtract(raw, 'syslog', 'hostname', 'Nullable(String)') = '<your-prod-backend-hostname>'
  AND dt > now() - INTERVAL 1 HOUR
ORDER BY dt DESC LIMIT 20
```

### 2. Investigate via SSH (Render)
```bash
# Query database state related to the error
ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o ConnectTimeout=30 \
  <your-prod-backend-service-id>@ssh.frankfurt.render.com \
  "node -e 'const{PrismaClient}=require(\"@prisma/client\");const p=new PrismaClient();p.enrichment.findMany({where:{status:\"FAILED\"},take:5}).then(r=>console.log(JSON.stringify(r,null,2))).finally(()=>p.\$disconnect())'"
```

### 3. Take Action (SSH)
```bash
# Fix data or trigger retry
ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o ConnectTimeout=30 \
  <your-prod-backend-service-id>@ssh.frankfurt.render.com \
  "node -e 'const{PrismaClient}=require(\"@prisma/client\");const p=new PrismaClient();p.enrichment.updateMany({where:{status:\"FAILED\"},data:{status:\"PENDING\"}}).then(r=>console.log(\"Reset:\",r.count)).finally(()=>p.\$disconnect())'"
```

## Service Reference

| Environment | Service | SSH ID | BetterStack Hostname |
|-------------|---------|--------|---------------------|
| Production | Backend | `<your-prod-backend-service-id>` | `<your-prod-backend-hostname>` |
| Production | Frontend | `<your-prod-frontend-service-id>` | `<your-prod-frontend-hostname>` |
| Staging | Backend | `<your-staging-backend-service-id>` | `<your-staging-backend-hostname>` |
| Staging | Frontend | `<your-staging-frontend-service-id>` | `<your-staging-frontend-hostname>` |

## Related Skills

- `render-infrastructure` - SSH access, deployment commands, service IDs
- `local-debugging` - Local log analysis
- `/debug-production` - Combined production debugging workflow
