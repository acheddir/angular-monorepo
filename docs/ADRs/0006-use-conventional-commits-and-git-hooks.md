# ADR 0006: Use Conventional Commits and Git Hooks

## Status

Accepted

## Context

Without automation, code quality checks are often forgotten or skipped:

- Inconsistent commit message formats make changelog generation difficult
- Code may be committed without linting or formatting
- Tests may not run before pushing
- Inconsistent code style across the team

We need automated guardrails that run before code is committed.

## Decision

We will implement automated quality checks using:

- **Husky** for Git hooks
- **lint-staged** for running checks on staged files only
- **Commitlint** for enforcing commit message format

### Git Hooks Configuration:

#### Pre-commit Hook:

```bash
# Runs on: git commit
- ESLint on staged files
- Prettier on staged files
- Tests for affected files
```

#### Commit-msg Hook:

```bash
# Runs on: git commit
- Validates commit message format
```

### Conventional Commits Format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Valid types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Test changes
- `build`: Build system changes
- `ci`: CI/CD changes
- `chore`: Other changes

**Examples:**

```bash
git commit -m "feat: add user authentication"
git commit -m "fix(products): resolve null reference error"
git commit -m "docs: update README with setup instructions"
```

## Consequences

### Positive:

- Consistent, high-quality code in the repository
- No untested or unformatted code gets committed
- Automatic changelog generation from commits
- Better git history for debugging
- Easier code reviews (no style discussions)
- Faster CI/CD (issues caught locally first)

### Negative:

- Slightly slower commit process (a few seconds)
- Rejected commits if checks fail (by design)
- Learning curve for commit message format

### Mitigations:

- Clear error messages when checks fail
- Documentation with commit message examples
- Fast checks with lint-staged (only staged files)
- Can skip hooks in emergencies with `--no-verify` (discouraged)
