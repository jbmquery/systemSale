//src/pages/InventarioLayout.jsx
import { Outlet, NavLink } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useState } from "react";

function InventarioLayout() {
  const [sidebarAbierto, setSidebarAbierto] = useState(false);

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-purple-50 to-purple-100">
      <Sidebar
        abierto={sidebarAbierto}
        cerrar={() => setSidebarAbierto(false)}
      />

      <div className="flex-1 min-w-0">
        <Navbar abrirSidebar={() => setSidebarAbierto(true)} />

        <div className="p-4 md:p-6">
          {/* ENCABEZADO DE LA PAGINA */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h2 className="text-3xl font-bold text-purple-800">Inventario</h2>
              <p className="text-sm text-purple-500">
                Control inteligente de productos y stock
              </p>
            </div>
          </div>
          {/* PESTAÑA */}
          <div className="overflow-hidden">
            <div
              role="tablist"
              className="tabs tabs-border tabs-sm lg:tabs-xl pt-2 px-2 bg-white font-bold rounded-t-xl text-sm md:text-lg overflow-x-auto text-purple-700"
            >
              <NavLink
                to="/inventario/productos"
                className={({ isActive }) =>
                  `tab text-sm md:text-lg whitespace-nowrap ${
                    isActive ? "tab-active" : ""
                  }`
                }
              >
                Productos
              </NavLink>

              <NavLink
                to="/inventario/categorias"
                className={({ isActive }) =>
                  `tab text-sm md:text-lg whitespace-nowrap ${
                    isActive ? "tab-active" : ""
                  }`
                }
              >
                Categorías
              </NavLink>

              <NavLink
                to="/inventario/marcas"
                className={({ isActive }) =>
                  `tab text-sm md:text-lg whitespace-nowrap ${
                    isActive ? "tab-active" : ""
                  }`
                }
              >
                Marcas
              </NavLink>

              <NavLink
                to="/inventario/unidades"
                className={({ isActive }) =>
                  `tab text-sm md:text-lg whitespace-nowrap ${
                    isActive ? "tab-active" : ""
                  }`
                }
              >
                Unidades
              </NavLink>
            </div>
          </div>
          {/* CUERPO - PESTAÑA */}
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default InventarioLayout;
