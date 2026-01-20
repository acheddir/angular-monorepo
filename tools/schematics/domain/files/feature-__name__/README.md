# Feature <%= classify(name) %>

This library contains the <%= name %> feature component for the <%= domain %> domain.

## Usage

Import the component in your routes:

```typescript
import { Feature<%= classify(name) %> } from '@<%= app %>/<%= domain %>/<%= name %>';
```

## Structure

- `src/lib/<%= name %>.ts` - Main feature component
- `src/lib/<%= name %>.spec.ts` - Component tests
- `src/public-api.ts` - Public API exports
