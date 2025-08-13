# 🧪 Sauce Labs Demo - Automated Test Suite

## 📋 Project Overview

This is a comprehensive automated test suite for the [Sauce Labs Demo Website](https://www.saucedemo.com/) built with **Playwright** and **TypeScript**. The test suite covers the complete customer flow of selecting 3 random items and completing the checkout process, as well as additional functionality testing.

## 🎯 Test Coverage

### ✅ Core Requirements Met
- **Complete Checkout Flow**: Login → Add 3 random items → Cart → Checkout → Complete order
- **Test Framework**: Playwright with TypeScript
- **Assertions**: Comprehensive verification of user actions and page states
- **Reporting**: HTML, JSON, and JUnit reports with screenshots and videos

### 🧪 Test Scenarios Covered

#### 1. **Complete Checkout Flow** (`checkout-flow.spec.ts`)
- ✅ Login with standard user
- ✅ Add 3 random products to cart
- ✅ Navigate to cart and verify items
- ✅ Complete checkout information
- ✅ Verify pricing calculations
- ✅ Complete order and verify success

#### 2. **Login Functionality** (`login.spec.ts`)
- ✅ Successful login with standard user
- ✅ Failed login with locked out user
- ✅ Failed login with invalid credentials
- ✅ Login with empty credentials
- ✅ Login with problem user
- ✅ Login with performance glitch user

#### 3. **Additional Features**
- ✅ Product sorting functionality (A-Z, Z-A, Price Low-High, Price High-Low)
- ✅ Cart management (add, remove, continue shopping)
- ✅ Cross-browser testing (Chrome, Firefox, Safari, Mobile)
- ✅ Error handling and validation

## 🏗️ Project Structure

```
sauce-demo-tests/
├── 📁 pages/                    # Page Object Models
│   ├── LoginPage.ts            # Login page interactions
│   ├── InventoryPage.ts        # Product listing and cart management
│   ├── CartPage.ts             # Shopping cart functionality
│   └── CheckoutPage.ts         # Checkout process
├── 📁 tests/                   # Test specifications
│   ├── checkout-flow.spec.ts   # Main checkout flow tests
│   └── login.spec.ts           # Login functionality tests
├── 📁 utils/                   # Utilities and helpers
│   ├── testData.ts             # Test data and constants
│   └── helpers.ts              # Helper functions
├── 📁 test-results/            # Test execution results
├── playwright.config.ts        # Playwright configuration
├── tsconfig.json              # TypeScript configuration
├── package.json               # Project dependencies and scripts
└── README.md                  # Project documentation
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** (version 16 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/sauce-demo-tests.git
   cd sauce-demo-tests
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright browsers**
   ```bash
   npm run test:install
   ```

### Running Tests

#### 🎯 Run All Tests
```bash
npm test
```

#### 🖥️ Run Tests in Headed Mode (with browser visible)
```bash
npm run test:headed
```

#### 🎨 Run Tests with UI Mode
```bash
npm run test:ui
```

#### 🐛 Run Tests in Debug Mode
```bash
npm run test:debug
```

#### 🌐 Run Tests on Specific Browsers
```bash
# Chrome only
npm run test:chromium

# Firefox only
npm run test:firefox

# Safari only
npm run test:webkit

# Mobile Chrome
npm run test:mobile
```

#### 📊 View Test Reports
```bash
npm run test:report
```

## 📊 Test Reports

The test suite generates comprehensive reports:

- **HTML Report**: Interactive report with screenshots and videos
- **JSON Report**: Machine-readable test results
- **JUnit Report**: CI/CD integration compatible
- **Screenshots**: Automatic screenshots on test failures
- **Videos**: Test execution recordings

### Viewing Reports
```bash
# Open HTML report in browser
npm run test:report

# Reports are saved in test-results/ directory
```

## 🏗️ Framework Architecture

### Page Object Model (POM)
The test suite follows the Page Object Model pattern for maintainable and reusable code:

```typescript
// Example: LoginPage.ts
export class LoginPage {
  private usernameInput = '[data-test="username"]';
  private passwordInput = '[data-test="password"]';
  
  async login(username: string, password: string) {
    await this.page.fill(this.usernameInput, username);
    await this.page.fill(this.passwordInput, password);
    await this.page.click('[data-test="login-button"]');
  }
}
```

### Test Data Management
Centralized test data for consistent test execution:

```typescript
// utils/testData.ts
export const TEST_CREDENTIALS = {
  STANDARD_USER: {
    username: 'standard_user',
    password: 'secret_sauce'
  }
};
```

### Helper Functions
Reusable utility functions for common operations:

```typescript
// utils/helpers.ts
export async function takeScreenshot(page: Page, name: string) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  await page.screenshot({ path: `test-results/${name}-${timestamp}.png` });
}
```

## 🧪 Test Execution Examples

### Complete Checkout Flow
```bash
# Run the main checkout flow test
npx playwright test checkout-flow.spec.ts

