import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { TEST_CREDENTIALS, CHECKOUT_INFO } from '../utils/testData';
import { waitForPageLoad, takeScreenshot } from '../utils/helpers';

test.describe('Sauce Labs Demo - Complete Checkout Flow', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
  });

  test('Complete checkout flow with 3 random items', async ({ page }) => {
    test.info().annotations.push({
      type: 'test_descr',
      description: 'Complete checkout flow: Login -> Add 3 random items -> Cart -> Checkout -> Complete order'
    });

    // Step 1: Navigate to login page and verify it's displayed
    await test.step('Navigate to login page', async () => {
      await loginPage.goto();
      await loginPage.verifyLoginPageIsDisplayed();
      await takeScreenshot(page, 'login-page');
    });

    // Step 2: Login with standard user
    await test.step('Login with standard user', async () => {
      await loginPage.login(
        TEST_CREDENTIALS.STANDARD_USER.username,
        TEST_CREDENTIALS.STANDARD_USER.password
      );
      await loginPage.verifySuccessfulLogin();
      await takeScreenshot(page, 'after-login');
    });

    // Step 3: Verify inventory page is displayed
    await test.step('Verify inventory page is displayed', async () => {
      await inventoryPage.verifyInventoryPageIsDisplayed();
      await waitForPageLoad(page);
    });

    // Step 4: Add 3 random products to cart
    await test.step('Add 3 random products to cart', async () => {
      const selectedIndices = await inventoryPage.addRandomProductsToCart(3);
      test.info().annotations.push({
        type: 'selected_products',
        description: `Selected product indices: ${selectedIndices.join(', ')}`
      });
      
      // Verify cart badge shows correct count
      await inventoryPage.verifyCartItemCount(3);
      await takeScreenshot(page, 'products-added-to-cart');
    });

    // Step 5: Navigate to cart
    await test.step('Navigate to cart', async () => {
      await inventoryPage.clickCart();
      await cartPage.verifyCartPageIsDisplayed();
      await takeScreenshot(page, 'cart-page');
    });

    // Step 6: Verify cart has 3 items
    await test.step('Verify cart has 3 items', async () => {
      await cartPage.verifyCartItemCount(3);
      
      // Get cart items for verification
      const cartItems = await cartPage.getCartItems();
      expect(cartItems.length).toBe(3);
      
      // Log cart items for debugging
      test.info().annotations.push({
        type: 'cart_items',
        description: `Cart items: ${cartItems.map(item => `${item.name} (${item.price})`).join(', ')}`
      });
    });

    // Step 7: Proceed to checkout
    await test.step('Proceed to checkout', async () => {
      await cartPage.proceedToCheckout();
      await checkoutPage.verifyCheckoutInfoPageIsDisplayed();
      await takeScreenshot(page, 'checkout-info-page');
    });

    // Step 8: Fill checkout information
    await test.step('Fill checkout information', async () => {
      await checkoutPage.completeCheckoutInfo(CHECKOUT_INFO.VALID);
      await checkoutPage.verifyCheckoutOverviewPageIsDisplayed();
      await takeScreenshot(page, 'checkout-overview');
    });

    // Step 9: Verify checkout overview details
    await test.step('Verify checkout overview details', async () => {
      // Verify total calculation is correct
      await checkoutPage.verifyTotalCalculation();
      
      // Get and log pricing details
      const itemTotal = await checkoutPage.getItemTotal();
      const taxAmount = await checkoutPage.getTaxAmount();
      const totalAmount = await checkoutPage.getTotalAmount();
      
      test.info().annotations.push({
        type: 'pricing',
        description: `Item Total: $${itemTotal}, Tax: $${taxAmount}, Total: $${totalAmount}`
      });
      
      expect(itemTotal).toBeGreaterThan(0);
      expect(taxAmount).toBeGreaterThan(0);
      expect(totalAmount).toBeGreaterThan(0);
    });

    // Step 10: Complete the order
    await test.step('Complete the order', async () => {
      await checkoutPage.finishOrder();
      await checkoutPage.verifyCheckoutCompletePageIsDisplayed();
      await takeScreenshot(page, 'order-complete');
    });

    // Step 11: Verify order completion
    await test.step('Verify order completion', async () => {
      // Verify success message
      await expect(page.locator('.complete-header')).toContainText('Thank you for your order!');
      await expect(page.locator('.complete-text')).toContainText('Your order has been dispatched');
      
      // Verify back to products button is available
      await expect(page.locator('[data-test="back-to-products"]')).toBeVisible();
    });
  });

  test('Verify product sorting functionality', async ({ page }) => {
    test.info().annotations.push({
      type: 'test_descr',
      description: 'Verify product sorting functionality on inventory page'
    });

    // Login
    await loginPage.goto();
    await loginPage.login(
      TEST_CREDENTIALS.STANDARD_USER.username,
      TEST_CREDENTIALS.STANDARD_USER.password
    );
    await inventoryPage.verifyInventoryPageIsDisplayed();

    // Test sorting by name A-Z
    await test.step('Sort products by name A-Z', async () => {
      await inventoryPage.sortProducts('az');
      await inventoryPage.verifyProductsSortedByNameAZ();
      await takeScreenshot(page, 'sorted-az');
    });

    // Test sorting by name Z-A
    await test.step('Sort products by name Z-A', async () => {
      await inventoryPage.sortProducts('za');
      await inventoryPage.verifyProductsSortedByNameZA();
      await takeScreenshot(page, 'sorted-za');
    });

    // Test sorting by price low to high
    await test.step('Sort products by price low to high', async () => {
      await inventoryPage.sortProducts('lohi');
      await inventoryPage.verifyProductsSortedByPriceLowToHigh();
      await takeScreenshot(page, 'sorted-lohi');
    });

    // Test sorting by price high to low
    await test.step('Sort products by price high to low', async () => {
      await inventoryPage.sortProducts('hilo');
      await inventoryPage.verifyProductsSortedByPriceHighToLow();
      await takeScreenshot(page, 'sorted-hilo');
    });
  });

  test('Verify cart functionality', async ({ page }) => {
    test.info().annotations.push({
      type: 'test_descr',
      description: 'Verify cart functionality: add items, remove items, continue shopping'
    });

    // Login
    await loginPage.goto();
    await loginPage.login(
      TEST_CREDENTIALS.STANDARD_USER.username,
      TEST_CREDENTIALS.STANDARD_USER.password
    );
    await inventoryPage.verifyInventoryPageIsDisplayed();

    // Add items to cart
    await test.step('Add items to cart', async () => {
      await inventoryPage.addRandomProductsToCart(2);
      await inventoryPage.verifyCartItemCount(2);
    });

    // Navigate to cart
    await test.step('Navigate to cart', async () => {
      await inventoryPage.clickCart();
      await cartPage.verifyCartPageIsDisplayed();
    });

    // Remove an item
    await test.step('Remove an item from cart', async () => {
      await cartPage.removeItemFromCart(0);
      await cartPage.verifyCartItemCount(1);
    });

    // Continue shopping
    await test.step('Continue shopping', async () => {
      await cartPage.continueShopping();
      await inventoryPage.verifyInventoryPageIsDisplayed();
    });

    // Verify cart count is maintained
    await test.step('Verify cart count is maintained', async () => {
      await inventoryPage.verifyCartItemCount(1);
    });
  });
});