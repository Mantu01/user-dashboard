# Testing Guide

This directory contains unit tests for the User Dashboard application.

## Test Structure

```
tests/
├── api/              # API route tests
│   ├── auth/         # Authentication endpoint tests
│   └── user/         # User endpoint tests
├── components/       # React component tests
│   ├── auth/         # Authentication component tests
│   └── ui/           # UI component tests
└── lib/              # Utility function tests
```

## Running Tests

### Run all tests
```bash
pnpm test
```

### Run tests in watch mode
```bash
pnpm test:watch
```

### Run tests with coverage
```bash
pnpm test:coverage
```

### Run specific test file
```bash
pnpm test tests/lib/auth.test.ts
```

## Test Coverage

The test suite covers:

- **Authentication Utilities** (`lib/auth.ts`)
  - Token generation
  - Token verification
  - Request token extraction
  - User ID extraction

- **Utility Functions** (`lib/utils.ts`)
  - Class name merging
  - Conditional classes

- **API Routes**
  - Authentication endpoints (login, register, logout, me)
  - User endpoints (profile, password, avatar, banner)

- **React Components**
  - UI components (Button, etc.)
  - Authentication forms
  - Dashboard components

## Writing Tests

### Example: Testing a Utility Function

```typescript
import { myFunction } from '@/lib/myUtils'

describe('myFunction', () => {
  it('should do something', () => {
    const result = myFunction(input)
    expect(result).toBe(expected)
  })
})
```

### Example: Testing an API Route

```typescript
import { GET } from '@/app/api/my-route/route'
import { NextRequest } from 'next/server'

describe('GET /api/my-route', () => {
  it('should return data', async () => {
    const request = new NextRequest('http://localhost:3000/api/my-route')
    const response = await GET(request)
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data).toBeDefined()
  })
})
```

### Example: Testing a React Component

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MyComponent } from '@/components/MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('handles user interaction', async () => {
    const user = userEvent.setup()
    render(<MyComponent />)
    
    await user.click(screen.getByRole('button'))
    expect(screen.getByText('Clicked')).toBeInTheDocument()
  })
})
```

## Mocking

### Mocking Next.js Router
The router is automatically mocked in `jest.setup.js`:
```typescript
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    // ...
  }),
}))
```

### Mocking API Calls
```typescript
import axios from 'axios'
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

mockedAxios.post.mockResolvedValue({ data: { success: true } })
```

### Mocking Database
```typescript
import connectDB from '@/lib/mongodb'
import User from '@/models/User'

jest.mock('@/lib/mongodb')
jest.mock('@/models/User')

const mockConnectDB = connectDB as jest.MockedFunction<typeof connectDB>
const mockUser = User as jest.Mocked<typeof User>
```

## Best Practices

1. **Test Isolation**: Each test should be independent and not rely on other tests
2. **Clear Test Names**: Use descriptive test names that explain what is being tested
3. **Arrange-Act-Assert**: Structure tests with clear sections
4. **Mock External Dependencies**: Mock database, API calls, and external services
5. **Test Edge Cases**: Test error conditions, empty inputs, and boundary cases
6. **Keep Tests Simple**: Each test should verify one thing

## Coverage Goals

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

## Troubleshooting

### Tests failing with module resolution errors
- Ensure `jest.config.js` has correct `moduleNameMapper` for `@/` paths
- Check that `tsconfig.json` paths match Jest configuration

### Tests failing with Next.js errors
- Ensure `next/jest` is properly configured
- Check that `jest.setup.js` mocks Next.js modules correctly

### Database connection errors in tests
- All database operations should be mocked
- Use `jest.mock()` to mock Mongoose models

