import { BrowserRouter } from "react-router-dom";
import { MyRoutes } from "./routes/Routes";
import { Navbar } from "./components/Navbar/Navbar";

export const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <MyRoutes />
      </main>
    </BrowserRouter>
  );
};