import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { authService } from "../api/services/AuthService";

interface User {
    id: string;
    name: string;
    role: string;
    payrollNumber: string;
}

interface AuthContextType {
    user: User | null;
    login: (token: string) => void;
    logout: () => Promise<void>;
    loading: boolean;
    isAuthenticated: boolean;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const isAuthenticated = !!user;
    const isAdmin = user?.role === "Admin";

    useEffect(() => {
        initializeAuth();
    }, []);

    const initializeAuth = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const payload = decodeJwtToken(token);
                setUser({
                    id: payload.sub || payload.nameid,
                    name: payload.unique_name || payload.name,
                    role: payload.role,
                    payrollNumber: payload.PayRollNumber || '',
                });
            } catch (error) {
                console.error("Token inválido", error);
                await handleCleanLogout();
            }
        }
        setLoading(false);
    };

    const handleCleanLogout = async (callBackend: boolean = true) => {
        try {
            if (callBackend && user) {
                await authService.logout();
            }
        } catch (error) {
            console.warn("Error llamando al backend logout:", error);
        } finally {
            authService.clearLocalAuth();
            setUser(null);
        }
    };

    const login = (token: string) => {
        if (!token || typeof token !== 'string') {
            console.error("Token inválido o ausente en login()");
            return;
        }

        try {
            const payload = decodeJwtToken(token);

            const newUser: User = {
                id: payload.sub || payload.nameid,
                name: payload.unique_name || payload.name,
                role: payload.role,
                payrollNumber: payload.PayRollNumber || '',
            };

            setUser(newUser);
            localStorage.setItem("token", token);
        } catch (error) {
            console.error("Error al procesar el token:", error);
        }
    };

    const logout = async (): Promise<void> => {
        await handleCleanLogout(true);
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            loading,
            isAuthenticated,
            isAdmin
        }}>
            {children}
        </AuthContext.Provider>
    );
};

const decodeJwtToken = (token: string): any => {
    try {
        const payloadBase64 = token.split('.')[1];
        if (!payloadBase64) {
            throw new Error("Token JWT malformado");
        }

        const paddedPayload = payloadBase64.padEnd(payloadBase64.length + (4 - payloadBase64.length % 4) % 4, '=');
        const payloadJson = atob(paddedPayload);
        return JSON.parse(payloadJson);
    } catch (error) {
        throw new Error(`Error decodificando token: ${error}`);
    }
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe usarse dentro del AuthProvider");
    }
    return context;
};