// src/components/inventario/InventarioProductosPage.jsx
import { useState, useEffect } from "react";
import { FaSearch, FaPlus } from "react-icons/fa";
import ProductosModal from "./modales/ProductosModal";
import { db } from "../../firebase/config";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";

function InventarioProductosPage() {
  const [busqueda, setBusqueda] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoModal, setModoModal] = useState("crear");
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [productos, setProductos] = useState([]);
  const [ordenStock, setOrdenStock] = useState(null); // "asc" | "desc" | null
  const [ordenVence, setOrdenVence] = useState(null);

  const [filtroCategoria, setFiltroCategoria] = useState([]);
  const [filtroMarca, setFiltroMarca] = useState([]);
  const [filtroUnidad, setFiltroUnidad] = useState([]);
  const [filtroLote, setFiltroLote] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState([]);

  const [menuAbierto, setMenuAbierto] = useState(null);

  // 🔥 TIEMPO REAL
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "productos"), (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProductos(lista);
    });

    return () => unsubscribe();
  }, []);

  const categorias = [
    ...new Set(productos.map((p) => p.categoria).filter(Boolean)),
  ];
  const marcas = [...new Set(productos.map((p) => p.marca).filter(Boolean))];
  const unidades = [...new Set(productos.map((p) => p.unidad).filter(Boolean))];
  const lotes = [...new Set(productos.map((p) => p.lote).filter(Boolean))];
  const estados = [...new Set(productos.map((p) => p.estado).filter(Boolean))];

  // 🔍 FILTRO
  const filtrados = productos
    .filter((p) => {
      const texto = busqueda.toLowerCase();

      const coincideBusqueda =
        p.producto?.toLowerCase().includes(texto) ||
        p.codigo?.toLowerCase().includes(texto);

      const cumpleCategoria =
        filtroCategoria.length === 0 || filtroCategoria.includes(p.categoria);

      const cumpleMarca =
        filtroMarca.length === 0 || filtroMarca.includes(p.marca);

      const cumpleUnidad =
        filtroUnidad.length === 0 || filtroUnidad.includes(p.unidad);

      const cumpleLote = filtroLote.length === 0 || filtroLote.includes(p.lote);

      const cumpleEstado =
        filtroEstado.length === 0 || filtroEstado.includes(p.estado);

      return (
        coincideBusqueda &&
        cumpleCategoria &&
        cumpleMarca &&
        cumpleUnidad &&
        cumpleLote &&
        cumpleEstado
      );
    })
    .sort((a, b) => {
      // 🧮 ORDEN STOCK
      if (ordenStock) {
        return ordenStock === "asc" ? a.stock - b.stock : b.stock - a.stock;
      }

      // 📅 ORDEN VENCIMIENTO
      if (ordenVence) {
        const fa = a.vence?.seconds || 9999999999;
        const fb = b.vence?.seconds || 9999999999;

        return ordenVence === "asc" ? fa - fb : fb - fa;
      }

      return 0;
    });

  // MODAL
  const abrirCrear = () => {
    setModoModal("crear");
    setProductoSeleccionado(null);
    setModalAbierto(true);
  };

  const abrirEditar = (p) => {
    setModoModal("editar");
    setProductoSeleccionado(p);
    setModalAbierto(true);
  };

  // 💾 GUARDAR
  const guardarProducto = async (data) => {
    try {
      if (modoModal === "editar") {
        const ref = doc(db, "productos", productoSeleccionado.id);

        await updateDoc(ref, data);
      } else {
        await addDoc(collection(db, "productos"), {
          ...data,
          fecha_creacion: new Date(),
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 🗑️ ELIMINAR
  const eliminarProducto = async () => {
    try {
      const ref = doc(db, "productos", productoSeleccionado.id);
      await deleteDoc(ref);
      setModalAbierto(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="flex flex-col bg-white px-3 pb-3 pt-4 rounded-b-xl">
        <div className="flex justify-between mb-4 items-center">
          <div className="bg-white rounded-2xl shadow-md px-4 py-1 flex items-center gap-3">
            <FaSearch className="text-purple-500" />
            <input
              type="text"
              placeholder="Buscar producto..."
              className="input input-ghost w-full focus:outline-none"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <button
            onClick={abrirCrear}
            className="btn rounded-full bg-fuchsia-500 text-white border-none hover:bg-fuchsia-600 px-4 md:px-6 flex gap-2 items-center cursor-pointer shadow-md"
          >
            <FaPlus />
            <span className="hidden md:inline">Nuevo producto</span>
          </button>
        </div>

        {/* TABLA */}
        <div className="overflow-x-auto">
          <table className="table text-sm w-full">
            <thead className="text-center bg-purple-50 text-purple-800">
              <tr>
                <th>Código</th>
                <th>Producto</th>
                <th className="relative">
                  <div
                    onClick={() =>
                      setMenuAbierto(
                        menuAbierto === "categoria" ? null : "categoria",
                      )
                    }
                    className="cursor-pointer"
                  >
                    Categoría ⏷
                  </div>

                  {menuAbierto === "categoria" && (
                    <div className="absolute z-50 bg-white shadow-lg rounded-lg p-2 mt-2 text-left">
                      {categorias.map((c) => (
                        <label key={c} className="flex gap-2 text-xs">
                          <input
                            type="checkbox"
                            checked={filtroCategoria.includes(c)}
                            onChange={() => {
                              setFiltroCategoria((prev) =>
                                prev.includes(c)
                                  ? prev.filter((x) => x !== c)
                                  : [...prev, c],
                              );
                            }}
                          />
                          {c}
                        </label>
                      ))}

                      <button
                        onClick={() => setFiltroCategoria([])}
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
                      setMenuAbierto(menuAbierto === "marca" ? null : "marca")
                    }
                    className="cursor-pointer"
                  >
                    Marca ⏷
                  </div>

                  {menuAbierto === "marca" && (
                    <div className="absolute z-50 bg-white shadow-lg rounded-lg p-2 mt-2 text-left">
                      {marcas.map((m) => (
                        <label key={m} className="flex gap-2 text-xs">
                          <input
                            type="checkbox"
                            checked={filtroMarca.includes(m)}
                            onChange={() => {
                              setFiltroMarca((prev) =>
                                prev.includes(m)
                                  ? prev.filter((x) => x !== m)
                                  : [...prev, m],
                              );
                            }}
                          />
                          {m}
                        </label>
                      ))}

                      <button
                        onClick={() => setFiltroMarca([])}
                        className="text-red-500 text-xs mt-2"
                      >
                        Limpiar
                      </button>
                    </div>
                  )}
                </th>
                <th>Unidad</th>
                <th>S/ Compra</th>
                <th>S/ Venta</th>
                <th>S/ Rebaja</th>
                <th
                  className="cursor-pointer select-none"
                  onClick={() => {
                    if (ordenStock === "asc") setOrdenStock("desc");
                    else if (ordenStock === "desc") setOrdenStock(null);
                    else setOrdenStock("asc");

                    setOrdenVence(null); // evita conflicto
                  }}
                >
                  Stock{" "}
                  {ordenStock === "asc"
                    ? "↑"
                    : ordenStock === "desc"
                      ? "↓"
                      : ""}
                </th>
                <th className="relative">
                  <div
                    onClick={() =>
                      setMenuAbierto(menuAbierto === "lote" ? null : "lote")
                    }
                    className="cursor-pointer"
                  >
                    Lote ⏷
                  </div>

                  {menuAbierto === "lote" && (
                    <div className="absolute z-50 bg-white shadow-lg rounded-lg p-2 mt-2 text-left">
                      {lotes.map((l) => (
                        <label key={l} className="flex gap-2 text-xs">
                          <input
                            type="checkbox"
                            checked={filtroLote.includes(l)}
                            onChange={() => {
                              setFiltroLote((prev) =>
                                prev.includes(l)
                                  ? prev.filter((x) => x !== l)
                                  : [...prev, l],
                              );
                            }}
                          />
                          {l}
                        </label>
                      ))}

                      <button
                        onClick={() => setFiltroLote([])}
                        className="text-red-500 text-xs mt-2"
                      >
                        Limpiar
                      </button>
                    </div>
                  )}
                </th>
                <th
                  className="cursor-pointer select-none"
                  onClick={() => {
                    if (ordenVence === "asc") setOrdenVence("desc");
                    else if (ordenVence === "desc") setOrdenVence(null);
                    else setOrdenVence("asc");

                    setOrdenStock(null); // evita conflicto
                  }}
                >
                  Vence{" "}
                  {ordenVence === "asc"
                    ? "↑"
                    : ordenVence === "desc"
                      ? "↓"
                      : ""}
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
              {filtrados.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => abrirEditar(p)}
                  className="hover:bg-purple-50 cursor-pointer"
                >
                  <td>{p.codigo}</td>
                  <td className="font-semibold text-purple-800 text-left">
                    {p.producto}
                  </td>
                  <td>{p.categoria}</td>
                  <td>{p.marca}</td>
                  <td>{p.unidad}</td>
                  <td>{p.compra.toFixed(2)}</td>
                  <td>{p.venta.toFixed(2)}</td>
                  <td>{p.rebaja.toFixed(2)}</td>
                  <td>{p.stock}</td>
                  <td>{p.lote}</td>
                  <td>
                    {p.vence
                      ? new Date(p.vence.seconds * 1000).toLocaleDateString()
                      : ""}
                  </td>
                  <td>{p.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ProductosModal
        abierto={modalAbierto}
        cerrar={() => setModalAbierto(false)}
        modo={modoModal}
        productoSeleccionado={productoSeleccionado}
        onGuardar={guardarProducto}
        onEliminar={eliminarProducto}
      />
    </>
  );
}

export default InventarioProductosPage;
