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
        // Find the product container first, then find the link inside it
        const product = this.page.locator('.product-image-wrapper').nth(index);
        const link = product.locator('.choose a');
        await this.clickWithAdHandling(link);
    }

    async addProductToCart(index: number) {
        await this.handleAds();

        const productContainer = this.page.locator('.product-image-wrapper').nth(index);
        await productContainer.scrollIntoViewIfNeeded();

        const addButton = productContainer.locator('.add-to-cart').first();
        const continueBtn = this.page.getByRole('button', { name: 'Continue Shopping' });

        for (let i = 0; i < 2; i++) {
            await this.clickWithAdHandling(addButton);
            try {
                await continueBtn.waitFor({ state: 'visible', timeout: 5000 });
                break;
            } catch (e) {
                if (i === 1) throw e;
                console.log(`Modal didn't appear, retrying add to cart...`);
                await this.handleAds();
            }
        }
        await continueBtn.click();
    }
}
