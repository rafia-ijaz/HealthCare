import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { InventoryPage } from '../src/pages/InventoryPage';
import { CartPage } from '../src/pages/CartPage';
import { CheckoutPage } from '../src/pages/CheckoutPage';
import { TEST_DATA } from '../src/data/testData';
import { TestHelpers } from '../src/utils/testHelpers';

test.describe('Sauce Labs Demo - Checkout Validation', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);

    // Login and add products to cart
    await loginPage.goto();
    await TestHelpers.waitForPageLoad(page);
    await loginPage.login(
      TEST_DATA.VALID_USERS.STANDARD_USER.username,
      TEST_DATA.VALID_USERS.STANDARD_USER.password
    );
    await inventoryPage.expectInventoryPageLoaded();
    
    // Add a product to cart
    await inventoryPage.addRandomProductsToCart(1);
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.expectCheckoutPageLoaded();
  });

  test('Empty first name should show error', async ({ page }) => {
    TestHelpers.logTestStep('Testing empty first name validation');

    await checkoutPage.fillCheckoutInformation(
      '',
      TEST_DATA.CHECKOUT_INFO.VALID.lastName,
      TEST_DATA.CHECKOUT_INFO.VALID.postalCode
    );
    await checkoutPage.continueToOverview();

    await checkoutPage.expectErrorMessage(TEST_DATA.ERROR_MESSAGES.FIRST_NAME_REQUIRED);
  });

  test('Empty last name should show error', async ({ page }) => {
    TestHelpers.logTestStep('Testing empty last name validation');

    await checkoutPage.fillCheckoutInformation(
      TEST_DATA.CHECKOUT_INFO.VALID.firstName,
      '',
      TEST_DATA.CHECKOUT_INFO.VALID.postalCode
    );
    await checkoutPage.continueToOverview();

    await checkoutPage.expectErrorMessage(TEST_DATA.ERROR_MESSAGES.LAST_NAME_REQUIRED);
  });

  test('Empty postal code should show error', async ({ page }) => {
    TestHelpers.logTestStep('Testing empty postal code validation');

    await checkoutPage.fillCheckoutInformation(
      TEST_DATA.CHECKOUT_INFO.VALID.firstName,
      TEST_DATA.CHECKOUT_INFO.VALID.lastName,
      ''
    );
    await checkoutPage.continueToOverview();

    await checkoutPage.expectErrorMessage(TEST_DATA.ERROR_MESSAGES.POSTAL_CODE_REQUIRED);
  });

  test('All empty fields should show error', async ({ page }) => {
    TestHelpers.logTestStep('Testing all empty fields validation');

    await checkoutPage.fillCheckoutInformation('', '', '');
    await checkoutPage.continueToOverview();

    await checkoutPage.expectErrorMessage(TEST_DATA.ERROR_MESSAGES.FIRST_NAME_REQUIRED);
  });

  test('Cancel checkout should return to cart', async ({ page }) => {
    TestHelpers.logTestStep('Testing cancel checkout functionality');

    await checkoutPage.cancelCheckout();
    await cartPage.expectCartPageLoaded();
    await expect(page).toHaveURL(/.*cart.html/);
  });

  test('Valid checkout information should proceed to overview', async ({ page }) => {
    TestHelpers.logTestStep('Testing valid checkout information');

    await checkoutPage.fillCheckoutInformation(
      TEST_DATA.CHECKOUT_INFO.VALID.firstName,
      TEST_DATA.CHECKOUT_INFO.VALID.lastName,
      TEST_DATA.CHECKOUT_INFO.VALID.postalCode
    );
    await checkoutPage.continueToOverview();

    await expect(page).toHaveURL(/.*checkout-step-two.html/);
  });
});