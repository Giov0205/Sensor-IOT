import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Registro from "./pages/Registro";
import Lecturas from "./pages/Lectura"; // ✅ Importa la vista de lecturas
import Alertas from "./pages/Alertas"; //

function Router() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Ruta principal apunta al Login */}
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/lecturas" element={<Lecturas />} /> {/* ✅ Nueva ruta */}
          <Route path="/alertas" element={<Alertas />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default Router;
