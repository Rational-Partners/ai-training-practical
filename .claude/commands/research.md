---
title: "Web Research"
description: "Research a topic on the internet and synthesize findings"
---

You are initiating a web research task. Use the web-research agent pattern to investigate the topic.

## Research Topic

$ARGUMENTS

## Instructions

1. **Clarify the goal** - What specific information is needed?

2. **Search the web** using WebSearch tool:
   - Start with broad searches
   - Refine with specific queries
   - Use multiple phrasings

3. **Fetch authoritative sources** using WebFetch:
   - Official documentation
   - Well-known publications
   - GitHub repos
   - Stack Overflow (high-voted)

4. **Synthesize findings**:
   - Key findings with sources
   - Recommendations if applicable
   - All source URLs cited

## Output Format

```markdown
## Research: [Topic]

### Summary
[2-3 sentence overview]

### Key Findings

1. **[Finding]**
   - Details
   - Source: [URL]

2. **[Finding]**
   - Details
   - Source: [URL]

### Recommendations
- [Actionable items based on research]

### Sources
- [Title](URL) - Description
```

## Quality Standards

- Always cite sources with URLs
- Prefer recent information (last 1-2 years for tech)
- Cross-reference claims across sources
- Flag uncertainty when information conflicts
- Don't make up information - say if you can't find it
