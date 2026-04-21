//src/components/inventario/InventarioCategoriasPage.jsx
import { useState, useEffect } from "react";
import { FaSearch, FaPlus } from "react-icons/fa";
import CategoriasModal from "./modales/CategoriasModal";
import { db } from "../../firebase/config";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";

function InventarioCategoriasPage() {
  const [busqueda, setBusqueda] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoModal, setModoModal] = useState("crear");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [categorias, setCategorias] = useState([]);

  // 🔥 TIEMPO REAL
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "categorias"),
      (snapshot) => {
        const lista = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setCategorias(lista);
      }
    );

    return () => unsubscribe(); // limpieza
  }, []);

  // 🔍 FILTRO
  const filtrados = categorias.filter((c) =>
    c.categoria?.toLowerCase().includes(busqueda.toLowerCase())
  );

  // 🟣 MODAL
  const abrirCrear = () => {
    setModoModal("crear");
    setCategoriaSeleccionada(null);
    setModalAbierto(true);
  };

  const abrirEditar = (categoria) => {
    setModoModal("editar");
    setCategoriaSeleccionada(categoria);
    setModalAbierto(true);
  };

  // 💾 GUARDAR / ACTUALIZAR
  const guardarCategoria = async (data) => {
    try {
      if (modoModal === "editar") {
        const ref = doc(db, "categorias", categoriaSeleccionada.id);

        await updateDoc(ref, {
          categoria: data.categoria,
          estado: data.estado,
        });

        console.log("✏️ Categoría actualizada");
      } else {
        await addDoc(collection(db, "categorias"), {
          categoria: data.categoria,
          estado: data.estado,
          fecha_creacion: new Date(),
        });

        console.log("✅ Categoría creada");
      }

      // 🚀 YA NO LLAMAMOS obtenerCategorias
    } catch (error) {
      console.error("❌ Error:", error);
    }
  };

  // 🗑️ ELIMINAR
  const eliminarCategoria = async () => {
    try {
      const ref = doc(db, "categorias", categoriaSeleccionada.id);
      await deleteDoc(ref);

      console.log("🗑️ Categoría eliminada");

      setModalAbierto(false);
    } catch (error) {
      console.error("❌ Error:", error);
    }
  };

  return (
    <>
      <div className="flex flex-col bg-white px-3 pb-3 pt-4 rounded-b-xl">
        {/* BUSCADOR */}
        <div className="flex justify-between mb-4 items-center">
          <div className="bg-white rounded-2xl shadow-md px-4 py-1 flex items-center gap-3">
            <FaSearch className="text-purple-500" />
            <input
              type="text"
              placeholder="Buscar Categoría..."
              className="input input-ghost w-full focus:outline-none"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          {/* BOTÓN */}
          <button
            onClick={abrirCrear}
            className="btn rounded-full bg-fuchsia-500 text-white border-none hover:bg-fuchsia-600 px-4 md:px-6 flex gap-2 items-center cursor-pointer shadow-md"
          >
            <FaPlus />
            <span className="font-bold hidden md:inline">
              Nueva Categoría
            </span>
          </button>
        </div>

        {/* TABLA */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table text-sm w-full">
              <thead className="text-center">
                <tr className="text-purple-800 bg-purple-50">
                  <th>Categoría</th>
                  <th>Estado</th>
                </tr>
              </thead>

              <tbody className="text-center">
                {filtrados.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-purple-50 transition cursor-pointer"
                    onClick={() => abrirEditar(c)}
                  >
                    <td className="font-semibold text-purple-800 py-2 px-2">
                      {c.categoria}
                    </td>
                    <td className="py-2 px-2">
                      {c.estado ? "Activo" : "Inactivo"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <CategoriasModal
        abierto={modalAbierto}
        cerrar={() => setModalAbierto(false)}
        modo={modoModal}
        categoriaSeleccionada={categoriaSeleccionada}
        onGuardar={guardarCategoria}
        onEliminar={eliminarCategoria}
      />
    </>
  );
}

export default InventarioCategoriasPage;