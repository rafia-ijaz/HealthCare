# 📁 Project Structure - Sauce Labs Demo Automation

## 🗂️ Directory Overview

```
sauce-demo-automation/
├── 📄 README.md                           # Main project documentation
├── 📄 SETUP_GUIDE.md                      # Detailed setup instructions
├── 📄 TEST_EXECUTION_GUIDE.md             # Test execution guide
├── 📄 ASSIGNMENT_SUMMARY.md               # Assignment requirements summary
├── 📄 PROJECT_STRUCTURE.md                # This file
├── 📄 run-tests.sh                        # Test execution script
├── 📄 package.json                        # Project dependencies and scripts
├── 📄 package-lock.json                   # Locked dependency versions
├── 📄 playwright.config.ts                # Playwright configuration
├── 📄 tsconfig.json                       # TypeScript configuration
│
├── 📁 src/                                # Source code directory
│   ├── 📁 pages/                          # Page Object Models
│   │   ├── 📄 LoginPage.ts                # Login page interactions
│   │   ├── 📄 InventoryPage.ts            # Product catalog management
│   │   ├── 📄 CartPage.ts                 # Shopping cart functionality
│   │   ├── 📄 CheckoutPage.ts             # Checkout form handling
│   │   ├── 📄 CheckoutOverviewPage.ts     # Order review page
│   │   └── 📄 CheckoutCompletePage.ts     # Order confirmation page
│   │
│   ├── 📁 data/                           # Test data
│   │   └── 📄 testData.ts                 # Centralized test data and constants
│   │
│   └── 📁 utils/                          # Utility functions
│       └── 📄 testHelpers.ts              # Helper functions and utilities
│
├── 📁 tests/                              # Test specifications
│   ├── 📄 checkout-flow.spec.ts           # Main checkout flow test (REQUIREMENT)
│   ├── 📄 login.spec.ts                   # Authentication tests
│   └── 📄 checkout-validation.spec.ts     # Form validation tests
│
└── 📁 test-results/                       # Test execution results (generated)
    ├── 📁 html-report/                    # Interactive HTML reports
    ├── 📁 screenshots/                    # Test screenshots
    ├── 📁 videos/                         # Test execution videos
    ├── 📄 results.json                    # JSON test results
    └── 📄 results.xml                     # JUnit test results
```

## 📋 File Descriptions

### 📄 Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Project dependencies, scripts, and metadata |
| `playwright.config.ts` | Playwright automation framework configuration |
| `tsconfig.json` | TypeScript compiler configuration |
| `run-tests.sh` | Easy-to-use test execution script |

### 📄 Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Main project overview and quick start guide |
| `SETUP_GUIDE.md` | Detailed installation and setup instructions |
| `TEST_EXECUTION_GUIDE.md` | Comprehensive test execution guide |
| `ASSIGNMENT_SUMMARY.md` | Assignment requirements fulfillment summary |
| `PROJECT_STRUCTURE.md` | This file - project structure overview |

### 📁 Source Code (`src/`)

#### 📁 Pages (`src/pages/`)
Page Object Models following the POM design pattern:

| File | Purpose |
|------|---------|
| `LoginPage.ts` | Handles user authentication and login form |
| `InventoryPage.ts` | Manages product catalog and cart operations |
| `CartPage.ts` | Shopping cart functionality and navigation |
| `CheckoutPage.ts` | Checkout form handling and validation |
| `CheckoutOverviewPage.ts` | Order review and pricing verification |
| `CheckoutCompletePage.ts` | Order confirmation and success verification |

#### 📁 Data (`src/data/`)
Test data and constants:

| File | Purpose |
|------|---------|
| `testData.ts` | Centralized test data, user credentials, error messages |

#### 📁 Utils (`src/utils/`)
Utility functions and helpers:

| File | Purpose |
|------|---------|
| `testHelpers.ts` | Helper functions for price calculations, screenshots, logging |

### 📁 Tests (`tests/`)

| File | Purpose |
|------|---------|
| `checkout-flow.spec.ts` | **MAIN TEST** - Complete checkout flow with 3 random products |
| `login.spec.ts` | Authentication and login functionality tests |
| `checkout-validation.spec.ts` | Checkout form validation tests |

