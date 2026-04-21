import { useState, useEffect } from "react";
import { FaSearch, FaPlus } from "react-icons/fa";
import MarcasModal from "./modales/MarcasModal";
import { db } from "../../firebase/config";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";

function InventarioMarcasPage() {
  const [busqueda, setBusqueda] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoModal, setModoModal] = useState("crear");
  const [marcaSeleccionada, setMarcaSeleccionada] = useState(null);
  const [marcas, setMarcas] = useState([]);

  // 🔥 TIEMPO REAL
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "marcas"),
      (snapshot) => {
        const lista = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setMarcas(lista);
      }
    );

    return () => unsubscribe(); // limpieza
  }, []);

  // 🔍 FILTRO
  const filtrados = marcas.filter((m) =>
    m.marca?.toLowerCase().includes(busqueda.toLowerCase())
  );

  // 🟣 MODAL
  const abrirCrear = () => {
    setModoModal("crear");
    setMarcaSeleccionada(null);
    setModalAbierto(true);
  };

  const abrirEditar = (marca) => {
    setModoModal("editar");
    setMarcaSeleccionada(marca);
    setModalAbierto(true);
  };

  // 💾 GUARDAR / ACTUALIZAR
  const guardarMarca = async (data) => {
    try {
      if (modoModal === "editar") {
        const ref = doc(db, "marcas", marcaSeleccionada.id);

        await updateDoc(ref, {
          marca: data.marca,
          estado: data.estado,
        });

        console.log("✏️ Marca actualizada");
      } else {
        await addDoc(collection(db, "marcas"), {
          marca: data.marca,
          estado: data.estado,
          fecha_creacion: new Date(),
        });

        console.log("✅ Marca creada");
      }

      // 🚀 ya NO llamamos obtenerMarcas
    } catch (error) {
      console.error("❌ Error:", error);
    }
  };

  // 🗑️ ELIMINAR
  const eliminarMarca = async () => {
    try {
      const ref = doc(db, "marcas", marcaSeleccionada.id);
      await deleteDoc(ref);

      console.log("🗑️ Marca eliminada");

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
              placeholder="Buscar Marca..."
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
            <span className="font-bold hidden md:inline">Nueva Marca</span>
          </button>
        </div>

        {/* TABLA */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table text-sm w-full">
              <thead className="text-center">
                <tr className="text-purple-800 bg-purple-50">
                  <th>Marca</th>
                  <th>Estado</th>
                </tr>
              </thead>

              <tbody className="text-center">
                {filtrados.map((m) => (
                  <tr
                    key={m.id}
                    className="hover:bg-purple-50 transition cursor-pointer"
                    onClick={() => abrirEditar(m)}
                  >
                    <td className="font-semibold text-purple-800 py-2 px-2">
                      {m.marca}
                    </td>
                    <td className="py-2 px-2">
                      {m.estado ? "Activo" : "Inactivo"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <MarcasModal
        abierto={modalAbierto}
        cerrar={() => setModalAbierto(false)}
        modo={modoModal}
        marcaSeleccionada={marcaSeleccionada}
        onGuardar={guardarMarca}
        onEliminar={eliminarMarca}
      />
    </>
  );
}

export default InventarioMarcasPage;