# Run with specific browser
npx playwright test checkout-flow.spec.ts --project=chromium

# Run with headed mode for visual debugging
npx playwright test checkout-flow.spec.ts --headed
```

### Individual Test Cases
```bash
# Run specific test by name
npx playwright test -g "Complete checkout flow with 3 random items"

# Run tests matching a pattern
npx playwright test -g "login"
```

## 🔧 Configuration

### Playwright Configuration (`playwright.config.ts`)
- **Base URL**: https://www.saucedemo.com
- **Browsers**: Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari
- **Reporting**: HTML, JSON, JUnit formats
- **Screenshots**: On failure
- **Videos**: Retain on failure
- **Traces**: On first retry

### TypeScript Configuration (`tsconfig.json`)
- **Target**: ES2020
- **Module**: CommonJS
- **Strict**: Enabled
- **Source Maps**: Enabled

## 📈 Test Metrics

### Coverage Statistics
- **Total Test Cases**: 10+
- **Page Objects**: 4
- **Helper Functions**: 8+
- **Test Data Sets**: 3
- **Browser Support**: 5 browsers

### Performance
- **Parallel Execution**: Enabled
- **Retry Logic**: CI only (2 retries)
- **Timeout Handling**: Configurable per test

## 🛠️ Development

### Adding New Tests
1. Create test file in `tests/` directory
2. Import required page objects and utilities
3. Follow the existing test structure and naming conventions
4. Add appropriate assertions and error handling

### Adding New Page Objects
1. Create new page class in `pages/` directory
2. Implement locators and methods
3. Add TypeScript interfaces for data structures
4. Include comprehensive documentation

### Code Quality
```bash
# Type checking
npm run build

# Linting (if ESLint is configured)
npm run lint

# Formatting (if Prettier is configured)
npm run format
```

## 🚀 CI/CD Integration

### GitHub Actions Example
```yaml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

## 📝 Test Data

### Available Test Users
- **standard_user**: Normal user with full access
- **locked_out_user**: User account that is locked
- **problem_user**: User with UI/UX issues
- **performance_glitch_user**: User with performance delays

### Sample Checkout Information
```typescript
{
  firstName: 'John',
  lastName: 'Doe',
  postalCode: '12345'
}
```

## 🔍 Debugging

### Debug Mode
```bash
# Run tests with debugger
npm run test:debug
```

### Code Generation
```bash
# Generate test code interactively
npm run test:codegen
```

### Trace Viewer
```bash
# View test traces
npx playwright show-trace trace.zip
```

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [Sauce Labs Demo Website](https://www.saucedemo.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**QA Automation Engineer**
- **Assignment**: Lean Technologies QA Automation Engineer Role
- **Framework**: Playwright + TypeScript
- **Coverage**: Complete checkout flow with 3 random items

---

**🎉 This test suite demonstrates modern QA automation practices with comprehensive coverage, maintainable code structure, and professional reporting capabilities!**


