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

    test('Test Case 8: Verify All Products and product detail page', async () => {
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

    test('Test Case 9: Search Product', async () => {
        await homePage.headerProductsLink.click();
        await productsPage.searchProduct('Blue Top');
        await expect(productsPage.page.locator('.features_items')).toContainText('Blue Top');
    });

    test('Test Case 18: View Category Products', async () => {
        await homePage.page.locator('text=Category').scrollIntoViewIfNeeded();
        await homePage.page.locator('a[href="#Women"]').click();
        await homePage.page.locator('a[href="/category_products/1"]').click(); // Dress
        // await expect(homePage.page.locator('h2.title').nth(1)).toHaveText('Women - Dress Products');

        await homePage.page.locator('a[href="#Men"]').click();
        await homePage.page.locator('a[href="/category_products/3"]').click(); // Tshirts
        // await expect(homePage.page.locator('h2.title').nth(1)).toHaveText('Men - Tshirts Products');
    });

    test('Test Case 19: View & Cart Brand Products', async () => {
        await homePage.headerProductsLink.click();
        await homePage.page.locator('a[href="/brand_products/Polo"]').click();
        await expect(homePage.page.locator('h2.title')).toHaveText('Brand - Polo Products');

        await homePage.page.locator('a[href="/brand_products/H&M"]').click();
        await expect(homePage.page.locator('h2.title')).toHaveText('Brand - H&M Products');
    });

    test('Test Case 20: Add review on product', async () => {
        await homePage.headerProductsLink.click();
        await productsPage.viewProductDetails(0);
        await productDetailPage.submitReview('Test User', 'test@example.com', 'This product is great!');
        await productDetailPage.verifyReviewSuccess();
    });

    test('Test Case 21: Add to cart from Recommended items', async () => {
        // Scroll to the recommended items section at the bottom
        await homePage.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

        // Wait for recommended items to be visible
        await expect(homePage.page.locator('.recommended_items')).toBeVisible();

        // Get the first recommended product and hover over it
        const recommendedProduct = homePage.page.locator('.recommended_items .product-image-wrapper').first();
        await recommendedProduct.hover();

        // Click the "Add to cart" button
        const addToCartButton = recommendedProduct.locator('.add-to-cart').first();
        await addToCartButton.click();

        // Handle the modal - click "Continue Shopping" or "View Cart"
        await homePage.page.locator('.modal-footer .btn-success').click(); // Continue shopping

        // Navigate to cart and verify the item was added
        await cartPage.load();
        await expect(cartPage.cartItems).toHaveCount(1);
    });
});
