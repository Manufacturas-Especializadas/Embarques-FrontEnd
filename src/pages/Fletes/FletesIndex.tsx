import { useEffect, useState } from "react";
import type { Flete } from "../../types/Flete";
import { FletesStats } from "../../components/FletesStats/FletesStats";
import { Loading } from "../../components/Loading/Loading";
import { FletesTable } from "../../components/FletesTable/FletesTable";
import { Modal } from "../../components/Modal/Modal";
import { FletesForm } from "../../components/FletesForm/FletesForm";
import { generalListsService } from "../../api/services/GeneralListsService";
import { useNavigate } from "react-router-dom";
import { RoleGuard } from "../../components/RoleGuard/RoleGuard";

export const FletesIndex = () => {
    const [fletes, setFletes] = useState<Flete[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFlete, setEditingFlete] = useState<Flete | null>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await generalListsService.getFletes();
            setFletes(response);
        } catch (error: any) {
            console.error("Error fetching: ", error);
            setFletes([]);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (flete: Flete) => {
        setEditingFlete(flete);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setEditingFlete(null);
        setIsModalOpen(true);
    };

    const handleFormSuccess = () => {
        setIsModalOpen(false);
        setEditingFlete(null);
        setRefreshTrigger(prev => prev + 1);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingFlete(null);
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (refreshTrigger > 0) {
            fetchData();
        }
    }, [refreshTrigger]);

    const filteredFletes = fletes.filter(flete =>
        flete.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
        flete.destination.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 uppercase">
                        Gestión de fletes
                    </h1>
                </div>

                <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar por proveedor o destino..."
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none
                            focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => navigate("/reportes")}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors 
                            duration-200 shadow-md flex items-center hover:cursor-pointer"
                        >
                            <svg
                                className="w-5 h-5 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                            Reportes
                        </button>
                        <RoleGuard allowedRoles={["Admin"]}>
                            <button
                                onClick={handleCreate}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors 
                            duration-200 shadow-md flex items-center hover:cursor-pointer"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Nuevo Flete
                            </button>
                        </RoleGuard>
                    </div>
                </div>

                {!loading && <FletesStats data={filteredFletes} />}

                <div className="bg-white rounded-lg shadow-lg">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Lista de fletes
                        </h2>
                    </div>
                    <div className="p-6">
                        {
                            loading ? (
                                <Loading />
                            ) : filteredFletes.length > 0 ? (
                                <FletesTable
                                    data={filteredFletes}
                                    onDeleteSuccess={() => setRefreshTrigger(prev => prev + 1)}
                                    onEdit={handleEdit}
                                />
                            ) : (
                                <div className="text-center py-12">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron fletes</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {searchTerm ? 'Intenta con otros términos de búsqueda.' : 'No hay fletes registrados aún.'}
                                    </p>
                                    <RoleGuard allowedRoles={["Admin"]}>
                                        {!searchTerm && (
                                            <button
                                                onClick={handleCreate}
                                                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                                            >
                                                Registrar primer flete
                                            </button>
                                        )}
                                    </RoleGuard>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingFlete ? "EDITAR FLETE" : "REGISTRAR NUEVO FLETE"}
            >
                <FletesForm
                    flete={editingFlete}
                    onSuccess={handleFormSuccess}
                    onCancel={handleCloseModal}
                />
            </Modal>
        </div>
    );
};