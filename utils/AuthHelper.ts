import { APIRequestContext, BrowserContext, request as playwrightRequest } from '@playwright/test';
import { AuthApi } from '../api/AuthApi';
import { User } from '../data/types';

export class AuthHelper {
    static async registerUser(user: User) {
        const requestContext = await playwrightRequest.newContext({
            baseURL: process.env.BASE_URL || 'https://automationexercise.com'
        });
        const authApi = new AuthApi(requestContext);
        const regResponse = await authApi.registerUser(user);
        if (!regResponse.ok()) {
            throw new Error(`Failed to register user: ${await regResponse.text()}`);
        }
        await requestContext.dispose();
    }

    static async registerAndLogin(user: User) {
        const requestContext = await playwrightRequest.newContext({
            baseURL: process.env.BASE_URL || 'https://automationexercise.com'
        });
        const authApi = new AuthApi(requestContext);

        try {
            // Register
            const regResponse = await authApi.registerUser(user);
            if (!regResponse.ok()) {
                const text = await regResponse.text();
                // If user exists, try to login directly, otherwise warn
                if (!text.includes('Email already exists')) {
                    throw new Error(`Failed to register user: ${text}`);
                }
            }

            // Verify Login (this endpoint sets the necessary cookies for the session)
            const loginResponse = await authApi.verifyLogin(user.email, user.password);
            if (!loginResponse.ok()) {
                throw new Error(`Failed to login user: ${await loginResponse.text()}`);
            }

            // Get storage state
            const storageState = await requestContext.storageState();
            return storageState;
        } finally {
            await requestContext.dispose();
        }
    }

    static async deleteAccount(user: User) {
        const requestContext = await playwrightRequest.newContext({
            baseURL: process.env.BASE_URL || 'https://automationexercise.com'
        });
        const authApi = new AuthApi(requestContext);
        try {
            await authApi.deleteAccount(user.email, user.password);
        } catch (e) {
            console.log(`Warning: Failed to delete account ${user.email} via API: ${e}`);
        } finally {
            await requestContext.dispose();
        }
    }
}
