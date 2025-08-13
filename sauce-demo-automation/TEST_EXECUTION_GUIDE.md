# 🧪 Test Execution Guide - Sauce Labs Demo Automation

This guide provides detailed instructions for executing the automated test suite for the Sauce Labs Demo website.

## 🚀 Quick Start

### Prerequisites Check
```bash
# Verify Node.js version (should be 16+)
node --version

# Verify npm is available
npm --version

# Check if you're in the correct directory
pwd  # Should show /path/to/sauce-demo-automation
```

### Initial Setup
```bash
# Install dependencies and browsers
./run-tests.sh install
```

## 📋 Test Execution Commands

### 1. Main Checkout Flow Test (Primary Requirement)
This test covers the complete user journey of selecting 3 random products and completing checkout:

```bash
# Run the main checkout flow test
./run-tests.sh checkout

# Or using npx directly
npx playwright test checkout-flow.spec.ts --project=chromium
```

**What this test does:**
1. ✅ Logs in with standard user credentials
2. ✅ Verifies 6 products are loaded on inventory page
3. ✅ Randomly selects 3 products and adds them to cart
4. ✅ Navigates to cart and verifies selected items
5. ✅ Proceeds to checkout and fills shipping information
6. ✅ Reviews order details and pricing
7. ✅ Completes the purchase
8. ✅ Verifies order confirmation

### 2. All Tests
```bash
# Run all test suites
./run-tests.sh all

# Or using npx
npx playwright test
```

### 3. Specific Test Suites
```bash
# Login functionality tests
./run-tests.sh login

# Checkout validation tests
./run-tests.sh validation

# Cart functionality tests
npx playwright test --grep="cart functionality"
```

### 4. Browser-Specific Testing
```bash
# Chrome only
./run-tests.sh chrome

# Firefox only
./run-tests.sh firefox

# Safari only
./run-tests.sh safari

# Mobile Chrome
./run-tests.sh mobile
```

## 🔍 Debugging and Development

### Debug Mode
```bash
# Run tests in debug mode (step-by-step)
./run-tests.sh debug

# Debug specific test
npx playwright test --debug --grep="Complete checkout flow"
```

### UI Mode (Interactive)
```bash
# Run tests with Playwright UI
./run-tests.sh ui
```

### Headed Mode (Visible Browser)
```bash
# Run tests with visible browser
./run-tests.sh headed
```

## 📊 Viewing Results

### HTML Report
```bash
# Generate and open HTML report
./run-tests.sh report

# Or manually
npx playwright show-report
```

### Command Line Output
```bash
# Detailed output
npx playwright test --reporter=list

# Verbose output
npx playwright test --reporter=verbose
```

## 🎯 Test Scenarios Overview

### 1. Complete Checkout Flow (`checkout-flow.spec.ts`)
**Primary Test - Meets Assignment Requirements**

**Test Steps:**
1. **Login**: Standard user authentication
2. **Product Selection**: Random selection of 3 products
3. **Cart Management**: Add products and verify cart
4. **Checkout Process**: Fill shipping information
5. **Order Review**: Verify pricing and items
6. **Order Completion**: Complete purchase and verify confirmation

**Assertions:**
- ✅ Login successful and navigation to inventory
- ✅ 6 products loaded on page
- ✅ 3 random products added to cart
- ✅ Cart badge shows correct count
- ✅ Cart page shows correct items
- ✅ Checkout form accepts valid data
- ✅ Order overview shows correct pricing
- ✅ Order completion shows success message

### 2. Login Functionality (`login.spec.ts`)
**Authentication Testing**

**Test Cases:**
- ✅ Successful login with standard user
- ✅ Successful login with problem user
- ✅ Successful login with performance glitch user
- ✅ Locked out user error handling
- ✅ Invalid credentials error
- ✅ Empty field validation

### 3. Checkout Validation (`checkout-validation.spec.ts`)
**Form Validation Testing**

