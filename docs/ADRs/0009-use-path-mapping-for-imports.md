# ADR 0009: Use Path Mapping for Imports

## Status

Accepted

## Context

In a monorepo with multiple libraries and applications, imports between modules can become unwieldy:

```typescript
// ❌ Relative path imports become difficult to read and maintain
import { Button } from "../../../shared/ui-button/src/components/Button";
import { useAuth } from "../../../../modules/auth/data/src/services/auth.service";
```

Problems with relative paths:

- **Fragile refactoring**: Moving files breaks imports throughout the codebase
- **Poor readability**: Deep nesting makes it hard to understand where imports come from
- **Inconsistent patterns**: Different files may use different relative paths to the same module
- **IDE limitations**: Autocomplete and navigation work poorly with deeply nested paths
- **Copy-paste errors**: Easy to miscalculate the number of `../` segments

## Decision

We will use TypeScript path mapping via `baseUrl` and `paths` in `tsconfig.json` to create clean, absolute-style import aliases.

### Configuration

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@app/shell": ["./libs/app/shell/feature-shell/src/public-api.ts"],
      "@app/layouts": ["./libs/app/layouts/ui-layouts/src/public-api.ts"],
      "@app/home/welcome": ["./libs/app/home/feature-welcome/src/public-api.ts"]
    }
  }
}
```

### Naming Convention

Path aliases follow the pattern: `@{app}/<domain>/<library-name>`

- `@{app}/` - Consistent prefix for all application code
- `<domain>` - The domain or module (e.g., `home`, `layouts`, `shared`)
- `<library-name>` - The specific library within the domain

### Example Usage

```typescript
// ✅ Clean, readable imports with path mapping
import { AppShellComponent } from "@app/shell";
import { MainLayoutComponent } from "@app/layouts";
import { WelcomeComponent } from "@app/home/welcome";

// ❌ Avoid relative paths for cross-library imports
import { AppShellComponent } from "../../../shell/feature-shell/src";
```

## Consequences

### Positive:

- **Improved readability**: Import paths clearly indicate the source module
- **Safe refactoring**: Moving files within a library doesn't break external imports
- **Consistent patterns**: All cross-library imports follow the same convention
- **Better tooling**: IDEs can provide accurate autocomplete and navigation
- **Enforced boundaries**: Works well with Sheriff for module boundary enforcement
- **Single source of truth**: Library entry points are defined in one place

### Negative:

- **Build tool configuration**: Angular CLI handles this automatically via tsconfig
- **Learning curve**: New developers must understand the mapping convention
- **Synchronization overhead**: Path mappings must be kept in sync with actual library locations

### Mitigations:

- Schematics automatically register new libraries in `tsconfig.json` paths
- ESLint rules can warn against relative imports crossing library boundaries
- Clear documentation of the naming convention
- Angular CLI respects tsconfig paths automatically
