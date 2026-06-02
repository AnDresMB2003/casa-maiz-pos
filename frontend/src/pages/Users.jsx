import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import MainLayout from "../layouts/MainLayout";

import UserForm from "../components/users/UserForm";
import EditUserModal from "../components/users/EditUserModal";
import DeleteConfirmModal from "../components/ui/DeleteConfirmModal";
import PermissionsEditor from "../components/users/PermissionsEditor";

import api from "../services/api";

import {
  Trash2,
  Shield,
  Pencil,
} from "lucide-react";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  async function loadUsers() {
    try {
      const response = await api.get("/users");
      setUsers(response.data);
    } catch {
      toast.error("Error cargando usuarios");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let mounted = true;

    async function init() {
      if (!mounted) return;
      await loadUsers();
    }

    init();

    return () => {
      mounted = false;
    };
  }, []);

  function openEditModal(user) {
    setEditUser(user);
  }

  function closeEditModal() {
    setEditUser(null);
  }

  function openDeleteModal(id) {
    setDeleteUserId(id);
    setIsDeleteModalOpen(true);
  }

  function closeDeleteModal() {
    setDeleteUserId(null);
    setIsDeleteModalOpen(false);
  }

  async function handleDelete() {
    if (!deleteUserId) return;

    try {
      await api.delete(`/users/${deleteUserId}`);
      toast.success("Usuario eliminado");
      await loadUsers();
    } catch {
      toast.error("Error eliminando usuario");
    } finally {
      closeDeleteModal();
    }
  }

  function handleUpdate() {
    closeEditModal();
    loadUsers();
  }

  return (
    <MainLayout>
      <div className="space-y-10">
        <div>
          <h1 className="text-5xl font-black text-[#EAB308]">
            Gestión de Usuarios
          </h1>
          <p className="text-[var(--muted)] mt-3">
            Administra usuarios, roles y permisos.
          </p>
        </div>

        <div className="rounded-[36px] border border-[var(--border)] bg-[var(--surface)] p-8 backdrop-blur-xl">
          <UserForm loadUsers={loadUsers} />
        </div>

        <div className="rounded-[36px] border border-[var(--border)] bg-[var(--surface)] p-8 backdrop-blur-xl overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-white/10">
                <th className="pb-5">Usuario</th>
                <th className="pb-5">Email</th>
                <th className="pb-5">Rol</th>
                <th className="pb-5">Estado</th>
                <th className="pb-5">Acción</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-10 text-center text-gray-400">
                    Cargando...
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-b border-white/5">
                    <td className="py-5">
                      <div className="flex items-center gap-3">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt={user.name}
                            className="w-11 h-11 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-[#EAB308] text-black font-bold flex items-center justify-center">
                            {user.name?.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold">{user.name}</div>
                          <div className="text-sm text-gray-400">{user.username || user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-5">{user.email}</td>
                    <td className="py-5">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#EAB308]/10 text-[#EAB308]">
                        <Shield size={16} />
                        {user.role}
                      </div>
                    </td>
                    <td className="py-5">
                      <span className={`inline-flex items-center rounded-2xl px-4 py-2 text-sm ${user.active ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
                        {user.active ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="py-5 flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(user)}
                        className="w-11 h-11 rounded-2xl bg-white/10 text-white flex items-center justify-center hover:scale-105 transition"
                        title="Editar usuario"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => openDeleteModal(user.id)}
                        className="w-11 h-11 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center hover:scale-105 transition"
                        title="Eliminar usuario"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <EditUserModal
          open={Boolean(editUser)}
          user={editUser}
          onClose={closeEditModal}
          onUpdated={handleUpdate}
        />

        <DeleteConfirmModal
          open={isDeleteModalOpen}
          title="Eliminar usuario"
          message="¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer."
          onCancel={closeDeleteModal}
          onConfirm={handleDelete}
        />

        <div className="mt-10">
          <PermissionsEditor />
        </div>
      </div>
    </MainLayout>
  );
}

export default Users;