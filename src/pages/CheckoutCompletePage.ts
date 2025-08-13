import { Page, Locator, expect } from '@playwright/test';

export class CheckoutCompletePage {
  readonly page: Page;
  readonly completeHeader: Locator;
  readonly completeText: Locator;
  readonly ponyExpressImage: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.completeHeader = page.locator('.complete-header');
    this.completeText = page.locator('.complete-text');
    this.ponyExpressImage = page.locator('.pony_express');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }

  async expectCheckoutCompletePageLoaded() {
    await expect(this.page).toHaveURL(/.*checkout-complete.html/);
    await expect(this.page.locator('.title')).toContainText('Checkout: Complete!');
  }

  async expectOrderConfirmation() {
    await expect(this.completeHeader).toContainText('THANK YOU FOR YOUR ORDER');
    await expect(this.completeText).toContainText('Your order has been dispatched');
    await expect(this.ponyExpressImage).toBeVisible();
  }

  async backToProducts(): Promise<void> {
    await this.backHomeButton.click();
  }

  async expectCompletePageElementsVisible(): Promise<void> {
    await expect(this.completeHeader).toBeVisible();
    await expect(this.completeText).toBeVisible();
    await expect(this.ponyExpressImage).toBeVisible();
    await expect(this.backHomeButton).toBeVisible();
  }
}