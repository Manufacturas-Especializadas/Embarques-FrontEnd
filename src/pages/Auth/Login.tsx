import React, { useState } from "react";
import Logo from "../../assets/logomesa.png";
import InputField from "../../components/Form/InputField";
import FormButton from "../../components/Form/FormButton";
import { authService } from "../../api/services/AuthService";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface LoginForm {
    payRollNumber: string;
    password: string;
};

export const Login = () => {
    const { login } = useAuth();
    const [formData, setFormData] = useState<LoginForm>({
        payRollNumber: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleInputChange = (field: keyof LoginForm, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        setError("");
        setSuccess("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setIsSubmitting(true);

        const payRollNumber = formData.payRollNumber;
        if (!payRollNumber || isNaN(Number(payRollNumber)) || Number(payRollNumber) <= 0) {
            setError("Por favor, ingresa un número de nómina válido.");
            setIsSubmitting(false);
            return;
        }

        if (!formData.password || formData.password.length < 4) {
            setError("La contraseña debe tener al menos 4 caracteres.");
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await authService.login(Number(payRollNumber), formData.password);

            if (!response) {
                setError("Error de conexión con el servidor.");
                return;
            }

            if (response.success === false) {
                setError(response.message || "Credenciales incorrectas");
                return;
            }

            if (!response.accessToken || typeof response.accessToken !== 'string') {
                setError("Error interno del sistema");
                return;
            }

            setSuccess("¡Inicio de sesión exitoso! Redirigiendo...");

            login(response.accessToken);
            localStorage.setItem("refreshToken", response.refreshToken);

            setTimeout(() => {
                navigate("/");
            }, 1200);

        } catch (error: any) {
            if (error.response?.status === 401) {
                setError("Credenciales incorrectas. Verifica tu número de nómina y contraseña.");
            } else if (error.response?.status === 500) {
                setError("Error del servidor. Por favor, intenta más tarde.");
            } else if (error.code === 'NETWORK_ERROR') {
                setError("Error de conexión. Verifica tu internet.");
            } else {
                setError("Error inesperado. Por favor, contacta al administrador.");
            }

            setSuccess("");
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            payRollNumber: "",
            password: "",
        });
        setError("");
        setSuccess("");
        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen bg-indigo-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
                <div className="flex justify-center mb-8">
                    <img src={Logo} alt="MESA" className="h-20 w-auto" />
                </div>

                <h2 className="text-2xl font-bold text-gray-800 text-center mb-6 uppercase">
                    Iniciar sesión
                </h2>

                {success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 transition-all duration-300">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            {success}
                        </div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 transition-all duration-300">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            {error}
                        </div>
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <InputField
                            label="Número de nómina"
                            type="text"
                            name="payRollNumber"
                            value={formData.payRollNumber}
                            onChange={(e) => handleInputChange("payRollNumber", e.target.value)}
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    <div>
                        <InputField
                            label="Contraseña"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={(e) => handleInputChange("password", e.target.value)}
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="flex justify-center">
                        <FormButton
                            variant="primary"
                            type="submit"
                            disabled={isSubmitting}
                            className="relative"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Procesando...
                                </>
                            ) : (
                                "Entrar"
                            )}
                        </FormButton>
                    </div>

                    {(error || success) && (
                        <div className="text-center">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
                                disabled={isSubmitting}
                            >
                                Limpiar formulario
                            </button>
                        </div>
                    )}
                </form>

                {isSubmitting && (
                    <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-3">
                            <svg className="animate-spin h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className="text-gray-700">Verificando credenciales...</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};