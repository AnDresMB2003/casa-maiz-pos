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
  },

  {
    name: "Inventario",
    path: "/inventory",
    icon: Package,
  },

  {
    name: "Ventas",
    path: "/sales",
    icon: ShoppingCart,
  },

  {
    name: "Clientes",
    path: "/customers",
    icon: Users,
  },

  {
    name: "Reportes",
    path: "/reports",
    icon: BarChart3,
  },

  {
    name: "Configuración",
    path: "/settings",
    icon: Settings,
  },

];

function Sidebar() {

  const { logout } =
    useAuth();

  return (
    <aside
      className="
        hidden
        lg:flex
        flex-col
        justify-between
        w-[260px]
        border-r
        border-white/[0.05]
        bg-[#111113]
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

          {links.map((link) => {

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
                        text-gray-400
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
          bg-red-500/5
          py-3
          text-sm
          font-semibold
          text-red-400
          transition-all
          hover:bg-red-500/10
        "
      >

        <LogOut size={18} />

        Cerrar sesión

      </button>

    </aside>
  );
}

export default Sidebar;