import { Page, Locator, expect } from '@playwright/test';

export type InventoryItem = {
  name: string;
  price: number;
};

export class InventoryPage {
  readonly page: Page;
  readonly title: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('.title');
    this.cartLink = page.locator('.shopping_cart_link');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.title).toHaveText('Products');
  }

  async getAllItems(): Promise<InventoryItem[]> {
    const items = this.page.locator('.inventory_item');
    const count = await items.count();
    const results: InventoryItem[] = [];
    for (let index = 0; index < count; index++) {
      const item = items.nth(index);
      const name = await item.locator('.inventory_item_name').innerText();
      const priceText = await item.locator('.inventory_item_price').innerText();
      const price = parseFloat(priceText.replace('$', ''));
      results.push({ name, price });
    }
    return results;
  }

  async addItemsToCartByNames(names: string[]): Promise<void> {
    for (const name of names) {
      const container = this.page.locator('.inventory_item').filter({ has: this.page.locator('.inventory_item_name', { hasText: name }) });
      const addButton = container.getByRole('button', { name: 'Add to cart' });
      await addButton.click();
      const toggleButton = container.getByRole('button');
      await expect(toggleButton).toHaveText('Remove');
    }
  }

  async goToCart(): Promise<void> {
    await this.cartLink.click();
  }
}