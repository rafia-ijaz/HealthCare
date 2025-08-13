import { Page, Locator, expect } from '@playwright/test';

export class CheckoutCompletePage {
  readonly page: Page;
  readonly title: Locator;
  readonly header: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('.title');
    this.header = page.locator('.complete-header');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.title).toHaveText('Checkout: Complete!');
    await expect(this.header).toHaveText('Thank you for your order!');
  }
}