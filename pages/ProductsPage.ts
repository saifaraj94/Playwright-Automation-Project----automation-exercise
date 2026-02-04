import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductsPage extends BasePage {
    readonly searchInput: Locator;
    readonly searchButton: Locator;
    readonly allProductsList: Locator;


    constructor(page: Page) {
        super(page);
        this.searchInput = page.locator('#search_product');
        this.searchButton = page.locator('#submit_search');
        this.allProductsList = page.locator('.features_items');
    }

    async load() {
        await this.navigateTo('/products');
        await expect(this.allProductsList).toBeVisible();
    }

    async searchProduct(productName: string) {
        await this.searchInput.waitFor({ state: 'visible' });
        await this.searchInput.fill(productName);
        await this.clickWithAdHandling(this.searchButton);
    }

    async viewProductDetails(index: number) {
        // View the Nth product
        const link = this.page.locator(`.choose > ul > li > a`).nth(index);
        await this.clickWithAdHandling(link);
    }

    async addProductToCart(index: number) {
        // Hover and click 'Add to cart'
        await this.handleAds();
        const product = this.page.locator('.single-products').nth(index);
        await product.hover();
        const addButton = product.locator('.add-to-cart').first();
        await this.clickWithAdHandling(addButton);
        await this.clickWithAdHandling(this.page.locator('.modal-footer .btn-success')); // Continue shopping
    }
}
