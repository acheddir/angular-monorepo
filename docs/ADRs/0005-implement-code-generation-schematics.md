# ADR 0005: Implement Code Generation Schematics

## Status

✅ Accepted

## Context

Creating new libraries in a monorepo involves repetitive tasks:

- Creating directory structure
- Adding barrel exports (`public-api.ts`)
- Configuring path aliases in `tsconfig.json`
- Registering projects in `angular.json`
- Following naming conventions
- Setting up correct library type and dependencies

Manual creation is error-prone and time-consuming. We need automation to ensure consistency.

## Decision

We will use **@angular-devkit/schematics** to create custom code generators for:

- Complete domains (`domain`)
- Individual libraries (`feature`, `data`, `types`, `ui`, `util`)

### Available Schematics:

```bash
# Generate full domain
ng g @tools/schematics:domain --app=app --domain=products --name=list

# Generate individual libraries
ng g @tools/schematics:feature --app=app --domain=products --name=detail
ng g @tools/schematics:ui --app=app --domain=products --name=card
ng g @tools/schematics:ui --app=app --name=button --shared  # Shared component
```

### What Schematics Do:

1. **Create directory structure** following conventions
2. **Generate boilerplate code** (components, services, types)
3. **Add path aliases** to tsconfig.json automatically
4. **Create project.json** in the library directory (distributed configuration)
5. **Create barrel exports** for public API
6. **Enforce naming conventions** (prefixes, casing)

> **Note:** Schematics create a `project.json` file in each library directory instead of registering projects in the central `angular.json`. This distributed approach scales better and reduces merge conflicts.

### Why @angular-devkit/schematics:

- Official Angular tooling
- Powerful templating system
- Dry-run mode for testing
- Deep integration with Angular CLI
- Well-documented and maintained

## Consequences

### Positive:

- Consistent structure across all libraries
- Faster library creation (seconds vs minutes)
- Fewer human errors
- Enforces best practices automatically
- New developers can be productive immediately
- Reduces onboarding friction

### Negative:

- Additional tooling to maintain
- Learning curve for modifying schematics
- Templates need to be kept up-to-date with architecture changes

### Mitigations:

- Comprehensive documentation of available schematics
- Simple, maintainable templates
- Regular validation that generated code matches conventions
- Version control for schematic templates
