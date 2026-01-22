# Architecture Decision Records (ADRs)

This directory contains Architecture Decision Records (ADRs) for the Angular Monorepo starter template.

## What is an ADR?

An ADR is a document that captures an important architectural decision made along with its context and consequences. They help teams:

- Understand why decisions were made
- Onboard new team members
- Avoid revisiting settled decisions
- Learn from past decisions

## Format

Each ADR follows this structure:

- **Title**: Short descriptive name
- **Status**: Accepted, Deprecated, Superseded
- **Context**: The issue motivating this decision
- **Decision**: The change being proposed or made
- **Consequences**: The impacts (positive and negative) of the decision

## Index

| ADR                                                      | Title                                  | Status   |
| -------------------------------------------------------- | -------------------------------------- | -------- |
| [0001](./0001-use-monorepo-architecture.md)              | Use Monorepo Architecture              | Accepted |
| [0002](./0002-adopt-domain-driven-design.md)             | Adopt Domain-Driven Design             | Accepted |
| [0003](./0003-enforce-module-boundaries-with-sheriff.md) | Enforce Module Boundaries with Sheriff | Accepted |
| [0004](./0004-use-angular-with-standalone-components.md) | Use Angular with Standalone Components | Accepted |
| [0005](./0005-implement-code-generation-schematics.md)   | Implement Code Generation Schematics   | Accepted |
| [0006](./0006-use-conventional-commits-and-git-hooks.md) | Use Conventional Commits and Git Hooks | Accepted |
| [0007](./0007-use-vitest-for-testing.md)                 | Use Vitest for Testing                 | Accepted |
| [0008](./0008-use-tailwind-css-for-styling.md)           | Use Tailwind CSS for Styling           | Accepted |
| [0009](./0009-use-path-mapping-for-imports.md)           | Use Path Mapping for Imports           | Accepted |

## Reading Order for New Developers

For onboarding, we recommend reading the ADRs in this order:

1. **ADR 0001** - Understand the monorepo approach
2. **ADR 0002** - Learn the domain-driven architecture
3. **ADR 0003** - Understand module boundaries and Sheriff
4. **ADR 0005** - Learn how to generate new code with schematics
5. **ADR 0004** - Understand the Angular + Standalone Components setup
6. **ADR 0007** - Learn the testing approach
7. **ADR 0008** - Understand the styling approach
8. **ADR 0006** - Learn about commit conventions and Git hooks

## Creating New ADRs

When making significant architectural decisions:

1. Copy the template structure from existing ADRs
2. Number it sequentially (next available number)
3. Include all sections: Status, Context, Decision, Consequences
4. Update this README index
5. Commit with message: `docs: add ADR XXXX - [title]`

## References

- [Architecture Decision Records](https://adr.github.io/)
- [Documenting Architecture Decisions](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
