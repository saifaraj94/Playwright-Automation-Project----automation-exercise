import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
    readonly page: Page;
    readonly headerHomeLink: Locator;
    readonly headerProductsLink: Locator;
    readonly headerCartLink: Locator;
    readonly headerSignupLoginLink: Locator;
    readonly headerContactUsLink: Locator;
    readonly headerDeleteAccountLink: Locator;
    readonly headerLogoutLink: Locator;
    readonly loggedInUserText: Locator;

    constructor(page: Page) {
        this.page = page;
        // Navigation Bar
        this.headerHomeLink = page.getByRole('link', { name: 'Home' });
        this.headerProductsLink = page.getByRole('link', { name: 'Products' });
        this.headerCartLink = page.getByRole('link', { name: 'Cart' });
        this.headerSignupLoginLink = page.getByRole('link', { name: 'Signup / Login' });
        this.headerContactUsLink = page.getByRole('link', { name: 'Contact us' });
        this.headerDeleteAccountLink = page.getByRole('link', { name: 'Delete Account' });
        this.headerLogoutLink = page.getByRole('link', { name: 'Logout' });

        // Assertions/Status
        this.loggedInUserText = page.getByText('Logged in as');
    }

    async navigateTo(path: string = '/') {
        await this.setupAdBlocking();
        await this.page.goto(path);
        // await this.handleAds(); // Kept as fallback but network blocking should catch 99%
    }

    async setupAdBlocking() {
        await this.page.route('**/*{googleads,g.doubleclick,googlesyndication,adsystem,adservice,rubiconproject,criteo,advertising,adsbox}*', route => route.abort());
    }

    async handleAds() {
        // Fallback for any persistent overlays using aggressive JS helpers
        const adSelectors = [
            '#dismiss-button',
            'div[id^="aswift"]',
            'iframe[id^="aswift"]',
            '[aria-label="Close ad"]',
            '.dismiss-button',
            '#close-button'
        ];

        try {
            // Quick evaluate based removal is faster than locators for these dynamic iframes
            await this.page.addStyleTag({ content: 'iframe[src*="google"], iframe[id^="aswift"], .adsbygoogle { display: none !important; }' });

            for (const selector of adSelectors) {
                const element = this.page.locator(selector).first();
                if (await element.isVisible({ timeout: 100 })) {
                    await element.click({ force: true, timeout: 500 }).catch(() => { });
                }
            }
        } catch (e) {
            // Ignore ad handling errors
        }
    }

    async clickWithAdHandling(locator: Locator) {
        // Just click, rely on network blocking. If it fails, try one fallback.
        try {
            await locator.click();
        } catch (e) {
            console.log('Click intercepted, retrying after ad check...');
            await this.handleAds();
            await locator.click({ force: true });
        }
    }

    async verifyLoggedInAs(username: string) {
        await expect(this.loggedInUserText).toContainText(username);
    }
}
