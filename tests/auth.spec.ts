import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { SignupPage } from '../pages/SignupPage';
import { AccountCreatedPage } from '../pages/AccountCreatedPage';
import { DeleteAccountPage } from '../pages/DeleteAccountPage';
import { createRandomUser } from '../data/factories';
import { AuthApi } from '../api/AuthApi';

test.describe('Authentication Tests', () => {
    let homePage: HomePage;
    let loginPage: LoginPage;
    let signupPage: SignupPage;
    let accountCreatedPage: AccountCreatedPage;
    let deleteAccountPage: DeleteAccountPage;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        loginPage = new LoginPage(page);
        signupPage = new SignupPage(page);
        accountCreatedPage = new AccountCreatedPage(page);
        deleteAccountPage = new DeleteAccountPage(page);
        await homePage.load();
    });

    test('Test Case 1: Register User', async () => {
        const user = createRandomUser();

        await homePage.headerSignupLoginLink.click();
        await expect(loginPage.signupForm).toBeVisible();

        await loginPage.signup(user.name, user.email);
        await expect(signupPage.passwordInput).toBeVisible();

        await signupPage.fillAccountDetails(user);
        await signupPage.submit();

        await accountCreatedPage.verifyAccountCreated();
        await accountCreatedPage.clickContinue();

        await homePage.verifyLoggedInAs(user.name);

        await homePage.headerDeleteAccountLink.click();
        await deleteAccountPage.verifyAccountDeleted();
        await deleteAccountPage.clickContinue();
    });

    test('Test Case 2: Login User with correct email and password', async () => {
        const user = createRandomUser();
        // Pre-register via API would be better for speed, but this is a login test
        // For Case 2, we actually need an existing user.
        // I'll register via UI first or use API if available for setup.
        // The prompt suggested: "Register & login via API... shared across API + UI tests"
        // However, specifically testing the UI Login flow (Case 2) should use UI.

        // Setup: Register via UI (alternative: API)
        await homePage.headerSignupLoginLink.click();
        await loginPage.signup(user.name, user.email);
        await signupPage.fillAccountDetails(user);
        await signupPage.submit();
        await accountCreatedPage.clickContinue();
        await homePage.headerLogoutLink.click();

        // Actual Login Test
        await homePage.headerSignupLoginLink.click();
        await loginPage.login(user.email, user.password);
        await homePage.verifyLoggedInAs(user.name);

        // Cleanup
        await homePage.headerDeleteAccountLink.click();
    });

    test('Test Case 3: Login User with incorrect email and password', async () => {
        await homePage.headerSignupLoginLink.click();
        await loginPage.login('invalid_email_user@example.com', 'InvalidPassword123');
        await loginPage.verifyError('Your email or password is incorrect!');
    });

    test('Test Case 4: Logout User', async () => {
        const user = createRandomUser();
        // Setup
        await homePage.headerSignupLoginLink.click();
        await loginPage.signup(user.name, user.email);
        await signupPage.fillAccountDetails(user);
        await signupPage.submit();
        await accountCreatedPage.clickContinue();

        // Logout
        await homePage.headerLogoutLink.click();
        await expect(loginPage.loginForm).toBeVisible();
    });

    test('Test Case 5: Register User with existing email', async ({ request }) => {
        const existingEmail = 'automation_existing_test@example.com';
        const user = createRandomUser();
        user.email = existingEmail;

        // Ensure user exists (Register via API if not already there)
        const authApi = new AuthApi(request);
        await authApi.registerUser(user);

        // Try register again via UI
        await homePage.headerSignupLoginLink.click();
        await loginPage.signup(user.name, existingEmail);
        await loginPage.verifyError('Email Address already exist!');
    });
});
