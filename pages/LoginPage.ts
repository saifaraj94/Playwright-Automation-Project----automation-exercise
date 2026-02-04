import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
    readonly loginForm: Locator;
    readonly signupForm: Locator;
    readonly loginEmailInput: Locator;
    readonly loginPasswordInput: Locator;
    readonly loginButton: Locator;
    readonly signupNameInput: Locator;
    readonly signupEmailInput: Locator;
    readonly signupButton: Locator;
    readonly loginErrorMessage: Locator;
    readonly signupErrorMessage: Locator;

    // Signup Page Elements (after clicking Signup)

    // ... we might need a separate SignupPage or keep it here if flows validation separate

    constructor(page: Page) {
        super(page);
        this.loginForm = page.locator('.login-form');
        this.signupForm = page.locator('.signup-form');

        // Login selectors
        this.loginEmailInput = page.getByTestId('login-email');
        this.loginPasswordInput = page.getByTestId('login-password');
        this.loginButton = page.getByTestId('login-button');

        // Signup selectors
        this.signupNameInput = page.getByTestId('signup-name');
        this.signupEmailInput = page.getByTestId('signup-email');
        this.signupButton = page.getByTestId('signup-button');

        // Error messages - keep broad for robustness, or use specific text
        this.loginErrorMessage = page.locator('.login-form p').filter({ hasText: /incorrect|error/i }).first();
        this.signupErrorMessage = page.locator('.signup-form p').filter({ hasText: /exist|error/i }).first();
    }

    async load() {
        await this.navigateTo('/login');
        await expect(this.loginForm).toBeVisible();
    }

    async login(email: string, pass: string) {
        // Wait for the form to be stable
        await this.loginForm.waitFor();
        await this.loginEmailInput.fill(email);
        await this.loginPasswordInput.fill(pass);
        await this.clickWithAdHandling(this.loginButton);
    }

    async signup(name: string, email: string) {
        await this.signupForm.waitFor();
        await this.signupNameInput.fill(name);
        await this.signupEmailInput.fill(email);
        await this.clickWithAdHandling(this.signupButton);
    }

    async verifyError(message: string) {
        // Broad text match is often better for error toasts/messages than rigid ID
        const errorLocator = this.page.getByText(message);
        await expect(errorLocator).toBeVisible({ timeout: 15000 });
    }
}
