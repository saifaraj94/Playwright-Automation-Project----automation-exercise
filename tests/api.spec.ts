import { test, expect } from '@playwright/test';
import { AuthApi } from '../api/AuthApi';
import { createRandomUser } from '../data/factories';

test.describe('API Tests', () => {
    let authApi: AuthApi;

    test.beforeEach(async ({ request }) => {
        authApi = new AuthApi(request);
    });

    test('Test Case 18: API: Register and Delete Account', async () => {
        const user = createRandomUser();

        // Register
        const regResponse = await authApi.registerUser(user);
        expect(regResponse.status()).toBe(200);
        const regBody = await regResponse.json();
        expect(regBody.message).toBe('User created!');

        // Login / Verify
        const loginResponse = await authApi.verifyLogin(user.email, user.password);
        expect(loginResponse.status()).toBe(200);
        const loginBody = await loginResponse.json();
        expect(loginBody.message).toBe('User exists!');

        // Delete
        const delResponse = await authApi.deleteAccount(user.email, user.password);
        expect(delResponse.status()).toBe(200);
        const delBody = await delResponse.json();
        expect(delBody.message).toBe('Account deleted!');
    });

    test('Test Case 19: API: Get All Products List', async ({ request }) => {
        const response = await request.get('/api/productsList');
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.products.length).toBeGreaterThan(0);
    });

    test('Test Case 20: API: Search Product', async ({ request }) => {
        const response = await request.post('/api/searchProduct', {
            form: { search_product: 'top' }
        });
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.responseCode).toBe(200);
        expect(body.products.length).toBeGreaterThan(0);
    });
});
