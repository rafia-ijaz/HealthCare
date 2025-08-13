import { Page, expect } from '@playwright/test';

export interface CheckoutInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export class CheckoutPage {
  private page: Page;

  // Locators
  private firstNameInput = '[data-test="firstName"]';
  private lastNameInput = '[data-test="lastName"]';
  private postalCodeInput = '[data-test="postalCode"]';
  private continueButton = '[data-test="continue"]';
  private cancelButton = '[data-test="cancel"]';
  private checkoutTitle = '.title';
  private errorMessage = '[data-test="error"]';

  // Checkout overview locators
  private itemTotal = '.summary_subtotal_label';
  private taxAmount = '.summary_tax_label';
  private totalAmount = '.summary_total_label';
  private finishButton = '[data-test="finish"]';

  // Checkout complete locators
  private completeHeader = '.complete-header';
  private completeText = '.complete-text';
  private backHomeButton = '[data-test="back-to-products"]';

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Fill checkout information
   * @param info - Checkout information object
   */
  async fillCheckoutInfo(info: CheckoutInfo) {
    await this.page.fill(this.firstNameInput, info.firstName);
    await this.page.fill(this.lastNameInput, info.lastName);
    await this.page.fill(this.postalCodeInput, info.postalCode);
  }

  /**
   * Click continue button
   */
  async continue() {
    await this.page.click(this.continueButton);
  }

  /**
   * Click cancel button
   */
  async cancel() {
    await this.page.click(this.cancelButton);
  }

  /**
   * Complete checkout information step
   * @param info - Checkout information object
   */
  async completeCheckoutInfo(info: CheckoutInfo) {
    await this.fillCheckoutInfo(info);
    await this.continue();
  }

  /**
   * Verify checkout information page is displayed
   */
  async verifyCheckoutInfoPageIsDisplayed() {
    await expect(this.page).toHaveURL(/.*checkout-step-one\.html/);
    await expect(this.page.locator(this.checkoutTitle)).toContainText('Checkout: Your Information');
    await expect(this.page.locator(this.firstNameInput)).toBeVisible();
    await expect(this.page.locator(this.lastNameInput)).toBeVisible();
    await expect(this.page.locator(this.postalCodeInput)).toBeVisible();
  }

  /**
   * Verify error message is displayed
   * @param expectedMessage - Expected error message
   */
  async verifyErrorMessage(expectedMessage: string) {
    await expect(this.page.locator(this.errorMessage)).toBeVisible();
    await expect(this.page.locator(this.errorMessage)).toContainText(expectedMessage);
  }

  /**
   * Verify checkout overview page is displayed
   */
  async verifyCheckoutOverviewPageIsDisplayed() {
    await expect(this.page).toHaveURL(/.*checkout-step-two\.html/);
    await expect(this.page.locator(this.checkoutTitle)).toContainText('Checkout: Overview');
    await expect(this.page.locator(this.itemTotal)).toBeVisible();
    await expect(this.page.locator(this.taxAmount)).toBeVisible();
    await expect(this.page.locator(this.totalAmount)).toBeVisible();
    await expect(this.page.locator(this.finishButton)).toBeVisible();
  }

  /**
   * Get item total from checkout overview
   */
  async getItemTotal(): Promise<number> {
    const itemTotalText = await this.page.locator(this.itemTotal).textContent() || '';
    const match = itemTotalText.match(/\$(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : 0;
  }

  /**
   * Get tax amount from checkout overview
   */
  async getTaxAmount(): Promise<number> {
    const taxText = await this.page.locator(this.taxAmount).textContent() || '';
    const match = taxText.match(/\$(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : 0;
  }

  /**
   * Get total amount from checkout overview
   */
  async getTotalAmount(): Promise<number> {
    const totalText = await this.page.locator(this.totalAmount).textContent() || '';
    const match = totalText.match(/\$(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : 0;
  }

  /**
   * Verify total calculation is correct
   */
  async verifyTotalCalculation() {
    const itemTotal = await this.getItemTotal();
    const taxAmount = await this.getTaxAmount();
    const totalAmount = await this.getTotalAmount();
    
    const calculatedTotal = itemTotal + taxAmount;
    expect(totalAmount).toBe(calculatedTotal);
  }

  /**
   * Click finish button to complete order
   */
  async finishOrder() {
    await this.page.click(this.finishButton);
  }

  /**
   * Verify checkout complete page is displayed
   */
  async verifyCheckoutCompletePageIsDisplayed() {
    await expect(this.page).toHaveURL(/.*checkout-complete\.html/);
    await expect(this.page.locator(this.completeHeader)).toContainText('Thank you for your order!');
    await expect(this.page.locator(this.completeText)).toContainText('Your order has been dispatched');
    await expect(this.page.locator(this.backHomeButton)).toBeVisible();
  }

  /**
   * Click back to products button
   */
  async backToProducts() {
    await this.page.click(this.backHomeButton);
  }

  /**
   * Complete the entire checkout process
   * @param info - Checkout information object
   */
  async completeCheckoutProcess(info: CheckoutInfo) {
    await this.completeCheckoutInfo(info);
    await this.verifyCheckoutOverviewPageIsDisplayed();
    await this.verifyTotalCalculation();
    await this.finishOrder();
    await this.verifyCheckoutCompletePageIsDisplayed();
  }
}