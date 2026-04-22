//src/pages/LoginPage.jsx
import { useState } from "react";
import { FaAngleRight } from "react-icons/fa6";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        correo,
        clave,
      );

      console.log("Usuario logueado:", userCredential.user);

      navigate("/dashboard"); // 🚀 redirige
    } catch (error) {
      console.error(error.message);
      alert("Credenciales incorrectas");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 via-purple-900 to-purple-700 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-8">
          <p className="text-white text-sm">¿No tienes una cuenta?</p>

          <button className="btn btn-lg py-3 rounded-full bg-fuchsia-500 border-none text-white px-6 hover:bg-fuchsia-600 flex flex-row items-center gap-2 transition cursor-pointer">
            <span className="font-bold">Suscríbete</span>
            <FaAngleRight />
          </button>
        </div>

        <div className="bg-white rounded-2xl px-3 py-4 md:px-5 md:py-6 shadow-xl mb-6 relative overflow-hidden">
          <h2 className="text-2xl md:text-3xl font-Oswald font-bold text-purple-800">
            Bienvenido Emprendedor
          </h2>

          <div className="absolute right-2 bottom-0 text-5xl md:text-7xl opacity-30">
            😎
          </div>
        </div>

        <h3 className="text-white text-2xl font-bold mb-5">Iniciar sesión</h3>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text text-white font-medium ">
                Correo electrónico
              </span>
            </label>

            <input
              type="email"
              placeholder="correo@ejemplo.com"
              className="input input-bordered w-full rounded-xl bg-white p-3 font-medium text-gray-500"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text text-white font-medium">
                Contraseña
              </span>
            </label>

            <input
              type="password"
              placeholder="••••••••"
              className="input input-bordered w-full rounded-xl bg-white p-3 font-medium text-gray-500"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
            />
          </div>

          <div className="text-center">
            <a href="#" className="text-fuchsia-300 text-sm underline">
              ¿Olvidaste la contraseña?
            </a>
          </div>

          <button className="btn w-full rounded-full border-none text-xl font-bold bg-gradient-to-r from-lime-200 to-cyan-300 text-fuchsia-600 hover:scale-[1.02] transition py-3 cursor-pointer hover:bg-gradient-to-r hover:from-cyan-300 hover:to-lime-200">
            Continuar →
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
