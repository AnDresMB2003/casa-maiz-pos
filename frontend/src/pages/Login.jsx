import {
  useState,
} from "react";

import axios from "axios";

import {
  useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";
import useAuth from "../context/useAuth";

function Login() {

  const navigate =
    useNavigate();

const {
  login,
} = useAuth();

  const [form, setForm] =
    useState({

      email: "",

      password: "",

    });

  const [loading, setLoading] =
    useState(false);

  // CHANGE
  function handleChange(e) {

    setForm({

      ...form,

      [e.target.name]:
        e.target.value,

    });
  }

  // LOGIN
  async function handleLogin(e) {

    e.preventDefault();

    try {

      setLoading(true);

      const response =
        await axios.post(

          "http://localhost:4000/api/auth/login",

          form
        );

      // SAVE TOKEN
      login(
        response.data.token,
        response.data.user
      );

      toast.success(
        "Bienvenido 🔥"
      );

      navigate("/");

    } catch (error) {

      toast.error(

        error.response?.data?.error ||

        "Error iniciando sesión"
      );

    } finally {

      setLoading(false);
    }
  }

  return (

    <div
      className="
        min-h-screen
        bg-[#0A0A0A]
        flex
        items-center
        justify-center
        p-6
      "
    >

      <div
        className="
          w-full
          max-w-md
          rounded-[40px]
          border
          border-white/10
          bg-white/[0.03]
          p-10
          backdrop-blur-xl
        "
      >

        {/* TITLE */}
        <div className="mb-10">

          <h1
            className="
              text-5xl
              font-black
              text-[#EAB308]
            "
          >
            CASA MAÍZ
          </h1>

          <p className="text-gray-400 mt-4">

            Sistema administrativo premium.

          </p>

        </div>

        {/* FORM */}
        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >

          {/* EMAIL */}
          <input
            type="email"
            name="email"
            placeholder="Correo"
            value={form.email}
            onChange={handleChange}
            className="
              w-full
              bg-[#1A1A1A]
              border
              border-white/10
              rounded-2xl
              px-5
              py-4
              outline-none
              text-white
            "
            required
          />

          {/* PASSWORD */}
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            className="
              w-full
              bg-[#1A1A1A]
              border
              border-white/10
              rounded-2xl
              px-5
              py-4
              outline-none
              text-white
            "
            required
          />

          {/* BUTTON */}
          <button
            disabled={loading}
            className="
              w-full
              bg-[#EAB308]
              text-black
              font-bold
              py-4
              rounded-2xl
              hover:scale-[1.02]
              transition
            "
          >

            {
              loading
                ? "Ingresando..."
                : "Iniciar Sesión"
            }

          </button>

        </form>

      </div>

    </div>
  );
}

export default Login;