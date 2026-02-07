# Research Deep Skill

Deep subject matter investigation combining external research with codebase exploration. Use this to thoroughly understand a domain, feature, or concept before planning implementation.

## When to Use

- Before `/spec` when you need domain understanding first
- When exploring unfamiliar territory (new API, new domain concept, unfamiliar pattern)
- When the user asks "help me understand X" or "research X for me"
- When you need to answer "what is the right way to do this?" before "how do we build it?"

## Philosophy: Scientist/Detective Mode

Think like a scientist investigating a phenomenon or a detective gathering evidence:

1. **Observe** - What exists? What patterns are there?
2. **Question** - What don't we understand? What assumptions need validation?
3. **Investigate** - Search broadly, then deeply
4. **Synthesize** - Connect the dots, form a coherent understanding
5. **Present** - Share findings clearly, acknowledge uncertainties

## Research Process

### Phase 1: Scope Definition

Before researching, clarify:
- What specific question(s) need answering?
- What would "understanding this" look like?
- What decisions will this research inform?

### Phase 2: External Research

Use web research to understand:
- **Domain concepts** - What is this thing? How does it work in general?
- **Best practices** - What do experts recommend?
- **Common patterns** - How do others solve this?
- **Pitfalls** - What goes wrong? What to avoid?
- **Terminology** - What are the key terms and their meanings?

Search strategies:
- Start with "[topic] explained" or "[topic] overview"
- Then "[topic] best practices 2025"
- Then "[topic] vs [alternative]" for comparisons
- Then "[topic] pitfalls" or "[topic] common mistakes"
- Check official documentation when applicable

### Phase 3: Codebase Exploration

Use Explore agent to understand:
- **Existing patterns** - How does this codebase handle similar things?
- **Related features** - What's already built that touches this domain?
- **Conventions** - What patterns should new code follow?
- **Integration points** - Where would new functionality connect?

Key questions:
- "Is there existing code that does something similar?"
- "What patterns does this codebase use for [X]?"
- "Where are the integration points for [domain]?"

### Phase 4: Synthesis

Connect external knowledge with codebase reality:
- How do best practices apply to THIS codebase?
- What existing patterns align with recommended approaches?
- What gaps exist between ideal and current state?
- What constraints does the existing architecture impose?

### Phase 5: Findings Presentation

Structure your findings report:

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
- [Source 2](URL) - [What it covered]
- [Codebase: path/to/file] - [What it showed]
```

## Output Guidelines

- **Be thorough but focused** - Cover what matters, skip tangents
- **Cite sources** - Every claim should trace back to a source
- **Distinguish certainty levels** - "Best practice is X" vs "It seems like X"
- **Connect to codebase** - External knowledge alone isn't enough
- **Identify unknowns** - What we don't know is as important as what we do
- **Enable decisions** - Findings should help the user decide next steps

## What This Is NOT

- **Not implementation planning** - Use `/spec` for that
- **Not a quick answer** - Use regular conversation for simple questions
- **Not pure web search** - Use `/research` for that
- **Not pure codebase exploration** - Use Explore agent for that

This is the bridge between "I don't understand this domain" and "I'm ready to plan the implementation."

## Example Usage

User: "Research deep on event-driven architecture - I need to understand how message queues and event sourcing work before we build this"

Output: Comprehensive findings on:
- What event-driven architecture is and how it differs from request-response
- How major platforms (AWS SQS/SNS, RabbitMQ, Kafka) handle this
- Best practices for event schema design, ordering, idempotency
- How our existing codebase handles async operations
- Where new event system would integrate
- Key decisions: queue vs pub/sub, ordering guarantees, retry strategy
