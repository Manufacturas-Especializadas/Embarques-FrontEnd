import { useState } from "react";
import Logo from "../../assets/logomesa.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const navigate = useNavigate();
    const { user, logout, loading, isAuthenticated } = useAuth();

    const handleLogout = async () => {
        try {
            setIsProfileOpen(false);
            setIsOpen(false);
            await logout();
            navigate("/");
        } catch (error) {
            console.error("Error durante el logout:", error);
        }
    };

    const handleLogin = () => {
        navigate("/login");
        setIsOpen(false);
    };

    const handleHome = () => {
        navigate("/");
        setIsOpen(false);
    };

    if (loading) {
        return <NavbarSkeleton />;
    }

    return (
        <nav className="bg-primary shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    <div className="flex items-center">
                        <div
                            className="flex items-center hover:cursor-pointer"
                            onClick={handleHome}
                        >
                            <img
                                className="h-10 w-auto lg:h-12"
                                src={Logo}
                                alt="Logo de la empresa"
                            />
                            <div className="ml-3">
                                <h1 className="text-xl lg:text-2xl font-bold text-white uppercase">
                                    Embarques
                                </h1>
                                <p className="text-xs text-blue-200 hidden sm:block">
                                    {isAuthenticated ? "Modo Administrativo" : "Modo Público"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center space-x-2 text-white hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:cursor-pointer"
                                >
                                    <div className="flex items-center space-x-2">
                                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                                            <span className="text-primary font-bold text-sm">
                                                {user?.name?.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <span className="max-w-32 truncate">
                                            {user?.name}
                                        </span>
                                        <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                                            {user?.role}
                                        </span>
                                        <svg
                                            className={`w-4 h-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </button>

                                {/* Dropdown Menu */}
                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                        <div className="px-4 py-2 text-sm text-gray-700 border-b">
                                            <div className="font-medium truncate">{user?.name}</div>
                                            <div className="text-gray-500 text-xs truncate">{user?.role}</div>
                                            <div className="text-gray-500 text-xs">#{user?.payrollNumber}</div>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 
                                            transition-colors duration-200 hover:cursor-pointer"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            Cerrar Sesión
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <span className="text-white text-sm">
                                    Modo de solo lectura
                                </span>
                                <button
                                    onClick={handleLogin}
                                    className="bg-white rounded-md text-primary hover:bg-blue-50 px-4 py-2 text-sm font-medium transition-colors duration-200 hover:cursor-pointer border border-transparent hover:border-primary"
                                >
                                    Acceso Admin
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Botón Móvil */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-blue-200 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white hover:cursor-pointer"
                            aria-expanded="false"
                        >
                            <span className="sr-only">Abrir menú principal</span>
                            {!isOpen ? (
                                <svg className="block h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Menú Móvil */}
            {isOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
                        {isAuthenticated ? (
                            <>
                                <div className="px-3 py-4 border-b border-gray-200">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                                            <span className="text-white font-bold text-sm">
                                                {user?.name?.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-gray-900 truncate">
                                                {user?.name}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {user?.role} • #{user?.payrollNumber}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleLogout}
                                    className="flex items-center w-full text-left px-3 py-2 text-base font-medium 
                                    text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-md transition-colors 
                                    duration-200 hover:cursor-pointer"
                                >
                                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Cerrar Sesión
                                </button>
                            </>
                        ) : (
                            <div className="space-y-3">
                                <div className="px-3 py-2 text-sm text-gray-600 bg-gray-50 rounded-md">
                                    💡 Modo de solo lectura
                                </div>
                                <button
                                    onClick={handleLogin}
                                    className="w-full text-center bg-primary text-white px-4 py-2 rounded-md text-base 
                                    font-medium transition-colors duration-200 hover:bg-blue-700 hover:cursor-pointer"
                                >
                                    Acceso Administrativo
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {isProfileOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsProfileOpen(false)}
                ></div>
            )}
        </nav>
    );
};

// Componente de skeleton para loading
const NavbarSkeleton = () => (
    <nav className="bg-primary shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-20">
                <div className="flex items-center">
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-400 rounded animate-pulse"></div>
                        <div className="ml-3">
                            <div className="h-6 w-32 bg-blue-400 rounded animate-pulse"></div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center">
                    <div className="h-8 w-24 bg-blue-400 rounded animate-pulse"></div>
                </div>
            </div>
        </div>
    </nav>
);