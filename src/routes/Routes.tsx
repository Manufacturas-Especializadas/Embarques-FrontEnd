import { Route, Routes } from "react-router-dom";
import { FletesIndex } from "../pages/Fletes/FletesIndex";
import { ReportsIndex } from "../pages/Reports/ReportsIndex";

export const MyRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<FletesIndex />} />
            <Route path="/reportes" element={<ReportsIndex />} />
        </Routes>
    );
};