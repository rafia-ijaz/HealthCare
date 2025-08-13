# 🛠️ Setup Guide - Sauce Labs Demo Automation

This guide provides step-by-step instructions for setting up and running the automated test suite for the Sauce Labs Demo website.

## 📋 Prerequisites

### System Requirements
- **Operating System**: Windows 10+, macOS 10.14+, or Linux (Ubuntu 18.04+)
- **Node.js**: Version 16.0.0 or higher
- **npm**: Version 8.0.0 or higher (comes with Node.js)
- **Git**: For cloning the repository

### Verify Prerequisites
```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check Git version
git --version
```

## 🚀 Installation Steps

### Step 1: Clone the Repository
```bash
# Clone the repository
git clone <repository-url>
cd sauce-demo-automation

# Verify the project structure
ls -la
```

### Step 2: Install Dependencies
```bash
# Install Node.js dependencies
npm install

# Verify installation
npm list --depth=0
```

### Step 3: Install Playwright Browsers
```bash
# Install all browsers (Chrome, Firefox, Safari)
npm run test:install

# Or install specific browser
npx playwright install chromium
npx playwright install firefox
npx playwright install webkit
```

### Step 4: Verify Installation
```bash
# Run a quick test to verify everything works
npm test -- --project=chromium --grep="Complete checkout flow"
```

## 🔧 Configuration

### Environment Setup
The framework is pre-configured for the Sauce Labs Demo website. Key configurations:

1. **Base URL**: https://www.saucedemo.com
2. **Browsers**: Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari
3. **Test Data**: Pre-configured user credentials and test data

### Custom Configuration
To modify settings, edit `playwright.config.ts`:

```typescript
// Example: Change base URL
use: {
  baseURL: 'https://your-custom-url.com',
}

// Example: Add custom browser
projects: [
  {
    name: 'Custom Browser',
    use: { ...devices['Desktop Chrome'] },
  }
]
```

## 🧪 Running Tests

### Basic Test Execution
```bash
# Run all tests
npm test

# Run tests in headed mode (visible browser)
npm run test:headed

# Run tests with debug mode
npm run test:debug
```

### Specific Test Suites
```bash
# Run only the main checkout flow test
npx playwright test checkout-flow.spec.ts

# Run login tests only
npx playwright test login.spec.ts

# Run checkout validation tests
npx playwright test checkout-validation.spec.ts
```

### Browser-Specific Testing
```bash
# Run tests only in Chrome
npx playwright test --project=chromium

# Run tests only in Firefox
npx playwright test --project=firefox

# Run tests only in Safari
npx playwright test --project=webkit

# Run tests on mobile Chrome
npx playwright test --project="Mobile Chrome"
```

### Advanced Test Execution
```bash
# Run tests with UI mode (interactive)
npm run test:ui

# Run tests with specific grep pattern
npx playwright test --grep="login"

# Run tests with retry on failure
npx playwright test --retries=2

# Run tests in parallel with specific workers
npx playwright test --workers=4
```

## 📊 Viewing Results

### HTML Report
```bash
# Generate and open HTML report
npm run test:report
```

The HTML report includes:
- Test execution timeline
- Screenshots and videos
- Error details and stack traces
- Performance metrics
- Test results summary

### Command Line Output
```bash
# Run tests with detailed output
npx playwright test --reporter=list

# Run tests with verbose output
npx playwright test --reporter=verbose
```

## 🐛 Troubleshooting

### Common Installation Issues

#### 1. Node.js Version Issues
```bash
# Check Node.js version
node --version

# If version is too old, update Node.js
# Download from: https://nodejs.org/
```

#### 2. Permission Issues (Linux/macOS)
```bash
# Fix permission issues
sudo chmod +x node_modules/.bin/playwright

# Or install globally
npm install -g @playwright/test
```

#### 3. Browser Installation Issues
```bash
# Reinstall browsers
npx playwright install --force

# Install specific browser
npx playwright install chromium
```

#### 4. Network Issues
```bash
# Check internet connectivity
ping www.saucedemo.com

# Use proxy if needed
export HTTP_PROXY=http://proxy.company.com:8080
export HTTPS_PROXY=http://proxy.company.com:8080
```

### Test Execution Issues

#### 1. Tests Failing Due to Timeouts
```bash
# Increase timeout in playwright.config.ts
use: {
  actionTimeout: 30000,
  navigationTimeout: 30000,
}
```

#### 2. Element Not Found Errors
- Verify the Sauce Labs demo site is accessible
- Check if the site structure has changed
- Update element selectors if needed

#### 3. Flaky Tests
```bash
# Run tests with retry
npx playwright test --retries=3

# Run tests in debug mode
npx playwright test --debug
```

## 🔍 Debugging

### Debug Mode
```bash
# Run tests in debug mode
npm run test:debug
```

This opens the browser in debug mode with:
- Step-by-step execution
- Pause on failures
- Interactive debugging

### Code Generation
```bash
# Generate test code interactively
npm run test:codegen
```

This opens Playwright's code generator to:
- Record user actions
- Generate test code
- Learn element selectors

### Screenshots and Videos
```bash
# View test artifacts
ls test-results/

# Open screenshots directory
open test-results/screenshots/

# Open videos directory
open test-results/videos/
```

## 📈 Performance Optimization

### Parallel Execution
```bash
# Run tests in parallel (default)
npx playwright test

# Control number of workers
npx playwright test --workers=4
```

### Browser Reuse
```bash
# Reuse browser instance for faster execution
npx playwright test --project=chromium --headed
```

### Headless Mode
```bash
# Run tests in headless mode (faster)
npx playwright test --headed=false
```

## 🔄 Continuous Integration

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
    - run: npm test
    - uses: actions/upload-artifact@v3
      if: always()
      with:
        name: playwright-report
        path: test-results/
```

### Jenkins Pipeline Example
```groovy
pipeline {
    agent any
    stages {
        stage('Install') {
            steps {
                sh 'npm ci'
                sh 'npx playwright install --with-deps'
            }
        }
        stage('Test') {
            steps {
                sh 'npm test'
            }
        }
    }
    post {
        always {
            publishHTML([
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'test-results/html-report',
                reportFiles: 'index.html',
                reportName: 'Playwright Report'
            ])
        }
    }
}
```

## 📞 Support

### Getting Help
1. **Check Documentation**: Review README.md and this setup guide
2. **Run Debug Mode**: Use `npm run test:debug` for interactive debugging
3. **Check Logs**: Review test-results/ directory for detailed logs
4. **Community**: Visit Playwright documentation and community forums

### Common Commands Reference
```bash
# Quick reference
npm test                    # Run all tests
npm run test:headed        # Run with visible browser
npm run test:debug         # Run in debug mode
npm run test:ui            # Run with UI mode
npm run test:report        # Open HTML report
npm run test:install       # Install browsers
npm run test:codegen       # Generate test code
```

---

**Happy Testing! 🎉**