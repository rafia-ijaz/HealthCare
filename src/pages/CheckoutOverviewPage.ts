import { Page, Locator, expect } from '@playwright/test';

export class CheckoutOverviewPage {
  readonly page: Page;
  readonly title: Locator;
  readonly finishButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('.title');
    this.finishButton = page.locator('data-test=finish');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.title).toHaveText('Checkout: Overview');
  }

  async expectItemsPresent(names: string[]): Promise<void> {
    for (const name of names) {
      await expect(this.page.locator('.cart_item .inventory_item_name', { hasText: name })).toBeVisible();
    }
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }
}