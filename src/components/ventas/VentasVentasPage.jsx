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
  const [busqueda, setBusqueda] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [ordenSubtotal, setOrdenSubtotal] = useState(null); // "asc" | "desc" | null

  const [filtroComprobante, setFiltroComprobante] = useState([]);
  const [filtroUsuario, setFiltroUsuario] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState([]);

  const [menuAbierto, setMenuAbierto] = useState(null); // "comprobante", "usuario", "estado"

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
  const tiposComprobante = [
    ...new Set(ventas.map((v) => v.tipo_comprobante).filter(Boolean)),
  ];
  const usuarios = [...new Set(ventas.map((v) => v.usuario || "caja1"))];
  const estados = [...new Set(ventas.map((v) => v.estado).filter(Boolean))];

  const ventasFiltradas = ventas
    .filter((v) => {
      const texto = busqueda.toLowerCase();

      const coincideBusqueda =
        v.num_venta?.toString().includes(texto) ||
        v.tipo_comprobante?.toLowerCase().includes(texto) ||
        v.estado?.toLowerCase().includes(texto) ||
        v.subtotal?.toString().includes(texto) ||
        formatearFecha(v.fecha_venta).toLowerCase().includes(texto);

      let cumpleFecha = true;

      if (v.fecha_venta) {
        const fechaVenta = v.fecha_venta.toDate();

        if (fechaDesde) {
          const desde = new Date(fechaDesde);
          desde.setHours(0, 0, 0, 0);
          if (fechaVenta < desde) cumpleFecha = false;
        }

        if (fechaHasta) {
          const hasta = new Date(fechaHasta);
          hasta.setHours(23, 59, 59, 999);
          if (fechaVenta > hasta) cumpleFecha = false;
        }
      }

      const cumpleComprobante =
        filtroComprobante.length === 0 ||
        filtroComprobante.includes(v.tipo_comprobante);

      const cumpleUsuario =
        filtroUsuario.length === 0 ||
        filtroUsuario.includes(v.usuario || "caja1");

      const cumpleEstado =
        filtroEstado.length === 0 || filtroEstado.includes(v.estado);

      return (
        coincideBusqueda &&
        cumpleFecha &&
        cumpleComprobante &&
        cumpleUsuario &&
        cumpleEstado
      );
    })
    .sort((a, b) => {
      if (!ordenSubtotal) return 0;

      return ordenSubtotal === "asc"
        ? a.subtotal - b.subtotal
        : b.subtotal - a.subtotal;
    });

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
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
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
              <div className="bg-white rounded-2xl shadow-md pr-2 py-1 flex items-center gap-0 w-full sm:w-auto">
                <input
                  type="date"
                  name="desde"
                  value={fechaDesde}
                  onChange={(e) => setFechaDesde(e.target.value)}
                  className="input input-ghost w-full focus:outline-none text-xs sm:text-sm"
                />

                {fechaDesde && (
                  <IoClose
                    onClick={() => setFechaDesde("")}
                    className="text-purple-500 text-xl cursor-pointer hover:scale-110 transition"
                  />
                )}
              </div>
            </div>

            {/* HASTA */}
            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2 w-full sm:w-auto">
              <span className="text-xs sm:text-sm whitespace-nowrap text-purple-500 font-semibold">
                Hasta
              </span>
              <div className="bg-white rounded-2xl shadow-md pr-2 py-1 flex items-center gap-1 w-full sm:w-auto">
                <input
                  type="date"
                  name="hasta"
                  value={fechaHasta}
                  onChange={(e) => setFechaHasta(e.target.value)}
                  className="input input-ghost w-full focus:outline-none text-xs sm:text-sm"
                />

                {fechaHasta && (
                  <IoClose
                    onClick={() => setFechaHasta("")}
                    className="text-purple-500 text-xl cursor-pointer hover:scale-110 transition"
                  />
                )}
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
                <th
                  className="cursor-pointer select-none"
                  onClick={() => {
                    if (ordenSubtotal === "asc") setOrdenSubtotal("desc");
                    else if (ordenSubtotal === "desc") setOrdenSubtotal(null);
                    else setOrdenSubtotal("asc");
                  }}
                >
                  Subtotal{" "}
                  {ordenSubtotal === "asc"
                    ? "↑"
                    : ordenSubtotal === "desc"
                      ? "↓"
                      : ""}
                </th>
                <th>Fecha de Pago</th>
                <th className="relative">
                  <div
                    onClick={() =>
                      setMenuAbierto(
                        menuAbierto === "comprobante" ? null : "comprobante",
                      )
                    }
                    className="cursor-pointer"
                  >
                    Tipo de Comprobante ⏷
                  </div>

                  {menuAbierto === "comprobante" && (
                    <div className="absolute z-50 bg-white shadow-lg rounded-lg p-2 mt-2 text-left">
                      {tiposComprobante.map((tipo) => (
                        <label key={tipo} className="flex gap-2 text-xs">
                          <input
                            type="checkbox"
                            checked={filtroComprobante.includes(tipo)}
                            onChange={() => {
                              setFiltroComprobante((prev) =>
                                prev.includes(tipo)
                                  ? prev.filter((t) => t !== tipo)
                                  : [...prev, tipo],
                              );
                            }}
                          />
                          {tipo}
                        </label>
                      ))}

                      <button
                        onClick={() => setFiltroComprobante([])}
                        className="text-red-500 text-xs mt-2"
                      >
                        Limpiar
                      </button>
                    </div>
                  )}
                </th>
                <th className="relative">
                  <div
                    onClick={() =>
                      setMenuAbierto(
                        menuAbierto === "usuario" ? null : "usuario",
                      )
                    }
                    className="cursor-pointer"
                  >
                    Usuario ⏷
                  </div>

                  {menuAbierto === "usuario" && (
                    <div className="absolute z-50 bg-white shadow-lg rounded-lg p-2 mt-2 text-left">
                      {usuarios.map((u) => (
                        <label key={u} className="flex gap-2 text-xs">
                          <input
                            type="checkbox"
                            checked={filtroUsuario.includes(u)}
                            onChange={() => {
                              setFiltroUsuario((prev) =>
                                prev.includes(u)
                                  ? prev.filter((x) => x !== u)
                                  : [...prev, u],
                              );
                            }}
                          />
                          {u}
                        </label>
                      ))}

                      <button
                        onClick={() => setFiltroUsuario([])}
                        className="text-red-500 text-xs mt-2"
                      >
                        Limpiar
                      </button>
                    </div>
                  )}
                </th>
                <th className="relative">
                  <div
                    onClick={() =>
                      setMenuAbierto(menuAbierto === "estado" ? null : "estado")
                    }
                    className="cursor-pointer"
                  >
                    Estado ⏷
                  </div>

                  {menuAbierto === "estado" && (
                    <div className="absolute z-50 bg-white shadow-lg rounded-lg p-2 mt-2 text-left">
                      {estados.map((e) => (
                        <label key={e} className="flex gap-2 text-xs">
                          <input
                            type="checkbox"
                            checked={filtroEstado.includes(e)}
                            onChange={() => {
                              setFiltroEstado((prev) =>
                                prev.includes(e)
                                  ? prev.filter((x) => x !== e)
                                  : [...prev, e],
                              );
                            }}
                          />
                          {e}
                        </label>
                      ))}

                      <button
                        onClick={() => setFiltroEstado([])}
                        className="text-red-500 text-xs mt-2"
                      >
                        Limpiar
                      </button>
                    </div>
                  )}
                </th>
              </tr>
            </thead>

            <tbody className="text-center">
              {ventasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan="7">No hay ventas</td>
                </tr>
              ) : (
                ventasFiltradas.map((v) => (
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
