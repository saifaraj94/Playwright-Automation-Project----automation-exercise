# Automation Exercise Playwright Framework

This is a comprehensive end-to-end automation framework for [Automation Exercise](https://automationexercise.com/).

## 🚀 Features
- **Clean Architecture**: Follows Page Object Model (POM).
- **Hybrid Testing**: Uses API for fast setup (registration/login) while focusing on UI verification.
- **Data-Driven**: Uses `@faker-js/faker` for dynamic test data generation.
- **Robustness**: 20 independent and parallel-safe test cases.
- **Reporting**: Integrated Playwright HTML reporter.

## 📁 Project Structure
- `api/`: API client classes wrapping `APIRequestContext`.
- `data/`: Type definitions and Faker factories.
- `pages/`: Page Object classes.
- `tests/`: Organized test suites (Auth, Products, Cart, Checkout, Misc, API - Total 20 tests).
- `utils/`: Reusable helpers like `AuthHelper`.

## 🛠️ Setup
1. **Clone the repository** (if applicable).
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Install Playwright browsers**:
   ```bash
   npx playwright install
   ```
4. **Configure Environment**:
   Copy `.env.example` to `.env` and adjust the `BASE_URL` if needed.

## 🧪 Running Tests

### Run all tests
```bash
npx playwright test
```

### Run UI tests specifically
```bash
npx playwright test tests/auth.spec.ts tests/cart.spec.ts tests/checkout.spec.ts tests/products.spec.ts tests/misc.spec.ts
```

### Run API tests specifically
```bash
npx playwright test tests/api.spec.ts
```

### Open HTML Report
```bash
npx playwright show-report
```

## 🔐 Auth Strategy
The framework uses a hybrid authentication strategy:
- **UI Tests**: Test authenticating via the UI as part of the sanity checks.
- **Speed Optimization**: For tests requiring a logged-in state (e.g., Checkout), the `AuthHelper` registers and logs in a user via API, captures the storage state (cookies), and injects them into the browser context. This avoids repetitive UI login flows.
- **Cleanup**: Users created during tests are deleted via API/UI to maintain a clean environment.

## 🚫 Best Practices Followed
- No direct API calls in test files (wrapped in `api/` clients).
- No hard-coded test data (using factories).
- No assertions inside Page Objects.
- Properly typed responses and models.
