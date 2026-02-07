---
name: parallel-research
description: Sub-agent delegation and parallel research patterns. Use when researching frameworks, analyzing codebases, or delegating discrete tasks to multiple sub-agents for maximum efficiency.
---

# Parallel Research Patterns

Patterns for delegating work to multiple sub-agents for maximum parallel efficiency.

## Core Principle

**NEVER do work that can be parallelized** - delegate to multiple sub-agents simultaneously.

## Research Phase (Always First)

Before any implementation, launch parallel research:

### Technology Detection
Scan project files to identify ALL frameworks, libraries, and tools:
- `package.json` - Node.js dependencies
- `requirements.txt` - Python dependencies
- `Cargo.toml` - Rust dependencies
- `go.mod` - Go dependencies
- Existing code patterns and conventions

### Parallel Research Launch

Deploy 5-8 sub-agents simultaneously:

| Agent | Focus Area | Example Prompt |
|-------|------------|----------------|
| 1 | Framework docs | "Research Express.js v4.18 official docs for middleware patterns" |
| 2 | Codebase patterns | "Analyze `backend/src/routes/` for established routing patterns" |
| 3 | Testing patterns | "Research Jest patterns for API testing with Supertest" |
| 4 | Language idioms | "Research TypeScript best practices for error handling" |
| 5 | Security | "Research OWASP security practices for Express.js APIs" |
| 6+ | Specialized | Additional research as needed |

## Research Prompt Templates

### Framework Documentation
```
Research [framework] v[version] official documentation for [feature] implementation patterns
```

### Codebase Analysis
```
Analyze codebase in [directory] to identify established patterns for [functionality]
```

### Testing Approach
```
Research [testing framework] best practices and patterns for [test type] with [libraries]
```

### Integration Research
```
Find best practices for [library] integration with [other tools] in [language]
```

### Security Research
```
Research security best practices for [framework] when implementing [feature type]
```

## Delegation Categories

### Research & Analysis (Always First)
- Framework documentation research
- Codebase pattern analysis
- Testing approach research
- Security and performance research
- Language idiom research

### Implementation (After Research)
- Component implementation following researched patterns
- Test suite creation using discovered patterns
- Configuration following framework best practices
- Utility functions following language idioms

### Quality & Review (Continuous)
- Implementation review against best practices
- Code validation against project standards
- Security review for feature type
- Test coverage verification

### Documentation (Parallel)
- Technical documentation updates
- Pattern documentation
- Reference documentation

## Parallel Execution Phases

### Phase 1: Simultaneous Research (ALL in parallel)
```
Sub-agent 1: Framework/library documentation research
Sub-agent 2: Codebase pattern analysis
Sub-agent 3: Testing approach research
Sub-agent 4: Security and performance research
Sub-agent 5: Language idiom research
```

### Phase 2: Parallel Implementation (after research)
```
Sub-agent 1: Test implementation following discovered patterns
Sub-agent 2: Core functionality implementation
Sub-agent 3: Configuration and setup
Sub-agent 4: Documentation updates
Sub-agent 5: Quality validation
```

### Phase 3: Parallel Validation
```
Sub-agent 1: Integration testing
Sub-agent 2: Performance and security review
Sub-agent 3: Documentation completeness
Sub-agent 4: Code quality review
```

## Research Synthesis

After parallel research completes:
1. Compile findings from all sub-agents
2. Identify patterns that apply to current task
3. Resolve any conflicting recommendations
4. Document key decisions for implementation

## Benefits

- **Maximum parallelization**: 5-8 agents working simultaneously
- **Comprehensive research**: All tools/frameworks thoroughly researched
- **Specialized expertise**: Each agent focused on specific domain
- **Reduced time**: Parallel work dramatically speeds development
- **Higher quality**: Independent research from multiple perspectives
- **Framework mastery**: Deep understanding of actual tools being used

## Anti-Patterns

- **Sequential research**: Doing one research task at a time
- **Skipping research**: Implementing without understanding framework patterns
- **Incomplete coverage**: Only researching some tools/libraries
- **Ignoring findings**: Not applying researched patterns to implementation
- **Duplicate work**: Multiple agents researching the same thing

## When to Use Parallel Research

- Starting new feature implementation
- Working with unfamiliar frameworks
- Implementing complex integrations
- Establishing new patterns
- Major refactoring efforts

## When NOT to Use

- Simple bug fixes with known cause
- Minor changes to existing patterns
- Tasks in well-understood codebase areas
