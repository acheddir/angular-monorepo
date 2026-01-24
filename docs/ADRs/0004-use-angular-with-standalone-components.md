# ADR 0004: Use Angular with Standalone Components

## Status

✅ Accepted

## Context

We need to choose a UI framework and component architecture for our application. Requirements:

- Robust framework with long-term support
- Modern component architecture
- TypeScript-first design
- Wide ecosystem and community support
- Enterprise-grade tooling
- Simplified module management

## Decision

We will use **Angular 21** with **standalone components** as the default component architecture.

### Angular 21:

- Industry-standard enterprise framework
- Excellent TypeScript support (built with TypeScript)
- Comprehensive CLI for development workflows
- Built-in dependency injection
- Strong community and documentation
- Signals for reactive state management
- Improved performance with Zoneless change detection

### Standalone Components:

- No NgModule boilerplate required
- Simplified imports and dependencies
- Better tree-shaking and bundle optimization
- Easier lazy loading
- More intuitive component composition
- Aligns with modern web component patterns

### Alternative Considered:

**NgModules-based Architecture**

- ❌ More boilerplate code
- ❌ Complex module dependency management
- ❌ Harder to understand for new developers
- ❌ Being phased out by Angular team

**React**

- ✅ Popular and flexible
- ❌ Less opinionated (requires more decisions)
- ❌ TypeScript is opt-in, not native
- ❌ No built-in DI or routing

**Vue.js**

- ✅ Gentle learning curve
- ❌ Smaller enterprise ecosystem
- ❌ Less comprehensive CLI tooling

## Consequences

### Positive:

- Reduced boilerplate and cleaner code
- Better developer experience with simplified imports
- Improved bundle sizes through better tree-shaking
- Easier testing of individual components
- Future-proof architecture aligned with Angular's direction
- Strong typing throughout the application

### Negative:

- Migration path needed for existing NgModule-based code
- Some third-party libraries may still use NgModules

### Mitigations:

- Angular provides interoperability between standalone and NgModule components
- Schematics generate standalone components by default
- Clear migration guides in documentation
