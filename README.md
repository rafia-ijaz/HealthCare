# Lean Technologies QA Assignment - Sauce Demo E2E with Playwright

This repository contains an automated test suite for the Sauce Labs demo website using Playwright + TypeScript. The suite covers the customer flow of selecting three random items and completing the checkout successfully.

## Tech Stack
- Playwright Test (TypeScript)
- Page Object Model (POM)
- Reporting: Playwright HTML + Allure

## Prerequisites
- Node.js 18+
- Playwright browsers installed: `npx playwright install`
- On Linux, you may need system libraries for browsers. Install via:
  - Try: `npx playwright install-deps`
  - If it fails, install browser deps manually for your distro. For Ubuntu/Debian:
    ```bash
    sudo apt-get update && sudo apt-get install -y \
      libgtk-4-1 libgtk-3-0 libglib2.0-0 libnss3 libatk1.0-0 libatk-bridge2.0-0 \
      libdrm2 libgbm1 libasound2 libxdamage1 libxcomposite1 libxrandr2 libxkbcommon0 \
      libxfixes3 libpango-1.0-0 libcairo2 libatspi2.0-0 libxshmfence1 libwayland-client0 \
      libwayland-egl1 libwayland-server0 libx11-xcb1 libx11-6 libxcb1 libxext6 libxrender1 \
      libdbus-1-3 libexpat1 libffi8 libpng16-16 libwoff2-1 libvpx9 libevent-2.1-7 libopus0 \
      libgstreamer1.0-0 libgstreamer-plugins-base1.0-0 libgstreamer-gl1.0-0 libgstreamer-plugins-good1.0-0 \
      libenchant-2-2 libsecret-1-0 libharfbuzz-icu0 libwebpmux3 libavif16 libxslt1.1
    ```

## Setup
```bash
npm ci
npx playwright install
```

## Scripts
- `npm test`: run all tests (chromium project)
- `npm run test:headed`: run tests in headed mode
- `npm run test:ui`: open Playwright Test UI
- `npm run report`: open Playwright HTML report
- `npm run allure:generate`: generate Allure report
- `npm run allure:open`: serve Allure report

## Configuration
- Base URL: `https://www.saucedemo.com`
- Default credentials: `standard_user` / `secret_sauce`
- You can override via env vars:
  - `SAUCE_USERNAME`, `SAUCE_PASSWORD`
  - `CHECKOUT_FIRST_NAME`, `CHECKOUT_LAST_NAME`, `CHECKOUT_POSTAL_CODE`

## Running Tests
```bash
# headless (default)
npx playwright test

# headed
HEADLESS=false npm run test:headed

# generate and open html report
npm run report

# Allure report
npm run allure:generate
npm run allure:open
```

## Test Design
- Page Object Model in `src/pages`
- One E2E spec `tests/e2e/checkout.spec.ts` that:
  1. Logs in
  2. Selects 3 random products
  3. Verifies cart badge and cart contents
  4. Completes checkout and verifies success

## Reporting
- Playwright HTML report written to `playwright-report/`
- Allure results to `allure-results/`, report to `allure-report/`

## CI Note
In CI, prefer running only Chromium for speed and stability. You can extend `projects` in `playwright.config.ts` to include Firefox and WebKit if needed.


