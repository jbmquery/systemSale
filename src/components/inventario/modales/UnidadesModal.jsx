//src/components/inventario/modales/UnidadesModal.jsx
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";

function UnidadesModal({ abierto, cerrar, modo, unidadSeleccionada, onGuardar }) {
  const [form, setForm] = useState({
    simbolo: "",
    unidad: "",
    estado: true,
  });

  // 🔁 CARGAR DATOS
  useEffect(() => {
    if (modo === "editar" && unidadSeleccionada) {
      setForm({
        simbolo: unidadSeleccionada.simbolo || "",
        unidad: unidadSeleccionada.unidad || "", // 🔥 CORREGIDO
        estado: unidadSeleccionada.estado ?? true,
      });
    } else {
      setForm({
        simbolo: "",
        unidad: "",
        estado: true,
      });
    }
  }, [modo, unidadSeleccionada]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = () => {
    onGuardar(form);
    cerrar();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/30 z-40 transition ${
          abierto ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={cerrar}
      />

      {/* PANEL */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-50 shadow-xl transform transition-transform duration-300 ${
          abierto ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-purple-800">
            {modo === "editar" ? "Editar Unidad" : "Nueva Unidad"}
          </h2>
          <button onClick={cerrar}>
            <IoMdClose className="text-2xl text-purple-600" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-4 space-y-4">
          <div>
            <label className="text-sm text-purple-700 font-semibold">
              Símbolo
            </label>
            <input
              type="text"
              name="simbolo"
              value={form.simbolo}
              onChange={handleChange}
              className="input input-bordered w-full mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-purple-700 font-semibold">
              Unidad
            </label>
            <input
              type="text"
              name="unidad"
              value={form.unidad}
              onChange={handleChange}
              className="input input-bordered w-full mt-1"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="estado"
              checked={form.estado}
              onChange={handleChange}
              className="toggle toggle-success"
            />
            <span className="text-sm font-semibold text-purple-700">
              Activo
            </span>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t">
          <button
            onClick={handleSubmit}
            className="btn w-full rounded-xl bg-fuchsia-500 text-white border-none hover:bg-fuchsia-600"
          >
            Guardar
          </button>
        </div>
      </div>
    </>
  );
}

export default UnidadesModal;