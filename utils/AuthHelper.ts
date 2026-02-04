import { APIRequestContext, BrowserContext, request as playwrightRequest } from '@playwright/test';
import { AuthApi } from '../api/AuthApi';
import { User } from '../data/types';

export class AuthHelper {
    static async registerUser(user: User) {
        const requestContext = await playwrightRequest.newContext({
            baseURL: process.env.BASE_URL
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
            baseURL: process.env.BASE_URL
        });
        const authApi = new AuthApi(requestContext);

        // Register
        const regResponse = await authApi.registerUser(user);
        if (!regResponse.ok()) {
            throw new Error(`Failed to register user: ${await regResponse.text()}`);
        }

        // Verify Login (which effectively logs them in and sets cookies)
        const loginResponse = await authApi.verifyLogin(user.email, user.password);
        if (!loginResponse.ok()) {
            throw new Error(`Failed to login user: ${await loginResponse.text()}`);
        }

        // Get storage state
        const storageState = await requestContext.storageState();
        await requestContext.dispose();

        return storageState;
    }

    static async deleteAccount(user: User) {
        const requestContext = await playwrightRequest.newContext({
            baseURL: process.env.BASE_URL
        });
        const authApi = new AuthApi(requestContext);
        await authApi.deleteAccount(user.email, user.password);
        await requestContext.dispose();
    }
}
