import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly title: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('.title');
    this.checkoutButton = page.locator('data-test=checkout');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.title).toHaveText('Your Cart');
  }

  async expectItemsPresent(names: string[]): Promise<void> {
    for (const name of names) {
      await expect(this.page.locator('.cart_item .inventory_item_name', { hasText: name })).toBeVisible();
    }
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
}