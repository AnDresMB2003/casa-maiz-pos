import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import toast from "react-hot-toast";

import MainLayout from "../layouts/MainLayout";

import UserForm from "../components/users/UserForm";

import {
  Trash2,
  Shield,
} from "lucide-react";

function Users() {

  // STATES
  const [users, setUsers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // LOAD USERS
  async function loadUsers() {

    try {

      const token =
        localStorage.getItem(
          "token"
        );

      const response =
        await axios.get(

          "http://localhost:4000/api/users",

          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      setUsers(response.data);

    } catch {

      toast.error(
        "Error cargando usuarios"
      );

    } finally {

      setLoading(false);
    }
  }

  // INIT
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

  // DELETE USER
  async function handleDelete(id) {

    const confirmDelete =
      window.confirm(
        "¿Eliminar usuario?"
      );

    if (!confirmDelete) return;

    try {

      const token =
        localStorage.getItem(
          "token"
        );

      await axios.delete(

        `http://localhost:4000/api/users/${id}`,

        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      toast.success(
        "Usuario eliminado"
      );

      await loadUsers();

    } catch {

      toast.error(
        "Error eliminando usuario"
      );
    }
  }

  return (

    <MainLayout>

      <div className="space-y-10">

        {/* HEADER */}
        <div>

          <h1
            className="
              text-5xl
              font-black
              text-[#EAB308]
            "
          >
            Gestión de Usuarios
          </h1>

          <p className="text-gray-400 mt-3">

            Administra usuarios,
            roles y permisos.

          </p>

        </div>

        {/* FORM */}
        <div
          className="
            rounded-[36px]
            border
            border-white/10
            bg-white/[0.03]
            p-8
            backdrop-blur-xl
          "
        >

          <UserForm
            loadUsers={loadUsers}
          />

        </div>

        {/* TABLE */}
        <div
          className="
            rounded-[36px]
            border
            border-white/10
            bg-white/[0.03]
            p-8
            backdrop-blur-xl
            overflow-x-auto
          "
        >

          <table className="w-full">

            <thead>

              <tr
                className="
                  text-left
                  border-b
                  border-white/10
                "
              >

                <th className="pb-5">
                  Usuario
                </th>

                <th className="pb-5">
                  Email
                </th>

                <th className="pb-5">
                  Rol
                </th>

                <th className="pb-5">
                  Acción
                </th>

              </tr>

            </thead>

            <tbody>

              {
                loading
                  ? (
                    <tr>

                      <td
                        colSpan="4"
                        className="
                          py-10
                          text-center
                          text-gray-400
                        "
                      >
                        Cargando...
                      </td>

                    </tr>
                  )
                  : users.map((user) => (

                    <tr
                      key={user.id}
                      className="
                        border-b
                        border-white/5
                      "
                    >

                      {/* USER */}
                      <td className="py-5">

                        <div
                          className="
                            flex
                            items-center
                            gap-3
                          "
                        >

                          <div
                            className="
                              w-11
                              h-11
                              rounded-full
                              bg-[#EAB308]
                              text-black
                              font-bold
                              flex
                              items-center
                              justify-center
                            "
                          >

                            {
                              user.name
                                ?.charAt(0)
                            }

                          </div>

                          <span>
                            {user.name}
                          </span>

                        </div>

                      </td>

                      {/* EMAIL */}
                      <td className="py-5">
                        {user.email}
                      </td>

                      {/* ROLE */}
                      <td className="py-5">

                        <div
                          className="
                            inline-flex
                            items-center
                            gap-2
                            px-4
                            py-2
                            rounded-2xl
                            bg-[#EAB308]/10
                            text-[#EAB308]
                          "
                        >

                          <Shield size={16} />

                          {user.role}

                        </div>

                      </td>

                      {/* ACTION */}
                      <td className="py-5">

                        <button
                          onClick={() =>
                            handleDelete(
                              user.id
                            )
                          }
                          className="
                            w-11
                            h-11
                            rounded-2xl
                            bg-red-500/10
                            text-red-400
                            flex
                            items-center
                            justify-center
                            hover:scale-105
                            transition
                          "
                        >

                          <Trash2 size={18} />

                        </button>

                      </td>

                    </tr>
                  ))
              }

            </tbody>

          </table>

        </div>

      </div>

    </MainLayout>
  );
}

export default Users;