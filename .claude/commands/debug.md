# Debug Command

**Purpose**: Diagnose and fix issues based on provided error descriptions and recent logs.

**Input**: Error description or problem statement from user

**Process**:
1. Parse recent logs from `/logs/backend.log` and `/logs/frontend.log` (last 100 lines)
2. Correlate error patterns with current conversation context
3. Search codebase for relevant error sources
4. Propose minimal, testable fixes
5. Work iteratively with user to verify solutions

**Approach**:
- Act as senior developer: systematic, thorough, incremental
- Focus on root cause, not symptoms
- Make small, safe changes
- Request user testing after each change
- Keep responses concise to preserve context

**Key Actions**:
- Read recent logs for error patterns
- Search affected code areas
- Propose targeted fixes
- Validate with user before proceeding