# ADR 0008: Use Tailwind CSS for Styling

## Status

✅ Accepted

## Context

We need a styling solution that:

- Enables rapid UI development
- Maintains consistency across the application
- Has minimal bundle size impact
- Works well with component-based architecture
- Supports responsive design easily
- Has good TypeScript/IDE support

## Decision

We will use **Tailwind CSS 4** for styling with the new CSS-first configuration.

### Tailwind CSS 4:

- Utility-first CSS framework
- CSS-first configuration (no JS config file)
- Built-in PostCSS support
- Excellent performance (unused styles purged automatically)
- Comprehensive utility classes
- Dark mode support
- Responsive design utilities

### Configuration:

```css
/* apps/app/src/styles.css */
@import "tailwindcss";

/* Custom theme and utilities */
```

### Alternatives Considered:

**Angular Material**

- ✅ Official Angular component library
- ❌ Opinionated design (hard to customize)
- ❌ Larger bundle size
- ❌ Can feel "same-y"

**CSS Modules**

- ✅ Scoped styles (Angular has this built-in)
- ❌ More boilerplate
- ❌ Requires naming classes
- ❌ Less consistency across team

**Plain CSS/SCSS**

- ✅ Simple
- ❌ No design system
- ❌ Hard to maintain consistency
- ❌ More custom code

## Consequences

### Positive:

- Rapid prototyping and development
- Consistent spacing, colors, and typography
- Tiny production bundle (only used classes included)
- No naming fatigue
- Responsive design is trivial
- Easy to create design system with Tailwind config
- Excellent IDE autocomplete support

### Negative:

- Verbose class names in templates
- Learning curve for utility-first approach
- Can be harder to reuse complex styles

### Mitigations:

- Extract repeated patterns into components
- Use custom utility classes for complex patterns
- Component composition over class repetition
- Team training on utility-first CSS
