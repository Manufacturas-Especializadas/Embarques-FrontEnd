export interface Flete {
    id: number;
    supplier: string;
    destination: string;
    highwayExpenseCost: number;
    costOfStay: number;
    individualCost: number;
    date: string;
    idSupplier: number;
    idDestination: number;
    registrationDate: string;
};

export interface FletesTableProps {
    fletes: Flete[];
    loading?: boolean;
}