# Angular Monorepo

A production-ready Angular monorepo template with domain-driven architecture, strict linting, and module boundary enforcement.

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

Use the custom domain schematic to scaffold new feature domains:

```bash
# Generate a complete domain with feature, data, and types
pnpm generate:domain --app=demo --domain=products --name=list
```

This creates:

- `libs/demo/products/feature-list/` - Feature component with routing
- `libs/demo/products/data/` - Data service for API calls
- `libs/demo/products/types/` - TypeScript interfaces

### Generated Path Aliases

The schematic automatically adds tsconfig path aliases:

- `@demo/products/list` → feature library
- `@demo/products/data` → data library
- `@demo/products/types` → types library

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

| Script                 | Description                       |
| ---------------------- | --------------------------------- |
| `pnpm start`           | Start development server          |
| `pnpm build`           | Build for production              |
| `pnpm test`            | Run tests with Vitest             |
| `pnpm test:watch`      | Run tests in watch mode           |
| `pnpm test:ui`         | Run tests with Vitest UI          |
| `pnpm lint`            | Run ESLint                        |
| `pnpm lint:fix`        | Fix ESLint issues                 |
| `pnpm format`          | Format with Prettier              |
| `pnpm format:check`    | Check formatting                  |
| `pnpm check`           | Run lint, format check, and tests |
| `pnpm generate:domain` | Generate a new domain             |
| `pnpm modules:list`    | List Sheriff modules              |

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
