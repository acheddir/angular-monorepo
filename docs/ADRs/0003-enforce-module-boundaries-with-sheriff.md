# ADR 0003: Enforce Module Boundaries with Sheriff

## Status

Accepted

## Context

In a monorepo with domain-driven architecture, it's crucial to prevent:

- Feature libraries directly importing from other features
- UI components importing from data access layers
- Circular dependencies between domains
- Violations of the intended architectural layers

Manual code reviews alone cannot catch all boundary violations. We need automated enforcement.

## Decision

We will use [@softarc/eslint-plugin-sheriff](https://github.com/softarc-consulting/sheriff) to automatically enforce module boundaries at lint time.

### Enforced Rules:

#### Layer Dependencies:

```
shell    → feature, ui, util
feature  → data, ui, util, types
data     → ui, util, types
ui       → util, types
util     → other util
types    → (standalone)
```

#### Domain Isolation:

- Domains can only import from:
  - Same domain
  - `shared` domain

#### Example Violations:

```typescript
// ❌ Feature importing from another domain
import { ProductCard } from "@app/orders/ui-card";

// ❌ UI component importing data layer
import { useProducts } from "@app/products/data";

// ✅ Feature importing from same domain
import { ProductCard } from "@app/products/ui-card";

// ✅ UI importing shared component
import { Button } from "@app/shared/ui-button";
```

## Consequences

### Positive:

- Architectural violations caught immediately during development
- Prevents accidental tight coupling between domains
- Forces developers to think about dependencies
- Documentation becomes executable
- CI/CD fails on boundary violations

### Negative:

- Additional ESLint configuration complexity
- Learning curve for understanding allowed dependencies
- May require refactoring to fix violations

### Mitigations:

- Clear documentation of allowed dependencies
- Sheriff provides helpful error messages
- Regular team discussions about architecture
- Examples of correct patterns in the codebase
