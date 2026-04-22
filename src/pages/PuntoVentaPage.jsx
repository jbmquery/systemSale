import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { FaSearch, FaTrash } from "react-icons/fa";
import { FaBarcode } from "react-icons/fa6";
import { FaRegUser } from "react-icons/fa6";
import { AiOutlineIdcard } from "react-icons/ai";
import { GrLocation } from "react-icons/gr";
import { IoMdClose } from "react-icons/io";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";

function PuntoVentaPage() {
  const [sidebarAbierto, setSidebarAbierto] = useState(false);
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [carrito, setCarrito] = useState([]);

  const agregarProducto = (producto) => {
    setCarrito([...carrito, producto]);
  };

  const total = carrito.reduce((acc, item) => acc + item.precio, 0);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "productos"), (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProductos(lista);
    });

    return () => unsubscribe();
  }, []);

  const productosFiltrados = productos.filter(
    (p) =>
      p.producto?.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.codigo?.includes(busqueda),
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-purple-50 to-purple-100">
      <Sidebar
        abierto={sidebarAbierto}
        cerrar={() => setSidebarAbierto(false)}
      />

      <div className="flex-1 min-w-0">
        <Navbar abrirSidebar={() => setSidebarAbierto(true)} />

        <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* PRODUCTOS */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-4">
            {/* ENCABEZADO*/}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h2 className="text-3xl font-bold text-purple-800">
                  Nueva Venta
                </h2>
                <p className="text-sm text-purple-500">
                  Sistema de busqueda y control de productos a vender
                </p>
              </div>
            </div>

            {/* BUSCADOR*/}
            <div className="flex items-center gap-3 mb-4 bg-purple-50 rounded-xl px-4 py-2">
              <FaSearch className="text-purple-500" />
              <input
                type="text"
                placeholder="Buscar o escanear producto..."
                className="input input-ghost w-full focus:outline-none"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <button className="btn rounded-xl bg-purple-700 text-white border-none hover:bg-purple-800">
                <FaBarcode />
              </button>
            </div>

            {/* LISTA DE PRODUCTOS */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {productosFiltrados.map((p) => (
                <div
                  key={p.id}
                  onClick={() =>
                    agregarProducto({
                      nombre: p.producto,
                      precio: p.venta,
                      codBar: p.codigo,
                    })
                  }
                  className="bg-purple-50 hover:bg-purple-100 cursor-pointer rounded-xl p-4 shadow-sm transition"
                >
                  {/* IMAGEN */}
                  <div className="w-full h-28 bg-white rounded-lg flex items-center justify-center mb-3 overflow-hidden">
                    <img
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKnKnw0MtmVH5_-A-wrEh5OiTSL3lu_5MZZA&s"
                      alt={p.producto}
                      className="h-full object-contain"
                    />
                  </div>

                  {/* DATOS */}
                  <h3 className="text-xs md:text-sm font-bold text-purple-800">
                    {p.producto}
                  </h3>

                  <p className="text-sm md:text-base text-fuchsia-600 font-bold mt-1">
                    S/ {p.venta.toFixed(2)}
                  </p>

                  <p className="text-xs text-gray-500 mt-1">COD: {p.codigo}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CARRITO */}
          <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col">
            {/* BOLETA/FACTURA */}
            <div className="mb-3">
              {/* name of each tab group should be unique */}
              <div className="tabs tabs-box rounded-xl bg-gradient-to-r from-lime-200 to-cyan-300 shadow-sm">
                {/* TAB TIPO DE PAGO 1 */}
                <input
                  type="radio"
                  name="my_tabs_6"
                  className="tab rounded-lg font-bold"
                  aria-label="Boleta Simple"
                />
                {/* TAB TIPO DE PAGO 2 */}
                <input
                  type="radio"
                  name="my_tabs_6"
                  className="tab rounded-lg font-bold"
                  aria-label="Boleta Electrónica"
                  defaultChecked
                />
                <div className="tab-content bg-base-100 border-base-300 p-6">
                  <div className="flex flex-col gap-3">
                    {/* BUSCADOR DE SUNAT BOLETAS */}
                    <div className="flex items-center gap-3 mb-2 bg-purple-50 rounded-xl px-4 py-1">
                      <FaSearch className="text-purple-500" />
                      <input
                        type="text"
                        placeholder="Buscar Cliente"
                        className="input input-ghost w-full"
                      />
                      <IoMdClose className="text-purple-500 text-2xl cursor-pointer hover:text-purple-700" />
                    </div>
                    {/* AGREGAR USUARIO */}
                    <div className="flex justify-end mb-1">
                      <span className="text-xs font-bold hover:text-purple-600 cursor-pointer">
                        + Nuevo Cliente
                      </span>
                    </div>
                    {/* DATOS DE SUNAT */}
                    <div className="flex flex-row gap-2">
                      <FaRegUser className="text-xs" />
                      <span className="text-xs">Nombre:</span>
                      <span className="text-xs font-bold">
                        JHEFERSON SANTIAGO BLANCO MARTIN
                      </span>
                    </div>
                    <div className="flex flex-row gap-2">
                      <AiOutlineIdcard className="text-xs" />
                      <span className="text-xs">N° Documento:</span>
                      <span className="text-xs font-bold">76045247</span>
                    </div>
                    <div className="flex flex-row gap-2">
                      <GrLocation className="text-xs" />
                      <span className="text-xs">Dirección:</span>
                      <span className="text-xs font-bold">
                        MZ K LT 17 VISTA ALEGRE - CARABAYLLO
                      </span>
                    </div>
                  </div>
                </div>
                {/* TAB TIPO DE PAGO 3 */}
                <input
                  type="radio"
                  name="my_tabs_6"
                  className="tab rounded-lg font-bold"
                  aria-label="Factura"
                />
                <div className="tab-content bg-base-100 border-base-300 p-6">
                  Tab content 3
                </div>
              </div>
            </div>
            {/* RESUMEN DE COMPRAS */}
            <div className="flex-1 space-y-3">
              {carrito.map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center bg-purple-50 rounded-xl px-3 py-2"
                >
                  <div>
                    <p className="font-semibold text-sm">{item.nombre}</p>
                    <p className="text-sm text-gray-500">
                      S/ {item.precio.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">cod: {item.codBar}</p>
                  </div>

                  <button className="text-red-500">
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
            {/* SUBTOTALES*/}
            <div className="mt-4 border-t pt-4">
              <div className="flex justify-between text-lg font-bold text-purple-800">
                <span>SubTotal</span>
                <span>S/ {total.toFixed(2)}</span>
              </div>
            </div>
            {/* PAGOS Y DESCUENTOS */}
            {/* PAGOS */}
            <div className="mt-3">
              {/* JOIN 1 */}
              <div className="flex flex-row gap-1">
                <select
                  defaultValue="Pick a font"
                  className="select select-ghost rounded-none rounded-l-xl bg-success "
                >
                  <option disabled={true}>Tipo de Pago</option>
                  <option>Efectivo</option>
                  <option>Yape</option>
                  <option>Plin</option>
                  <option>Transferencia</option>
                  <option>Agora</option>
                </select>

                <input
                  type="date"
                  className="input input-ghost rounded-none bg-purple-50 text-sm w-full sm:w-40"
                />

                <input
                  type="text"
                  placeholder="Monto"
                  className="input input-ghost rounded-none rounded-r-xl bg-purple-50 text-sm w-full sm:w-28"
                />
              </div>
              {/* Añadir mas pagos */}
              <div className="flex justify-end my-2">
                <span className="text-xs font-bold hover:text-purple-600 cursor-pointer">
                  + Añadir Pago
                </span>
              </div>
            </div>
            {/* DESCUENTOS */}
            <div className="flex flex-row gap-1 mt-2">
              <select
                defaultValue="Pick a font"
                className="select select-ghost rounded-none rounded-l-xl bg-error"
              >
                <option disabled={true}>Descuento</option>
                <option>Monto S/.</option>
                <option>Porcentual %</option>
              </select>

              <input
                type="date"
                className="input input-ghost rounded-none bg-purple-50 text-sm w-full sm:w-40"
              />

              <input
                type="text"
                placeholder="Monto"
                className="input input-ghost rounded-none rounded-r-xl bg-purple-50 text-sm w-full sm:w-28"
              />
            </div>
            {/* BOTONES DE ACCIONES*/}
            <button className="btn w-full mt-4 rounded-xl bg-fuchsia-500 text-white border-none hover:bg-fuchsia-600">
              Cobrar venta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PuntoVentaPage;
