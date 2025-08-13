import { Page, expect } from '@playwright/test';
import { Product } from './InventoryPage';

export interface CartItem {
  name: string;
  price: string;
  quantity: number;
}

export class CartPage {
  private page: Page;

  // Locators
  private cartItems = '.cart_item';
  private itemNames = '.inventory_item_name';
  private itemPrices = '.inventory_item_price';
  private itemQuantities = '.cart_quantity';
  private removeButtons = '[data-test^="remove-"]';
  private continueShoppingButton = '[data-test="continue-shopping"]';
  private checkoutButton = '[data-test="checkout"]';
  private cartTitle = '.title';

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Get all cart items
   */
  async getCartItems(): Promise<CartItem[]> {
    const items = await this.page.locator(this.cartItems).all();
    const cartItems: CartItem[] = [];

    for (const item of items) {
      const name = await item.locator(this.itemNames).textContent() || '';
      const price = await item.locator(this.itemPrices).textContent() || '';
      const quantityText = await item.locator(this.itemQuantities).textContent() || '1';
      const quantity = parseInt(quantityText, 10);

      cartItems.push({ name, price, quantity });
    }

    return cartItems;
  }

  /**
   * Get cart item count
   */
  async getCartItemCount(): Promise<number> {
    return await this.page.locator(this.cartItems).count();
  }

  /**
   * Verify cart has expected number of items
   * @param expectedCount - Expected number of items
   */
  async verifyCartItemCount(expectedCount: number) {
    const actualCount = await this.getCartItemCount();
    expect(actualCount).toBe(expectedCount);
  }

  /**
   * Verify specific product is in cart
   * @param productName - Name of the product to verify
   */
  async verifyProductInCart(productName: string) {
    const cartItems = await this.getCartItems();
    const found = cartItems.some(item => item.name === productName);
    expect(found).toBe(true);
  }

  /**
   * Remove item from cart by index
   * @param index - Index of the item to remove (0-based)
   */
  async removeItemFromCart(index: number) {
    const removeButtons = await this.page.locator(this.removeButtons).all();
    if (index >= removeButtons.length) {
      throw new Error(`Item index ${index} is out of range. Total items: ${removeButtons.length}`);
    }
    await removeButtons[index].click();
  }

  /**
   * Click continue shopping button
   */
  async continueShopping() {
    await this.page.click(this.continueShoppingButton);
  }

  /**
   * Click checkout button
   */
  async proceedToCheckout() {
    await this.page.click(this.checkoutButton);
  }

  /**
   * Verify cart page is displayed
   */
  async verifyCartPageIsDisplayed() {
    await expect(this.page).toHaveURL(/.*cart\.html/);
    await expect(this.page.locator(this.cartTitle)).toContainText('Your Cart');
  }

  /**
   * Verify cart is empty
   */
  async verifyCartIsEmpty() {
    const itemCount = await this.getCartItemCount();
    expect(itemCount).toBe(0);
  }

  /**
   * Calculate total price of items in cart
   */
  async calculateTotalPrice(): Promise<number> {
    const cartItems = await this.getCartItems();
    let total = 0;

    for (const item of cartItems) {
      const price = parseFloat(item.price.replace('$', ''));
      total += price * item.quantity;
    }

    return total;
  }

  /**
   * Verify total price matches expected value
   * @param expectedTotal - Expected total price
   */
  async verifyTotalPrice(expectedTotal: number) {
    const actualTotal = await this.calculateTotalPrice();
    expect(actualTotal).toBe(expectedTotal);
  }
}