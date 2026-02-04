import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class PaymentPage extends BasePage {
    readonly nameOnCardInput: Locator;
    readonly cardNumberInput: Locator;
    readonly cvcInput: Locator;
    readonly expiryMonthInput: Locator;
    readonly expiryYearInput: Locator;
    readonly payButton: Locator;
    readonly successMessage: Locator;
    readonly downloadInvoiceButton: Locator;
    readonly continueButton: Locator;

    constructor(page: Page) {
        super(page);
        this.nameOnCardInput = page.locator('[data-qa="name-on-card"]');
        this.cardNumberInput = page.locator('[data-qa="card-number"]');
        this.cvcInput = page.locator('[data-qa="cvc"]');
        this.expiryMonthInput = page.locator('[data-qa="expiry-month"]');
        this.expiryYearInput = page.locator('[data-qa="expiry-year"]');
        this.payButton = page.locator('[data-qa="pay-button"]');
        this.successMessage = page.locator('[data-qa="order-placed"]');
        this.downloadInvoiceButton = page.locator('a:has-text("Download Invoice")');
        this.continueButton = page.locator('[data-qa="continue-button"]');
    }

    async enterPaymentDetails(name: string, number: string, cvc: string, month: string, year: string) {
        await this.nameOnCardInput.fill(name);
        await this.cardNumberInput.fill(number);
        await this.cvcInput.fill(cvc);
        await this.expiryMonthInput.fill(month);
        await this.expiryYearInput.fill(year);
    }

    async clickPayAndConfirm() {
        await this.clickWithAdHandling(this.payButton);
        await this.successMessage.waitFor({ state: 'visible', timeout: 15000 });
    }

    async downloadInvoice() {
        const downloadPromise = this.page.waitForEvent('download');
        await this.clickWithAdHandling(this.downloadInvoiceButton);
        return await downloadPromise;
    }

    async clickContinue() {
        await this.clickWithAdHandling(this.continueButton);
    }
}
