import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ProductsPage } from '../pages/ProductsPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { CartPage } from '../pages/CartPage';
import { LoginPage } from '../pages/LoginPage';
import { createRandomUser } from '../data/factories';
import { AuthHelper } from '../utils/AuthHelper';

test.describe('Product and Category Tests', () => {
    let homePage: HomePage;
    let productsPage: ProductsPage;
    let productDetailPage: ProductDetailPage;
    let cartPage: CartPage;
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        productsPage = new ProductsPage(page);
        productDetailPage = new ProductDetailPage(page);
        cartPage = new CartPage(page);
        loginPage = new LoginPage(page);
        await homePage.load();
    });

    test('Test Case 6: Verify All Products and product detail page', async () => {
        await homePage.headerProductsLink.click();
        await expect(productsPage.allProductsList).toBeVisible();
        await productsPage.viewProductDetails(0);
        await productDetailPage.handleAds(); // Ensure detail page ad is closed
        await expect(productDetailPage.productName).toBeVisible();

        // Use a more generic way to check for information if the exact spans/labels are brittle
        const productInfo = productDetailPage.page.locator('.product-information');
        await expect(productInfo).toContainText(/Category:/i);
        await expect(productInfo).toContainText(/Availability:/i);
        await expect(productInfo).toContainText(/Condition:/i);
        await expect(productInfo).toContainText(/Brand:/i);
    });

    test('Test Case 7: Search Product', async () => {
        await homePage.headerProductsLink.click();
        await productsPage.searchProduct('Blue Top');
        await expect(productsPage.page.locator('.features_items')).toContainText('Blue Top');
    });

    test('Test Case 8: View & Cart Brand Products', async () => {
        await homePage.headerProductsLink.click();
        const poloLink = homePage.page.getByRole('link', { name: 'Polo' });
        await homePage.clickWithAdHandling(poloLink);
        await expect(homePage.page.getByRole('heading', { name: 'Brand - Polo Products' })).toBeVisible();

        const hmLink = homePage.page.getByRole('link', { name: 'H&M' });
        await homePage.clickWithAdHandling(hmLink);
        await expect(homePage.page.getByRole('heading', { name: 'Brand - H&M Products' })).toBeVisible();
    });

    test('Test Case 9: Add review on product', async () => {
        await homePage.headerProductsLink.click();
        await productsPage.viewProductDetails(0);
        await productDetailPage.submitReview('Test User', 'test@example.com', 'This product is great!');
        await productDetailPage.verifyReviewSuccess();
    });

});
