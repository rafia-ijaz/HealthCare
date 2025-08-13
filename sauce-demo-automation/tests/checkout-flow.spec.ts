import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { InventoryPage } from '../src/pages/InventoryPage';
import { CartPage } from '../src/pages/CartPage';
import { CheckoutPage } from '../src/pages/CheckoutPage';
import { CheckoutOverviewPage } from '../src/pages/CheckoutOverviewPage';
import { CheckoutCompletePage } from '../src/pages/CheckoutCompletePage';
import { TEST_DATA } from '../src/data/testData';
import { TestHelpers } from '../src/utils/testHelpers';

test.describe('Sauce Labs Demo - Complete Checkout Flow', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;
  let checkoutOverviewPage: CheckoutOverviewPage;
  let checkoutCompletePage: CheckoutCompletePage;
  let selectedProducts: string[] = [];

  test.beforeEach(async ({ page }) => {
    // Initialize page objects
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    checkoutOverviewPage = new CheckoutOverviewPage(page);
    checkoutCompletePage = new CheckoutCompletePage(page);

    // Navigate to the application
    await loginPage.goto();
    await TestHelpers.waitForPageLoad(page);
  });

  test('Complete checkout flow with 3 random products', async ({ page }) => {
    TestHelpers.logTestStep('Starting complete checkout flow test');

    // Step 1: Login with valid credentials
    TestHelpers.logTestStep('Step 1: Logging in with standard user');
    await loginPage.expectLoginFormVisible();
    await loginPage.login(
      TEST_DATA.VALID_USERS.STANDARD_USER.username,
      TEST_DATA.VALID_USERS.STANDARD_USER.password
    );

    // Verify successful login and navigation to inventory page
    await inventoryPage.expectInventoryPageLoaded();
    await expect(page).toHaveURL(/.*inventory.html/);

    // Step 2: Verify products are loaded
    TestHelpers.logTestStep('Step 2: Verifying products are loaded');
    const productCount = await inventoryPage.getProductCount();
    expect(productCount).toBe(TEST_DATA.PRODUCT_COUNT);
    
    // Verify cart is empty initially
    await inventoryPage.expectCartItemCount(0);

    // Step 3: Add 3 random products to cart
    TestHelpers.logTestStep('Step 3: Adding 3 random products to cart');
    selectedProducts = await inventoryPage.addRandomProductsToCart(TEST_DATA.RANDOM_PRODUCTS_TO_ADD);
    
    // Verify products were added to cart
    expect(selectedProducts).toHaveLength(TEST_DATA.RANDOM_PRODUCTS_TO_ADD);
    await inventoryPage.expectCartItemCount(TEST_DATA.RANDOM_PRODUCTS_TO_ADD);
    
    // Take screenshot after adding products
    await TestHelpers.takeScreenshot(page, 'products-added-to-cart');

    // Step 4: Navigate to cart and verify items
    TestHelpers.logTestStep('Step 4: Navigating to cart and verifying items');
    await inventoryPage.goToCart();
    await cartPage.expectCartPageLoaded();
    
    // Verify correct items are in cart
    await cartPage.expectCartItemCount(TEST_DATA.RANDOM_PRODUCTS_TO_ADD);
    await cartPage.expectItemsInCart(selectedProducts);
    
    // Get cart item prices for later verification
    const cartItemPrices = await cartPage.getCartItemPrices();
    expect(cartItemPrices).toHaveLength(TEST_DATA.RANDOM_PRODUCTS_TO_ADD);

    // Step 5: Proceed to checkout
    TestHelpers.logTestStep('Step 5: Proceeding to checkout');
    await cartPage.proceedToCheckout();
    await checkoutPage.expectCheckoutPageLoaded();
    await checkoutPage.expectFormFieldsVisible();

    // Step 6: Fill checkout information
    TestHelpers.logTestStep('Step 6: Filling checkout information');
    await checkoutPage.fillCheckoutInformation(
      TEST_DATA.CHECKOUT_INFO.VALID.firstName,
      TEST_DATA.CHECKOUT_INFO.VALID.lastName,
      TEST_DATA.CHECKOUT_INFO.VALID.postalCode
    );

    // Step 7: Continue to checkout overview
    TestHelpers.logTestStep('Step 7: Continuing to checkout overview');
    await checkoutPage.continueToOverview();
    await checkoutOverviewPage.expectCheckoutOverviewPageLoaded();

    // Step 8: Verify checkout overview details
    TestHelpers.logTestStep('Step 8: Verifying checkout overview details');
    await checkoutOverviewPage.expectCartItemCount(TEST_DATA.RANDOM_PRODUCTS_TO_ADD);
    await checkoutOverviewPage.expectItemsInOverview(selectedProducts);
    await checkoutOverviewPage.expectPricingInformationVisible();

    // Verify pricing information
    const overviewItemPrices = await checkoutOverviewPage.getCartItemPrices();
    const subtotal = await checkoutOverviewPage.getSubtotal();
    const tax = await checkoutOverviewPage.getTax();
    const total = await checkoutOverviewPage.getTotal();

    // Verify prices match between cart and overview
    expect(overviewItemPrices).toEqual(cartItemPrices);

    // Verify subtotal calculation
    const calculatedSubtotal = TestHelpers.calculateTotalPrice(overviewItemPrices);
    const expectedSubtotalText = TestHelpers.formatPrice(calculatedSubtotal);
    expect(subtotal).toContain(expectedSubtotalText);

    // Verify total includes tax
    expect(total).toContain('Total: $');
    expect(parseFloat(total.replace(/[^0-9.]/g, ''))).toBeGreaterThan(calculatedSubtotal);

    // Take screenshot before completing order
    await TestHelpers.takeScreenshot(page, 'checkout-overview');

    // Step 9: Complete the order
    TestHelpers.logTestStep('Step 9: Completing the order');
    await checkoutOverviewPage.finishOrder();

    // Step 10: Verify order completion
    TestHelpers.logTestStep('Step 10: Verifying order completion');
    await checkoutCompletePage.expectCheckoutCompletePageLoaded();
    await checkoutCompletePage.expectOrderConfirmation();
    await checkoutCompletePage.expectCompletePageElementsVisible();

    // Verify success message
    await expect(checkoutCompletePage.completeHeader).toContainText('THANK YOU FOR YOUR ORDER');
    await expect(checkoutCompletePage.completeText).toContainText('Your order has been dispatched');

    // Take final screenshot
    await TestHelpers.takeScreenshot(page, 'order-completed');

    TestHelpers.logTestStep('Complete checkout flow test finished successfully');
  });

  test('Verify cart functionality and navigation', async ({ page }) => {
    TestHelpers.logTestStep('Starting cart functionality verification test');

    // Login
    await loginPage.login(
      TEST_DATA.VALID_USERS.STANDARD_USER.username,
      TEST_DATA.VALID_USERS.STANDARD_USER.password
    );
    await inventoryPage.expectInventoryPageLoaded();

    // Add products and verify cart badge
    selectedProducts = await inventoryPage.addRandomProductsToCart(2);
    await inventoryPage.expectCartItemCount(2);

    // Navigate to cart and verify items
    await inventoryPage.goToCart();
    await cartPage.expectCartPageLoaded();
    await cartPage.expectItemsInCart(selectedProducts);

    // Continue shopping and verify return to inventory
    await cartPage.continueShopping();
    await inventoryPage.expectInventoryPageLoaded();
    await inventoryPage.expectCartItemCount(2); // Cart should still have items

    TestHelpers.logTestStep('Cart functionality verification test completed');
  });

  test('Verify product sorting functionality', async ({ page }) => {
    TestHelpers.logTestStep('Starting product sorting verification test');

    // Login
    await loginPage.login(
      TEST_DATA.VALID_USERS.STANDARD_USER.username,
      TEST_DATA.VALID_USERS.STANDARD_USER.password
    );
    await inventoryPage.expectInventoryPageLoaded();

    // Get initial product names
    const initialProductNames = await inventoryPage.getProductNames();
    expect(initialProductNames).toHaveLength(TEST_DATA.PRODUCT_COUNT);

    // Sort by name A-Z
    await inventoryPage.sortProducts('az');
    const sortedAZ = await inventoryPage.getProductNames();
    expect(sortedAZ).toEqual([...initialProductNames].sort());

    // Sort by name Z-A
    await inventoryPage.sortProducts('za');
    const sortedZA = await inventoryPage.getProductNames();
    expect(sortedZA).toEqual([...initialProductNames].sort().reverse());

    // Sort by price low to high
    await inventoryPage.sortProducts('lohi');
    const prices = await inventoryPage.getProductPrices();
    const priceValues = prices.map(p => TestHelpers.extractPriceValue(p));
    const sortedPrices = [...priceValues].sort((a, b) => a - b);
    expect(priceValues).toEqual(sortedPrices);

    TestHelpers.logTestStep('Product sorting verification test completed');
  });
});