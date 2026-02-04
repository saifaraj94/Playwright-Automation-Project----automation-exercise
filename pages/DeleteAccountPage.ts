import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class DeleteAccountPage extends BasePage {
    readonly accountDeletedMessage: Locator;
    readonly continueButton: Locator;

    constructor(page: Page) {
        super(page);
        this.accountDeletedMessage = page.locator('[data-qa="account-deleted"]');
        this.continueButton = page.locator('[data-qa="continue-button"]');
    }

    async verifyAccountDeleted() {
        await expect(this.accountDeletedMessage).toBeVisible();
        await expect(this.accountDeletedMessage).toHaveText('Account Deleted!');
    }

    async clickContinue() {
        await this.clickWithAdHandling(this.continueButton);
    }
}
