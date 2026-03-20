import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import InventarioLayout from "./pages/InventarioLayout";
import InventarioProductosPage from "./pages/InventarioProductosPage";
import InventarioCategoriasPage from "./pages/InventarioCategoriasPage";
import InventarioMarcasPage from "./pages/InventarioMarcasPage";
import InventarioUnidadesPage from "./pages/InventarioUnidadesPage";

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
