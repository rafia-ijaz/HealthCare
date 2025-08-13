import { Page, expect } from '@playwright/test';

export interface Product {
  name: string;
  price: string;
  description: string;
}

export class InventoryPage {
  private page: Page;

  // Locators
  private productItems = '.inventory_item';
  private productNames = '.inventory_item_name';
  private productPrices = '.inventory_item_price';
  private addToCartButtons = '[data-test^="add-to-cart-"]';
  private removeButtons = '[data-test^="remove-"]';
  private cartBadge = '.shopping_cart_badge';
  private cartLink = '.shopping_cart_link';
  private sortDropdown = '[data-test="product_sort_container"]';
  private menuButton = '#react-burger-menu-btn';
  private logoutLink = '#logout_sidebar_link';

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Get all product items on the page
   */
  async getProductItems() {
    return await this.page.locator(this.productItems).all();
  }

  /**
   * Get product information by index
   * @param index - The index of the product (0-based)
   */
  async getProductByIndex(index: number): Promise<Product> {
    const products = await this.page.locator(this.productItems).all();
    if (index >= products.length) {
      throw new Error(`Product index ${index} is out of range. Total products: ${products.length}`);
    }

    const product = products[index];
    const name = await product.locator(this.productNames).textContent() || '';
    const price = await product.locator(this.productPrices).textContent() || '';
    const description = await product.locator('.inventory_item_desc').textContent() || '';

    return { name, price, description };
  }

  /**
   * Add product to cart by index
   * @param index - The index of the product to add (0-based)
   */
  async addProductToCart(index: number) {
    const addButtons = await this.page.locator(this.addToCartButtons).all();
    if (index >= addButtons.length) {
      throw new Error(`Product index ${index} is out of range. Total products: ${addButtons.length}`);
    }
    await addButtons[index].click();
  }

  /**
   * Add multiple random products to cart
   * @param count - Number of products to add (default: 3)
   */
  async addRandomProductsToCart(count: number = 3) {
    const totalProducts = await this.page.locator(this.productItems).count();
    const productsToAdd = Math.min(count, totalProducts);
    
    // Generate random indices
    const indices = this.generateRandomIndices(totalProducts, productsToAdd);
    
    for (const index of indices) {
      await this.addProductToCart(index);
    }

    return indices;
  }

  /**
   * Generate random indices for product selection
   * @param max - Maximum number of products
   * @param count - Number of indices to generate
   */
  private generateRandomIndices(max: number, count: number): number[] {
    const indices = Array.from({ length: max }, (_, i) => i);
    const selected: number[] = [];
    
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * indices.length);
      selected.push(indices.splice(randomIndex, 1)[0]);
    }
    
    return selected;
  }

  /**
   * Get cart item count
   */
  async getCartItemCount(): Promise<number> {
    const badge = this.page.locator(this.cartBadge);
    if (await badge.isVisible()) {
      const countText = await badge.textContent();
      return parseInt(countText || '0', 10);
    }
    return 0;
  }

  /**
   * Verify cart badge shows correct count
   * @param expectedCount - Expected number of items in cart
   */
  async verifyCartItemCount(expectedCount: number) {
    if (expectedCount > 0) {
      await expect(this.page.locator(this.cartBadge)).toBeVisible();
      await expect(this.page.locator(this.cartBadge)).toHaveText(expectedCount.toString());
    } else {
      await expect(this.page.locator(this.cartBadge)).not.toBeVisible();
    }
  }

  /**
   * Click on cart link
   */
  async clickCart() {
    await this.page.click(this.cartLink);
  }

  /**
   * Sort products by option
   * @param option - Sort option (az, za, lohi, hilo)
   */
  async sortProducts(option: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.page.selectOption(this.sortDropdown, option);
  }

  /**
   * Verify products are sorted by name (A-Z)
   */
  async verifyProductsSortedByNameAZ() {
    const productNames = await this.page.locator(this.productNames).allTextContents();
    const sortedNames = [...productNames].sort();
    expect(productNames).toEqual(sortedNames);
  }

  /**
   * Verify products are sorted by name (Z-A)
   */
  async verifyProductsSortedByNameZA() {
    const productNames = await this.page.locator(this.productNames).allTextContents();
    const sortedNames = [...productNames].sort().reverse();
    expect(productNames).toEqual(sortedNames);
  }

  /**
   * Verify products are sorted by price (low to high)
   */
  async verifyProductsSortedByPriceLowToHigh() {
    const priceElements = await this.page.locator(this.productPrices).all();
    const prices = await Promise.all(
      priceElements.map(async (el) => {
        const priceText = await el.textContent() || '';
        return parseFloat(priceText.replace('$', ''));
      })
    );
    
    const sortedPrices = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sortedPrices);
  }

  /**
   * Verify products are sorted by price (high to low)
   */
  async verifyProductsSortedByPriceHighToLow() {
    const priceElements = await this.page.locator(this.productPrices).all();
    const prices = await Promise.all(
      priceElements.map(async (el) => {
        const priceText = await el.textContent() || '';
        return parseFloat(priceText.replace('$', ''));
      })
    );
    
    const sortedPrices = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sortedPrices);
  }

  /**
   * Logout from the application
   */
  async logout() {
    await this.page.click(this.menuButton);
    await this.page.click(this.logoutLink);
  }

  /**
   * Verify inventory page is displayed
   */
  async verifyInventoryPageIsDisplayed() {
    await expect(this.page).toHaveURL(/.*inventory\.html/);
    await expect(this.page.locator('.inventory_list')).toBeVisible();
  }
}