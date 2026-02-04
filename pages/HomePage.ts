import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
    readonly sliderCarousel: Locator;
    readonly subscriptionEmailInput: Locator;
    readonly subscribeButton: Locator;
    readonly successSubscribeMessage: Locator;

    constructor(page: Page) {
        super(page);
        this.sliderCarousel = page.locator('#slider-carousel');
        this.subscriptionEmailInput = page.getByRole('textbox', { name: 'subscribe' }).or(page.locator('#susbscribe_email'));
        this.subscribeButton = page.locator('#subscribe');
        this.successSubscribeMessage = page.getByText('You have been successfully subscribed!');
    }

    async load() {
        await this.navigateTo('/');
        await expect(this.sliderCarousel).toBeVisible();
    }

    async viewProductDetails(index: number = 0) {
        const viewProductButton = this.page.locator('.choose a[href*="product_details"]').nth(index);
        await viewProductButton.waitFor({ state: 'visible' });
        await this.clickWithAdHandling(viewProductButton);
    }

    async subscribe(email: string) {
        await this.subscriptionEmailInput.scrollIntoViewIfNeeded();
        await this.subscriptionEmailInput.fill(email);
        await this.subscribeButton.waitFor({ state: 'visible' });
        await this.clickWithAdHandling(this.subscribeButton);
    }

    async verifySubscriptionSuccess() {
        await expect(this.successSubscribeMessage).toBeVisible();
        await expect(this.successSubscribeMessage).toHaveText('You have been successfully subscribed!');
    }
}
