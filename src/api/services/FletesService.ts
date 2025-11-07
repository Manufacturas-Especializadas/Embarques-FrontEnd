import { API_CONFIG } from "../../config/api";
import type { Months } from "../../types/Months";
import { apiClient } from "../client";

export interface FletesFormData {
    idSupplier: number;
    idDestination: number;
    highwayExpenseCost: number;
    costOfStay: number;
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
    private createEndpoint = API_CONFIG.endpoints.fletes.create;


    async getMonths(): Promise<Months[]> {
        return apiClient.get<Months[]>(this.getMonthsEndpoint);
    };

    async generateMonthlyReport(year: number, month: number): Promise<void> {
        const requestData: ReportRequest = { year, month };
        const monthName = new Date(year, month - 1).toLocaleString('es-MX', { month: 'long' });
        const filename = `Reporte_${monthName}_${year}.xlsx`;

        await apiClient.downloadFile(this.generateMonthlyReportEndpoint, filename, requestData);
    };

    async create(formData: FletesFormData): Promise<FletesResponse> {
        const response = await apiClient.post<FletesResponse>(
            this.createEndpoint,
            formData
        );

        return response;
    };
};

export const fletesService = new FletesService();