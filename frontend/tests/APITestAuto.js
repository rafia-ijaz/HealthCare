// tests/api.spec.js
const { test, expect, request } = require('@playwright/test');

test.describe('Healthcare API', () => {
  let apiContext;

  test.beforeAll(async ({ playwright }) => {
    apiContext = await request.newContext({
      baseURL: 'http://localhost:5000'
    });
  });

  test('POST /login - valid credentials', async () => {
    const response = await apiContext.post('/login', {
      data: { username: 'testuser', password: 'password123' }
    });
    expect(response.ok()).toBeTruthy();
  });

  test('POST /login - invalid credentials', async () => {
    const response = await apiContext.post('/login', {
      data: { username: 'invalid', password: 'wrongpass' }
    });
    expect(response.status()).toBe(401);
  });

  test('GET /items - fetch all items', async () => {
    const response = await apiContext.get('/items');
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });

  test('POST /items - create new item', async () => {
    const response = await apiContext.post('/items', {
      data: { name: 'New Item', description: 'Test item' }
    });
    expect(response.ok()).toBeTruthy();
    const item = await response.json();
    expect(item.name).toBe('New Item');
  });

  test('PUT /items/:id - update item', async () => {
    // Create an item first
    const newItem = await apiContext.post('/items', {
      data: { name: 'ToUpdate', description: 'To be updated' }
    });
    const { id } = await newItem.json();

    const response = await apiContext.put(`/items/${id}`, {
      data: { name: 'Updated Name' }
    });
    expect(response.ok()).toBeTruthy();
  });

  test('DELETE /items/:id - delete item', async () => {
    const newItem = await apiContext.post('/items', {
      data: { name: 'ToDelete', description: 'Will be deleted' }
    });
    const { id } = await newItem.json();

    const response = await apiContext.delete(`/items/${id}`);
    expect(response.ok()).toBeTruthy();
  });
});
