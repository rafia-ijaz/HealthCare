import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { TEST_CREDENTIALS, ERROR_MESSAGES } from '../utils/testData';
import { takeScreenshot } from '../utils/helpers';

test.describe('Sauce Labs Demo - Login Functionality', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
  });

  test('Successful login with standard user', async ({ page }) => {
    test.info().annotations.push({
      type: 'test_descr',
      description: 'Verify successful login with standard user credentials'
    });

    await test.step('Navigate to login page', async () => {
      await loginPage.goto();
      await loginPage.verifyLoginPageIsDisplayed();
    });

    await test.step('Login with standard user', async () => {
      await loginPage.login(
        TEST_CREDENTIALS.STANDARD_USER.username,
        TEST_CREDENTIALS.STANDARD_USER.password
      );
      await loginPage.verifySuccessfulLogin();
      await takeScreenshot(page, 'successful-login');
    });
  });

  test('Failed login with locked out user', async ({ page }) => {
    test.info().annotations.push({
      type: 'test_descr',
      description: 'Verify error message when logging in with locked out user'
    });

    await test.step('Navigate to login page', async () => {
      await loginPage.goto();
      await loginPage.verifyLoginPageIsDisplayed();
    });

    await test.step('Login with locked out user', async () => {
      await loginPage.login(
        TEST_CREDENTIALS.LOCKED_OUT_USER.username,
        TEST_CREDENTIALS.LOCKED_OUT_USER.password
      );
      await loginPage.verifyErrorMessage(ERROR_MESSAGES.LOCKED_OUT);
      await takeScreenshot(page, 'locked-out-error');
    });
  });

  test('Failed login with invalid credentials', async ({ page }) => {
    test.info().annotations.push({
      type: 'test_descr',
      description: 'Verify error message when logging in with invalid credentials'
    });

    await test.step('Navigate to login page', async () => {
      await loginPage.goto();
      await loginPage.verifyLoginPageIsDisplayed();
    });

    await test.step('Login with invalid credentials', async () => {
      await loginPage.login('invalid_user', 'invalid_password');
      await loginPage.verifyErrorMessage(ERROR_MESSAGES.INVALID_CREDENTIALS);
      await takeScreenshot(page, 'invalid-credentials-error');
    });
  });

  test('Login with empty credentials', async ({ page }) => {
    test.info().annotations.push({
      type: 'test_descr',
      description: 'Verify error message when logging in with empty credentials'
    });

    await test.step('Navigate to login page', async () => {
      await loginPage.goto();
      await loginPage.verifyLoginPageIsDisplayed();
    });

    await test.step('Login with empty credentials', async () => {
      await loginPage.login('', '');
      await loginPage.verifyErrorMessage(ERROR_MESSAGES.INVALID_CREDENTIALS);
      await takeScreenshot(page, 'empty-credentials-error');
    });
  });

  test('Login with problem user', async ({ page }) => {
    test.info().annotations.push({
      type: 'test_descr',
      description: 'Verify login with problem user (may have UI issues)'
    });

    await test.step('Navigate to login page', async () => {
      await loginPage.goto();
      await loginPage.verifyLoginPageIsDisplayed();
    });

    await test.step('Login with problem user', async () => {
      await loginPage.login(
        TEST_CREDENTIALS.PROBLEM_USER.username,
        TEST_CREDENTIALS.PROBLEM_USER.password
      );
      await loginPage.verifySuccessfulLogin();
      await takeScreenshot(page, 'problem-user-login');
    });
  });

  test('Login with performance glitch user', async ({ page }) => {
    test.info().annotations.push({
      type: 'test_descr',
      description: 'Verify login with performance glitch user (may have delays)'
    });

    await test.step('Navigate to login page', async () => {
      await loginPage.goto();
      await loginPage.verifyLoginPageIsDisplayed();
    });

    await test.step('Login with performance glitch user', async () => {
      await loginPage.login(
        TEST_CREDENTIALS.PERFORMANCE_GLITCH_USER.username,
        TEST_CREDENTIALS.PERFORMANCE_GLITCH_USER.password
      );
      await loginPage.verifySuccessfulLogin();
      await takeScreenshot(page, 'performance-glitch-user-login');
    });
  });
});