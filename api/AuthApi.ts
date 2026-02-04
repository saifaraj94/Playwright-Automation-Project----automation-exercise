import { APIRequestContext } from '@playwright/test';
import { BaseClient } from './BaseClient';
import { User } from '../data/types';

export class AuthApi extends BaseClient {
    constructor(request: APIRequestContext) {
        super(request);
    }

    async registerUser(user: User) {
        const response = await this.request.post('/api/createAccount', {
            form: {
                name: user.name,
                email: user.email,
                password: user.password,
                title: user.title,
                birth_date: user.birthDay,
                birth_month: user.birthMonth,
                birth_year: user.birthYear,
                firstname: user.firstName,
                lastname: user.lastName,
                company: user.company,
                address1: user.address1,
                address2: user.address2,
                country: user.country,
                zipcode: user.zipcode,
                state: user.state,
                city: user.city,
                mobile_number: user.mobileNumber
            }
        });
        return response;
    }

    async verifyLogin(email: string, password: string) {
        const response = await this.request.post('/api/verifyLogin', {
            form: {
                email,
                password
            }
        })
        return response;
    }

    async deleteAccount(email: string, password: string) {
        const response = await this.request.delete('/api/deleteAccount', {
            form: {
                email,
                password
            }
        });
        return response;
    }
}
