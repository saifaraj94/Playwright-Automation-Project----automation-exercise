import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { User } from '../data/types';

export class SignupPage extends BasePage {
    readonly titleMr: Locator;
    readonly titleMrs: Locator;
    readonly passwordInput: Locator;
    readonly daysSelect: Locator;
    readonly monthsSelect: Locator;
    readonly yearsSelect: Locator;
    readonly newsletterCheckbox: Locator;
    readonly optinCheckbox: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly companyInput: Locator;
    readonly address1Input: Locator;
    readonly address2Input: Locator;
    readonly countrySelect: Locator;
    readonly stateInput: Locator;
    readonly cityInput: Locator;
    readonly zipcodeInput: Locator;
    readonly mobileNumberInput: Locator;
    readonly createAccountButton: Locator;

    constructor(page: Page) {
        super(page);
        this.titleMr = page.locator('#id_gender1');
        this.titleMrs = page.locator('#id_gender2');
        this.passwordInput = page.locator('[data-qa="password"]');
        this.daysSelect = page.locator('[data-qa="days"]');
        this.monthsSelect = page.locator('[data-qa="months"]');
        this.yearsSelect = page.locator('[data-qa="years"]');
        this.newsletterCheckbox = page.locator('#newsletter');
        this.optinCheckbox = page.locator('#optin');
        this.firstNameInput = page.locator('[data-qa="first_name"]');
        this.lastNameInput = page.locator('[data-qa="last_name"]');
        this.companyInput = page.locator('[data-qa="company"]');
        this.address1Input = page.locator('[data-qa="address"]');
        this.address2Input = page.locator('[data-qa="address2"]');
        this.countrySelect = page.locator('[data-qa="country"]');
        this.stateInput = page.locator('[data-qa="state"]');
        this.cityInput = page.locator('[data-qa="city"]');
        this.zipcodeInput = page.locator('[data-qa="zipcode"]');
        this.mobileNumberInput = page.locator('[data-qa="mobile_number"]');
        this.createAccountButton = page.locator('[data-qa="create-account"]');
    }

    async fillAccountDetails(user: User) {
        if (user.title === 'Mr') {
            await this.titleMr.check();
        } else {
            await this.titleMrs.check();
        }

        await this.passwordInput.fill(user.password);
        await this.daysSelect.selectOption(user.birthDay);
        await this.monthsSelect.selectOption(user.birthMonth);
        await this.yearsSelect.selectOption(user.birthYear);

        await this.newsletterCheckbox.check();
        await this.optinCheckbox.check();

        await this.firstNameInput.fill(user.firstName);
        await this.lastNameInput.fill(user.lastName);
        await this.companyInput.fill(user.company);
        await this.address1Input.fill(user.address1);
        await this.address2Input.fill(user.address2);
        await this.countrySelect.selectOption(user.country);
        await this.stateInput.fill(user.state);
        await this.cityInput.fill(user.city);
        await this.zipcodeInput.fill(user.zipcode);
        await this.mobileNumberInput.fill(user.mobileNumber);
    }

    async submit() {
        await this.clickWithAdHandling(this.createAccountButton);
    }
}
