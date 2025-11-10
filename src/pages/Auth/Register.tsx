import Logo from "../../assets/logomesa.png";

export const Register = () => {
    return (
        <div className="min-h-screen bg-indigo-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
                <div className="flex justify-center mb-8">
                    <img src={Logo} alt="MESA" className="h-20 w-auto" />
                </div>

                <h2 className="text-2xl font-bold text-gray-800 text-center mb-6 uppercase">
                    Registrar usuario
                </h2>
            </div>
        </div>
    );
};