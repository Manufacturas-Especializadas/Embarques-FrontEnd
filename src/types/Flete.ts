export interface Flete {
    id: number;
    supplier: string;
    destination: string;
    highwayExpenseCost: number;
    costOfStay: number;
    individualCost: number;
    date: string;
};

export interface FletesTableProps {
    fletes: Flete[];
    loading?: boolean;
}