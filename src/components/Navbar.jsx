import { FaBell, FaUserCircle, FaBars } from "react-icons/fa";
import { ImExit } from "react-icons/im";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";

function Navbar({ abrirSidebar }) {
  const navigate = useNavigate(); // ✅ ahora sí

  const logout = async () => {
    await signOut(auth);
    navigate("/");
  };

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
          Salomé Store
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative cursor-pointer">
          <FaBell className="text-xl text-purple-700" />
          <span className="absolute -top-1 -right-1 bg-fuchsia-500 text-white text-xs rounded-full px-1">
            3
          </span>
        </button>

        {/* 👇 aquí disparas logout */}
        <ImExit
          onClick={logout}
          className="text-2xl text-purple-700 cursor-pointer hover:scale-110 transition"
        />
      </div>
    </div>
  );
}

export default Navbar;