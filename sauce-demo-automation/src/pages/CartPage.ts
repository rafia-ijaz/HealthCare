import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly removeButtons: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly itemQuantities: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.removeButtons = page.locator('[data-test^="remove-"]');
    this.itemNames = page.locator('.inventory_item_name');
    this.itemPrices = page.locator('.inventory_item_price');
    this.itemQuantities = page.locator('.cart_quantity');
  }

  async expectCartPageLoaded() {
    await expect(this.page).toHaveURL(/.*cart.html/);
    await expect(this.page.locator('.title')).toContainText('Your Cart');
  }

  async getCartItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  async expectCartItemCount(expectedCount: number): Promise<void> {
    await expect(this.cartItems).toHaveCount(expectedCount);
  }

  async getCartItemNames(): Promise<string[]> {
    const names = await this.itemNames.allTextContents();
    return names.map(name => name.trim());
  }

  async getCartItemPrices(): Promise<string[]> {
    const prices = await this.itemPrices.allTextContents();
    return prices.map(price => price.trim());
  }

  async removeItem(itemName: string): Promise<void> {
    const item = this.cartItems.filter({ hasText: itemName }).first();
    const removeButton = item.locator('[data-test^="remove-"]');
    await removeButton.click();
  }

  async removeAllItems(): Promise<void> {
    const removeButtons = await this.removeButtons.all();
    for (const button of removeButtons) {
      await button.click();
    }
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async expectItemsInCart(expectedItems: string[]): Promise<void> {
    const actualItems = await this.getCartItemNames();
    expect(actualItems).toEqual(expect.arrayContaining(expectedItems));
  }

  async expectCartEmpty(): Promise<void> {
    await expect(this.cartItems).toHaveCount(0);
  }
}