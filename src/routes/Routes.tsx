import { Route, Routes } from "react-router-dom";
import { FletesIndex } from "../pages/Fletes/FletesIndex";
import { ReportsIndex } from "../pages/Reports/ReportsIndex";
import { Register } from "../pages/Auth/Register";
import { Login } from "../pages/Auth/Login";

export const MyRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<FletesIndex />} />
            <Route path="/reportes" element={<ReportsIndex />} />

            <Route path="/registro" element={<Register />} />
            <Route path="/login" element={<Login />} />
        </Routes>
    );
};