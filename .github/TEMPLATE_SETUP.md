# Template Setup Guide

Congratulations on creating your new Angular project from this template!

## Quick Start

### 1. Run the Setup Script

After cloning your new repository, run the interactive setup script to rename the project:

```bash
node scripts/setup.mjs
```

The script will prompt you for your new application name and automatically:

- Rename all project references from `demo` to your chosen name
- Update configuration files (`angular.json`, `tsconfig.json`, `package.json`, etc.)
- Rename folders (`apps/demo/` → `apps/<yourapp>/`, `libs/demo/` → `libs/<yourapp>/`)
- Self-delete after successful completion

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Start Development

```bash
pnpm start
```

## Project Structure

```
├── apps/
│   └── <yourapp>/          # Main application
├── libs/
│   └── <yourapp>/          # Application libraries
│       ├── shell/          # Shell feature (app bootstrapping)
│       └── <domain>/       # Domain-specific libraries
│           ├── feature-*/  # Feature libraries (smart components)
│           ├── data/       # Data access (services, state)
│           └── types/      # TypeScript interfaces/types
└── tools/
    └── schematics/         # Custom Angular schematics
```

## Generating Domain Libraries

Use the custom domain schematic to scaffold new feature domains:

```bash
pnpm generate:domain --app=<yourapp> --domain=products --name=list
```

This creates:

- `libs/<yourapp>/products/feature-list/` - Feature component
- `libs/<yourapp>/products/data/` - Data service
- `libs/<yourapp>/products/types/` - TypeScript types

## Architecture Guidelines

### Module Boundaries (Sheriff)

This template uses [Sheriff](https://github.com/softarc-consulting/sheriff) for enforcing module boundaries:

- **Features** can import from `data`, `ui`, `util`, `types`
- **Data** can import from `ui`, `util`, `types`
- **UI** can import from `util`, `types`
- **Util** can import from other utils only
- **Types** are standalone

### Component Selectors

All components use the prefix configured for your app (e.g., `<yourapp-component>`).

## Available Scripts

| Script                 | Description               |
| ---------------------- | ------------------------- |
| `pnpm start`           | Start development server  |
| `pnpm build`           | Build for production      |
| `pnpm test`            | Run tests                 |
| `pnpm lint`            | Run ESLint                |
| `pnpm format`          | Format code with Prettier |
| `pnpm generate:domain` | Generate a new domain     |

## Need Help?

- [Angular Documentation](https://angular.dev)
- [Sheriff Documentation](https://github.com/softarc-consulting/sheriff)
