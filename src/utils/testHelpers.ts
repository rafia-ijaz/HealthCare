import { Page } from '@playwright/test';

export class TestHelpers {
  /**
   * Wait for page to be fully loaded
   */
  static async waitForPageLoad(page: Page): Promise<void> {
    await page.waitForLoadState('networkidle');
  }

  /**
   * Generate random string for test data
   */
  static generateRandomString(length: number = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Generate random email for test data
   */
  static generateRandomEmail(): string {
    const randomString = this.generateRandomString(8);
    return `${randomString}@test.com`;
  }

  /**
   * Extract price value from price string (e.g., "$29.99" -> 29.99)
   */
  static extractPriceValue(priceString: string): number {
    const match = priceString.match(/\$(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : 0;
  }

  /**
   * Calculate total price from array of price strings
   */
  static calculateTotalPrice(prices: string[]): number {
    return prices.reduce((total, price) => {
      return total + this.extractPriceValue(price);
    }, 0);
  }

  /**
   * Format price for comparison (e.g., 29.99 -> "$29.99")
   */
  static formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }

  /**
   * Take screenshot with timestamp
   */
  static async takeScreenshot(page: Page, name: string): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await page.screenshot({ 
      path: `test-results/screenshots/${name}-${timestamp}.png`,
      fullPage: true 
    });
  }

  /**
   * Log test step with timestamp
   */
  static logTestStep(step: string): void {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${step}`);
  }
}