#!/bin/bash

# Sauce Labs Demo Automation - Test Runner Script
# This script provides easy commands to run different test scenarios

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    if ! command_exists node; then
        print_error "Node.js is not installed. Please install Node.js v16 or higher."
        exit 1
    fi
    
    if ! command_exists npm; then
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
    
    if [ ! -f "package.json" ]; then
        print_error "package.json not found. Please run this script from the project root directory."
        exit 1
    fi
    
    print_success "Prerequisites check passed"
}

# Function to install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    npm install
    print_success "Dependencies installed successfully"
}

# Function to install browsers
install_browsers() {
    print_status "Installing Playwright browsers..."
    npx playwright install
    print_success "Browsers installed successfully"
}

# Function to run all tests
run_all_tests() {
    print_status "Running all tests..."
    npm test
}

# Function to run specific test suite
run_test_suite() {
    local suite=$1
    print_status "Running test suite: $suite"
    npx playwright test "$suite"
}

# Function to run tests in headed mode
run_headed_tests() {
    print_status "Running tests in headed mode..."
    npm run test:headed
}

# Function to run tests in debug mode
run_debug_tests() {
    print_status "Running tests in debug mode..."
    npm run test:debug
}

# Function to run tests with UI mode
run_ui_tests() {
    print_status "Running tests with UI mode..."
    npm run test:ui
}

# Function to show test report
show_report() {
    print_status "Opening test report..."
    npm run test:report
}

# Function to run tests for specific browser
run_browser_tests() {
    local browser=$1
    print_status "Running tests for browser: $browser"
    npx playwright test --project="$browser"
}

# Function to run main checkout flow test
run_checkout_flow() {
    print_status "Running main checkout flow test..."
    npx playwright test checkout-flow.spec.ts --project=chromium
}

# Function to show help
show_help() {
    echo "Sauce Labs Demo Automation - Test Runner"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  install          Install dependencies and browsers"
    echo "  all              Run all tests"
    echo "  checkout         Run main checkout flow test"
    echo "  login            Run login tests"
    echo "  validation       Run checkout validation tests"
    echo "  headed           Run tests in headed mode"
    echo "  debug            Run tests in debug mode"
    echo "  ui               Run tests with UI mode"
    echo "  report           Show test report"
    echo "  chrome           Run tests in Chrome"
    echo "  firefox          Run tests in Firefox"
    echo "  safari           Run tests in Safari"
    echo "  mobile           Run tests on mobile Chrome"
    echo "  help             Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 install       # Install everything"
    echo "  $0 checkout      # Run main test"
    echo "  $0 chrome        # Run tests in Chrome only"
    echo "  $0 debug         # Run tests in debug mode"
}

# Main script logic
case "${1:-help}" in
    "install")
        check_prerequisites
        install_dependencies
        install_browsers
        print_success "Installation completed successfully!"
        ;;
    "all")
        check_prerequisites
        run_all_tests
        ;;
    "checkout")
        check_prerequisites
        run_checkout_flow
        ;;
    "login")
        check_prerequisites
        run_test_suite "login.spec.ts"
        ;;
    "validation")
        check_prerequisites
        run_test_suite "checkout-validation.spec.ts"
        ;;
    "headed")
        check_prerequisites
        run_headed_tests
        ;;
    "debug")
        check_prerequisites
        run_debug_tests
        ;;
    "ui")
        check_prerequisites
        run_ui_tests
        ;;
    "report")
        show_report
        ;;
    "chrome")
        check_prerequisites
        run_browser_tests "chromium"
        ;;
    "firefox")
        check_prerequisites
        run_browser_tests "firefox"
        ;;
    "safari")
        check_prerequisites
        run_browser_tests "webkit"
        ;;
    "mobile")
        check_prerequisites
        run_browser_tests "Mobile Chrome"
        ;;
    "help"|*)
        show_help
        ;;
esac