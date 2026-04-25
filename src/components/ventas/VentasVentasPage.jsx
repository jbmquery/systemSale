// src/components/ventas/VentasVentasPage.jsx
import { useState, useEffect } from "react";
import { FaSearch, FaPlus } from "react-icons/fa";

// ✅ RUTA CORREGIDA
import ProductosModal from "../inventario/modales/ProductosModal";
import { IoClose } from "react-icons/io5";
import { db } from "../../firebase/config";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";

function VentasVentasPage() {
  const [modalAbierto, setModalAbierto] = useState(false);

  return (
    <>
      {/* MODAL */}
      <ProductosModal
        abierto={modalAbierto}
        cerrar={() => setModalAbierto(false)}
        modo="crear"
        onGuardar={() => {}}
      />

      <div className="flex flex-col bg-white px-3 pb-3 pt-4 rounded-b-xl">
        <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-3 mb-4">
          {/* 🔍 BUSCADOR */}
          <div className="bg-white rounded-2xl shadow-md px-4 py-2 flex items-center gap-3 w-full lg:max-w-sm">
            <FaSearch className="text-purple-500" />
            <input
              type="text"
              placeholder="Buscar producto..."
              className="input input-ghost w-full focus:outline-none text-sm"
            />
          </div>

          {/* 📅 FILTROS DE FECHA */}
          <div className="flex grid-cols-2 gap-2 md:gap-4 w-full lg:w-auto mt-1">
            {/* DESDE */}
            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2 w-full sm:w-auto">
              <span className="text-xs sm:text-sm whitespace-nowrap text-purple-500 font-semibold">
                Desde
              </span>
              <div className="bg-white rounded-2xl shadow-md px-2 py-1 flex items-center gap-1 w-full sm:w-auto">
                <input
                  type="date"
                  name="desde"
                  className="input input-ghost w-full focus:outline-none text-xs sm:text-sm"
                />
              </div>
            </div>

            {/* HASTA */}
            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2 w-full sm:w-auto">
              <span className="text-xs sm:text-sm whitespace-nowrap text-purple-500 font-semibold">
                Hasta
              </span>
              <div className="bg-white rounded-2xl shadow-md px-2 py-1 flex items-center gap-1 w-full sm:w-auto">
                <input
                  type="date"
                  name="hasta"
                  className="input input-ghost w-full focus:outline-none text-xs sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* TABLA */}
        <div className="overflow-x-auto">
          <table className="table text-sm w-full">
            <thead className="text-center bg-purple-50 text-purple-800">
              <tr>
                <th>num_venta</th>
                <th>cliente</th>
                <th>Subtotal</th>
                <th>Fecha</th>
                <th>tipo_comprobante</th>
                <th>usuario</th>
                <th>estado</th>
              </tr>
            </thead>

            <tbody className="text-center">
              <tr className="hover:bg-purple-50 cursor-pointer">
                <td>-</td>
                <td className="font-semibold text-purple-800 text-left">-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default VentasVentasPage;
