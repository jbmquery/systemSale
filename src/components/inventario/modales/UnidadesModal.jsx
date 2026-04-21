import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";

function UnidadesModal({
  abierto,
  cerrar,
  modo,
  unidadSeleccionada,
  onGuardar,
  onEliminar,
}) {
  const [form, setForm] = useState({
    simbolo: "",
    unidad: "",
    estado: true,
  });

  useEffect(() => {
    if (modo === "editar" && unidadSeleccionada) {
      setForm({
        simbolo: unidadSeleccionada.simbolo || "",
        unidad: unidadSeleccionada.unidad || "",
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
      {/* OVERLAY */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-all duration-300 ${
          abierto ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={cerrar}
      />

      {/* PANEL */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-50 shadow-2xl transform transition-all duration-300 ${
          abierto ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center p-5 border-b">
          <div>
            <h2 className="text-xl font-bold text-purple-800">
              {modo === "editar" ? "Editar Unidad" : "Nueva Unidad"}
            </h2>
            <p className="text-xs text-purple-500">
              {modo === "editar"
                ? "Modifica la información de la unidad"
                : "Registra una nueva unidad"}
            </p>
          </div>

          <button
            onClick={cerrar}
            className="p-2 rounded-full hover:bg-purple-100 transition"
          >
            <IoMdClose className="text-2xl text-purple-600" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-5 space-y-5">
          {/* SIMBOLO */}
          <div>
            <label className="text-sm font-semibold text-purple-700">
              Símbolo
            </label>
            <input
              type="text"
              name="simbolo"
              value={form.simbolo}
              onChange={handleChange}
              placeholder="Ej: KG, UND..."
              className="input input-bordered w-full mt-1 focus:outline-none focus:ring-2 focus:ring-fuchsia-400 rounded-2xl"
            />
          </div>

          {/* UNIDAD */}
          <div>
            <label className="text-sm font-semibold text-purple-700">
              Unidad
            </label>
            <input
              type="text"
              name="unidad"
              value={form.unidad}
              onChange={handleChange}
              placeholder="Ej: Kilogramo"
              className="input input-bordered w-full mt-1 focus:outline-none focus:ring-2 focus:ring-fuchsia-400 rounded-2xl"
            />
          </div>

          {/* ESTADO */}
          <div className="flex items-center justify-between bg-purple-50 px-4 py-3 rounded-2xl">
            <span className="text-sm font-semibold text-purple-700">
              Estado
            </span>

            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-xs text-purple-500">
                {form.estado ? "Activo" : "Inactivo"}
              </span>
              <input
                type="checkbox"
                name="estado"
                checked={form.estado}
                onChange={handleChange}
                className="toggle toggle-success"
              />
            </label>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-5 border-t flex gap-3">
          <button
            onClick={handleSubmit}
            className="btn flex-1 rounded-xl bg-fuchsia-500 text-white border-none hover:bg-fuchsia-600 shadow-md transition"
          >
            Guardar
          </button>

          {modo === "editar" && (
            <button
              onClick={onEliminar}
              className="btn flex-1 rounded-xl bg-white text-fuchsia-500 border-solid border-fuchsia-500 hover:bg-fuchsia-500 hover:text-white shadow-md transition"
            >
              Eliminar
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default UnidadesModal;