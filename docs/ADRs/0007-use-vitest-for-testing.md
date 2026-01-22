# ADR 0007: Use Vitest for Testing

## Status

Accepted

## Context

We need a testing framework for unit and integration tests. Requirements:

- Fast test execution
- Good TypeScript support
- Angular component testing support
- Watch mode for development
- Code coverage reporting

## Decision

We will use **Vitest** as our test runner with **Angular Testing Library** for component testing.

### Vitest:

- Modern, fast test runner
- Native ESM support
- Lightning-fast test execution
- Jest-compatible API (easy migration)
- Parallel test execution
- Built-in TypeScript support

### Angular Testing Library:

- Encourages testing user behavior, not implementation
- Prevents brittle tests
- Industry standard for Angular testing
- Works seamlessly with Vitest

### Test Configuration:

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./test-setup.ts",
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
    },
  },
});
```

### Alternatives Considered:

**Karma + Jasmine**

- ✅ Traditional Angular testing setup
- ❌ Slower test execution
- ❌ More complex configuration
- ❌ Being phased out by Angular team

**Jest**

- ✅ Most popular testing framework
- ❌ ESM support is problematic
- ❌ Slower than Vitest
- ❌ Requires more configuration for Angular

## Consequences

### Positive:

- Extremely fast test execution (instant feedback)
- Hot module replacement in watch mode
- Same path aliases work in tests
- Excellent developer experience
- Easy to write and maintain tests

### Negative:

- Smaller ecosystem than Jest (but growing rapidly)
- Some Jest plugins may not work
- Less Stack Overflow answers (though docs are excellent)

### Mitigations:

- Vitest API is Jest-compatible (most solutions work)
- Active community and excellent documentation
- Can gradually migrate existing Karma tests if needed
