import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ContactUsPage extends BasePage {
    readonly nameInput: Locator;
    readonly emailInput: Locator;
    readonly subjectInput: Locator;
    readonly messageInput: Locator;
    readonly uploadFileInput: Locator;
    readonly submitButton: Locator;
    readonly successMessage: Locator;
    readonly homeButton: Locator;

    constructor(page: Page) {
        super(page);
        this.nameInput = page.locator('[data-qa="name"]');
        this.emailInput = page.locator('[data-qa="email"]');
        this.subjectInput = page.locator('[data-qa="subject"]');
        this.messageInput = page.locator('[data-qa="message"]');
        this.uploadFileInput = page.locator('input[name="upload_file"]');
        this.submitButton = page.locator('[data-qa="submit-button"]');
        this.successMessage = page.locator('.contact-form .alert-success');
        this.homeButton = page.locator('#form-section .btn-success');
    }

    async load() {
        await this.navigateTo('/contact_us');
    }

    async submitForm(name: string, email: string, subject: string, message: string, filePath?: string) {
        await this.nameInput.fill(name);
        await this.emailInput.fill(email);
        await this.subjectInput.fill(subject);
        await this.messageInput.fill(message);
        if (filePath) {
            await this.uploadFileInput.setInputFiles(filePath);
        }

        // Handling dialog that appears after submit
        this.page.once('dialog', dialog => dialog.accept());
        await this.clickWithAdHandling(this.submitButton);
    }

    async verifySuccessMessage() {
        const message = this.page.locator('.status.alert-success, .alert-success, text=/submitted successfully/i').first();
        await expect(message).toBeVisible({ timeout: 15000 });
        await expect(message).toContainText('Success');
    }

    async goHome() {
        await this.clickWithAdHandling(this.homeButton);
    }
}
