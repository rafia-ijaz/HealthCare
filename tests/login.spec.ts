import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { InventoryPage } from '../src/pages/InventoryPage';
import { TEST_DATA } from '../src/data/testData';
import { TestHelpers } from '../src/utils/testHelpers';

test.describe('Sauce Labs Demo - Login Functionality', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.goto();
    await TestHelpers.waitForPageLoad(page);
  });

  test('Successful login with standard user', async ({ page }) => {
    TestHelpers.logTestStep('Testing successful login with standard user');

    await loginPage.expectLoginFormVisible();
    await loginPage.login(
      TEST_DATA.VALID_USERS.STANDARD_USER.username,
      TEST_DATA.VALID_USERS.STANDARD_USER.password
    );

    await inventoryPage.expectInventoryPageLoaded();
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('Successful login with problem user', async ({ page }) => {
    TestHelpers.logTestStep('Testing successful login with problem user');

    await loginPage.expectLoginFormVisible();
    await loginPage.login(
      TEST_DATA.VALID_USERS.PROBLEM_USER.username,
      TEST_DATA.VALID_USERS.PROBLEM_USER.password
    );

    await inventoryPage.expectInventoryPageLoaded();
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('Successful login with performance glitch user', async ({ page }) => {
    TestHelpers.logTestStep('Testing successful login with performance glitch user');

    await loginPage.expectLoginFormVisible();
    await loginPage.login(
      TEST_DATA.VALID_USERS.PERFORMANCE_GLITCH_USER.username,
      TEST_DATA.VALID_USERS.PERFORMANCE_GLITCH_USER.password
    );

    await inventoryPage.expectInventoryPageLoaded();
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('Locked out user should show error message', async ({ page }) => {
    TestHelpers.logTestStep('Testing locked out user error');

    await loginPage.expectLoginFormVisible();
    await loginPage.login(
      TEST_DATA.INVALID_USERS.LOCKED_OUT_USER.username,
      TEST_DATA.INVALID_USERS.LOCKED_OUT_USER.password
    );

    await loginPage.expectErrorMessage(TEST_DATA.ERROR_MESSAGES.LOCKED_OUT);
    await expect(page).toHaveURL('/');
  });

  test('Invalid credentials should show error message', async ({ page }) => {
    TestHelpers.logTestStep('Testing invalid credentials error');

    await loginPage.expectLoginFormVisible();
    await loginPage.login('invalid_user', 'invalid_password');

    await loginPage.expectErrorMessage(TEST_DATA.ERROR_MESSAGES.INVALID_CREDENTIALS);
    await expect(page).toHaveURL('/');
  });

  test('Empty username should show error message', async ({ page }) => {
    TestHelpers.logTestStep('Testing empty username error');

    await loginPage.expectLoginFormVisible();
    await loginPage.login('', TEST_DATA.VALID_USERS.STANDARD_USER.password);

    await loginPage.expectErrorMessage(TEST_DATA.ERROR_MESSAGES.INVALID_CREDENTIALS);
    await expect(page).toHaveURL('/');
  });

  test('Empty password should show error message', async ({ page }) => {
    TestHelpers.logTestStep('Testing empty password error');

    await loginPage.expectLoginFormVisible();
    await loginPage.login(TEST_DATA.VALID_USERS.STANDARD_USER.username, '');

    await loginPage.expectErrorMessage(TEST_DATA.ERROR_MESSAGES.INVALID_CREDENTIALS);
    await expect(page).toHaveURL('/');
  });
});