// src/components/inventario/modales/ProductosModal.jsx
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { db } from "../../../firebase/config";
import { FaBarcode } from "react-icons/fa6";
import { collection, onSnapshot } from "firebase/firestore";

function ProductosModal({
  abierto,
  cerrar,
  modo,
  productoSeleccionado,
  onGuardar,
  onEliminar,
}) {
  const [form, setForm] = useState({
    codigo: "",
    producto: "",
    categoria: "",
    marca: "",
    unidad: "",
    compra: "",
    venta: "",
    stock: "",
    lote: "",
    vence: "",
    estado: "Activo",
    imagen: "",
  });

  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [unidades, setUnidades] = useState([]);

  // 🔥 SELECTS EN TIEMPO REAL
  useEffect(() => {
    const unsub1 = onSnapshot(collection(db, "categorias"), (snap) => {
      setCategorias(snap.docs.map((d) => d.data()).filter((c) => c.estado));
    });

    const unsub2 = onSnapshot(collection(db, "marcas"), (snap) => {
      setMarcas(snap.docs.map((d) => d.data()).filter((m) => m.estado));
    });

    const unsub3 = onSnapshot(collection(db, "unidades"), (snap) => {
      setUnidades(snap.docs.map((d) => d.data()).filter((u) => u.estado));
    });

    return () => {
      unsub1();
      unsub2();
      unsub3();
    };
  }, []);

  // 🔁 CARGAR DATA
  useEffect(() => {
    if (modo === "editar" && productoSeleccionado) {
      setForm({
        ...productoSeleccionado,
        vence: productoSeleccionado.vence
          ? new Date(productoSeleccionado.vence.seconds * 1000)
              .toISOString()
              .split("T")[0]
          : "",
      });
    } else {
      setForm({
        codigo: "",
        producto: "",
        categoria: "",
        marca: "",
        unidad: "",
        compra: "",
        venta: "",
        stock: "",
        lote: "",
        vence: "",
        estado: "Activo",
        imagen: "",
      });
    }
  }, [modo, productoSeleccionado]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

const handleSubmit = async () => {
  await onGuardar({
    codigo: form.codigo,
    producto: form.producto,
    categoria: form.categoria,
    marca: form.marca,
    unidad: form.unidad,
    compra: parseFloat(form.compra),
    venta: parseFloat(form.venta),
    stock: parseInt(form.stock),
    lote: form.lote,
    vence: form.vence ? new Date(form.vence) : null,
    estado: form.estado,
  });

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
              {modo === "editar" ? "Editar Producto" : "Nuevo Producto"}
            </h2>
            <p className="text-xs text-purple-500">
              {modo === "editar"
                ? "Modifica la información del producto"
                : "Registra un nuevo producto"}
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
        <div className="p-5 space-y-5 overflow-y-auto">
          {/* CODIGO */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-purple-700">
              Codigo
            </label>
            <div className="flex flex-row">
              <button className="btn bg-purple-800 text-white rounded-none rounded-l-2xl hover:bg-purple-900">
                <FaBarcode />
              </button>
              <input
                name="codigo"
                placeholder="123456789"
                value={form.codigo}
                onChange={handleChange}
                className="input input-bordered w-full rounded-none rounded-r-2xl"
              />
            </div>
          </div>

          {/* PRODUCTO */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-purple-700">
              Producto
            </label>
            <input
              name="producto"
              value={form.producto}
              placeholder="Ejm: Guantes"
              onChange={handleChange}
              className="input input-bordered w-full rounded-2xl"
            />
          </div>

          {/* SELECTS */}
          <div className="grid grid-cols-3 gap-1">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-purple-700">
                Categorías
              </label>
              <select
                name="categoria"
                value={form.categoria}
                onChange={handleChange}
                className="select select-bordered rounded-2xl"
              >
                <option value="">Categoría</option>
                {categorias.map((c, i) => (
                  <option key={i}>{c.categoria}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-purple-700">
                Marcas
              </label>
              <select
                name="marca"
                value={form.marca}
                onChange={handleChange}
                className="select select-bordered rounded-2xl"
              >
                <option value="">Marca</option>
                {marcas.map((m, i) => (
                  <option key={i}>{m.marca}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-purple-700">
                Unidades
              </label>
              <select
                name="unidad"
                value={form.unidad}
                onChange={handleChange}
                className="select select-bordered rounded-2xl"
              >
                <option value="">Unidad</option>
                {unidades.map((u, i) => (
                  <option key={i}>{u.unidad}</option>
                ))}
              </select>
            </div>
          </div>

          {/* PRECIOS y STOCK*/}
          <div className="grid grid-cols-4 gap-1">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-purple-700">
                S/ Compra
              </label>
              <input
                name="compra"
                placeholder="0.00"
                onChange={handleChange}
                value={form.compra}
                className="input input-bordered rounded-2xl"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-purple-700">
                S/ Venta
              </label>
              <input
                name="venta"
                placeholder="0.00"
                onChange={handleChange}
                value={form.venta}
                className="input input-bordered rounded-2xl"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-purple-700">
                Stock
              </label>
              <input
                name="stock"
                placeholder="0"
                onChange={handleChange}
                value={form.stock}
                className="input input-bordered rounded-2xl"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-purple-700">
                Lote
              </label>
              <input
                name="lote"
                placeholder="L001"
                onChange={handleChange}
                value={form.lote}
                className="input input-bordered rounded-2xl"
              />
            </div>
          </div>

          {/* FECHA Y ESTADO*/}
          <div className="grid grid-cols-2 gap-1">
            {/* FECHA */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-purple-700">
                Fecha Vencimiento
              </label>
              <input
                type="date"
                name="vence"
                value={form.vence}
                onChange={handleChange}
                className="input input-bordered w-full rounded-2xl"
              />
            </div>
            {/* ESTADO */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-purple-700">
                Estado
              </label>

              <select
                name="estado"
                value={form.estado}
                onChange={handleChange}
                className="select select-bordered rounded-2xl"
              >
                <option>Activo</option>
                <option>Inactivo</option>
              </select>
            </div>
          </div>

          {/* IMAGEN */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-purple-700">
              Imagen
            </label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="file-input file-input-bordered w-full rounded-2xl"
            />

            {form.imagen && (
              <img src={form.imagen} className="w-24 mt-3 rounded-xl shadow" />
            )}
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
              className="btn flex-1 rounded-xl border border-fuchsia-500 text-fuchsia-500 hover:bg-fuchsia-500 hover:text-white"
            >
              Eliminar
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default ProductosModal;
