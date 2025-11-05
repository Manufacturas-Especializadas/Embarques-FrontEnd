import { useEffect, useState } from "react";
import type { Suppliers } from "../../types/Suppliers";
import type { Destination } from "../../types/Destination";
import { generalListsService } from "../../api/services/GeneralListsService";
import { fletesService, type FletesFormData } from "../../api/services/FletesService";
import SelectField from "../Form/SelectField";
import InputField from "../Form/InputField";

export const FletesForm = () => {
    const [formData, setFormData] = useState<FletesFormData>({
        idSupplier: 0,
        idDestination: 0,
        highwayExpenseCost: 0
    });
    const [suppliers, setSuppliers] = useState<Suppliers[]>([]);
    const [destination, setDestination] = useState<Destination[]>([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const selectedDestinationCost = destination.find(dest => dest.id === formData.idDestination)?.cost || 0;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const suppliersResponse = await generalListsService.getSuppliers();
                setSuppliers(suppliersResponse);

                const destinationResponse = await generalListsService.getDestination();
                setDestination(destinationResponse);
            } catch (error: any) {
                console.error("Error fetching data: ", error);
                setSuppliers([]);
                setDestination([]);
            }
        };
        fetchData();
    }, []);

    const supplierOptions = suppliers.map(supplier => ({
        value: supplier.id,
        label: supplier.supplierName
    }));

    const destinationOptions = destination.map(dest => ({
        value: dest.id,
        label: dest.destinationName
    }));

    const handleInputChange = (field: keyof FletesFormData, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        setError("");
        setSuccess("");
    };

    const handleSubmit = async () => {
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
            const response = await fletesService.create(formData);

            if (response.success) {
                setSuccess("Flete guardado");
                setFormData({
                    idSupplier: 0,
                    idDestination: 0,
                    highwayExpenseCost: 0
                });

                setTimeout(() => {
                    setSuccess("");
                }, 500);
            }

        } catch (error: any) {
            console.error("Error al guardar flete: ", error);
            if (error.reponse?.data?.message) {
                setError(`Error: ${error.response.data.message}`);
            } else if (error.message) {
                setError(`Error: ${error.message}`);
            } else {
                setError("Error desconocido al guardar el flete");
            }
        } finally {
            setLoading(false);
        }
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

                {
                    formData.idDestination > 0 && (
                        <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                            <p className="text-sm text-orange-800">
                                <span className="font-medium">Costo de la ruta seleccionada: </span>
                                ${selectedDestinationCost.toLocaleString()}
                            </p>
                        </div>
                    )
                }

                <InputField
                    label="Costo de gastos de autopista (opcional)"
                    type="number"
                    value={formData.highwayExpenseCost || ""}
                    onChange={(e) => handleInputChange("highwayExpenseCost", Number(e.target.value))}
                    min="0"
                />

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4
                        rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 
                        focus:ring-offset-2 hover:cursor-pointer"
                    >
                        {loading ? "Guardando..." : "Guardar"}
                    </button>
                </div>
            </div>
        </form>
    );
};