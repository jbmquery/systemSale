import {
  FaBoxOpen,
  FaCashRegister,
  FaTruck,
  FaChartBar,
  FaWarehouse,
} from "react-icons/fa";
import { TbCoinYuan } from "react-icons/tb";

import { NavLink, useLocation } from "react-router-dom";

function Sidebar({ abierto, cerrar }) {
  const location = useLocation();

  const menuClass = ({ isActive }) =>
    `flex items-center gap-3 cursor-pointer transition px-3 py-2 rounded-xl ${
      isActive
        ? "bg-gradient-to-r from-lime-200 to-cyan-300 hover:bg-gradient-to-r hover:from-cyan-300 hover:to-lime-200 text-fuchsia-600 font-bold"
        : "hover:text-cyan-300"
    }`;

  const inventarioActivo = location.pathname.startsWith("/inventario");

  return (
    <>
      <div
        className={`
          fixed md:static top-0 left-0 z-50
          w-64 min-h-screen
          bg-gradient-to-b from-purple-950 via-purple-900 to-purple-700
          text-white p-5
          transform transition-transform duration-300
          ${abierto ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="flex justify-between items-center md:block">
          <h2 className="text-2xl font-bold mb-8">Mi Tienda</h2>

          <button className="md:hidden text-xl" onClick={cerrar}>
            ✕
          </button>
        </div>

        <ul className="space-y-3">
          <li>
            <NavLink to="/dashboard" className={menuClass} onClick={cerrar}>
              <FaWarehouse />
              Dashboard
            </NavLink>
          </li>

          <li>
            <NavLink to="/punto-venta" className={menuClass} onClick={cerrar}>
              <FaCashRegister />
              Punto de venta
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/inventario/productos"
              onClick={cerrar}
              className={`flex items-center gap-3 cursor-pointer transition px-3 py-2 rounded-xl ${
                inventarioActivo
                  ? "bg-gradient-to-r from-lime-200 to-cyan-300 hover:bg-gradient-to-r hover:from-cyan-300 hover:to-lime-200 text-fuchsia-600 font-bold"
                  : "hover:text-cyan-300"
              }`}
            >
              <FaBoxOpen />
              Inventario
            </NavLink>
          </li>

          <li>
            <NavLink to="/ventas" className={menuClass} onClick={cerrar}>
              <TbCoinYuan />
              Ventas
            </NavLink>
          </li>

          <li>
            <NavLink to="/proveedores" className={menuClass} onClick={cerrar}>
              <FaTruck />
              Proveedores
            </NavLink>
          </li>

          <li>
            <NavLink to="/reportes" className={menuClass} onClick={cerrar}>
              <FaChartBar />
              Reportes
            </NavLink>
          </li>
        </ul>
      </div>

      {abierto && (
        <div className="fixed inset-0 bg-black/30 md:hidden" onClick={cerrar} />
      )}
    </>
  );
}

export default Sidebar;