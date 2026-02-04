import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { LoginPage } from '../pages/LoginPage';
import { SignupPage } from '../pages/SignupPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { PaymentPage } from '../pages/PaymentPage';
import { AccountCreatedPage } from '../pages/AccountCreatedPage';
import { DeleteAccountPage } from '../pages/DeleteAccountPage';
import { createRandomUser } from '../data/factories';
import { AuthHelper } from '../utils/AuthHelper';
import fs from 'fs';
import path from 'path';

test.describe('Checkout and Order Tests', () => {
    let homePage: HomePage;
    let productsPage: ProductsPage;
    let cartPage: CartPage;
    let loginPage: LoginPage;
    let signupPage: SignupPage;
    let checkoutPage: CheckoutPage;
    let paymentPage: PaymentPage;
    let accountCreatedPage: AccountCreatedPage;
    let deleteAccountPage: DeleteAccountPage;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        productsPage = new ProductsPage(page);
        cartPage = new CartPage(page);
        loginPage = new LoginPage(page);
        signupPage = new SignupPage(page);
        checkoutPage = new CheckoutPage(page);
        paymentPage = new PaymentPage(page);
        accountCreatedPage = new AccountCreatedPage(page);
        deleteAccountPage = new DeleteAccountPage(page);
        await homePage.load();
    });

    test('Test Case 13: Place Order: Register while Checkout', async () => {
        await homePage.headerProductsLink.click();
        await productsPage.addProductToCart(0);
        await cartPage.load();
        await cartPage.proceedToCheckout();
        await cartPage.clickLoginRegisterModal();

        const user = createRandomUser();
        await loginPage.signup(user.name, user.email);
        await signupPage.fillAccountDetails(user);
        await signupPage.submit();
        await accountCreatedPage.clickContinue();
        await homePage.handleAds();
        await homePage.verifyLoggedInAs(user.name);

        await cartPage.load();
        await cartPage.proceedToCheckout();

        await checkoutPage.verifyAddressDetails(user.address1);
        await checkoutPage.placeOrder();

        await paymentPage.enterPaymentDetails(user.name, '4111111111111111', '123', '12', '2025');
        await paymentPage.clickPayAndConfirm();

        await expect(paymentPage.successMessage).toBeVisible();
        await homePage.headerDeleteAccountLink.click();
    });

    test('Test Case 14: Place Order: Register before Checkout', async () => {
        const user = createRandomUser();
        await homePage.headerSignupLoginLink.click();
        await loginPage.signup(user.name, user.email);
        await signupPage.fillAccountDetails(user);
        await signupPage.submit();
        await accountCreatedPage.clickContinue();
        await homePage.verifyLoggedInAs(user.name);

        await homePage.headerProductsLink.click();
        await productsPage.addProductToCart(0);
        await cartPage.load();
        await cartPage.proceedToCheckout();

        await checkoutPage.placeOrder();
        await paymentPage.enterPaymentDetails(user.name, '4242424242424242', '123', '12', '2025');
        await paymentPage.clickPayAndConfirm();

        await expect(paymentPage.successMessage).toBeVisible();
        await homePage.headerDeleteAccountLink.click();
    });

    test('Test Case 15: Place Order: Login before Checkout', async () => {
        const user = createRandomUser();
        await AuthHelper.registerAndLogin(user); // Quick setup via API

        await homePage.load();
        await homePage.headerSignupLoginLink.click();
        await loginPage.login(user.email, user.password);

        await homePage.headerProductsLink.click();
        await productsPage.addProductToCart(0);
        await cartPage.load();
        await cartPage.proceedToCheckout();

        await checkoutPage.placeOrder();
        await paymentPage.enterPaymentDetails(user.name, '4111111111111111', '123', '12', '2025');
        await paymentPage.clickPayAndConfirm();

        await expect(paymentPage.successMessage).toBeVisible();
        await homePage.headerDeleteAccountLink.click();
    });

});
