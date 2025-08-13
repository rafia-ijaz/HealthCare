import { Page, Locator, expect } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly productItems: Locator;
  readonly addToCartButtons: Locator;
  readonly removeButtons: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;
  readonly sortDropdown: Locator;
  readonly productNames: Locator;
  readonly productPrices: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productItems = page.locator('.inventory_item');
    this.addToCartButtons = page.locator('[data-test^="add-to-cart-"]');
    this.removeButtons = page.locator('[data-test^="remove-"]');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
    this.sortDropdown = page.locator('[data-test="product_sort_container"]');
    this.productNames = page.locator('.inventory_item_name');
    this.productPrices = page.locator('.inventory_item_price');
  }

  async expectInventoryPageLoaded() {
    await expect(this.page).toHaveURL(/.*inventory.html/);
    await expect(this.productItems.first()).toBeVisible();
  }

  async getProductCount(): Promise<number> {
    return await this.productItems.count();
  }

  async addRandomProductsToCart(count: number = 3): Promise<string[]> {
    const totalProducts = await this.getProductCount();
    const selectedIndices = this.getRandomIndices(totalProducts, count);
    const addedProductNames: string[] = [];

    for (const index of selectedIndices) {
      const productItem = this.productItems.nth(index);
      const productName = await productItem.locator('.inventory_item_name').textContent();
      const addButton = productItem.locator('[data-test^="add-to-cart-"]');
      
      await addButton.click();
      if (productName) {
        addedProductNames.push(productName.trim());
      }
    }

    return addedProductNames;
  }

  async addSpecificProductToCart(productName: string): Promise<void> {
    const productItem = this.productItems.filter({ hasText: productName }).first();
    const addButton = productItem.locator('[data-test^="add-to-cart-"]');
    await addButton.click();
  }

  async getCartItemCount(): Promise<number> {
    const badgeText = await this.cartBadge.textContent();
    return badgeText ? parseInt(badgeText) : 0;
  }

  async expectCartItemCount(expectedCount: number): Promise<void> {
    await expect(this.cartBadge).toHaveText(expectedCount.toString());
  }

  async goToCart(): Promise<void> {
    await this.cartLink.click();
  }

  async sortProducts(sortOption: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.sortDropdown.selectOption(sortOption);
  }

  async getProductNames(): Promise<string[]> {
    const names = await this.productNames.allTextContents();
    return names.map(name => name.trim());
  }

  async getProductPrices(): Promise<string[]> {
    const prices = await this.productPrices.allTextContents();
    return prices.map(price => price.trim());
  }

  private getRandomIndices(max: number, count: number): number[] {
    const indices = Array.from({ length: max }, (_, i) => i);
    const selected: number[] = [];
    
    for (let i = 0; i < count && indices.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * indices.length);
      selected.push(indices.splice(randomIndex, 1)[0]);
    }
    
    return selected;
  }
}