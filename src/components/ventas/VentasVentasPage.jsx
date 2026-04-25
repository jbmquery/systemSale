// src/components/ventas/VentasVentasPage.jsx
import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import ProductosModal from "../inventario/modales/ProductosModal";
import { IoClose } from "react-icons/io5";

import { db } from "../../firebase/config";
import { collection, onSnapshot } from "firebase/firestore";

function VentasVentasPage() {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [ventas, setVentas] = useState([]);

  // 🔥 TRAER VENTAS EN TIEMPO REAL
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "ventas"), (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setVentas(lista);
    });

    return () => unsubscribe();
  }, []);

  // 🗓️ FORMATEAR FECHA
  const formatearFecha = (timestamp) => {
    if (!timestamp) return "-";

    const fecha = timestamp.toDate();
    return fecha.toLocaleString("es-PE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
                <th>N° Venta</th>
                <th>Cliente</th>
                <th>Subtotal</th>
                <th>Fecha de Pago</th>
                <th>Tipo de Comprobante</th>
                <th>Usuario</th>
                <th>Estado</th>
              </tr>
            </thead>

            <tbody className="text-center">
              {ventas.length === 0 ? (
                <tr>
                  <td colSpan="7">No hay ventas</td>
                </tr>
              ) : (
                ventas.map((v) => (
                  <tr key={v.id} className="hover:bg-purple-50 cursor-pointer">
                    <td>{v.num_venta}</td>
                    <td className="text-left font-semibold text-purple-800">
                      {/* No tienes cliente aún */}-
                    </td>
                    <td>S/ {v.subtotal?.toFixed(2)}</td>
                    <td>{formatearFecha(v.fecha_venta)}</td>
                    <td>{v.tipo_comprobante}</td>
                    <td>caja1</td>
                    <td>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold ${
                          v.estado === "pagado"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {v.estado}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default VentasVentasPage;
