import { useEffect, useState } from "react";
import type { Months } from "../../types/Months";
import { fletesService } from "../../api/services/FletesService";

export const ReportsTable = () => {
    const [months, setMonths] = useState<Months[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [downloading, setDownloading] = useState<string | null>(null);

    useEffect(() => {
        const fetchMonths = async () => {
            try {
                setLoading(true);
                const response = await fletesService.getMonths();
                setMonths(response);
            } catch (error: any) {
                console.error("Error fetching: ", error);
                setMonths([]);
                setError("Error al cargar los meses");
            } finally {
                setLoading(false);
            }
        };
        fetchMonths();
    }, []);

    const downloadReport = async (year: number, month: number, monthId: string) => {
        try {
            setDownloading(monthId);
            setError("");
            await fletesService.generateMonthlyReport(year, month);
        } catch (error: any) {
            console.error("Error al descargar: ", error);
            setError("Error al descargar el reporte");
        } finally {
            setDownloading(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="text-gray-500">Cargando meses disponibles...</div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg m-4">
                    <p className="text-red-800 text-sm">{error}</p>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Mes
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {months.length === 0 ? (
                            <tr>
                                <td colSpan={2} className="px-6 py-8 text-center text-gray-500">
                                    No hay meses con datos disponibles
                                </td>
                            </tr>
                        ) : (
                            months.map((month) => {
                                const monthId = `${month.year}-${month.month}`;
                                const isDownloading = downloading === monthId;

                                return (
                                    <tr key={monthId} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {month.description}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => downloadReport(month.year, month.month, monthId)}
                                                disabled={isDownloading}
                                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isDownloading
                                                        ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                                                        : "bg-green-600 hover:bg-green-700 text-white hover:cursor-pointer"
                                                    }`}
                                            >
                                                {isDownloading ? "Descargando..." : "Descargar Reporte"}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};