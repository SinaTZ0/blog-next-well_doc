# Authentication E2E Tests

This directory contains end-to-end tests for the authentication flow using Playwright and Vitest. The tests verify the complete authentication mechanism without mocking any functionality.

## What's Covered

- Sign-up
- Sign-in with valid and invalid credentials
- Access to protected pages
- Redirection for unauthorized access
- Sign-out functionality
- Toast notifications for success and error states

## Test Files

- `auth.spec.ts` - Playwright tests for the authentication flow

## Running the Tests

### Prerequisites

- Make sure the application is running locally at http://localhost:3000

### Using Playwright

```bash
npx playwright test --ui src/app/auth/tests/auth.spec.ts
```

## Test Structure

Each test file contains three main test cases:

1. **Invalid Credentials Test** - Verifies that error toasts appear when invalid credentials are provided
2. **Complete Authentication Flow Test** - Tests the entire flow from sign-up to sign-in to accessing a protected page to sign-out
3. **Unauthorized Access Test** - Verifies that unauthorized access attempts redirect to the login page with appropriate notifications

## Notes

- These tests use a real browser and interact with the actual UI components
- No functionality is mocked, providing a true end-to-end test of the authentication system
- The tests verify both UI state and toast notifications
