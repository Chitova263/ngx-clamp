# Contributing to ngx-clamp

Thank you for your interest in contributing to ngx-clamp! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## Getting Started

### Prerequisites

- Node.js (see `.nvmrc` for version)
- npm

### Setup

1. Fork the repository
2. Clone your fork:
    ```bash
    git clone https://github.com/YOUR_USERNAME/ngx-clamp.git
    cd ngx-clamp
    ```
3. Install dependencies:
    ```bash
    npm install
    ```
4. Start the demo app:
    ```bash
    npm start
    ```

## Development Workflow

### Building the Library

```bash
npm run build
```

### Running the Demo

```bash
npm start
```

### Code Formatting

This project uses Prettier for code formatting:

```bash
# Check formatting
npm run prettier:check

# Fix formatting
npm run prettier:fix
```

## Submitting Changes

### Branch Naming

Use descriptive branch names:

- `feature/add-new-option` - New features
- `fix/line-height-calculation` - Bug fixes
- `docs/update-readme` - Documentation updates

### Commit Messages

Follow conventional commit format:

```
type(scope): description

[optional body]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Examples:

- `feat(directive): add support for character-based clamping`
- `fix(truncate): handle empty text nodes`
- `docs(readme): add usage examples`

### Pull Request Process

1. Create a feature branch from `main`
2. Make your changes
3. Ensure code is formatted (`npm run prettier:fix`)
4. Update documentation if needed
5. Update CHANGELOG.md under `[Unreleased]`
6. Submit a pull request

### PR Requirements

- Clear description of changes
- Link to related issue (if applicable)
- All CI checks passing
- Code formatted with Prettier

## Reporting Issues

### Bug Reports

Include:

- Angular version
- Browser and version
- Minimal reproduction steps
- Expected vs actual behavior

### Feature Requests

Include:

- Use case description
- Proposed API (if applicable)
- Alternatives considered

## Questions?

Open a [GitHub Discussion](https://github.com/Chitova263/ngx-clamp/discussions) for questions or ideas.
