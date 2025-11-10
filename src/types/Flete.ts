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
};

export interface FletesTableProps {
    fletes: Flete[];
    loading?: boolean;
}