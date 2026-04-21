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

  // 🔍 FILTRO
  const filtrados = productos.filter((p) =>
    p.producto?.toLowerCase().includes(busqueda.toLowerCase())
  );

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
              className="input input-ghost w-full"
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
                <th>Categoría</th>
                <th>Marca</th>
                <th>Unidad</th>
                <th>Compra</th>
                <th>Venta</th>
                <th>Stock</th>
                <th>Lote</th>
                <th>Vence</th>
                <th>Estado</th>
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
                  <td>{p.compra}</td>
                  <td>{p.venta}</td>
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