//src/pages/InventarioCategoriasPage.jsx
import { useState } from "react";
import { FaSearch, FaPlus } from "react-icons/fa";

function InventarioCategoriasPage() {
const [busqueda, setBusqueda] = useState("");
  
  const productos = [
    {
      Id: "sdfg74b5d56w8",
      nombreCat: "Leche",
      estado: "activo",
    },
    {
      Id: "sdff5g7t57re",
      nombreCat: "Arroz",
      estado: "activo",
    },
  ];

  const filtrados = productos.filter((p) =>
    p.nombreCat.toLowerCase().includes(busqueda.toLowerCase()),
  );

  return (
    <>
      <div className="flex flex-col bg-white px-3 pb-3 pt-4 rounded-b-xl">
        <div className="flex flex-row justify-between mb-4 gap-2 items-center">
          <div className="bg-white rounded-2xl shadow-md px-4 py-1 flex items-center gap-3">
            <FaSearch className="text-purple-500 shrink-0" />
            <input
              type="text"
              placeholder="Buscar categoría..."
              className="input input-ghost w-full focus:outline-none"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="flex flex-row gap-1 md:gap-2">
            <button className="btn rounded-full bg-fuchsia-500 text-white border-none hover:bg-fuchsia-600 px-4 md:px-6 flex gap-2 items-center cursor-pointer shadow-md">
              <FaPlus />
              <span className="font-bold hidden md:inline">Nueva categoria</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table text-sm w-full">
              <thead className="text-center">
                <tr className="text-purple-800 bg-purple-50">
                  <th className="py-4 px-2">Categoria</th>
                  <th className="py-4 px-2">Producto</th>
                </tr>
              </thead>

              <tbody className="text-center">
                {filtrados.map((p, i) => (
                  <tr key={i} className="hover:bg-purple-50 transition">
                    <td className="font-semibold text-purple-800 py-2 px-2">{p.nombreCat}</td>
                    <td className="py-2 px-2">{p.estado}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default InventarioCategoriasPage