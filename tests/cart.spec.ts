import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';

test.describe('Cart Tests', () => {
    let homePage: HomePage;
    let productsPage: ProductsPage;
    let cartPage: CartPage;
    let productDetailPage: ProductDetailPage;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        productsPage = new ProductsPage(page);
        cartPage = new CartPage(page);
        productDetailPage = new ProductDetailPage(page);
        await homePage.load();
    });

    test('Test Case 10: Verify Subscription in Cart page', async () => {
        await cartPage.load();
        await cartPage.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await homePage.subscriptionEmailInput.waitFor({ state: 'visible' });
        await homePage.subscribe('cart_' + Date.now() + '@example.com');
        await homePage.verifySubscriptionSuccess();
    });

    test('Test Case 11: Add Products in Cart', async () => {
        await homePage.headerProductsLink.click();

        // Add first product
        await productsPage.addProductToCart(0);
        // Add second product
        await productsPage.addProductToCart(1);

        await cartPage.load();
        // Wait for table to be populated
        await cartPage.cartItems.first().waitFor({ state: 'visible', timeout: 15000 });
        await expect(cartPage.cartItems).toHaveCount(2);
    });


    test('Test Case 12: Remove Products From Cart', async () => {
        await homePage.headerProductsLink.click();
        await productsPage.addProductToCart(0);
        await cartPage.load();
        await expect(cartPage.cartItems).toHaveCount(1);

        // Click delete using the page object's ad handling
        const deleteBtn = cartPage.page.locator('.cart_quantity_delete').first();
        await cartPage.clickWithAdHandling(deleteBtn);

        // Verification
        await expect(cartPage.cartItems).toHaveCount(0);
        await expect(cartPage.page.getByText('Cart is empty!')).toBeVisible();
    });
});
