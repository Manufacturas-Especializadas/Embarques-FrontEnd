import { BrowserRouter } from "react-router-dom";
import { MyRoutes } from "./routes/Routes";
import { Navbar } from "./components/Navbar/Navbar";
import { AuthProvider } from "./context/AuthContext";

export const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main>
          <MyRoutes />
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
};