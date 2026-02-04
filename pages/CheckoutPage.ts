import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
    readonly commentInput: Locator;
    readonly placeOrderButton: Locator;
    readonly addressDetails: Locator;
    readonly deliveryAddress: Locator;
    readonly billingAddress: Locator;

    constructor(page: Page) {
        super(page);
        this.commentInput = page.locator('textarea.form-control');
        this.placeOrderButton = page.locator('a.check_out[href="/payment"]');
        this.addressDetails = page.locator('#address_delivery');
        this.deliveryAddress = page.locator('#address_delivery');
        this.billingAddress = page.locator('#address_invoice');
    }

    async placeOrder(message: string = "Order msg") {
        await this.commentInput.fill(message);
        await this.clickWithAdHandling(this.placeOrderButton);
    }

    async verifyAddressDetails(text: string, type: 'delivery' | 'billing' = 'delivery') {
        const locator = type === 'delivery' ? this.deliveryAddress : this.billingAddress;
        // Use a more relaxed match since lines can be combined
        await expect(locator).toContainText(new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
    }
}
