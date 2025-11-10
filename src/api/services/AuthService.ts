import { API_CONFIG } from "../../config/api";
import { apiClient } from "../client";

export interface UserResponse {
    success?: boolean;
    message?: string;
    userId?: string;
};

class AuthService {
    private loginEndpoint = API_CONFIG.endpoints.auth.login;
    private logoutEndpoint = API_CONFIG.endpoints.auth.logout;

    async login(payRollNumber: number, password: string): Promise<any> {
        return apiClient.post(this.loginEndpoint, { payRollNumber, password });
    };

    async logout(): Promise<{ message: string }> {
        try {
            const response = await apiClient.post<{ message: string }>(
                this.logoutEndpoint,
                {}
            );

            return response;
        } catch (error) {
            console.error('Error durante el logout:', error);
            throw error;
        }
    }

    clearLocalAuth(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
    }
};

export const authService = new AuthService();