### 📁 Test Results (`test-results/`)
Generated during test execution:

| Directory/File | Purpose |
|----------------|---------|
| `html-report/` | Interactive web-based test reports |
| `screenshots/` | Test failure screenshots |
| `videos/` | Test execution recordings |
| `results.json` | Machine-readable test results |
| `results.xml` | JUnit format for CI/CD integration |

## 🎯 Key Features by Directory

### 📁 `src/pages/` - Page Object Models
- **Maintainable**: Easy to update when UI changes
- **Reusable**: Methods can be used across multiple tests
- **Type-Safe**: Full TypeScript support with proper typing
- **Comprehensive**: Covers all major user interactions

### 📁 `src/data/` - Test Data Management
- **Centralized**: All test data in one location
- **Configurable**: Easy to modify test scenarios
- **Structured**: Organized by test categories
- **Maintainable**: Single source of truth for test data

### 📁 `src/utils/` - Utility Functions
- **Reusable**: Common functions used across tests
- **Specialized**: Price calculations, screenshot capture, logging
- **Extensible**: Easy to add new utility functions
- **Well-Documented**: Clear purpose and usage examples

### 📁 `tests/` - Test Specifications
- **Focused**: Each file covers specific functionality
- **Comprehensive**: Covers main requirements and edge cases
- **Readable**: Clear test descriptions and structure
- **Maintainable**: Easy to add new test scenarios

## 🔧 Configuration Details

### Playwright Configuration (`playwright.config.ts`)
- **Base URL**: https://www.saucedemo.com
- **Browsers**: Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari
- **Parallel Execution**: Enabled by default
- **Reporting**: HTML, JSON, JUnit formats
- **Screenshots/Videos**: On failure
- **Retry Logic**: 2 retries on CI environments

### TypeScript Configuration (`tsconfig.json`)
- **Target**: ES2020
- **Module**: CommonJS
- **Strict Mode**: Enabled
- **Path Mapping**: `@/*` for src directory
- **Output**: `./dist` directory

### Package Configuration (`package.json`)
- **Scripts**: Multiple execution modes (test, debug, ui, report)
- **Dependencies**: Playwright and TypeScript
- **Keywords**: Automation, testing, sauce-labs
- **License**: MIT

## 🚀 Quick Navigation

### Main Files for Assignment Review
1. **`tests/checkout-flow.spec.ts`** - Main test meeting assignment requirements
2. **`src/pages/InventoryPage.ts`** - Random product selection logic
3. **`README.md`** - Project overview and quick start
4. **`ASSIGNMENT_SUMMARY.md`** - Requirements fulfillment summary

### Key Configuration Files
1. **`playwright.config.ts`** - Framework configuration
2. **`package.json`** - Dependencies and scripts
3. **`run-tests.sh`** - Easy test execution

### Documentation Files
1. **`SETUP_GUIDE.md`** - Installation instructions
2. **`TEST_EXECUTION_GUIDE.md`** - Test execution guide
3. **`README.md`** - Project overview

## 📊 File Statistics

- **Total Files**: 20+ files
- **TypeScript Files**: 9 files
- **Documentation Files**: 5 files
- **Configuration Files**: 4 files
- **Test Files**: 3 files
- **Lines of Code**: ~1,500+ lines
- **Test Cases**: 17 individual test cases

## 🎉 Project Highlights

### ✅ Assignment Requirements Met
- Complete checkout flow with 3 random products
- Playwright with TypeScript framework
- Comprehensive assertions and validations
- Multiple reporting formats
- Professional documentation

### 🏗️ Architecture Benefits
- **Scalable**: Easy to add new test scenarios
- **Maintainable**: Page Object Model design
- **Reliable**: Robust element selection strategies
- **Professional**: Production-ready code quality

### 🚀 Developer Experience
- **Easy Setup**: One-command installation
- **Multiple Modes**: Headed, headless, debug, UI
- **Comprehensive Docs**: Step-by-step guides
- **CI/CD Ready**: Integration-ready configuration

---

**Project Status**: ✅ **COMPLETE AND READY FOR EVALUATION**

**Next Step**: Run `./run-tests.sh checkout` to execute the main test.