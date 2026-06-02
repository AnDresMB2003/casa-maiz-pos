import {
  useState,
} from "react";

import api from "../../services/api";

import toast from "react-hot-toast";

function UserForm({
  loadUsers,
}) {

  const [form, setForm] =
    useState({

      name: "",

      username: "",

      email: "",

      password: "",

      phone: "",

      document: "",

      role: "admin",

      status: "Activo",

      image: "",

    });

  const [preview, setPreview] =
    useState("");

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

  function handleImage(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({
        ...prev,
        image: reader.result,
      }));
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  }

  // SUBMIT
  async function handleSubmit(e) {

    e.preventDefault();

    try {
      setLoading(true);
      await api.post("/users", form);

      toast.success(
        "Usuario creado correctamente"
      );

      setForm({

        name: "",

        username: "",

        email: "",

        password: "",

        phone: "",

        document: "",

        role: "admin",

        status: "Activo",

        image: "",

      });

      setPreview("");
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
          bg-[var(--surface)]
          border
          border-[var(--border)]
          rounded-2xl
          px-5
          py-4
          outline-none
          text-[var(--text)]
          placeholder:text-[var(--muted)]
        "
        required
      />

      <input
        type="text"
        name="username"
        placeholder="Usuario"
        value={form.username}
        onChange={handleChange}
        className="
          bg-[var(--surface)]
          border
          border-[var(--border)]
          rounded-2xl
          px-5
          py-4
          outline-none
          text-[var(--text)]
          placeholder:text-[var(--muted)]
        "
      />

      {/* EMAIL */}
      <input
        type="email"
        name="email"
        placeholder="Correo"
        value={form.email}
        onChange={handleChange}
        className="
          bg-[var(--surface)]
          border
          border-[var(--border)]
          rounded-2xl
          px-5
          py-4
          outline-none
          text-[var(--text)]
          placeholder:text-[var(--muted)]
        "
        required
      />

      <input
        type="text"
        name="document"
        placeholder="Documento"
        value={form.document}
        onChange={handleChange}
        className="
          bg-[var(--surface)]
          border
          border-[var(--border)]
          rounded-2xl
          px-5
          py-4
          outline-none
          text-[var(--text)]
          placeholder:text-[var(--muted)]
        "
      />

      {/* PASSWORD */}
      <input
        type="password"
        name="password"
        placeholder="Contraseña"
        value={form.password}
        onChange={handleChange}
        className="
          bg-[var(--surface)]
          border
          border-[var(--border)]
          rounded-2xl
          px-5
          py-4
          outline-none
          text-[var(--text)]
          placeholder:text-[var(--muted)]
        "
        required
      />

      <input
        type="text"
        name="phone"
        placeholder="Teléfono"
        value={form.phone}
        onChange={handleChange}
        className="
          bg-[var(--surface)]
          border
          border-[var(--border)]
          rounded-2xl
          px-5
          py-4
          outline-none
          text-[var(--text)]
          placeholder:text-[var(--muted)]
        "
      />

      {/* ROLE */}
      <select
        name="role"
        value={form.role}
        onChange={handleChange}
        className="
          bg-[var(--surface)]
          border
          border-[var(--border)]
          rounded-2xl
          px-5
          py-4
          outline-none
          text-[var(--text)]
          placeholder:text-[var(--muted)]
        "
      >
        <option value="admin">Admin</option>
        <option value="vendedor">Vendedor</option>
        <option value="cashier">Cajero</option>
      </select>

      <select
        name="status"
        value={form.status}
        onChange={handleChange}
        className="
          bg-[var(--surface)]
          border
          border-[var(--border)]
          rounded-2xl
          px-5
          py-4
          outline-none
          text-[var(--text)]
          placeholder:text-[var(--muted)]
        "
      >
        <option value="Activo">Activo</option>
        <option value="Inactivo">Inactivo</option>
        <option value="Retirado">Retirado</option>
      </select>

      <label className="flex flex-col gap-3 rounded-2xl border border-white/10 p-4">
        <span className="text-sm text-gray-400">Foto de perfil</span>
        <input
          type="file"
          accept="image/*"
          onChange={handleImage}
          className="text-sm text-white"
        />
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-full max-w-xs rounded-3xl object-cover"
          />
        )}
      </label>

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