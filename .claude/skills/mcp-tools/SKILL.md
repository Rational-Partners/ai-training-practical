---
name: mcp-tools
description: MCP (Model Context Protocol) tools for code intelligence, refactoring, browser automation, and external integrations. Use cclsp for refactoring, find references, rename symbols. Use Playwright for UI testing. Use GitHub MCP for PR operations.
---

# MCP Tools Reference

This skill documents the MCP servers available for enhanced code intelligence, automation, and integrations.

## CCLSP (Code Intelligence) - Refactoring Powerhouse

The `cclsp` MCP provides Language Server Protocol capabilities for intelligent code operations. **Use these tools for any refactoring task** - they're significantly more reliable than text-based find/replace.

### Available Tools

| Tool | Purpose | When to Use |
|------|---------|-------------|
| `mcp__cclsp__find_definition` | Find where a symbol is defined | Understanding code, navigating to implementations |
| `mcp__cclsp__find_references` | Find all usages of a symbol | Impact analysis before refactoring |
| `mcp__cclsp__rename_symbol` | Rename across entire codebase | Refactoring variable/function/class names |
| `mcp__cclsp__rename_symbol_strict` | Rename at specific position | When rename_symbol finds multiple candidates |
| `mcp__cclsp__get_diagnostics` | Get TypeScript/lint errors | Checking code health before/after changes |
| `mcp__cclsp__get_hover` | Get type info/docs at position | Understanding types, checking signatures |
| `mcp__cclsp__find_workspace_symbols` | Search symbols by name | Finding classes/functions across codebase |
| `mcp__cclsp__find_implementation` | Find interface implementations | Understanding polymorphism, finding concrete classes |
| `mcp__cclsp__prepare_call_hierarchy` | Prepare for call analysis | Required before get_incoming_calls/get_outgoing_calls |
| `mcp__cclsp__get_incoming_calls` | Find callers of a function | Impact analysis - who calls this? |
| `mcp__cclsp__get_outgoing_calls` | Find callees of a function | Dependency analysis - what does this call? |
| `mcp__cclsp__restart_server` | Restart LSP server | If results seem stale or incorrect |

### Common Patterns

#### Safe Rename Refactoring

```
1. Find all references first (impact analysis):
   mcp__cclsp__find_references
     file_path: "backend/src/services/user.service.ts"
     symbol_name: "getUserById"

2. Review the references to ensure you want to rename all of them

3. Perform the rename (dry_run first):
   mcp__cclsp__rename_symbol
     file_path: "backend/src/services/user.service.ts"
     symbol_name: "getUserById"
     new_name: "fetchUserById"
     dry_run: true

4. If dry_run looks good, execute the rename:
   mcp__cclsp__rename_symbol
     file_path: "backend/src/services/user.service.ts"
     symbol_name: "getUserById"
     new_name: "fetchUserById"
     dry_run: false
```

#### Understanding Call Flow

```
1. Prepare call hierarchy:
   mcp__cclsp__prepare_call_hierarchy
     file_path: "backend/src/services/enrichment.service.ts"
     line: 45
     character: 10

2. Find what calls this function:
   mcp__cclsp__get_incoming_calls
     file_path: "backend/src/services/enrichment.service.ts"
     line: 45
     character: 10

3. Find what this function calls:
   mcp__cclsp__get_outgoing_calls
     file_path: "backend/src/services/enrichment.service.ts"
     line: 45
     character: 10
```

#### Finding Interface Implementations

```
mcp__cclsp__find_implementation
  file_path: "backend/src/types/services.ts"
  line: 15  # Line where interface method is defined
  character: 5
```

#### Checking Code Health

```
mcp__cclsp__get_diagnostics
  file_path: "backend/src/services/new-feature.service.ts"

# Returns TypeScript errors, warnings, and hints
```

### Best Practices

1. **Always use dry_run first** for rename operations
2. **Check references before renaming** to understand impact
3. **Use find_workspace_symbols** when you don't know the file location
4. **Restart server** if results seem incorrect after file changes
5. **Prefer cclsp over grep/sed** for any symbol-aware operations

---

## BetterStack (Production Logs)

See the `betterstack-logs` skill for comprehensive documentation.

### Quick Reference

| Tool | Purpose |
|------|---------|
| `mcp__betterstack__telemetry_create_cloud_connection_tool` | Create connection credentials (1hr expiry) |
| `mcp__betterstack__telemetry_query` | Execute ClickHouse SQL queries |
| `mcp__betterstack__telemetry_build_explore_query_tool` | Generate query from natural language |
| `mcp__betterstack__telemetry_get_source_fields_tool` | List available log fields |
| `mcp__betterstack__uptime_list_incidents_tool` | List uptime incidents |

