import {
  NavLink,
} from "react-router-dom";

import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

import useAuth from "../../context/useAuth";

const links = [

  {
    name: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
    roles: ["admin", "vendedor", "cashier"],
  },

  {
    name: "Inventario",
    path: "/inventory",
    icon: Package,
    roles: ["admin"],
  },

  {
    name: "Ventas",
    path: "/sales",
    icon: ShoppingCart,
    roles: ["admin", "vendedor", "cashier"],
  },

  {
    name: "Clientes",
    path: "/customers",
    icon: Users,
    roles: ["admin", "vendedor"],
  },

  {
    name: "Reportes",
    path: "/reports",
    icon: BarChart3,
    roles: ["admin", "vendedor"],
  },

  {
    name: "Usuarios",
    path: "/users",
    icon: Users,
    roles: ["admin"],
  },

  {
    name: "Configuración",
    path: "/settings",
    icon: Settings,
    roles: ["admin"],
  },

];

function Sidebar() {

  const { user, logout } =
    useAuth();

  const availableLinks = links.filter((link) =>
    link.roles.includes(user?.role || "admin")
  );

  return (
    <aside
      className="
        hidden
        lg:flex
        flex-col
        justify-between
        w-[260px]
        border-r
        border-[var(--border)]
        bg-[var(--surface-strong)]
        px-5
        py-6
      "
    >

      <div>

        {/* LOGO */}
        <div className="px-3">

          <h1
            className="
              text-2xl
              font-black
              tracking-tight
              text-[#EAB308]
            "
          >
            CASA MAÍZ
          </h1>

          <p
            className="
              text-sm
              text-gray-500
              mt-1
            "
          >
            Enterprise ERP
          </p>

        </div>

        {/* NAV */}
        <nav className="mt-10 space-y-2">

          {availableLinks.map((link) => {

            const Icon =
              link.icon;

            return (

              <NavLink
                key={link.path}
                to={link.path}
                className={({
                  isActive,
                }) => `
                  flex
                  items-center
                  gap-3
                  rounded-2xl
                  px-4
                  py-3
                  transition-all
                  text-sm
                  font-medium
                  ${
                    isActive
                      ? `
                        bg-[#EAB308]
                        text-black
                      `
                      : `
                        text-[var(--text)]
                        hover:bg-white/[0.04]
                        hover:text-white
                      `
                  }
                `}
              >

                <Icon size={18} />

                {link.name}

              </NavLink>

            );
          })}

        </nav>

      </div>

      {/* LOGOUT */}
      <button
        onClick={logout}
        className="
          flex
          items-center
          justify-center
          gap-3
          rounded-2xl
          border
          border-red-500/10
          bg-red-500/10
          py-3
          text-sm
          font-semibold
          text-red-400
          transition-all
          hover:bg-red-500/20
        "
      >

        <LogOut size={18} />

        Cerrar sesión

      </button>

    </aside>
  );
}

export default Sidebar;