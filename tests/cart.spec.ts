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

    test('Test Case 11: Verify Subscription in Cart page', async () => {
        await cartPage.load();
        await cartPage.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await homePage.subscribe('cart@example.com'); // HomePage has sub methods
        await homePage.verifySubscriptionSuccess();
    });

    test('Test Case 12: Add Products in Cart', async () => {
        await homePage.headerProductsLink.click();

        // Add first product
        await productsPage.addProductToCart(0);
        // Add second product
        await productsPage.addProductToCart(1);

        await cartPage.load();
        await expect(cartPage.cartItems).toHaveCount(2);
    });

    test('Test Case 13: Verify Product quantity in Cart', async () => {
        await homePage.viewProductDetails(2);
        await productDetailPage.setQuantity('4');
        await productDetailPage.addToCart();

        await cartPage.load();
        const quantityText = await cartPage.getProductQuantity();
        expect(quantityText).toBe('4');
    });

    test('Test Case 17: Remove Products From Cart', async () => {
        await homePage.headerProductsLink.click();
        await productsPage.addProductToCart(0);
        await cartPage.load();
        await expect(cartPage.cartItems).toHaveCount(1);

        await cartPage.page.locator('.cart_quantity_delete').first().click();
        await expect(cartPage.cartItems).toHaveCount(0);
        await expect(cartPage.page.locator('text=Cart is empty!')).toBeVisible();
    });
});
