const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
    throw new Error("API base URL is not defined in environment variables");
}

export const API_CONFIG = {
    baseUrl: API_BASE_URL,
    endpoints: {
        auth: {
            login: "/api/Auth/Login",
            logout: "/api/Auth/Logout"
        },
        generalList: {
            getFletes: "/api/GeneralLists/GetFletes",
            getSuppliers: "/api/GeneralLists/GetSuppliers",
            getDestination: "/api/GeneralLists/GetDestination",
        },
        fletes: {
            getMonthsWithData: "/api/Fletes/GeMonthsWithData",
            generateMonthlyReport: "/api/Fletes/GenerateMonthlyReport",
            create: "/api/Fletes/Create",
            update: "/api/Fletes/Update/",
            delete: "/api/Fletes/Delete/"
        }
    }
};