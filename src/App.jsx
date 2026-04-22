//src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import InventarioLayout from "./pages/InventarioLayout";
import InventarioProductosPage from "./components/inventario/InventarioProductosPage";
import InventarioCategoriasPage from "./components/inventario/InventarioCategoriasPage";
import InventarioMarcasPage from "./components/inventario/InventarioMarcasPage";
import InventarioUnidadesPage from "./components/inventario/InventarioUnidadesPage";
import PuntoVentaPage from "./pages/PuntoVentaPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* 🔓 PUBLICA */}
          <Route path="/" element={<LoginPage />} />

          {/* 🔒 PRIVADAS */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/inventario"
            element={
              <PrivateRoute>
                <InventarioLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<InventarioProductosPage />} />
            <Route path="productos" element={<InventarioProductosPage />} />
            <Route path="categorias" element={<InventarioCategoriasPage />} />
            <Route path="marcas" element={<InventarioMarcasPage />} />
            <Route path="unidades" element={<InventarioUnidadesPage />} />
          </Route>

          <Route
            path="/punto-venta"
            element={
              <PrivateRoute>
                <PuntoVentaPage />
              </PrivateRoute>
            }
          />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;