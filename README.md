# Angular Monorepo Starter

A production-ready Angular monorepo starter template with domain-driven architecture, strict linting, and module boundary enforcement.

## Features

- **Angular 21** with standalone components
- **Monorepo architecture** with apps and libs separation
- **Domain-driven design** with feature, data, and types libraries
- **Sheriff** for module boundary enforcement
- **ESLint** with strict TypeScript rules
- **Vitest** for unit testing
- **Prettier** for code formatting
- **Husky** + **lint-staged** for pre-commit hooks
- **Commitlint** for conventional commits
- **Tailwind CSS 4** for styling
- **Custom schematics** for generating domain libraries

## Using This Template

### 1. Create Your Repository

Click the **"Use this template"** button on GitHub to create a new repository.

### 2. Clone and Setup

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
node scripts/setup.mjs
```

The setup script will interactively rename the project from `demo` to your chosen name.

### 3. Install and Run

```bash
pnpm install
pnpm start
```

## Project Structure

```
├── apps/
│   └── demo/                   # Main application
│       ├── src/
│       │   ├── main.ts         # Application entry point
│       │   └── styles.css      # Global styles
│       └── public/             # Static assets
├── libs/
│   └── demo/                   # Application libraries
│       ├── shell/              # Shell feature (app bootstrapping)
│       │   └── feature-shell/  # Root component and routing
│       ├── layouts/            # Layout components domain
│       │   ├── ui-layouts/     # Header, Main, Footer components
│       │   └── ui-navigation/  # Navigation component
│       ├── home/               # Home domain
│       │   ├── feature-welcome/# Welcome page feature
│       │   └── ui-hero/        # Hero section component
│       └── <domain>/           # Domain-specific libraries
│           ├── feature-*/      # Feature libraries (smart components)
│           ├── ui-*/           # UI libraries (presentational components)
│           ├── data/           # Data access (services, state)
│           └── types/          # TypeScript interfaces/types
└── tools/
    └── schematics/             # Custom Angular schematics
```

## Generating Domain Libraries

Custom schematics are available via the `@tools/schematics` package.

### Full Domain Generation

Generate a complete domain with feature, data, and types libraries:

```bash
ng g @tools/schematics:domain --app=demo --domain=products --name=list
# or short form
ng g domain --app=demo --domain=products --name=list
```

This creates:

- `libs/demo/products/feature-list/` - Feature component
- `libs/demo/products/data/` - Data service for API calls
- `libs/demo/products/types/` - TypeScript interfaces

### Individual Library Generation

Generate single libraries within a domain:

```bash
# Feature library (feature-*)
ng g @tools/schematics:feature --app=demo --domain=products --name=detail

# Data access library
ng g @tools/schematics:data --app=demo --domain=products

# Types library
ng g @tools/schematics:types --app=demo --domain=products

# UI component library (ui-*)
ng g @tools/schematics:ui --app=demo --domain=products --name=card

# Utility library (util-*)
ng g @tools/schematics:util --app=demo --domain=products --name=formatters
```

### Available Schematics

| Schematic | Alias | Description                        | Output Path                           |
| --------- | ----- | ---------------------------------- | ------------------------------------- |
| `domain`  | `d`   | Full domain (feature, data, types) | `libs/{app}/{domain}/*`               |
| `feature` | `f`   | Single feature library             | `libs/{app}/{domain}/feature-{name}/` |
| `data`    | `da`  | Data access library                | `libs/{app}/{domain}/data/`           |
| `types`   | `t`   | Types/models library               | `libs/{app}/{domain}/types/`          |
| `ui`      | `u`   | UI component library               | `libs/{app}/{domain}/ui-{name}/`      |
| `util`    | `ut`  | Utility library                    | `libs/{app}/{domain}/util-{name}/`    |

### Generated Path Aliases

Each schematic automatically adds tsconfig path aliases:

| Library Type | Path Alias                    |
| ------------ | ----------------------------- |
| feature      | `@{app}/{domain}/{name}`      |
| data         | `@{app}/{domain}/data`        |
| types        | `@{app}/{domain}/types`       |
| ui           | `@{app}/{domain}/ui-{name}`   |
| util         | `@{app}/{domain}/util-{name}` |

### Existing Path Aliases

| Alias                      | Library                                  |
| -------------------------- | ---------------------------------------- |
| `@demo/shell`              | Shell feature (root component)           |
| `@demo/layouts`            | Layout components (Header, Main, Footer) |
| `@demo/layouts/navigation` | Navigation component                     |
| `@demo/home/welcome`       | Welcome page feature                     |
| `@demo/home/hero`          | Hero section component                   |

## Architecture

### Module Boundaries

This template uses [Sheriff](https://github.com/softarc-consulting/sheriff) to enforce module boundaries:

| Type      | Can Import                    |
| --------- | ----------------------------- |
| `feature` | `data`, `ui`, `util`, `types` |
| `data`    | `ui`, `util`, `types`         |
| `ui`      | `util`, `types`               |
| `util`    | other `util`                  |
| `types`   | standalone                    |

### Library Types

- **feature-\*** - Smart components that handle business logic and compose UI
- **data** - Services for API calls, state management, data transformation
- **types** - TypeScript interfaces, types, and enums
- **ui-\*** - Presentational (dumb) components
- **util-\*** - Pure utility functions and helpers

## Available Scripts

| Script                  | Description                       |
| ----------------------- | --------------------------------- |
| `pnpm start`            | Start development server          |
| `pnpm build`            | Build for production              |
| `pnpm test`             | Run tests with Vitest             |
| `pnpm test:watch`       | Run tests in watch mode           |
| `pnpm test:ui`          | Run tests with Vitest UI          |
| `pnpm lint`             | Run ESLint                        |
| `pnpm lint:fix`         | Fix ESLint issues                 |
| `pnpm format`           | Format with Prettier              |
| `pnpm format:check`     | Check formatting                  |
| `pnpm check`            | Run lint, format check, and tests |
| `pnpm generate:domain`  | Generate a new domain             |
| `pnpm build:schematics` | Build custom schematics           |
| `pnpm modules:list`     | List Sheriff modules              |

## Configuration Files

| File                   | Purpose                                    |
| ---------------------- | ------------------------------------------ |
| `angular.json`         | Angular CLI configuration                  |
| `tsconfig.json`        | TypeScript configuration with path aliases |
| `eslint.config.mjs`    | ESLint flat config                         |
| `sheriff.config.ts`    | Module boundary rules                      |
| `vitest.config.ts`     | Vitest test configuration                  |
| `.prettierrc`          | Prettier formatting rules                  |
| `commitlint.config.js` | Commit message rules                       |

## Requirements

- Node.js >= 20.0.0
- pnpm >= 10.0.0

## License

MIT
