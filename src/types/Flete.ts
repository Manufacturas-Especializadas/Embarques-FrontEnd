export interface Flete {
    id: number;
    supplier: string;
    destination: string;
    highwayExpenseCost: number;
    individualCost: number;
    date: string;
};

export interface FletesTableProps {
    fletes: Flete[];
    loading?: boolean;
}