import {
  useState,
} from "react";

import axios from "axios";

import toast from "react-hot-toast";

function UserForm({
  loadUsers,
}) {

  const [form, setForm] =
    useState({

      name: "",

      email: "",

      password: "",

      role: "employee",

    });

  const [loading, setLoading] =
    useState(false);

  // HANDLE CHANGE
  function handleChange(e) {

    setForm({

      ...form,

      [e.target.name]:
        e.target.value,

    });
  }

  // SUBMIT
  async function handleSubmit(e) {

    e.preventDefault();

    try {

      setLoading(true);

      const token =
        localStorage.getItem(
          "token"
        );

      await axios.post(

        "http://localhost:4000/api/users",

        form,

        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      toast.success(
        "Usuario creado correctamente"
      );

      setForm({

        name: "",

        email: "",

        password: "",

        role: "employee",

      });

      loadUsers();

    } catch (error) {

      toast.error(
        error.response?.data?.error ||
        "Error creando usuario"
      );

    } finally {

      setLoading(false);
    }
  }

  return (

    <form
      onSubmit={handleSubmit}
      className="
        grid
        grid-cols-1
        md:grid-cols-2
        gap-5
      "
    >

      {/* NAME */}
      <input
        type="text"
        name="name"
        placeholder="Nombre"
        value={form.name}
        onChange={handleChange}
        className="
          bg-[#1A1A1A]
          border
          border-white/10
          rounded-2xl
          px-5
          py-4
          outline-none
        "
        required
      />

      {/* EMAIL */}
      <input
        type="email"
        name="email"
        placeholder="Correo"
        value={form.email}
        onChange={handleChange}
        className="
          bg-[#1A1A1A]
          border
          border-white/10
          rounded-2xl
          px-5
          py-4
          outline-none
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
          bg-[#1A1A1A]
          border
          border-white/10
          rounded-2xl
          px-5
          py-4
          outline-none
        "
        required
      />

      {/* ROLE */}
      <select
        name="role"
        value={form.role}
        onChange={handleChange}
        className="
          bg-[#1A1A1A]
          border
          border-white/10
          rounded-2xl
          px-5
          py-4
          outline-none
        "
      >

        <option value="admin">
          Admin
        </option>

        <option value="employee">
          Employee
        </option>

        <option value="cashier">
          Cashier
        </option>

      </select>

      {/* BUTTON */}
      <button
        disabled={loading}
        className="
          md:col-span-2
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
            ? "Creando..."
            : "Crear Usuario"
        }

      </button>

    </form>
  );
}

export default UserForm;