### Quick Log Query

```
1. Create connection:
   mcp__betterstack__telemetry_create_cloud_connection_tool
     team_id: <your-team-id>
     source_id: <your-source-id>

2. Query errors:
   mcp__betterstack__telemetry_query
     table: "<your-table>.render_production_5"
     query: "SELECT dt, JSONExtract(raw, 'message', 'Nullable(String)') AS message
             FROM remote(<your-table>_render_production_5_logs)
             WHERE JSONExtract(raw, 'level', 'Nullable(String)') = 'error'
             ORDER BY dt DESC LIMIT 20"
     host: [from connection]
     username: [from connection]
     password: [from connection]
```

---

## GitHub MCP

For pull request and issue management.

### Available Tools

| Tool | Purpose |
|------|---------|
| `mcp__github__create_pull_request` | Create a new PR |
| `mcp__github__pull_request_read` | Get PR details, diff, status, files, comments |
| `mcp__github__merge_pull_request` | Merge a PR |
| `mcp__github__list_pull_requests` | List PRs with filters |
| `mcp__github__search_pull_requests` | Search PRs |
| `mcp__github__issue_read` | Read issue details |
| `mcp__github__issue_write` | Create/update issues |
| `mcp__github__search_code` | Search code in repos |
| `mcp__github__get_file_contents` | Get file from repo |

### Common Patterns

#### Review a PR

```
mcp__github__pull_request_read
  owner: "<your-org>"
  repo: "<your-repo>"
  pullNumber: 123
  method: "get_diff"
```

#### Get PR Review Comments

```
mcp__github__pull_request_read
  owner: "<your-org>"
  repo: "<your-repo>"
  pullNumber: 123
  method: "get_review_comments"
```

---

## Playwright MCP (Browser Automation)

For UI testing and browser automation.

### Available Tools

| Tool | Purpose |
|------|---------|
| `mcp__playwright__browser_navigate` | Navigate to URL |
| `mcp__playwright__browser_snapshot` | Get page accessibility snapshot |
| `mcp__playwright__browser_take_screenshot` | Capture screenshot |
| `mcp__playwright__browser_click` | Click element |
| `mcp__playwright__browser_fill_form` | Fill form fields |
| `mcp__playwright__browser_type` | Type text |
| `mcp__playwright__browser_run_code` | Run custom Playwright code |
| `mcp__playwright__browser_console_messages` | Get console output |
| `mcp__playwright__browser_network_requests` | Monitor network |

### Common Patterns

#### Navigate and Screenshot

```
1. Navigate:
   mcp__playwright__browser_navigate
     url: "http://localhost:3100/portal/dashboard"

2. Screenshot:
   mcp__playwright__browser_take_screenshot
```

#### Fill and Submit Form

```
mcp__playwright__browser_fill_form
  fields: [
    {"selector": "#email", "value": "test@example.com"},
    {"selector": "#password", "value": "password123"}
  ]

mcp__playwright__browser_click
  selector: "button[type='submit']"
```

---

## Email MCP

For email operations.

### Available Tools

| Tool | Purpose |
|------|---------|
| `mcp__email__list_available_accounts` | List configured email accounts |
| `mcp__email__list_emails_metadata` | List emails with filters |
| `mcp__email__get_emails_content` | Get full email content |
| `mcp__email__send_email` | Send an email |
| `mcp__email__delete_emails` | Delete emails |
| `mcp__email__download_attachment` | Download attachment |

---

## When to Use Each MCP

| Task | MCP | Tool |
|------|-----|------|
| Rename a function/variable | cclsp | `rename_symbol` |
| Find all usages of a symbol | cclsp | `find_references` |
| Understand call hierarchy | cclsp | `get_incoming_calls`, `get_outgoing_calls` |
| Check TypeScript errors | cclsp | `get_diagnostics` |
| Query production logs | betterstack | `telemetry_query` |
| Investigate production errors | betterstack | `telemetry_query` with error filter |
| Review a pull request | github | `pull_request_read` |
| Create a PR programmatically | github | `create_pull_request` |
| Test UI flows | playwright | Various browser_* tools |
| Check email delivery | email | `list_emails_metadata` |

## Related Skills

- `betterstack-logs` - Comprehensive BetterStack log querying
- `render-infrastructure` - Production SSH access
