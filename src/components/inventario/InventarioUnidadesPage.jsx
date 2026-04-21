//src/pages/InventarioUnidadesPage.jsx
import { useState, useEffect } from "react";
import { FaSearch, FaPlus } from "react-icons/fa";
import UnidadesModal from "./modales/UnidadesModal";
import { db } from "../../firebase/config";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

function InventarioUnidadesPage() {
  const [busqueda, setBusqueda] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoModal, setModoModal] = useState("crear");
  const [unidadSeleccionada, setUnidadSeleccionada] = useState(null);
  const [productos, setProductos] = useState([]);

  const obtenerUnidades = async () => {
    const querySnapshot = await getDocs(collection(db, "unidades"));

    const lista = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setProductos(lista);
  };

  useEffect(() => {
    obtenerUnidades();
  }, []);

  const filtrados = productos.filter((p) =>
    p.unidad?.toLowerCase().includes(busqueda.toLowerCase())
  );

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
        // ✏️ ACTUALIZAR
        const ref = doc(db, "unidades", unidadSeleccionada.id);

        await updateDoc(ref, {
          simbolo: data.simbolo,
          unidad: data.unidad,
          estado: data.estado,
        });

        console.log("✏️ Actualizado");
      } else {
        // 🆕 CREAR
        await addDoc(collection(db, "unidades"), {
          simbolo: data.simbolo,
          unidad: data.unidad,
          estado: data.estado,
          fecha_creacion: new Date(),
        });

        console.log("✅ Creado");
      }

      await obtenerUnidades();
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

      await obtenerUnidades();
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
            className="btn bg-fuchsia-500 text-white hover:bg-fuchsia-600"
          >
            <FaPlus /> Nueva Unidad
          </button>
        </div>

        <table className="table w-full text-center">
          <thead>
            <tr>
              <th>Simbolo</th>
              <th>Unidad</th>
              <th>Estado</th>
            </tr>
          </thead>

          <tbody>
            {filtrados.map((p) => (
              <tr key={p.id} onClick={() => abrirEditar(p)}>
                <td>{p.simbolo}</td>
                <td>{p.unidad}</td>
                <td>{p.estado ? "Activo" : "Inactivo"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <UnidadesModal
        abierto={modalAbierto}
        cerrar={() => setModalAbierto(false)}
        modo={modoModal}
        unidadSeleccionada={unidadSeleccionada}
        onGuardar={guardarUnidad}
        onEliminar={eliminarUnidad} // 🔥 NUEVO
      />
    </>
  );
}

export default InventarioUnidadesPage;