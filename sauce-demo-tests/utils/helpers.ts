import { Page, expect } from '@playwright/test';

/**
 * Wait for page to be fully loaded
 * @param page - Playwright page object
 */
export async function waitForPageLoad(page: Page) {
  await page.waitForLoadState('networkidle');
}

/**
 * Take a screenshot with timestamp
 * @param page - Playwright page object
 * @param name - Screenshot name
 */
export async function takeScreenshot(page: Page, name: string) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  await page.screenshot({ path: `test-results/${name}-${timestamp}.png` });
}

/**
 * Generate random string
 * @param length - Length of the string
 */
export function generateRandomString(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate random email
 */
export function generateRandomEmail(): string {
  return `test-${generateRandomString(6)}@example.com`;
}

/**
 * Format price string to number
 * @param priceString - Price string like "$29.99"
 */
export function parsePrice(priceString: string): number {
  return parseFloat(priceString.replace('$', ''));
}

/**
 * Verify URL contains expected path
 * @param page - Playwright page object
 * @param expectedPath - Expected path in URL
 */
export async function verifyUrlContains(page: Page, expectedPath: string) {
  await expect(page).toHaveURL(new RegExp(expectedPath));
}

/**
 * Wait for element to be visible and stable
 * @param page - Playwright page object
 * @param selector - Element selector
 * @param timeout - Timeout in milliseconds
 */
export async function waitForElementStable(
  page: Page, 
  selector: string, 
  timeout: number = 5000
) {
  await page.waitForSelector(selector, { state: 'visible', timeout });
  // Additional wait to ensure element is stable
  await page.waitForTimeout(500);
}