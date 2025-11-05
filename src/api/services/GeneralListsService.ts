import { API_CONFIG } from "../../config/api";
import type { Destination } from "../../types/Destination";
import type { Flete } from "../../types/Flete";
import type { Suppliers } from "../../types/Suppliers";
import { apiClient } from "../client";

class GeneralListsService {
    private getSuppliersEndpoint = API_CONFIG.endpoints.generalList.getSuppliers;
    private getDestinationEndpoint = API_CONFIG.endpoints.generalList.getDestination;
    private getFletesEndpoint = API_CONFIG.endpoints.generalList.getFletes;

    async getFletes(): Promise<Flete[]> {
        return apiClient.get<Flete[]>(this.getFletesEndpoint);
    };

    async getSuppliers(): Promise<Suppliers[]> {
        return apiClient.get<Suppliers[]>(this.getSuppliersEndpoint);
    };

    async getDestination(): Promise<Destination[]> {
        return apiClient.get<Destination[]>(this.getDestinationEndpoint);
    };

};

export const generalListsService = new GeneralListsService();