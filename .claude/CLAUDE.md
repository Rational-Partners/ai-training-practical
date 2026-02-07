# Project Guidelines

## Workflow: Use Sub-Agents for Complex Tasks

**Delegate work to specialized agents whenever possible.** This improves quality and reduces context exhaustion.

### When to Delegate

| Task Type | Agent/Command | When to Use |
|-----------|---------------|-------------|
| Codebase exploration | `Explore` agent | Finding files, understanding patterns, answering "how does X work?" |
| Deep subject research | `/research-deep` | Understanding a domain before planning (scientist/detective mode) |
| Implementation planning | `/spec` | Before starting any non-trivial feature |
| Executing approved plans | `/build` | After plan is approved, to orchestrate implementation |
| Code review | `principal-code-reviewer` | After implementing significant code |
| Git commits | `/commit` | When ready to commit changes |
| Debugging production | `/debug-production` | Investigating production errors |
| Research tasks | `general-purpose` agent | Multi-step research requiring tool use |
| Web research | `/research` | Researching topics on the internet |

### How to Delegate

```
# For exploration
Task tool with subagent_type="Explore" - "Find all API endpoints that handle user authentication"

# For planning
/spec - starts interactive planning session

# For implementation
/build - executes approved plan with specialized agents
```

### Key Principle

**Don't do manually what an agent can do better.** If you find yourself:
- Searching through many files → Use Explore agent
- Planning a multi-step implementation → Use /spec
- Writing significant code → Follow with principal-code-reviewer

## Skills System

Skills provide domain knowledge that's automatically applied based on context. Key skills:

| Skill | Applies When |
|-------|--------------|
| `portal-tailwind` | Working on portal components (tw- prefix required) |
| `prisma-migrations` | Modifying database schema (migration required) |
| `api-development` | Creating/modifying API endpoints |
| `tdd-workflow` | Writing tests |
| `git-commits` | Committing code |
| `local-debugging` | Debugging local development issues |
| `mcp-tools` | Using cclsp for refactoring, Playwright for testing, GitHub MCP |

Skills are in `.claude/skills/` - read them for detailed guidance.

## Core Rules

### Server & Process Management
- Never run `npm run dev` or start servers - user runs these separately
- Never restart servers or kill processes without permission
- Never run npm/npx commands without permission (except `prisma generate`)

### Code Quality
- Focus on the specific problem - don't fix tangential issues
- Make minimal, focused changes only
- Never rewrite entire files without explicit instruction
- Use built-in logging (`debug`), never `console.log`
- Include debug logging behind development feature flags

### Database Changes
- **ALWAYS** create migrations when modifying schema.prisma
- See `prisma-migrations` skill for complete workflow
- Never make changes that could lose data without asking

### File Management
- Never create random analysis/research files in source code directories
- Project tracking docs (test checklists, implementation notes) go in `documentation/planning/current/`
- Use `/tmp/` ONLY for truly ephemeral files (debug output, scratch files not needed later)
- All permanent docs go in `documentation/` only when requested

### Version Control
- Never push to git without explicit permission
- Never stage to git without explicit permission
- Use `/commit` command for proper commit workflow

### Testing & Deployment
- Don't run tests automatically - ask user to run them
- Never deploy without explicit permission

## Research Process

Before implementing anything non-trivial:

1. **Understand the domain** - use `/research-deep` for unfamiliar territory
2. **Search the codebase thoroughly** - use Explore agent for complex searches
3. **Create a detailed plan** - use `/spec` for significant features
4. **Rate confidence level** - must be 95%+ before implementing
5. **If under 95%**, continue researching and re-evaluate
6. **Walk through thinking** step by step during implementation

## Quick References

### Commands Available
- `/workflow` - Quick reference for all commands and recommended flow
- `/research-deep` - Deep subject matter investigation (scientist/detective mode)
- `/spec` - Interactive planning for new features
- `/build` - Execute approved implementation plans
- `/commit` - Commit workflow with build verification
- `/debug` - Debug local issues
- `/debug-production` - Investigate production errors
- `/catch-up` - Rebuild context from git history
- `/standup` - Generate work summaries
- `/retro` - Capture learnings from completed work
- `/research` - Quick web research on a topic

### Key Skills
- `portal-tailwind` - Tailwind styling with tw- prefix
- `prisma-migrations` - Database schema changes
- `api-development` - Backend API patterns
- `local-debugging` - Log locations and common errors
