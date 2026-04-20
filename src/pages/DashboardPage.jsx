//src/pages/DashboardPage.jsx
import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import DashboardCard from "../components/DashboardCard";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";

function DashboardPage() {
  const [sidebarAbierto, setSidebarAbierto] = useState(false);

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-purple-50 to-purple-100">
      <Sidebar
        abierto={sidebarAbierto}
        cerrar={() => setSidebarAbierto(false)}
      />

      <div className="flex-1">
        <Navbar abrirSidebar={() => setSidebarAbierto(true)} />

        <div className="p-6">
          {/* ENCABEZADO*/}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h2 className="text-3xl font-bold text-purple-800">
                Resumen general
              </h2>
              <p className="text-sm text-purple-500">
                Control y analisis general
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <DashboardCard
              titulo="Total Productos"
              valor="1,240"
              color="bg-purple-700"
            />
            <DashboardCard
              titulo="Stock Bajo"
              valor="18"
              color="bg-fuchsia-500"
            />
            <DashboardCard titulo="Por Vencer" valor="7" color="bg-cyan-500" />
            <DashboardCard
              titulo="Ventas Hoy"
              valor="S/ 1,320"
              color="bg-lime-500"
            />
          </div>
          <div className="mt-8 bg-white rounded-2xl shadow p-5">
            <h3 className="text-lg font-bold text-purple-800 mb-3">
              Últimos movimientos
            </h3>

            <ul className="space-y-2 text-gray-600">
              <li>✔ Entrada de arroz 50kg</li>
              <li>✔ Venta de gaseosas 12 unidades</li>
              <li>✔ Producto vencido retirado</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
