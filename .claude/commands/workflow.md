---
title: "Workflow Quick Reference"
description: "Show available commands, agents, and recommended workflow"
---

# Workflow Quick Reference

## Recommended Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   /research-deep  →  /spec  →  /build  →  /commit         │
│    (understand)       (plan)       (implement)  (ship)          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Commands

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `/research-deep` | Deep subject investigation | Unfamiliar domain, need to understand before planning |
| `/spec` | Interactive planning | Before any non-trivial feature |
| `/build` | Execute approved plan | After plan is approved |
| `/quick` | Small changes | Simple tasks, no planning needed |
| `/commit` | Git commit workflow | Ready to commit changes |
| `/research` | Quick web search | Need external info on a topic |
| `/debug` | Debug local issues | Something broken locally |
| `/debug-production` | Debug production | Investigating prod errors |
| `/catch-up` | Rebuild context | Starting fresh, need to know recent changes |
| `/standup` | Work summary | Generate standup from git history |
| `/retro` | Capture learnings | After completing significant work |
| `/docs` | Update documentation | After features are built |
| `/scope` | Quick feasibility | Before committing to full planning |

## Agents

| Agent | Model | Purpose |
|-------|-------|---------|
| `backend` | opus | API endpoints, services, validation |
| `frontend` | sonnet | React components, pages, UI |
| `database` | opus | Schema design, Prisma migrations |
| `test` | sonnet | Jest tests, coverage |
| `orchestrator` | opus | Coordinates multi-agent builds |
| `principal-code-reviewer` | opus | Deep code review |
| `security-permissions-auditor` | opus | Permission/access control audit |
| `documentation` | haiku | Create/update docs |
| `web-research` | haiku | Internet research |
| `Explore` | - | Codebase exploration |

## Quick Decision Guide

**"I need to build something new"**
→ `/spec` (or `/research-deep` first if unfamiliar domain)

**"I need to make a small change"**
→ `/quick`

**"I need to understand how X works"**
→ `/research-deep` (domain + codebase) or `/research` (web only)

**"Something is broken"**
→ `/debug` (local) or `/debug-production` (prod)

**"I'm ready to commit"**
→ `/commit`

**"What happened while I was away?"**
→ `/catch-up`

## Key Skills (Auto-Applied)

| Skill | Triggers When |
|-------|---------------|
| `portal-tailwind` | Working in portal components |
| `prisma-migrations` | Modifying schema.prisma |
| `api-development` | Creating/modifying API endpoints |
| `tdd-workflow` | Writing tests |
| `git-commits` | Committing code |

## Tips

- **Delegate to agents** - Don't search manually when Explore agent is better
- **Plan before building** - `/spec` prevents rework
- **Understand before planning** - `/research-deep` for unfamiliar territory
- **Review significant code** - Use `principal-code-reviewer` after major changes
- **Never skip migrations** - Database changes need `prisma migrate`
