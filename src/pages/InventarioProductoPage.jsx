//src/pages/InventarioProductoPage.jsx
import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { FaSearch, FaPlus } from "react-icons/fa";
import { BiSolidDownload } from "react-icons/bi";
import { NavLink } from "react-router-dom";
import { FaBarcode } from "react-icons/fa6";
import { MdFileUpload } from "react-icons/md";
import { ImCloudUpload } from "react-icons/im";


function InventarioProductoPage() {
  const [sidebarAbierto, setSidebarAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  const productos = [
    {
      Id:"sdfg74b5d56w8",
      codBar: "775012345678",
      nombre: "Leche Gloria 1L",
      categoria: "Lácteos",
      marca: "Gloria",
      unidad: "Unidad",
      compra: "S/ 3.50",
      venta: "S/ 4.50",
      stock: 12,
      minimo: 5,
      lote: "L001",
      vencimiento: "25/03/2026",
      nomProveedor: "Adolfo Gutierrez SAC",
      fecRegitro: "16/03/2026"
    },
    {
      Id:"sdff5g7t57re",
      codBar: "775098765432",
      nombre: "Yogurt Fresa",
      categoria: "Lácteos",
      marca: "Laive",
      unidad: "Unidad",
      compra: "S/ 2.00",
      venta: "S/ 3.00",
      stock: 3,
      minimo: 5,
      lote: "L002",
      vencimiento: "20/03/2026",
      nomProveedor: "JuanquinMaquiz EIRL",
      fecRegitro: "16/03/2026"
    },
  ];

  const filtrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()),
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-purple-50 to-purple-100">
      <Sidebar
        abierto={sidebarAbierto}
        cerrar={() => setSidebarAbierto(false)}
      />

      <div className="flex-1 min-w-0">
        <Navbar abrirSidebar={() => setSidebarAbierto(true)} />

        <div className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h2 className="text-3xl font-bold text-purple-800">Inventario</h2>
              <p className="text-sm text-purple-500">
                Control inteligente de productos y stock
              </p>
            </div>
          </div>

          {/* PESTAÑA */}

          <div className="overflow-hidden">
            <div
              role="tablist"
              className="tabs tabs-border tabs-sm lg:tabs-xl pt-2 px-2 bg-white font-bold rounded-t-xl text-sm md:text-lg overflow-x-auto text-purple-700"
            >
              <NavLink
                to="/inventario-producto"
                className={({ isActive }) =>
                  `tab text-sm md:text-lg whitespace-nowrap ${
                    isActive ? "tab-active" : ""
                  }`
                }
              >
                Productos
              </NavLink>

              <NavLink
                to="/inventario/categorias"
                className={({ isActive }) =>
                  `tab text-sm md:text-lg whitespace-nowrap ${
                    isActive ? "tab-active" : ""
                  }`
                }
              >
                Categorías
              </NavLink>

              <NavLink
                to="/inventario/marcas"
                className={({ isActive }) =>
                  `tab text-sm md:text-lg whitespace-nowrap ${
                    isActive ? "tab-active" : ""
                  }`
                }
              >
                Marcas
              </NavLink>

              <NavLink
                to="/inventario/unidades"
                className={({ isActive }) =>
                  `tab text-sm md:text-lg whitespace-nowrap ${
                    isActive ? "tab-active" : ""
                  }`
                }
              >
                Unidades
              </NavLink>
            </div>
          </div>

          {/* CUERPO - PESTAÑA */}
          <div className="flex flex-col bg-white px-3 pb-3 pt-4 rounded-b-xl">
            <div className="flex flex-row justify-between mb-4 gap-2 items-center">
              <div className="bg-white rounded-2xl shadow-md px-4 py-1 flex items-center gap-3">
                <FaSearch className="text-purple-500 shrink-0" />
                <input
                  type="text"
                  placeholder="Buscar producto..."
                  className="input input-ghost w-full focus:outline-none"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>

              <div className="flex flex-row gap-1 md:gap-2">
                <button className="btn rounded-full bg-gray-600 text-white border-none hover:bg-gray-800 px-4 md:px-6 flex gap-2 items-center cursor-pointer shadow-md">
                  <FaBarcode className="font-bold text-sm md:text-xl" />
                </button>
                <button className="btn rounded-full bg-purple-700 text-white border-none hover:bg-purple-900 px-4 md:px-6 flex gap-2 items-center cursor-pointer shadow-md">
                  <ImCloudUpload className="font-bold text-sm md:text-2xl" />
                </button>
                <button className="btn rounded-full bg-purple-700 text-white border-none hover:bg-purple-900 px-4 md:px-6 flex gap-2 items-center cursor-pointer shadow-md">
                  <BiSolidDownload className="font-bold text-sm md:text-2xl" />
                </button>
                <button className="btn rounded-full bg-fuchsia-500 text-white border-none hover:bg-fuchsia-600 px-4 md:px-6 flex gap-2 items-center cursor-pointer shadow-md">
                  <FaPlus />
                  <span className="font-bold hidden md:inline">
                    Nuevo producto
                  </span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="table text-sm w-full">
                  <thead className="text-center">
                    <tr className="text-purple-800 bg-purple-50">
                      <th className="py-4 px-2">Código</th>
                      <th className="py-4 px-2">Producto</th>
                      <th className="py-4 px-2">Categoría</th>
                      <th className="py-4 px-2">Marca</th>
                      <th className="py-4 px-2">Unidad</th>
                      <th className="py-4 px-2">Compra</th>
                      <th className="py-4 px-2">Venta</th>
                      <th className="py-4 px-2">Stock</th>
                      <th className="py-4 px-2">Lote</th>
                      <th className="py-4 px-2">Vence</th>
                      <th className="py-4 px-2">Estado</th>
                    </tr>
                  </thead>

                  <tbody className="text-center">
                    {filtrados.map((p, i) => (
                      <tr key={i} className="hover:bg-purple-50 transition">
                        <td className="py-2 px-2">{p.codBar}</td>

                        <td className="font-semibold text-purple-800 text-left px-2">
                          {p.nombre}
                        </td>

                        <td className="py-2 px-2">{p.categoria}</td>
                        <td className="py-2">{p.marca}</td>
                        <td className="py-2 px-2">{p.unidad}</td>
                        <td className="py-2 px-2">{p.compra}</td>
                        <td className="py-2 px-2">{p.venta}</td>

                        <td className="py-2 px-2">
                          <span
                            className={`badge ${
                              p.stock <= p.minimo
                                ? "badge-error"
                                : "badge-success"
                            }`}
                          >
                            {p.stock}
                          </span>
                        </td>

                        <td className="py-2 px-2">{p.lote}</td>
                        <td className="py-2 px-2">{p.vencimiento}</td>

                        <td className="py-2 px-2">
                          {p.stock <= p.minimo ? (
                            <span className="badge badge-error">Bajo</span>
                          ) : (
                            <span className="badge badge-success">Normal</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InventarioProductoPage;
