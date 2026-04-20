//src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

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
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/inventario" element={<InventarioLayout />}>
          <Route index element={<InventarioProductosPage />} />
          <Route path="productos" element={<InventarioProductosPage />} />
          <Route path="categorias" element={<InventarioCategoriasPage />} />
          <Route path="marcas" element={<InventarioMarcasPage />} />
          <Route path="unidades" element={<InventarioUnidadesPage />} />
        </Route>
        <Route path="/punto-venta" element={<PuntoVentaPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
