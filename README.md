# 🧪 Sauce Labs Demo - Automated Test Suite

This repository contains a comprehensive automated test suite for the [Sauce Labs Demo website](https://www.saucedemo.com) built with **Playwright** and **TypeScript**. The test suite covers the complete customer flow of selecting random items and completing the checkout process.

## 📋 Project Overview

### Test Coverage
- ✅ **Complete Checkout Flow**: User selects 3 random products and completes the entire checkout process
- ✅ **Login Functionality**: Tests for all user types (standard, problem, performance glitch, locked out)
- ✅ **Product Management**: Add/remove products, cart functionality, product sorting
- ✅ **Checkout Validation**: Form validation and error handling
- ✅ **Cross-browser Testing**: Chrome, Firefox, Safari, and mobile browsers

### Framework Features
- 🏗️ **Page Object Model (POM)**: Maintainable and reusable test structure
- 📊 **Comprehensive Reporting**: HTML, JSON, and JUnit reports
- 🎯 **Smart Assertions**: Detailed verification of user actions
- 📸 **Screenshot Capture**: Automatic screenshots on test failures
- 🎥 **Video Recording**: Test execution videos for debugging
- 🔄 **Parallel Execution**: Tests run in parallel for faster execution

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sauce-demo-automation
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

#### Basic Test Execution
```bash
# Run all tests
npm test

# Run tests in headed mode (visible browser)
npm run test:headed

# Run tests with debug mode
npm run test:debug
```

#### Specific Test Suites
```bash
# Run only checkout flow tests
npx playwright test checkout-flow.spec.ts

# Run only login tests
npx playwright test login.spec.ts

# Run tests for specific browser
npx playwright test --project=chromium
```

#### Advanced Options
```bash
# Run tests with UI mode (interactive)
npm run test:ui

# Generate test code
npm run test:codegen

# View test reports
npm run test:report
```

## 📁 Project Structure

```
sauce-demo-automation/
├── src/
│   ├── pages/                 # Page Object Models
│   │   ├── LoginPage.ts
│   │   ├── InventoryPage.ts
│   │   ├── CartPage.ts
│   │   ├── CheckoutPage.ts
│   │   ├── CheckoutOverviewPage.ts
│   │   └── CheckoutCompletePage.ts
│   ├── data/                  # Test data and constants
│   │   └── testData.ts
│   └── utils/                 # Utility functions
│       └── testHelpers.ts
├── tests/                     # Test specifications
│   ├── checkout-flow.spec.ts  # Main checkout flow test
│   ├── login.spec.ts          # Login functionality tests
│   └── checkout-validation.spec.ts
├── test-results/              # Test execution results
│   ├── html-report/           # HTML test reports
│   ├── screenshots/           # Test screenshots
│   └── videos/                # Test execution videos
├── playwright.config.ts       # Playwright configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Project dependencies
```

## 🧩 Page Object Models

### LoginPage
Handles user authentication with methods for:
- Login form interaction
- Error message verification
- Form validation

### InventoryPage
Manages product catalog with methods for:
- Product selection (random and specific)
- Cart management
- Product sorting
- Navigation

### CartPage
Handles shopping cart functionality:
- Cart item verification
- Item removal
- Checkout navigation

### CheckoutPage
Manages checkout information:
- Form filling
- Validation
- Navigation

### CheckoutOverviewPage
Handles order review:
- Item verification
- Price calculations
- Order completion

### CheckoutCompletePage
Manages order confirmation:
- Success verification
- Navigation back to products

## 📊 Test Reports

The framework generates multiple types of reports:

### HTML Report
```bash
npm run test:report
```
Opens an interactive HTML report with:
- Test execution timeline
- Screenshots and videos
- Error details and stack traces
- Performance metrics

### JSON Report
Located at `test-results/results.json` for CI/CD integration

### JUnit Report
Located at `test-results/results.xml` for Jenkins and other CI tools

## 🔧 Configuration

### Playwright Configuration (`playwright.config.ts`)
- **Base URL**: https://www.saucedemo.com
- **Browsers**: Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari
- **Reporting**: HTML, JSON, JUnit formats
- **Screenshots**: On failure
- **Videos**: On failure
- **Parallel Execution**: Enabled

### Test Data (`src/data/testData.ts`)
Centralized test data including:
- User credentials for all user types
- Checkout information
- Error messages
- Product counts

## 🎯 Test Scenarios

### 1. Complete Checkout Flow
**File**: `tests/checkout-flow.spec.ts`

This is the main test that covers the complete user journey:
1. **Login** with standard user credentials
2. **Product Selection** - Add 3 random products to cart
3. **Cart Review** - Verify selected products and prices
4. **Checkout Process** - Fill shipping information
5. **Order Review** - Verify order details and pricing
6. **Order Completion** - Complete purchase and verify confirmation

### 2. Login Functionality
**File**: `tests/login.spec.ts`

Tests all user authentication scenarios:
- Successful login with all user types
- Locked out user error handling
- Invalid credentials
- Empty field validation

### 3. Checkout Validation
**File**: `tests/checkout-validation.spec.ts`

Validates checkout form behavior:
- Required field validation
- Error message verification
- Navigation functionality

## 🛠️ Development

### Adding New Tests
1. Create new test file in `tests/` directory
2. Import required page objects
3. Use existing test data from `src/data/testData.ts`
4. Follow naming convention: `*.spec.ts`

### Extending Page Objects
1. Add new methods to existing page classes
2. Use Playwright's locator API for element selection
3. Include appropriate assertions
4. Update documentation

### Running Tests in CI/CD
```yaml
# Example GitHub Actions workflow
- name: Run Playwright tests
  run: |
    npm ci
    npx playwright install --with-deps
    npm test
```

## 📈 Best Practices

### Code Quality
- ✅ Use TypeScript for type safety
- ✅ Follow Page Object Model pattern
- ✅ Implement proper error handling
- ✅ Use descriptive test names
- ✅ Add appropriate assertions

### Test Maintenance
- ✅ Keep test data centralized
- ✅ Use data attributes for element selection
- ✅ Implement retry logic for flaky tests
- ✅ Regular test execution and monitoring

### Performance
- ✅ Parallel test execution
- ✅ Efficient element locators
- ✅ Minimal wait times
- ✅ Resource cleanup

## 🐛 Troubleshooting

### Common Issues

1. **Browser Installation**
   ```bash
   npx playwright install
   ```

2. **Permission Issues**
   ```bash
   sudo chmod +x node_modules/.bin/playwright
   ```

3. **Test Failures**
   - Check network connectivity
   - Verify Sauce Labs demo site accessibility
   - Review test data validity

### Debug Mode
```bash
npm run test:debug
```
Opens browser in debug mode with step-by-step execution

## 📝 Contributing

1. Fork the repository
2. Create feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Support

For questions or issues:
- Create an issue in the repository
- Review test documentation
- Check Playwright documentation

---

**Built with ❤️ using Playwright and TypeScript**


