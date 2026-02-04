import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductDetailPage extends BasePage {
    readonly productName: Locator;
    readonly quantityInput: Locator;
    readonly addToCartButton: Locator;
    readonly reviewNameInput: Locator;
    readonly reviewEmailInput: Locator;
    readonly reviewTextInput: Locator;
    readonly submitReviewButton: Locator;
    readonly successMessage: Locator;

    constructor(page: Page) {
        super(page);
        this.productName = page.locator('.product-information h2');
        this.quantityInput = page.locator('#quantity');
        this.addToCartButton = page.locator('button.cart');

        this.reviewNameInput = page.locator('#name');
        this.reviewEmailInput = page.locator('#email');
        this.reviewTextInput = page.locator('#review');
        this.submitReviewButton = page.locator('#button-review');
        this.successMessage = page.locator('#review-section .alert-success');
    }

    async setQuantity(qty: string) {
        await this.productName.waitFor({ state: 'visible' });
        await this.quantityInput.fill(qty);
        // Verify value stuck
        await expect(this.quantityInput).toHaveValue(qty);
    }

    async addToCart() {
        await this.clickWithAdHandling(this.addToCartButton);
        await this.page.locator('.modal-content').waitFor({ state: 'visible' });
        await this.clickWithAdHandling(this.page.locator('.modal-footer .btn-success')); // Continue
    }

    async submitReview(name: string, email: string, review: string) {
        await this.reviewNameInput.fill(name);
        await this.reviewEmailInput.fill(email);
        await this.reviewTextInput.fill(review);
        await this.clickWithAdHandling(this.submitReviewButton);
    }

    async verifyReviewSuccess() {
        await expect(this.successMessage).toBeVisible();
        await expect(this.successMessage).toHaveText('Thank you for your review.');
    }
}
