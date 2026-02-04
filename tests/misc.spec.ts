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

    test('Test Case 6: Verify Test Cases Page', async () => {
        await homePage.navigateTo('/test_cases');
        await testCasesPage.verifyPageLoaded();
    });

    test('Test Case 7: Verify Subscription in home page', async () => {
        await homePage.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await homePage.subscribe('test@example.com');
        await homePage.verifySubscriptionSuccess();
    });

    test('Test Case 8: Verify Scroll Up without Arrow button and Scroll Down functionality', async () => {
        await homePage.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await expect(homePage.subscriptionEmailInput).toBeInViewport();

        await homePage.page.evaluate(() => window.scrollTo(0, 0));
        await expect(homePage.sliderCarousel).toBeInViewport();
        await expect(homePage.page.locator('h2:has-text("Full-Fledged practice website")').first()).toBeVisible();
    });

    test('Test Case 9: Verify Scroll Up with Arrow button and Scroll Down functionality', async () => {
        await homePage.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await expect(homePage.subscriptionEmailInput).toBeInViewport();

        const scrollUpArrow = homePage.page.locator('#scrollUp');
        await scrollUpArrow.click();

        await expect(homePage.sliderCarousel).toBeInViewport();
        await expect(homePage.page.locator('h2:has-text("Full-Fledged practice website")').first()).toBeVisible();
    });
});
