import { APIRequestContext, APIResponse } from '@playwright/test';

export class BaseClient {
    constructor(protected request: APIRequestContext) { }

    protected async post(url: string, data: any): Promise<APIResponse> {
        const response = await this.request.post(url, {
            form: data, // AutomationExercise uses form data often, check specific endpoints
        });
        return response;
    }

    protected async get(url: string, params?: any): Promise<APIResponse> {
        const response = await this.request.get(url, {
            params: params,
        });
        return response;
    }

    protected async put(url: string, data: any): Promise<APIResponse> {
        const response = await this.request.put(url, {
            form: data
        })
        return response;
    }

    protected async delete(url: string, data?: any): Promise<APIResponse> {
        const response = await this.request.delete(url, {
            form: data
        })
        return response;
    }
}
