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
        this.loginEmailInput = page.locator('[data-qa="login-email"]');
        this.loginPasswordInput = page.locator('[data-qa="login-password"]');
        this.loginButton = page.locator('[data-qa="login-button"]');

        this.signupNameInput = page.locator('[data-qa="signup-name"]');
        this.signupEmailInput = page.locator('[data-qa="signup-email"]');
        this.signupButton = page.locator('[data-qa="signup-button"]');

        this.loginErrorMessage = page.locator('.login-form p:has-text("incorrect"), .login-form .alert-danger, .login-form p[style*="color: red"], .login-form p:has-text("Your email or password is incorrect!")').first();
        this.signupErrorMessage = page.locator('.signup-form p:has-text("exist"), .signup-form .alert-danger, .signup-form p[style*="color: red"]').first();
    }

    async load() {
        await this.navigateTo('/login');
        await expect(this.loginForm).toBeVisible();
    }

    async login(email: string, pass: string) {
        await this.loginForm.waitFor();
        await this.loginEmailInput.fill(email);
        await this.loginPasswordInput.fill(pass);
        await this.clickWithAdHandling(this.loginButton);
    }

    async signup(name: string, email: string) {
        await this.signupNameInput.fill(name);
        await this.signupEmailInput.fill(email);
        await this.clickWithAdHandling(this.signupButton);
    }

    async verifyError(message: string) {
        await this.handleAds();
        // Resilient check: look for the error message anywhere with a good timeout
        const errorLocator = this.page.locator(`text=${message}`);
        await errorLocator.waitFor({ state: 'visible', timeout: 15000 });
        await expect(errorLocator).toBeVisible();
    }
}
