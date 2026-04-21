//src/components/inventario/modales/UnidadesModal.jsx
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
      <div
        className={`fixed inset-0 bg-black/30 ${
          abierto ? "visible" : "invisible"
        }`}
        onClick={cerrar}
      />

      <div
        className={`fixed right-0 top-0 h-full w-[400px] bg-white ${
          abierto ? "translate-x-0" : "translate-x-full"
        } transition`}
      >
        <div className="flex justify-between p-4 border-b">
          <h2>{modo === "editar" ? "Editar Unidad" : "Nueva Unidad"}</h2>
          <button onClick={cerrar}>
            <IoMdClose />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <input
            name="simbolo"
            value={form.simbolo}
            onChange={handleChange}
            placeholder="Símbolo"
            className="input input-bordered w-full"
          />

          <input
            name="unidad"
            value={form.unidad}
            onChange={handleChange}
            placeholder="Unidad"
            className="input input-bordered w-full"
          />

          <input
            type="checkbox"
            name="estado"
            checked={form.estado}
            onChange={handleChange}
          />
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t flex gap-2">
          <button
            onClick={handleSubmit}
            className="btn flex-1 bg-fuchsia-500 text-white"
          >
            Guardar
          </button>

          {modo === "editar" && (
            <button
              onClick={onEliminar}
              className="btn flex-1 bg-red-500 text-white"
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