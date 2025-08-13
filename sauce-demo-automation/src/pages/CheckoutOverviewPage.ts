import { Page, Locator, expect } from '@playwright/test';

export class CheckoutOverviewPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly subtotal: Locator;
  readonly tax: Locator;
  readonly total: Locator;
  readonly finishButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('.cart_item');
    this.itemNames = page.locator('.inventory_item_name');
    this.itemPrices = page.locator('.inventory_item_price');
    this.subtotal = page.locator('.summary_subtotal_label');
    this.tax = page.locator('.summary_tax_label');
    this.total = page.locator('.summary_total_label');
    this.finishButton = page.locator('[data-test="finish"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
  }

  async expectCheckoutOverviewPageLoaded() {
    await expect(this.page).toHaveURL(/.*checkout-step-two.html/);
    await expect(this.page.locator('.title')).toContainText('Checkout: Overview');
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

  async getSubtotal(): Promise<string> {
    const subtotalText = await this.subtotal.textContent();
    return subtotalText ? subtotalText.trim() : '';
  }

  async getTax(): Promise<string> {
    const taxText = await this.tax.textContent();
    return taxText ? taxText.trim() : '';
  }

  async getTotal(): Promise<string> {
    const totalText = await this.total.textContent();
    return totalText ? totalText.trim() : '';
  }

  async finishOrder(): Promise<void> {
    await this.finishButton.click();
  }

  async cancelOrder(): Promise<void> {
    await this.cancelButton.click();
  }

  async expectItemsInOverview(expectedItems: string[]): Promise<void> {
    const actualItems = await this.getCartItemNames();
    expect(actualItems).toEqual(expect.arrayContaining(expectedItems));
  }

  async expectPricingInformationVisible(): Promise<void> {
    await expect(this.subtotal).toBeVisible();
    await expect(this.tax).toBeVisible();
    await expect(this.total).toBeVisible();
  }
}