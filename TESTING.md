# Testing Guide

## Running Tests

### Backend Tests

```bash
cd server
npm run test              # Run all tests
npm run test -- --watch  # Watch mode
npm run test -- --ui     # UI mode
```

### Frontend Tests

```bash
cd client
npm run test              # Run all tests
npm run test -- --watch  # Watch mode
npm run test -- --ui     # UI mode
```

## Test Structure

### Backend Tests

Located in `server/src/**/*.test.ts`

**Files**:
- `src/schemas/index.test.ts` - Schema validation tests
- `src/utils/id-generator.test.ts` - ID generation tests
- `src/models/index.test.ts` - Database model tests

**Example Test**:
```typescript
import { describe, it, expect } from 'vitest';
import { RegisterTeamSchema } from '../src/schemas/index';

describe('Team Registration Schema', () => {
  it('should validate a correct registration', () => {
    const validData = {
      teamName: 'CodeMasters',
      collegeName: 'XYZ University',
      leaderEmail: 'leader@example.com',
      leaderPhone: '9876543210',
      participants: [{...}],
    };

    const result = RegisterTeamSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });
});
```

### Frontend Tests

Located in `client/src/**/*.test.ts` and `client/src/**/*.test.tsx`

**Files**:
- `src/schemas/index.test.ts` - Form validation tests

**Example Test**:
```typescript
import { describe, it, expect } from 'vitest';
import { RegisterTeamSchema } from '../../src/schemas/index';

describe('Register Component Validation', () => {
  it('should validate correct team data', () => {
    const validData = {...};
    const result = RegisterTeamSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });
});
```

## Test Coverage

### Current Coverage

**Backend** (~30% of critical paths):
- ✅ Zod schema validation
- ✅ ID generators
- ✅ Model instantiation

**Frontend** (~15% of critical paths):
- ✅ Schema validation

### Recommended Coverage to Add

**Backend Integration Tests**:
```typescript
describe('Team Registration Flow', () => {
  it('should create team with valid data', async () => {
    // Test team creation
  });

  it('should reject duplicate emails', async () => {
    // Test duplicate prevention
  });

  it('should update payment status', async () => {
    // Test payment confirmation
  });

  it('should verify admin authentication', async () => {
    // Test JWT validation
  });
});
```

**Frontend Component Tests**:
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import Register from '../pages/Register';

describe('Register Component', () => {
  it('should render form fields', () => {
    render(<Register />);
    expect(screen.getByPlaceholderText('Team Name')).toBeInTheDocument();
  });

  it('should submit valid form', async () => {
    // Test form submission
  });

  it('should display validation errors', () => {
    // Test error handling
  });
});
```

## Testing Best Practices

### Unit Tests
- Test individual functions in isolation
- Use mocking for external dependencies
- Focus on logic, not implementation details

### Integration Tests
- Test interaction between modules
- Use test database (separate from production)
- Clean up test data after each test

### E2E Tests (Future)
- Test complete user flows
- Use Playwright or Cypress
- Run against staging environment

## Continuous Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      
      - name: Test Server
        run: |
          cd server
          npm install
          npm run test
      
      - name: Test Client
        run: |
          cd client
          npm install
          npm run test
      
      - name: Upload Coverage
        uses: codecov/codecov-action@v3
```

## Debugging Tests

### Run Single Test File
```bash
npm run test -- server/src/schemas/index.test.ts
```

### Debug in Node Inspector
```bash
node --inspect-brk ./node_modules/vitest/vitest.mjs
```

### Increase Timeout
```typescript
it('should complete slow operation', async () => {
  // test code
}, 10000); // 10 second timeout
```

## Mock Data

### Test Fixtures

Create `server/src/__fixtures__/teams.ts`:
```typescript
export const mockTeam = {
  teamName: 'Test Team',
  collegeName: 'Test College',
  leaderEmail: 'leader@test.com',
  leaderPhone: '9876543210',
  participants: [
    {
      fullName: 'John Doe',
      email: 'john@test.com',
      phone: '9876543211',
      rollNumber: 'R001',
    }
  ],
};
```

## Testing Checklist

Before deploying:

- [ ] All unit tests passing
- [ ] All integration tests passing
- [ ] No console errors or warnings
- [ ] Code coverage >= 80% for critical paths
- [ ] Manual testing of registration flow
- [ ] Manual testing of admin dashboard
- [ ] Manual testing of payment flow
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Mobile responsiveness testing
- [ ] Performance testing (lighthouse >= 80)
- [ ] Security audit (npm audit)
- [ ] ESLint passing (npm run lint)

## Performance Testing

### Lighthouse Audit

```bash
# Frontend
cd client
npm run build
npm run preview
# Open http://localhost:4173 in Chrome
# Dev Tools → Lighthouse → Generate Report
```

### Load Testing

```bash
# Install k6
npm install -g k6

# Create test script (k6-test.js)
import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
};

export default function () {
  const res = http.get('http://localhost:4000/api/health');
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
}

# Run test
k6 run k6-test.js
```

## Troubleshooting

### Test Hangs
- Check for unresolved promises
- Ensure test database is accessible
- Clear test data between runs

### Module Not Found
- Ensure all dependencies installed
- Check TypeScript paths in tsconfig.json
- Verify import statements

### Timeout Errors
- Increase test timeout
- Check database performance
- Mock slow external calls

## Resources

- **Vitest**: https://vitest.dev/
- **Testing Library**: https://testing-library.com/
- **Jest**: https://jestjs.io/ (reference)
- **Playwright**: https://playwright.dev/ (E2E)

---

**Happy Testing! ✅**
