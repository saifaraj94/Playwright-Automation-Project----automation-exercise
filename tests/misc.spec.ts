import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { TestCasesPage } from '../pages/TestCasesPage';

test.describe('Miscellaneous Tests', () => {
    let homePage: HomePage;
    let testCasesPage: TestCasesPage;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        testCasesPage = new TestCasesPage(page);
        await homePage.load();
    });

    test('Test Case 16: Verify Test Cases Page', async () => {
        await homePage.navigateTo('/test_cases');
        await testCasesPage.verifyPageLoaded();
    });

    test('Test Case 17: Verify Subscription in home page', async () => {
        // More robust scroll to bottom
        await homePage.page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight);
        });
        // Wait for the input to be visible which confirms we are at the footer
        await homePage.subscriptionEmailInput.waitFor({ state: 'visible' });
        await homePage.subscribe('test' + Date.now() + '@example.com');
        await homePage.verifySubscriptionSuccess();
    });

});
