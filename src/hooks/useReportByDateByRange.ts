import { useState } from "react";
import { fletesService } from "../api/services/FletesService";


export const useReportByDateRange = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);


    const reportByDateRange = async (startDate: string, endDate: string) => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(false);

            const start = new Date(startDate);
            const end = new Date(endDate);

            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                throw new Error("Formato de fecha inválido");
            }

            if (start > end) {
                throw new Error("La fecha inicial no puede ser mayor que la final");
            }

            await fletesService.generateReportByDateRange(startDate, endDate);
            setSuccess(true);
        } catch (error: any) {
            console.error("Error generating report:", error);
            const errorMessage = error.response?.data?.message ||
                error.message ||
                "Error al generar el reporte";
            setError(errorMessage);
        } finally {
            setLoading(true);
        }
    };

    const resetState = () => {
        setError(null);
        setSuccess(false);
        setLoading(false);
    };

    return {
        loading,
        error,
        success,
        reportByDateRange,
        resetState
    };
};