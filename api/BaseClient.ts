import { APIRequestContext, APIResponse } from '@playwright/test';

export class BaseClient {
    constructor(protected request: APIRequestContext) { }

    async invokeWithRetry(action: () => Promise<APIResponse>, attempts = 3): Promise<APIResponse> {
        let lastError;
        for (let i = 0; i < attempts; i++) {
            try {
                const response = await action();
                if (response.status() >= 500) {
                    // Server error, might be transient
                    console.log(`API 5xx error (attempt ${i + 1}): ${response.status()}`);
                } else {
                    return response;
                }
            } catch (e) {
                lastError = e;
                console.log(`API Request failed (attempt ${i + 1}): ${e}`);
                await new Promise(r => setTimeout(r, 1000)); // wait 1s
            }
        }
        throw lastError || new Error('API Request failed after retries');
    }

    protected async post(url: string, data: any): Promise<APIResponse> {
        return this.invokeWithRetry(() => this.request.post(url, {
            form: data
        }));
    }

    protected async get(url: string, params?: any): Promise<APIResponse> {
        return this.invokeWithRetry(() => this.request.get(url, {
            params: params,
        }));
    }

    protected async put(url: string, data: any): Promise<APIResponse> {
        return this.invokeWithRetry(() => this.request.put(url, {
            form: data
        }));
    }

    protected async delete(url: string, data?: any): Promise<APIResponse> {
        return this.invokeWithRetry(() => this.request.delete(url, {
            form: data
        }));
    }
}
