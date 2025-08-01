This folder contains Architecture Decision Records (ADRs) for the SprintDeck project.

ADRs are concise documents that capture important architectural and technical decisions made during the development of the project, along with their context and consequences. Each ADR should be added as a separate markdown file and follow a consistent template.

Use this folder to document significant choices, alternatives considered, and the reasoning behind key decisions to ensure long-term clarity and maintainability.

---

## ADR Template

Create each ADR as a new markdown file (e.g., `0001-use-supabase-auth.md`) and use the following format:

```markdown
# ADR-0001: [Short Title]

**Date:** YYYY-MM-DD  
**Status:** [Proposed | Accepted | Deprecated | Superseded]  
**Deciders:** [List of people who made the decision]  
**Technical Story:** [Link to issue or story if applicable]

## Context

[Describe the situation that led to this decision. What problem are we trying to solve? What constraints exist?]

## Decision

[Describe the decision that was made. Be specific and clear about what was chosen.]

We will [specific action/technology/approach].

## Consequences

### Positive
- [List positive consequences]

### Negative
- [List negative consequences or trade-offs]

### Neutral
- [List neutral consequences or notes]

## Alternatives Considered

- **Alternative 1:** [Description] - [Why rejected]
- **Alternative 2:** [Description] - [Why rejected]

## Implementation Notes

[Optional: Add implementation details, migration steps, or other relevant notes]

## References

- [Link to relevant documentation, RFCs, or discussions]
```

## ADR Numbering Convention

- Use sequential numbers starting from 0001
- Format: `ADR-0001`, `ADR-0002`, etc.
- File naming: `0001-short-title.md`

## Status Definitions

- **Proposed:** Decision is under consideration
- **Accepted:** Decision has been approved and is being implemented
- **Deprecated:** Decision is no longer valid but kept for historical reference
- **Superseded:** Decision has been replaced by a newer ADR

## Example ADR

See `0001-example-adr.md` for a complete example of an ADR following this template.


