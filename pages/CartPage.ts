import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
    readonly proceedToCheckoutButton: Locator;
    readonly cartItems: Locator;
    readonly loginRegisterLink: Locator;

    constructor(page: Page) {
        super(page);
        this.proceedToCheckoutButton = page.getByText('Proceed To Checkout');
        this.cartItems = page.locator('#cart_info_table tbody tr');
        // The modal link "Register / Login"
        this.loginRegisterLink = page.getByRole('link', { name: 'Register / Login' });
    }

    async load() {
        await this.navigateTo('/view_cart');
    }

    async proceedToCheckout() {
        await this.proceedToCheckoutButton.waitFor({ state: 'visible' });
        await this.clickWithAdHandling(this.proceedToCheckoutButton);
    }

    async clickLoginRegisterModal() {
        await this.loginRegisterLink.waitFor({ state: 'visible' });
        await this.clickWithAdHandling(this.loginRegisterLink);
    }

    async verifyProductInCart(productName: string) {
        await expect(this.page.locator(`text=${productName}`)).toBeVisible();
    }

    async getProductQuantity(index: number = 0) {
        // The quantity is usually in a button, but let's be flexible
        return await this.page.locator('td.cart_quantity').nth(index).innerText();
    }
}
