import { API_CONFIG } from "../../config/api";
import type { Flete } from "../../types/Flete";
import type { Months } from "../../types/Months";
import { apiClient } from "../client";

export interface FletesFormData {
    idSupplier: number;
    idDestination: number;
    highwayExpenseCost: number;
    costOfStay: number;
    registrationDate: string;
    tripNumber: number;
};

export interface FletesResponse {
    success?: boolean;
    message?: string;
    IdFletes: string | number;
};

export interface ReportRequest {
    year: number;
    month: number;
}

class FletesService {
    private getMonthsEndpoint = API_CONFIG.endpoints.fletes.getMonthsWithData;
    private generateMonthlyReportEndpoint = API_CONFIG.endpoints.fletes.generateMonthlyReport;
    private getFleteByIdEndpoint = API_CONFIG.endpoints.fletes.getFletesById;
    private createEndpoint = API_CONFIG.endpoints.fletes.create;
    private updateEndpoint = API_CONFIG.endpoints.fletes.update;
    private deleteEndpoint = API_CONFIG.endpoints.fletes.delete;

    async getMonths(): Promise<Months[]> {
        return apiClient.get<Months[]>(this.getMonthsEndpoint);
    };

    async generateMonthlyReport(year: number, month: number): Promise<void> {
        const requestData: ReportRequest = { year, month };
        const monthName = new Date(year, month - 1).toLocaleString('es-MX', { month: 'long' });
        const filename = `Reporte_${monthName}_${year}.xlsx`;

        await apiClient.downloadFile(this.generateMonthlyReportEndpoint, filename, requestData);
    };

    async getFleteById(id: number): Promise<Flete> {
        return apiClient.get<Flete>(`${this.getFleteByIdEndpoint}${id}`);
    };

    async create(formData: FletesFormData): Promise<FletesResponse> {
        const response = await apiClient.post<FletesResponse>(
            this.createEndpoint,
            formData
        );

        return response;
    };

    async update(id: number, formData: FletesFormData): Promise<FletesResponse> {
        const response = await apiClient.put<FletesResponse>(
            `${this.updateEndpoint}${id}`,
            formData
        );

        return response;
    };

    async delete(id: number): Promise<FletesResponse> {
        return apiClient.delete(`${this.deleteEndpoint}${id}`);
    };
};

export const fletesService = new FletesService();