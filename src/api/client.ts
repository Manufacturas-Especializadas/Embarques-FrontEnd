import { API_CONFIG } from "../config/api";

class ApiClient {
    private baseUrl: string;

    constructor() {
        this.baseUrl = API_CONFIG.baseUrl;
    }

    private getAuthHeaders(): HeadersInit {
        const token = localStorage.getItem("token");
        return token ? { Authorization: `Bearer ${token}` } : {};
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...this.getAuthHeaders(),
                ...options.headers,
            },
            ...options,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `HTTP Error: ${response.status} - ${response.statusText}`);
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return response.json() as Promise<T>;
        }

        return null as unknown as T;
    }

    get<T>(endpoint: string) {
        return this.request<T>(endpoint, { method: 'GET' });
    }

    async post<T>(endpoint: string, data: any): Promise<T> {
        if (data instanceof FormData) {
            return this.request<T>(endpoint, {
                method: "POST",
                headers: this.getAuthHeaders(),
                body: data,
            });
        } else {
            return this.request<T>(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...this.getAuthHeaders(),
                },
                body: JSON.stringify(data),
            });
        }
    }

    async put<T>(endpoint: string, data: any): Promise<T> {
        const fullUrl = `${this.baseUrl}${endpoint}`;
        const authHeaders = this.getAuthHeaders();

        if (data instanceof FormData) {
            const response = await fetch(fullUrl, {
                method: "PUT",
                headers: { ...authHeaders },
                body: data,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Error en la solicitud PUT con FormData");
            }
            return response.json();

        } else {
            const response = await fetch(fullUrl, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...authHeaders,
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Error en la solicitud PUT con JSON");
            }
            return response.json();
        }
    }

    delete<T>(endpoint: string) {
        return this.request<T>(endpoint, { method: 'DELETE' });
    }

    async downloadFile(endpoint: string, filename: string, data?: any): Promise<void> {
        const url = `${this.baseUrl}${endpoint}`;

        const options: RequestInit = {
            method: data ? "POST" : "GET",
            headers: this.getAuthHeaders(),
        };

        if (data) {
            options.headers = {
                ...options.headers,
                "Content-Type": "application/json",
            };
            options.body = JSON.stringify(data);
        }

        const response = await fetch(url, options);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `HTTP Error: ${response.status}`);
        }

        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
    }
}

export const apiClient = new ApiClient();