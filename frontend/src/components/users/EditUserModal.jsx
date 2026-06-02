import { useEffect, useState } from "react";

import api from "../../services/api";
import toast from "react-hot-toast";

function EditUserModal({ open, user, onClose, onUpdated }) {
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    document: "",
    phone: "",
    role: "admin",
    status: "Activo",
    active: true,
    image: "",
  });

  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !user) return;

    setForm({
      name: user.name || "",
      username: user.username || "",
      email: user.email || "",
      document: user.document || "",
      phone: user.phone || "",
      role: user.role || "admin",
      status: user.status || "Activo",
      active: user.active === 1 || user.active === true,
      image: user.image || "",
    });

    setPreview(user.image || "");
  }, [open, user]);

  if (!open || !user) return null;

  function updateField(key, value) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function handleImage(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      updateField("image", reader.result);
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  }

  async function handleSave() {
    try {
      setLoading(true);
      await api.put(`/users/${user.id}`, form);
      toast.success("Usuario actualizado");
      onUpdated();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.error || "Error actualizando usuario");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[var(--surface)] text-[var(--text)] w-full max-w-2xl rounded-3xl p-7 shadow-2xl border border-[var(--border)]">
        <div className="flex justify-between items-center mb-7">
          <div>
            <h2 className="text-3xl font-black">Editar usuario</h2>
            <p className="text-[var(--muted)]">Actualiza los datos del usuario.</p>
          </div>
          <button onClick={onClose} className="w-11 h-11 rounded-2xl bg-red-800 text-white">
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <input
            type="text"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder="Nombre"
            className="border border-[var(--border)] rounded-2xl p-4 text-[var(--text)] placeholder:text-[var(--muted)] bg-[var(--surface)]"
          />

          <input
            type="text"
            value={form.username}
            onChange={(e) => updateField("username", e.target.value)}
            placeholder="Usuario"
            className="border border-[var(--border)] rounded-2xl p-4 text-[var(--text)] placeholder:text-[var(--muted)] bg-[var(--surface)]"
          />

          <input
            type="email"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            placeholder="Correo"
            className="border border-[var(--border)] rounded-2xl p-4 text-[var(--text)] placeholder:text-[var(--muted)] bg-[var(--surface)]"
          />

          <input
            type="text"
            value={form.document}
            onChange={(e) => updateField("document", e.target.value)}
            placeholder="Documento"
            className="border border-[var(--border)] rounded-2xl p-4 text-[var(--text)] placeholder:text-[var(--muted)] bg-[var(--surface)]"
          />

          <input
            type="text"
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            placeholder="Teléfono"
            className="border border-[var(--border)] rounded-2xl p-4 text-[var(--text)] placeholder:text-[var(--muted)] bg-[var(--surface)]"
          />

          <select
            value={form.role}
            onChange={(e) => updateField("role", e.target.value)}
            className="border border-[var(--border)] rounded-2xl p-4 text-[var(--text)] bg-[var(--surface)]"
          >
            <option value="admin">Admin</option>
            <option value="vendedor">Vendedor</option>
            <option value="cashier">Cajero</option>
          </select>

          <select
            value={form.status}
            onChange={(e) => updateField("status", e.target.value)}
            className="border border-[var(--border)] rounded-2xl p-4 text-[var(--text)] bg-[var(--surface)]"
          >
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
            <option value="Retirado">Retirado</option>
          </select>

          <label className="flex items-center gap-3 rounded-2xl border p-4">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => updateField("active", e.target.checked)}
            />
            Usuario activo
          </label>
        </div>

        <div className="mt-6 border-2 border-dashed rounded-3xl p-6 text-center">
          <input type="file" accept="image/*" id="editUserImage" className="hidden" onChange={handleImage} />
          <label htmlFor="editUserImage" className="inline-flex bg-black text-white px-5 py-3 rounded-2xl cursor-pointer font-semibold">
            📁 Cambiar foto de perfil
          </label>
          {preview && (
            <img src={preview} alt="preview" className="w-40 h-40 rounded-3xl object-cover mx-auto mt-6" />
          )}
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button onClick={onClose} className="px-5 py-3 rounded-2xl bg-gray-100 font-semibold">
            Cancelar
          </button>
          <button onClick={handleSave} disabled={loading} className="px-6 py-3 rounded-2xl bg-black text-white font-bold">
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditUserModal;
