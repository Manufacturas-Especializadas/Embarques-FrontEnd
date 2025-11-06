import { useState } from "react";
import type { Flete } from "../../types/Flete";

interface Props {
    data: Flete[];
};

export const FletesTable = ({ data }: Props) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(amount);
    };

    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = data.slice(startIndex, endIndex);

    const getPagesNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    };

    const handlePrevious = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const handleNext = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Proveedor
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Costo Individual
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Costo de gastos de autopista
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Destino
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Fecha
                            </th>
                            {/* <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th> */}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentData.map((flete) => (
                            <tr
                                key={flete.id}
                                className="hover:bg-gray-50 transition-colors duration-150"
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            <span className="text-blue-600 font-semibold text-sm">
                                                {flete.supplier.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {flete.supplier}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-semibold text-green-600">
                                        {formatCurrency(flete.individualCost)}
                                    </div>
                                </td>
                                <div className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-semibold text-blue-600">
                                        {formatCurrency(flete.highwayExpenseCost)}
                                    </div>
                                </div>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{flete.destination}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">
                                        {flete.date}
                                    </div>
                                </td>
                                {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button className="text-blue-600 hover:text-blue-900 mr-3 transition-colors duration-200
                                        hover:cursor-pointer">
                                        Editar
                                    </button>
                                    <button className="text-red-600 hover:text-red-900 transition-colors duration-200
                                        hover:cursor-pointer">
                                        Eliminar
                                    </button>
                                </td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {
                totalPages > 1 && (
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                            <button
                                onClick={handlePrevious}
                                disabled={currentPage === 1}
                                className={`px-4 py-2 text-sm font-medium rounded-md ${currentPage === 1
                                    ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                                    : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:cursor-pointer"
                                    }`}
                            >
                                Anterior
                            </button>

                            <div className="hidden md:flex space-x-1">
                                {
                                    getPagesNumbers().map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`px-4 py-2 text-sm font-medium rounded-md ${currentPage === page
                                                ? "bg-blue-600 text-white hover:cursor-pointer"
                                                : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:cursor-pointer"
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))
                                }
                            </div>

                            <div className="md:hidden text-sm text-gray-700">
                                Página {currentPage} de {totalPages}
                            </div>

                            <button
                                onClick={handleNext}
                                disabled={currentPage === totalPages}
                                className={`px-4 py-2 text-sm font-medium rounded-md ${currentPage === totalPages
                                    ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                                    : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:cursor-pointer"
                                    }`}
                            >
                                Siguiente
                            </button>
                        </div>
                    </div>
                )
            }

            {
                data.length === 0 && (
                    <div className="px-6 py-12 text-center">
                        <div className="text-gray-500 text-lg">
                            No hay datos disponibles
                        </div>
                        <div className="text-gray-400 text-sm mt-2">
                            No se encontrarón fletes para mostrar
                        </div>
                    </div>
                )
            }
        </div>
    );
};