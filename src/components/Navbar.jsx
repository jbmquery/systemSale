//src/components/Navbar.jsx
import { FaBell, FaUserCircle, FaBars } from "react-icons/fa";

function Navbar({ abrirSidebar }) {
  return (
    <div className="w-full h-16 bg-white shadow-sm flex items-center justify-between px-6 rounded-b-2xl">

      <div className="flex items-center gap-4">

        <button
          className="md:hidden text-xl text-purple-800"
          onClick={abrirSidebar}
        >
          <FaBars />
        </button>

        <h1 className="text-xl font-bold text-purple-800">
          Lupita Store
        </h1>

      </div>

      <div className="flex items-center gap-4">
        <button className="relative cursor-pointer">
          <FaBell className="text-xl text-purple-700" />
          <span className="absolute -top-1 -right-1 bg-fuchsia-500 text-white text-xs rounded-full px-1">
            3
          </span>
        </button>

        <FaUserCircle className="text-3xl text-purple-700 cursor-pointer" />
      </div>
    </div>
  );
}

export default Navbar;