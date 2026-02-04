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
        this.headerHomeLink = page.locator('header a[href="/"]');
        this.headerProductsLink = page.locator('header a[href="/products"]');
        this.headerCartLink = page.locator('header a[href="/view_cart"]');
        this.headerSignupLoginLink = page.locator('header a[href="/login"]');
        this.headerContactUsLink = page.locator('header a[href="/contact_us"]');
        this.headerDeleteAccountLink = page.locator('header a[href="/delete_account"]');
        this.headerLogoutLink = page.locator('header a[href="/logout"]');
        this.loggedInUserText = page.locator('header li:has-text("Logged in as")');
    }

    async navigateTo(path: string = '/') {
        await this.page.goto(path);
        await this.handleAds();
    }

    async handleAds() {
        const adSelectors = [
            '#dismiss-button',
            '[aria-label="Close ad"]',
            'span:has-text("Close")',
            '.ns-sh09x-e-7',
            'div:has-text("Close")',
            '#close-button',
            '.dismiss-button'
        ];
        const combinedSelector = adSelectors.join(', ');

        try {
            // Remove ad iframes and containers
            await this.page.evaluate(() => {
                // Remove iframes with advertisement title
                const iframes = document.querySelectorAll('iframe[title="Advertisement"]');
                iframes.forEach(iframe => iframe.remove());

                // Remove ad containers that intercept events
                const adHosts = document.querySelectorAll('[id^="aswift_"]');
                adHosts.forEach(host => host.remove());

                // Remove adsbygoogle containers
                const adContainers = document.querySelectorAll('.adsbygoogle');
                adContainers.forEach(container => container.remove());
            });

            // Check main page first
            const mainLocator = this.page.locator(combinedSelector).first();
            if (await mainLocator.isVisible({ timeout: 1000 })) {
                await mainLocator.click({ force: true });
                return;
            }

            // Check iframes (usually Google Ads)
            const frames = this.page.frames();
            for (const frame of frames) {
                try {
                    const locator = frame.locator(combinedSelector).first();
                    if (await locator.isVisible({ timeout: 500 })) {
                        await locator.click({ force: true });
                        return;
                    }
                } catch (innerError) {
                    // Frame might be detached or cross-origin
                }
            }
        } catch (e) {
            // Silent catch
        }
    }

    async clickWithAdHandling(locator: Locator) {
        await this.handleAds();
        try {
            await locator.click({ timeout: 5000 });
        } catch (e) {
            await this.handleAds();
            await locator.click({ timeout: 10000 });
        }
    }

    async verifyLoggedInAs(username: string) {
        await expect(this.loggedInUserText).toContainText(username);
    }
}
