import { useState } from "react";
import Logo from "../../assets/logomesa.png";

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    // const navigation = [
    //     {}
    //     // { name: "Inicio", href: "#" },
    //     // { name: "Servicios", href: "#" },
    //     // { name: "Proyectos", href: "#" },
    //     // { name: "Nosotros", href: "#" },
    //     // { name: "Contacto", href: "#" },
    // ];

    return (
        <nav className="bg-primary shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    <div className="flex items-center">
                        <div className="flex items-center">
                            <img
                                className="h-10 w-auto lg:h-12"
                                src={Logo}
                                alt="Logo de la empresa"
                            />
                            <div className="ml-3">
                                <h1 className="text-xl lg:text-2xl font-bold text-white uppercase">
                                    Embarques
                                </h1>
                            </div>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        {/* {navigation.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                            >
                                {item.name}
                            </a>
                        ))} */}
                    </div>

                    {/* Botones desktop */}
                    {/* <div className="hidden md:flex items-center space-x-4">
                        <button className=" bg-white rounded-md text-black hover:text-blue-600 px-4 py-2 text-sm font-medium transition-colors duration-200 hover:cursor-pointer">
                            Iniciar Sesión
                        </button>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors duration-200 shadow-md">
                            Registrarse
                        </button>
                    </div> */}

                    {/* Botón móvil */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-blue-600 hover:bg-gray-100 
                            focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 hover:cursor-pointer"
                            aria-expanded="false"
                        >
                            <span className="sr-only">Abrir menú principal</span>
                            {!isOpen ? (
                                <svg
                                    className="block h-6 w-6"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    className="block h-6 w-6"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Menú móvil */}
            {isOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
                        {/* {navigation.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                                onClick={() => setIsOpen(false)}
                            >
                                {item.name}
                            </a>
                        ))} */}
                        {/* <div className="pt-4 pb-3 border-t border-gray-200">
                            <div className="flex items-center px-5 space-y-1">
                                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-base font-medium transition-colors duration-200 mb-2">
                                    Registrarse
                                </button>
                                <button className="w-full text-gray-700 hover:text-blue-600 px-4 py-2 rounded-md text-base font-medium transition-colors 
                                    duration-200 border border-gray-300 hover:cursor-pointer">
                                    Iniciar Sesión
                                </button>
                            </div>
                        </div> */}
                    </div>
                </div>
            )}
        </nav>
    );
};