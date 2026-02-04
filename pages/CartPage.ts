import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
    readonly proceedToCheckoutButton: Locator;
    readonly cartItems: Locator;
    readonly loginRegisterLink: Locator;

    constructor(page: Page) {
        super(page);
        this.proceedToCheckoutButton = page.locator('a.check_out');
        this.cartItems = page.locator('#cart_info_table tbody tr');
        this.loginRegisterLink = page.locator('.modal-content a[href="/login"]').first();
    }

    async load() {
        await this.navigateTo('/view_cart');
    }

    async proceedToCheckout() {
        await this.clickWithAdHandling(this.proceedToCheckoutButton);
    }

    async clickLoginRegisterModal() {
        await this.loginRegisterLink.first().waitFor({ state: 'visible' });
        await this.clickWithAdHandling(this.loginRegisterLink.first());
    }

    async verifyProductInCart(productName: string) {
        await expect(this.page.locator(`text=${productName}`)).toBeVisible();
    }

    async getProductQuantity(index: number = 0) {
        return await this.page.locator('td.cart_quantity button.disabled').nth(index).innerText();
    }
}
