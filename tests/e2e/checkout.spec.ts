import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { InventoryPage } from '../../src/pages/InventoryPage';
import { CartPage } from '../../src/pages/CartPage';
import { CheckoutInformationPage } from '../../src/pages/CheckoutInformationPage';
import { CheckoutOverviewPage } from '../../src/pages/CheckoutOverviewPage';
import { CheckoutCompletePage } from '../../src/pages/CheckoutCompletePage';
import { pickNUniqueRandom } from '../../src/utils/random';

const USERNAME = process.env.SAUCE_USERNAME || 'standard_user';
const PASSWORD = process.env.SAUCE_PASSWORD || 'secret_sauce';

const FIRST_NAME = process.env.CHECKOUT_FIRST_NAME || 'John';
const LAST_NAME = process.env.CHECKOUT_LAST_NAME || 'Doe';
const POSTAL_CODE = process.env.CHECKOUT_POSTAL_CODE || '12345';

test.describe('Successful checkout flow with 3 random items', () => {
  test('should add three random items to cart and complete checkout', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const infoPage = new CheckoutInformationPage(page);
    const overviewPage = new CheckoutOverviewPage(page);
    const completePage = new CheckoutCompletePage(page);

    // Login
    await loginPage.goto();
    await loginPage.login(USERNAME, PASSWORD);

    // Inventory
    await inventoryPage.expectLoaded();
    const allItems = await inventoryPage.getAllItems();
    expect(allItems.length).toBeGreaterThanOrEqual(3);

    const selectedItems = pickNUniqueRandom(allItems, 3);
    const selectedNames = selectedItems.map((i) => i.name);

    await inventoryPage.addItemsToCartByNames(selectedNames);

    // Assert cart badge shows 3
    await expect(page.locator('.shopping_cart_badge')).toHaveText('3');

    // Go to cart
    await inventoryPage.goToCart();

    // Cart page
    await cartPage.expectLoaded();
    await cartPage.expectItemsPresent(selectedNames);

    await cartPage.proceedToCheckout();

    // Checkout information
    await infoPage.expectLoaded();
    await infoPage.fillInformation(FIRST_NAME, LAST_NAME, POSTAL_CODE);

    // Overview
    await overviewPage.expectLoaded();
    await overviewPage.expectItemsPresent(selectedNames);
    await overviewPage.finish();

    // Complete
    await completePage.expectLoaded();
  });
});