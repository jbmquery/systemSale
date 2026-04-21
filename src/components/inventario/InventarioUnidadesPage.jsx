//src/pages/InventarioUnidadesPage.jsx
import { useState, useEffect } from "react";
import { FaSearch, FaPlus } from "react-icons/fa";
import UnidadesModal from "./modales/UnidadesModal";
import { db } from "../../firebase/config";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";

function InventarioUnidadesPage() {
  const [busqueda, setBusqueda] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoModal, setModoModal] = useState("crear");
  const [unidadSeleccionada, setUnidadSeleccionada] = useState(null);
  const [productos, setProductos] = useState([]);

  // 🔥 TIEMPO REAL
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "unidades"),
      (snapshot) => {
        const lista = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProductos(lista);
      }
    );

    return () => unsubscribe();
  }, []);

  // 🔍 FILTRO
  const filtrados = productos.filter((p) =>
    p.unidad?.toLowerCase().includes(busqueda.toLowerCase())
  );

  // 🟣 MODAL
  const abrirCrear = () => {
    setModoModal("crear");
    setUnidadSeleccionada(null);
    setModalAbierto(true);
  };

  const abrirEditar = (unidad) => {
    setModoModal("editar");
    setUnidadSeleccionada(unidad);
    setModalAbierto(true);
  };

  // 💾 GUARDAR / ACTUALIZAR
  const guardarUnidad = async (data) => {
    try {
      if (modoModal === "editar") {
        const ref = doc(db, "unidades", unidadSeleccionada.id);

        await updateDoc(ref, {
          simbolo: data.simbolo,
          unidad: data.unidad,
          estado: data.estado,
        });

        console.log("✏️ Actualizado");
      } else {
        await addDoc(collection(db, "unidades"), {
          simbolo: data.simbolo,
          unidad: data.unidad,
          estado: data.estado,
          fecha_creacion: new Date(),
        });

        console.log("✅ Creado");
      }

      // 🚀 ya no recargamos manualmente
    } catch (error) {
      console.error("❌ Error:", error);
    }
  };

  // 🗑️ ELIMINAR
  const eliminarUnidad = async () => {
    try {
      const ref = doc(db, "unidades", unidadSeleccionada.id);
      await deleteDoc(ref);

      console.log("🗑️ Eliminado");

      setModalAbierto(false);
    } catch (error) {
      console.error("❌ Error al eliminar:", error);
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
              placeholder="Buscar Unidad..."
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
            <span className="font-bold hidden md:inline">Nueva Unidad</span>
          </button>
        </div>

        {/* TABLA */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table text-sm w-full">
              <thead className="text-center">
                <tr className="text-purple-800 bg-purple-50">
                  <th>Simbolo</th>
                  <th>Unidad</th>
                  <th>Estado</th>
                </tr>
              </thead>

              <tbody className="text-center">
                {filtrados.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-purple-50 transition"
                    onClick={() => abrirEditar(p)}
                  >
                    <td className="font-semibold text-purple-800 py-2 px-2">
                      {p.simbolo}
                    </td>
                    <td className="py-2 px-2">{p.unidad}</td>
                    <td className="py-2 px-2">
                      {p.estado ? "Activo" : "Inactivo"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <UnidadesModal
        abierto={modalAbierto}
        cerrar={() => setModalAbierto(false)}
        modo={modoModal}
        unidadSeleccionada={unidadSeleccionada}
        onGuardar={guardarUnidad}
        onEliminar={eliminarUnidad}
      />
    </>
  );
}

export default InventarioUnidadesPage;