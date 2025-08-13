import { Page, expect } from '@playwright/test';

export class LoginPage {
  private page: Page;

  // Locators
  private usernameInput = '[data-test="username"]';
  private passwordInput = '[data-test="password"]';
  private loginButton = '[data-test="login-button"]';
  private errorMessage = '[data-test="error"]';

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to the login page
   */
  async goto() {
    await this.page.goto('/');
  }

  /**
   * Fill in login credentials
   * @param username - The username to enter
   * @param password - The password to enter
   */
  async fillCredentials(username: string, password: string) {
    await this.page.fill(this.usernameInput, username);
    await this.page.fill(this.passwordInput, password);
  }

  /**
   * Click the login button
   */
  async clickLogin() {
    await this.page.click(this.loginButton);
  }

  /**
   * Complete login process
   * @param username - The username to enter
   * @param password - The password to enter
   */
  async login(username: string, password: string) {
    await this.fillCredentials(username, password);
    await this.clickLogin();
  }

  /**
   * Verify that the login page is displayed
   */
  async verifyLoginPageIsDisplayed() {
    await expect(this.page.locator(this.usernameInput)).toBeVisible();
    await expect(this.page.locator(this.passwordInput)).toBeVisible();
    await expect(this.page.locator(this.loginButton)).toBeVisible();
  }

  /**
   * Verify error message is displayed
   * @param expectedMessage - The expected error message
   */
  async verifyErrorMessage(expectedMessage: string) {
    await expect(this.page.locator(this.errorMessage)).toBeVisible();
    await expect(this.page.locator(this.errorMessage)).toContainText(expectedMessage);
  }

  /**
   * Verify successful login by checking if we're redirected to inventory page
   */
  async verifySuccessfulLogin() {
    await expect(this.page).toHaveURL(/.*inventory\.html/);
  }
}