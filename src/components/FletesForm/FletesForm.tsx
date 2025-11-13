import { useEffect, useState } from "react";
import type { Suppliers } from "../../types/Suppliers";
import type { Destination } from "../../types/Destination";
import { generalListsService } from "../../api/services/GeneralListsService";
import { fletesService, type FletesFormData } from "../../api/services/FletesService";
import SelectField from "../Form/SelectField";
import InputField from "../Form/InputField";
import type { Flete } from "../../types/Flete";

interface Props {
    flete?: Flete | null;
    onSuccess?: () => void;
    onCancel?: () => void;
};

export const FletesForm = ({ flete, onSuccess, onCancel }: Props) => {
    const [formData, setFormData] = useState<FletesFormData>({
        idSupplier: 0,
        idDestination: 0,
        highwayExpenseCost: 0,
        costOfStay: 0
    });
    const [suppliers, setSuppliers] = useState<Suppliers[]>([]);
    const [destination, setDestination] = useState<Destination[]>([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [isEditing] = useState(!!flete);

    const selectedSupplier = suppliers.find(sup => sup.id === formData.idSupplier);
    const supplierName = selectedSupplier?.supplierName?.toUpperCase() || "";

    const isProveedorSinCosto = supplierName === "UNIDAD MESA" ||
        supplierName === "RECOLECCIONES A PROVEEDOR" ||
        supplierName === "ALEJANDRO CRUZ SOSA";

    const selectedDestination = destination.find(dest => dest.id === formData.idDestination);
    const originalDestinationCost = selectedDestination?.cost || 0;
    const selectedDestinationCost = isProveedorSinCosto ? 0 : originalDestinationCost;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [suppliersResponse, destinationResponse] = await Promise.all([
                    generalListsService.getSuppliers(),
                    generalListsService.getDestination()
                ]);

                setSuppliers(suppliersResponse);
                setDestination(destinationResponse);

                if (flete) {
                    const foundSupplier = suppliersResponse.find(
                        s => s.supplierName === flete.supplier
                    );

                    const foundDestination = destinationResponse.find(
                        d => d.destinationName === flete.destination
                    );

                    setFormData({
                        idSupplier: foundSupplier?.id || 0,
                        idDestination: foundDestination?.id || 0,
                        highwayExpenseCost: flete.highwayExpenseCost || 0,
                        costOfStay: flete.costOfStay || 0
                    });
                }
            } catch (error: any) {
                console.error("Error fetching data: ", error);
                setSuppliers([]);
                setDestination([]);
            }
        };
        fetchData();
    }, [flete]);

    useEffect(() => {
        if (isProveedorSinCosto && (formData.highwayExpenseCost > 0 || formData.costOfStay > 0)) {
            setFormData(prev => ({
                ...prev,
                highwayExpenseCost: 0,
                costOfStay: 0
            }));
        }
    }, [isProveedorSinCosto, formData.highwayExpenseCost, formData.costOfStay]);

    const supplierOptions = suppliers.map(supplier => ({
        value: supplier.id,
        label: supplier.supplierName
    }));

    const destinationOptions = destination.map(dest => ({
        value: dest.id,
        label: dest.destinationName
    }));

    const handleInputChange = (field: keyof FletesFormData, value: string | number) => {
        if (isProveedorSinCosto && (field === 'highwayExpenseCost' || field === 'costOfStay')) {
            return;
        }

        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        setError("");
        setSuccess("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.idSupplier || !formData.idDestination) {
            setError("Por favor, selecciona un proveedor y una ruta");
            return;
        };

        if (formData.idSupplier === 0 || formData.idDestination === 0) {
            setError("Por favor, selecciona un proveedor y una ruta válidos");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            let response;

            const submitData = {
                ...formData,
                highwayExpenseCost: isProveedorSinCosto ? 0 : formData.highwayExpenseCost,
                costOfStay: isProveedorSinCosto ? 0 : formData.costOfStay
            };

            if (isEditing && flete) {
                response = await fletesService.update(flete.id, submitData);
            } else {
                response = await fletesService.create(submitData);
            }

            if (response.success) {
                setSuccess(isEditing ? "Flete actualizado correctamente" : "Flete guardado correctamente");

                if (!isEditing) {
                    setFormData({
                        idSupplier: 0,
                        idDestination: 0,
                        highwayExpenseCost: 0,
                        costOfStay: 0
                    });
                }

                setTimeout(() => {
                    if (onSuccess) {
                        onSuccess();
                    }
                }, 1500);
            }

        } catch (error: any) {
            console.error(`Error al ${isEditing ? 'actualizar' : 'guardar'} flete: `, error);
            if (error.response?.data?.message) {
                setError(`Error: ${error.response.data.message}`);
            } else if (error.message) {
                setError(`Error: ${error.message}`);
            } else {
                setError(`Error desconocido al ${isEditing ? 'actualizar' : 'guardar'} el flete`);
            }
        } finally {
            setLoading(false);
        }
    };

    const getProveedorSinCostoNombre = () => {
        if (supplierName === "UNIDAD MESA") return "Unidad MESA";
        if (supplierName === "RECOLECCIONES A PROVEEDOR") return "Recolecciones a Proveedor";
        if (supplierName === "ALEJANDRO CRUZ SOSA") return "Alejandro Cruz Sosa";
        return "";
    };

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="max-w-md overflow-y-auto space-y-3 px-4">
                {
                    success && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-green-800 text-sm">
                                {success}
                            </p>
                        </div>
                    )
                }

                {
                    error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-800 text-sm">
                                {error}
                            </p>
                        </div>
                    )
                }

                <SelectField
                    label="Proveedor"
                    options={supplierOptions}
                    value={formData.idSupplier}
                    onChange={(e) => handleInputChange("idSupplier", Number(e.target.value))}
                    required
                />

                <SelectField
                    label="Ruta"
                    options={destinationOptions}
                    value={formData.idDestination}
                    onChange={(e) => handleInputChange("idDestination", Number(e.target.value))}
                    required
                />

                {/* Mensaje cuando se selecciona proveedor sin costo */}
                {isProveedorSinCosto && formData.idDestination > 0 && (
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-800">
                            <span className="font-medium">Proveedor {getProveedorSinCostoNombre()} seleccionado: </span>
                            No se aplicará ningún costo (ni costo base ni adicionales).
                        </p>
                    </div>
                )}

                {
                    formData.idDestination > 0 && (
                        <div className={`p-3 rounded-lg border ${isProveedorSinCosto ? 'bg-gray-50 border-gray-200' : 'bg-orange-50 border-orange-200'
                            }`}>
                            <p className={`text-sm ${isProveedorSinCosto ? 'text-gray-600' : 'text-orange-800'
                                }`}>
                                <span className="font-medium">
                                    Costo de la ruta seleccionada:
                                </span>
                                {isProveedorSinCosto ? (
                                    <>
                                        <span className="line-through">${originalDestinationCost.toLocaleString()}</span>
                                        <span className="ml-2">$0 (No aplica para {getProveedorSinCostoNombre()})</span>
                                    </>
                                ) : (
                                    `$${selectedDestinationCost.toLocaleString()}`
                                )}
                            </p>
                            {isProveedorSinCosto && (
                                <p className="text-sm text-blue-600 mt-1">
                                    💡 El proveedor {getProveedorSinCostoNombre()} no genera costos de flete.
                                </p>
                            )}
                        </div>
                    )
                }

                <InputField
                    label="Costo de gastos de autopista (opcional)"
                    type="number"
                    value={isProveedorSinCosto ? 0 : formData.highwayExpenseCost || ""}
                    onChange={(e) => handleInputChange("highwayExpenseCost", Number(e.target.value))}
                    min="0"
                    disabled={isProveedorSinCosto}
                />

                <InputField
                    label="Costo por estadía (opcional)"
                    type="number"
                    value={isProveedorSinCosto ? 0 : formData.costOfStay || ""}
                    onChange={(e) => handleInputChange("costOfStay", Number(e.target.value))}
                    min="0"
                    disabled={isProveedorSinCosto}
                />

                <div className="pt-4 flex gap-3">
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={loading}
                            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2.5 px-4
                            rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 
                            focus:ring-offset-2 hover:cursor-pointer disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4
                        rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 
                        focus:ring-offset-2 hover:cursor-pointer disabled:opacity-50"
                    >
                        {loading
                            ? (isEditing ? "Actualizando..." : "Guardando...")
                            : (isEditing ? "Actualizar" : "Guardar")
                        }
                    </button>
                </div>
            </div>
        </form>
    );
};