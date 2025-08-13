import { Page, Locator, expect } from '@playwright/test';

export class CheckoutInformationPage {
  readonly page: Page;
  readonly title: Locator;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('.title');
    this.firstName = page.locator('data-test=firstName');
    this.lastName = page.locator('data-test=lastName');
    this.postalCode = page.locator('data-test=postalCode');
    this.continueButton = page.locator('data-test=continue');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.title).toHaveText('Checkout: Your Information');
  }

  async fillInformation(first: string, last: string, postal: string): Promise<void> {
    await this.firstName.fill(first);
    await this.lastName.fill(last);
    await this.postalCode.fill(postal);
    await this.continueButton.click();
  }
}