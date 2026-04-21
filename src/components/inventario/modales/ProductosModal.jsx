import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { db } from "../../../firebase/config";
import { collection, onSnapshot } from "firebase/firestore";

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

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
  const [file, setFile] = useState(null);

  // 🔥 SELECTS EN TIEMPO REAL
  useEffect(() => {
    const unsub1 = onSnapshot(collection(db, "categorias"), (snap) => {
      setCategorias(snap.docs.map(d => d.data()).filter(c => c.estado));
    });

    const unsub2 = onSnapshot(collection(db, "marcas"), (snap) => {
      setMarcas(snap.docs.map(d => d.data()).filter(m => m.estado));
    });

    const unsub3 = onSnapshot(collection(db, "unidades"), (snap) => {
      setUnidades(snap.docs.map(d => d.data()).filter(u => u.estado));
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

  // 📦 SUBIR IMAGEN
  const subirImagen = async () => {
    if (!file) return form.imagen;

    const storage = getStorage();
    const storageRef = ref(storage, `productos/${Date.now()}_${file.name}`);

    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleSubmit = async () => {
    const urlImagen = await subirImagen();

    await onGuardar({
      ...form,
      imagen: urlImagen,
      compra: parseFloat(form.compra),
      venta: parseFloat(form.venta),
      stock: parseInt(form.stock),
      vence: form.vence ? new Date(form.vence) : null,
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
          <div>
            <label className="text-sm font-semibold text-purple-700">Código</label>
            <input
              name="codigo"
              value={form.codigo}
              onChange={handleChange}
              className="input input-bordered w-full mt-1 rounded-2xl focus:ring-2 focus:ring-fuchsia-400"
            />
          </div>

          {/* PRODUCTO */}
          <div>
            <label className="text-sm font-semibold text-purple-700">Producto</label>
            <input
              name="producto"
              value={form.producto}
              onChange={handleChange}
              className="input input-bordered w-full mt-1 rounded-2xl"
            />
          </div>

          {/* SELECTS */}
          <div className="grid grid-cols-1 gap-4">
            <select name="categoria" value={form.categoria} onChange={handleChange} className="select select-bordered rounded-2xl">
              <option value="">Categoría</option>
              {categorias.map((c, i) => (
                <option key={i}>{c.categoria}</option>
              ))}
            </select>

            <select name="marca" value={form.marca} onChange={handleChange} className="select select-bordered rounded-2xl">
              <option value="">Marca</option>
              {marcas.map((m, i) => (
                <option key={i}>{m.marca}</option>
              ))}
            </select>

            <select name="unidad" value={form.unidad} onChange={handleChange} className="select select-bordered rounded-2xl">
              <option value="">Unidad</option>
              {unidades.map((u, i) => (
                <option key={i}>{u.unidad}</option>
              ))}
            </select>
          </div>

          {/* PRECIOS */}
          <div className="grid grid-cols-2 gap-3">
            <input name="compra" placeholder="Compra" onChange={handleChange} value={form.compra} className="input input-bordered rounded-2xl" />
            <input name="venta" placeholder="Venta" onChange={handleChange} value={form.venta} className="input input-bordered rounded-2xl" />
          </div>

          {/* STOCK */}
          <div className="grid grid-cols-2 gap-3">
            <input name="stock" placeholder="Stock" onChange={handleChange} value={form.stock} className="input input-bordered rounded-2xl" />
            <input name="lote" placeholder="Lote" onChange={handleChange} value={form.lote} className="input input-bordered rounded-2xl" />
          </div>

          {/* FECHA */}
          <div>
            <label className="text-sm text-purple-700">Vencimiento</label>
            <input type="date" name="vence" value={form.vence} onChange={handleChange} className="input input-bordered w-full rounded-2xl" />
          </div>

          {/* IMAGEN */}
          <div>
            <label className="text-sm text-purple-700">Imagen</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="file-input file-input-bordered w-full rounded-2xl"
            />

            {form.imagen && (
              <img src={form.imagen} className="w-24 mt-3 rounded-xl shadow" />
            )}
          </div>

          {/* ESTADO */}
          <div className="flex items-center justify-between bg-purple-50 px-4 py-3 rounded-2xl">
            <span className="text-sm font-semibold text-purple-700">Estado</span>

            <select
              name="estado"
              value={form.estado}
              onChange={handleChange}
              className="select select-sm rounded-xl"
            >
              <option>Activo</option>
              <option>Inactivo</option>
            </select>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-5 border-t flex gap-3">
          <button
            onClick={handleSubmit}
            className="btn flex-1 rounded-xl bg-fuchsia-500 text-white hover:bg-fuchsia-600"
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