# Testing the Render MCP Server

This directory contains tests for the Render MCP server.

## Running Tests

To run all tests:

```bash
npm test
```

To run a specific test file:

```bash
npm test -- tests/renderClient.test.ts
```

To run tests with coverage:

```bash
npm test -- --coverage
```

## Test Structure

- `renderClient.test.ts`: Tests for the Render API client

## Writing Tests

When writing tests, follow these guidelines:

1. Mock external dependencies (like axios)
2. Test both success and failure cases
3. Use descriptive test names
4. Group related tests using `describe` blocks
5. Keep tests isolated and independent

## Test Configuration

Jest is configured in the `package.json` file. The configuration includes:

- TypeScript support
- Code coverage reporting
- Test environment setup

## Continuous Integration

Tests are automatically run on GitHub Actions when you push to the repository or create a pull request.
