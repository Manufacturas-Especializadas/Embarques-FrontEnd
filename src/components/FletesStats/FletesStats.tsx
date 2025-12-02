import type { Flete } from "../../types/Flete";
import { useState, useEffect } from "react";

interface FletesStatsProps {
    data: Flete[];
}

export const FletesStats = ({ data }: FletesStatsProps) => {
    const [currentMonthData, setCurrentMonthData] = useState<Flete[]>([]);

    useEffect(() => {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        const filteredData = data.filter(flete => {
            if (!flete.registrationDate) return false;

            const parts = flete.registrationDate.split('/');

            const isoDateStr = `${parts[2]}-${parts[1]}-${parts[0]}`;

            const fleteDate = new Date(isoDateStr);

            return fleteDate.getMonth() === currentMonth &&
                fleteDate.getFullYear() === currentYear;
        });

        setCurrentMonthData(filteredData);
    }, [data]);

    const totalFreight = currentMonthData.length;
    const totalCost = currentMonthData.reduce((sum, flete) => sum + flete.individualCost, 0);
    const averageCost = totalFreight > 0 ? totalCost / totalFreight : 0;

    const currentMonthName = new Date().toLocaleDateString('es-MX', {
        month: 'long',
        year: 'numeric'
    }).toUpperCase();

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
                <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">
                            Total de fletes del mes
                        </p>
                        <p className="text-2xl font-semibold text-gray-900">
                            {totalFreight}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            {currentMonthName}
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
                <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                    </div>
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">
                            Costo total del mes
                        </p>
                        <p className="text-2xl font-semibold text-green-600">
                            {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(totalCost)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            {currentMonthName}
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-500">
                <div className="flex items-center">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">
                            Costo promedio por flete
                        </p>
                        <p className="text-2xl font-semibold text-purple-600">
                            {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(averageCost)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            {currentMonthName}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};