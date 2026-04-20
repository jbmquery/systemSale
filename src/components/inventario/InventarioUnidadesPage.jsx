//src/pages/InventarioUnidadesPage.jsx
import { useState, useEffect } from "react";
import { FaSearch, FaPlus } from "react-icons/fa";
import UnidadesModal from "./modales/UnidadesModal";
import { db } from "../../firebase/config";
import { collection, addDoc, getDocs } from "firebase/firestore";

function InventarioUnidadesPage() {
  const [busqueda, setBusqueda] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoModal, setModoModal] = useState("crear");
  const [unidadSeleccionada, setUnidadSeleccionada] = useState(null);
  const [productos, setProductos] = useState([]);

  // 🔥 OBTENER DATOS
  const obtenerUnidades = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "unidades"));

      const lista = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProductos(lista);
    } catch (error) {
      console.error("❌ Error al obtener datos:", error);
    }
  };

  useEffect(() => {
    obtenerUnidades();
  }, []);

  // 🔍 FILTRO
  const filtrados = productos.filter((p) =>
    p.unidad?.toLowerCase().includes(busqueda.toLowerCase())
  );

  // 🟣 ABRIR MODAL
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

  // 💾 GUARDAR EN FIREBASE
  const guardarUnidad = async (data) => {
    try {
      await addDoc(collection(db, "unidades"), {
        simbolo: data.simbolo,
        unidad: data.unidad,
        estado: data.estado,
        fecha_creacion: new Date(),
      });

      console.log("✅ Guardado en Firebase");

      await obtenerUnidades(); // 🔥 refrescar tabla
    } catch (error) {
      console.error("❌ Error al guardar:", error);
    }
  };

  return (
    <>
      <div className="flex flex-col bg-white px-3 pb-3 pt-4 rounded-b-xl">
        {/* BUSCADOR */}
        <div className="flex flex-row justify-between mb-4 gap-2 items-center">
          <div className="bg-white rounded-2xl shadow-md px-4 py-1 flex items-center gap-3">
            <FaSearch className="text-purple-500 shrink-0" />
            <input
              type="text"
              placeholder="Buscar Unidad..."
              className="input input-ghost w-full focus:outline-none"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          {/* BOTÓN */}
          <button
            onClick={abrirCrear}
            className="btn rounded-full bg-fuchsia-500 text-white border-none hover:bg-fuchsia-600 px-4 md:px-6 flex gap-2 items-center shadow-md"
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
                    onClick={() => abrirEditar(p)}
                    className="hover:bg-purple-50 transition cursor-pointer"
                  >
                    <td>{p.simbolo}</td>
                    <td className="font-semibold text-purple-800">
                      {p.unidad}
                    </td>
                    <td>
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
      />
    </>
  );
}

export default InventarioUnidadesPage;