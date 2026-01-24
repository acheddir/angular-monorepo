# ADR 0002: Adopt Domain-Driven Design

## Status

✅ Accepted

## Context

As the application grows, organizing code by technical layers (components, services, pipes) becomes difficult to maintain. We need an architecture that:

- Groups related code together
- Reflects business domains
- Scales with complexity
- Enables team autonomy
- Makes code easy to locate and understand

## Decision

We will organize libraries using Domain-Driven Design (DDD) principles, grouping code by business domains rather than technical layers.

### Library Organization:

```
libs/app/
├── modules/              # Domain-specific business logic
│   └── {domain}/         # Each business domain
│       ├── feature-*/    # Smart components
│       ├── data/         # Data access
│       ├── types/        # Domain types
│       ├── ui-*/         # Presentational components
│       └── util-*/       # Domain utilities
└── shared/               # Cross-cutting concerns
    ├── components/       # Shared UI components
    │   └── ui-*/         # Reusable UI components
    ├── util-*/           # Shared utilities
    └── types/            # Shared types
```

### Library Types:

| Type      | Purpose                                          | Can Import            |
| --------- | ------------------------------------------------ | --------------------- |
| `feature` | Smart components with business logic and routing | data, ui, util, types |
| `data`    | API calls, state management                      | ui, util, types       |
| `ui`      | Presentational components                        | util, types           |
| `types`   | TypeScript interfaces and types                  | (standalone)          |
| `util`    | Pure utility functions                           | other util            |

## Consequences

### Positive:

- Code is organized by business domain, making it easier to find
- Clear separation of concerns within each domain
- Teams can own entire domains end-to-end
- New features are self-contained
- Easier to understand business logic

### Negative:

- Initial learning curve for developers unfamiliar with DDD
- Some code duplication across domains (mitigated by `shared/`)
- Requires discipline to maintain boundaries

### Mitigations:

- Provide comprehensive documentation and examples
- Use schematics to generate correctly structured libraries
- Enforce boundaries with Sheriff
- Regular architecture reviews