**Test Cases:**
- ✅ Empty first name validation
- ✅ Empty last name validation
- ✅ Empty postal code validation
- ✅ All empty fields validation
- ✅ Cancel checkout functionality
- ✅ Valid checkout information processing

### 4. Additional Functionality Tests
**Extended Coverage**

**Test Cases:**
- ✅ Cart navigation and item persistence
- ✅ Product sorting (A-Z, Z-A, Price Low-High)
- ✅ Price calculation verification
- ✅ Cross-browser compatibility

## 🔧 Configuration Options

### Environment Variables
```bash
# Run tests in CI mode (with retries)
CI=true npm test

# Set custom timeout
PLAYWRIGHT_TIMEOUT=30000 npm test
```

### Custom Test Execution
```bash
# Run tests with specific grep pattern
npx playwright test --grep="login"

# Run tests with retry on failure
npx playwright test --retries=2

# Run tests in parallel with specific workers
npx playwright test --workers=4

# Run tests with specific browser and headed mode
npx playwright test --project=chromium --headed
```

## 📈 Performance Optimization

### Parallel Execution
```bash
# Default parallel execution
npx playwright test

# Control number of workers
npx playwright test --workers=2
```

### Browser Reuse
```bash
# Reuse browser instance for faster execution
npx playwright test --project=chromium --headed
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Test Timeouts
```bash
# Increase timeout in playwright.config.ts
use: {
  actionTimeout: 30000,
  navigationTimeout: 30000,
}
```

#### 2. Element Not Found
- Verify Sauce Labs demo site accessibility
- Check network connectivity
- Update element selectors if site structure changes

#### 3. Browser Installation Issues
```bash
# Reinstall browsers
npx playwright install --force

# Install specific browser
npx playwright install chromium
```

#### 4. Permission Issues (Linux/macOS)
```bash
# Fix permissions
chmod +x run-tests.sh
sudo chmod +x node_modules/.bin/playwright
```

### Debug Commands
```bash
# Check test structure
npx playwright test --list

# Validate configuration
npx playwright test --config=playwright.config.ts --dry-run

# Check browser installation
npx playwright install --dry-run
```

## 📊 Expected Test Results

### Successful Test Run
```
✓ Complete checkout flow with 3 random products (15s)
✓ Verify cart functionality and navigation (8s)
✓ Verify product sorting functionality (12s)
✓ Successful login with standard user (5s)
✓ Successful login with problem user (5s)
✓ Successful login with performance glitch user (5s)
✓ Locked out user should show error message (3s)
✓ Invalid credentials should show error message (3s)
✓ Empty username should show error message (3s)
✓ Empty password should show error message (3s)
✓ Empty first name should show error (8s)
✓ Empty last name should show error (8s)
✓ Empty postal code should show error (8s)
✓ All empty fields should show error (8s)
✓ Cancel checkout should return to cart (8s)
✓ Valid checkout information should proceed to overview (8s)

17 passed (2m 15s)
```

### Test Artifacts Generated
- `test-results/html-report/` - Interactive HTML report
- `test-results/screenshots/` - Test screenshots
- `test-results/videos/` - Test execution videos
- `test-results/results.json` - JSON test results
- `test-results/results.xml` - JUnit test results

## 🎯 Assignment Requirements Verification

### ✅ Requirements Met

1. **Test Coverage**: Complete checkout flow with 3 random products ✅
2. **Framework**: Playwright with TypeScript ✅
3. **Assertions**: Comprehensive verification of user actions ✅
4. **Reporting**: HTML, JSON, and JUnit reports ✅
5. **Documentation**: Complete setup and execution guides ✅

### 📋 Deliverables Checklist

- ✅ **Source Code**: Complete automation framework
- ✅ **Documentation**: README, Setup Guide, Test Execution Guide
- ✅ **Dependencies**: package.json with all required packages
- ✅ **Configuration**: Playwright and TypeScript configs
- ✅ **Test Scripts**: Easy-to-use execution scripts

---

**Ready to execute! Run `./run-tests.sh checkout` to start the main test.**