import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class AccountCreatedPage extends BasePage {
    readonly accountCreatedMessage: Locator;
    readonly continueButton: Locator;

    constructor(page: Page) {
        super(page);
        this.accountCreatedMessage = page.locator('[data-qa="account-created"]');
        this.continueButton = page.locator('[data-qa="continue-button"]');
    }

    async verifyAccountCreated() {
        await expect(this.accountCreatedMessage).toBeVisible();
        await expect(this.accountCreatedMessage).toHaveText('Account Created!');
    }

    async clickContinue() {
        await this.clickWithAdHandling(this.continueButton);
    }
}
