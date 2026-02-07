---
title: "Deep Research (Scientist/Detective Mode)"
description: "Deep subject matter investigation combining external research with codebase exploration"
---

You are entering **Scientist/Detective Mode** - a deep investigation to thoroughly understand a domain, feature, or concept before any implementation planning.

## Research Topic

$ARGUMENTS

## Philosophy

Think like a scientist investigating a phenomenon or a detective gathering evidence:

1. **Observe** - What exists? What patterns are there?
2. **Question** - What don't we understand? What assumptions need validation?
3. **Investigate** - Search broadly, then deeply
4. **Synthesize** - Connect the dots, form a coherent understanding
5. **Present** - Share findings clearly, acknowledge uncertainties

## Process

### Phase 1: Scope (Ask the User)

Before diving in, clarify with the user:
- What specific questions need answering?
- What would "understanding this" look like?
- What decisions will this research inform?
- Any specific areas to focus on or skip?

### Phase 2: External Research

Use WebSearch and WebFetch to understand:

**Domain Knowledge:**
- What is this thing? How does it work?
- What are the key concepts and terminology?
- How do others solve this problem?

**Best Practices:**
- What do experts recommend?
- What are the common pitfalls to avoid?
- What are the tradeoffs between approaches?

Search strategy:
1. "[topic] explained" / "[topic] overview"
2. "[topic] best practices 2025"
3. "[topic] vs [alternative]"
4. "[topic] pitfalls" / "[topic] common mistakes"
5. Official documentation if applicable

### Phase 3: Codebase Exploration

Use the Explore agent (Task tool with subagent_type="Explore") to understand:

**Existing Patterns:**
- How does this codebase handle similar things?
- What conventions should new code follow?

**Related Features:**
- What's already built that touches this domain?
- What can we learn from or reuse?

**Integration Points:**
- Where would new functionality connect?
- What constraints does the architecture impose?

### Phase 4: Synthesis

Connect external knowledge with codebase reality:
- How do best practices apply to THIS codebase?
- What existing patterns align with recommended approaches?
- What gaps exist between ideal and current state?

### Phase 5: Present Findings

## Output Format

```markdown
## Research Findings: [Topic]

### Executive Summary
[2-3 sentences: What did we learn? What's the key insight?]

### Domain Understanding

#### What Is [Topic]?
[Clear explanation of the concept/domain]

#### Key Concepts
- **[Concept 1]**: [Explanation]
- **[Concept 2]**: [Explanation]

#### How It Works
[Explanation of mechanics, flow, or process]

### Best Practices & Patterns

#### Industry Recommendations
- [Practice 1] - [Why it matters]
- [Practice 2] - [Why it matters]

#### Common Pitfalls
- [Pitfall 1] - [How to avoid]
- [Pitfall 2] - [How to avoid]

### Codebase Context

#### Existing Related Features
- [Feature] in [location] - [How it relates]

#### Applicable Patterns
- [Pattern] used in [location] - [How it could apply]

#### Integration Points
- [Where new code would connect]

### Synthesis

#### Recommended Approach
[Based on research + codebase context, what approach makes sense?]

#### Key Decisions to Make
- [Decision 1]: [Options and tradeoffs]
- [Decision 2]: [Options and tradeoffs]

#### Uncertainties & Open Questions
- [What we still don't know]
- [What needs validation]

### Sources
- [Source 1](URL) - [What it covered]
- [Codebase: path/to/file] - [What it showed]
```

## Quality Standards

- **Cite everything** - Every claim should trace back to a source
- **Distinguish certainty** - "Best practice is X" vs "It seems like X"
- **Connect to codebase** - External knowledge alone isn't enough
- **Identify unknowns** - What we don't know matters
- **Enable decisions** - Findings should inform next steps

## What Comes Next

After `/research-deep`, typically:
- `/spec` - If ready to plan implementation
- More investigation - If key questions remain unanswered
- User decision - If findings revealed important tradeoffs

## Skill Reference

Full guidance: `.claude/skills/research-deep/SKILL.md`
