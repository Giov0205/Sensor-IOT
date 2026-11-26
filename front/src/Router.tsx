import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Home from './pages/Home';
import Lecturas from './pages/Lectura';
import Alertas from './pages/Alertas';
import Configuracion from './pages/Configuracion';
import Layout from './components/Layout';

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        {/* Pantallas que necesitan sesión iniciada */}
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/lecturas" element={<Lecturas />} />
          <Route path="/alertas" element={<Alertas />} />
          <Route path="/config" element={<Configuracion />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
