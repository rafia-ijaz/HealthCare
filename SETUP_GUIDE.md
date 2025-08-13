# 🚀 Setup Guide - Sauce Labs Demo Test Suite

## 📋 Prerequisites

Before setting up the test suite, ensure you have the following installed:

### Required Software
- **Node.js** (version 16 or higher)
  - Download from: https://nodejs.org/
  - Verify installation: `node --version`
- **npm** (comes with Node.js)
  - Verify installation: `npm --version`
- **Git** (for version control)
  - Download from: https://git-scm.com/
  - Verify installation: `git --version`

### System Requirements
- **Operating System**: Windows, macOS, or Linux
- **Memory**: Minimum 4GB RAM (8GB recommended)
- **Storage**: At least 2GB free space
- **Internet**: Required for downloading dependencies and running tests

## 🛠️ Installation Steps

### Step 1: Clone the Repository
```bash
# Clone the repository
git clone https://github.com/your-username/sauce-demo-tests.git

# Navigate to the project directory
cd sauce-demo-tests
```

### Step 2: Install Dependencies
```bash
# Install Node.js dependencies
npm install
```

### Step 3: Install Playwright Browsers
```bash
# Install all supported browsers
npm run test:install
```

**Note**: This step downloads browser binaries (~500MB) and may take a few minutes depending on your internet connection.

### Step 4: Verify Installation
```bash
# Check if everything is installed correctly
npm run build

# Run a quick test to verify setup
npm test -- --project=chromium --grep="Successful login"
```

## 🧪 Running Your First Test

### Quick Start - Run All Tests
```bash
# Run all tests in headless mode
npm test
```

### Run Tests with Browser Visible
```bash
# Run tests with browser window visible (useful for debugging)
npm run test:headed
```

### Run Specific Test
```bash
# Run only the checkout flow test
npx playwright test checkout-flow.spec.ts

# Run only login tests
npx playwright test login.spec.ts
```

## 📊 Viewing Test Results

### HTML Report (Recommended)
```bash
# Generate and open HTML report
npm run test:report
```

The HTML report will open in your default browser showing:
- ✅ Test results with pass/fail status
- 📸 Screenshots of test execution
- 🎥 Videos of failed tests
- 📈 Performance metrics
- 🔍 Detailed error information

### Command Line Results
```bash
# Run tests with detailed output
npm test -- --reporter=list
```

## 🎯 Understanding the Test Structure

### Main Test Files
1. **`tests/checkout-flow.spec.ts`** - Complete checkout flow with 3 random items
2. **`tests/login.spec.ts`** - Login functionality testing

### Page Objects
- **`pages/LoginPage.ts`** - Login page interactions
- **`pages/InventoryPage.ts`** - Product listing and cart management
- **`pages/CartPage.ts`** - Shopping cart functionality
- **`pages/CheckoutPage.ts`** - Checkout process

### Test Data
- **`utils/testData.ts`** - Test credentials and sample data
- **`utils/helpers.ts`** - Utility functions

## 🔧 Configuration Options

### Browser Selection
```bash
# Run tests on specific browsers
npm run test:chromium    # Chrome only
npm run test:firefox     # Firefox only
npm run test:webkit      # Safari only
npm run test:mobile      # Mobile Chrome
```

### Test Execution Modes
```bash
# Debug mode (step through tests)
npm run test:debug

# UI mode (interactive test runner)
npm run test:ui

# Generate test code interactively
npm run test:codegen
```

## 🐛 Troubleshooting

### Common Issues and Solutions

#### 1. Node.js Version Issues
```bash
# Check Node.js version
node --version

# If version is below 16, upgrade Node.js
# Download from: https://nodejs.org/
```

#### 2. Playwright Browser Installation Issues
```bash
# Clear Playwright cache and reinstall
npx playwright install --force

# Install specific browser
npx playwright install chromium
```

#### 3. Permission Issues (Linux/macOS)
```bash
# Fix permission issues
sudo chmod +x node_modules/.bin/playwright
```

#### 4. Network Issues
```bash
# Check if Sauce Labs demo site is accessible
curl -I https://www.saucedemo.com

# If blocked, check your firewall/proxy settings
```

#### 5. Test Failures
```bash
# Run tests with more verbose output
npm test -- --reporter=verbose

# Run single test in debug mode
npx playwright test --debug --grep="Complete checkout flow"
```

### Debug Mode
```bash
# Run tests with debugger attached
npm run test:debug

# This will:
# - Open browser in headed mode
# - Pause execution at each step
# - Allow manual interaction
# - Show detailed logs
```

## 📈 Performance Optimization

### Parallel Execution
The test suite is configured to run tests in parallel for faster execution:

```bash
# Run with maximum parallelization
npm test -- --workers=4

# Run tests sequentially (useful for debugging)
npm test -- --workers=1
```

### Browser Optimization
```bash
# Run tests with specific browser settings
npx playwright test --project=chromium --headed
```

## 🔄 Continuous Integration

### GitHub Actions Setup
1. Create `.github/workflows/playwright.yml` in your repository
2. Add the following content:

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

### Local CI Simulation
```bash
# Simulate CI environment
CI=true npm test
```

## 📚 Next Steps

### 1. Explore the Test Suite
- Review the test files to understand the structure
- Examine page objects to see how interactions are implemented
- Check test data to understand available test scenarios

### 2. Run Different Test Scenarios
```bash
# Run login tests only
npm test -- --grep="login"

# Run checkout flow only
npm test -- --grep="checkout"

# Run tests with specific browser
npm test -- --project=firefox
```

### 3. Customize Tests
- Modify test data in `utils/testData.ts`
- Add new test scenarios
- Extend page objects for additional functionality

### 4. Generate New Tests
```bash
# Use Playwright's code generator
npm run test:codegen

# This opens an interactive browser where you can:
# - Navigate the website
# - Perform actions
# - Generate test code automatically
```

## 🆘 Getting Help

### Documentation
- [Playwright Documentation](https://playwright.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Sauce Labs Demo Website](https://www.saucedemo.com/)

### Community Resources
- [Playwright GitHub](https://github.com/microsoft/playwright)
- [Playwright Discord](https://discord.gg/playwright)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/playwright)

### Project Issues
- Check the project's GitHub issues
- Create a new issue with detailed information
- Include test logs and screenshots when reporting bugs

---

**🎉 Congratulations! You're now ready to run the Sauce Labs Demo test suite. Happy testing!**