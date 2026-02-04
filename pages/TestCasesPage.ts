import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class TestCasesPage extends BasePage {
    readonly pageTitle: Locator;

    constructor(page: Page) {
        super(page);
        this.pageTitle = page.locator('h2.title').filter({ hasText: 'Test Cases' });
    }

    async load() {
        await this.navigateTo('/test_cases');
    }

    async verifyPageLoaded() {
        await expect(this.pageTitle).toBeVisible();
    }
}
