import {
  Bell,
  Search,
} from "lucide-react";

import useAuth from "../../context/useAuth";

function Topbar() {

  const { user } =
    useAuth();

  return (
    <header
      className="
        flex
        flex-col
        lg:flex-row
        items-start
        lg:items-center
        justify-between
        gap-5
        mb-10
      "
    >

      {/* SEARCH */}
      <div
        className="
          flex
          items-center
          gap-3
          h-12
          rounded-2xl
          border
          border-white/[0.05]
          bg-[#111113]
          px-4
          w-full
          max-w-lg
        "
      >

        <Search
          size={18}
          className="text-gray-500"
        />

        <input
          type="text"
          placeholder="Buscar..."
          className="
            bg-transparent
            outline-none
            w-full
            text-sm
            text-white
            placeholder:text-gray-500
          "
        />

      </div>

      {/* RIGHT */}
      <div
        className="
          flex
          items-center
          gap-4
        "
      >

        {/* NOTIFICATIONS */}
        <button
          className="
            relative
            flex
            items-center
            justify-center
            h-12
            w-12
            rounded-2xl
            border
            border-white/[0.05]
            bg-[#111113]
          "
        >

          <Bell size={18} />

          <span
            className="
              absolute
              top-3
              right-3
              h-2
              w-2
              rounded-full
              bg-[#EAB308]
            "
          />

        </button>

        {/* USER */}
        <div
          className="
            flex
            items-center
            gap-3
            rounded-2xl
            border
            border-white/[0.05]
            bg-[#111113]
            px-3
            py-2
          "
        >

          <div
            className="
              flex
              items-center
              justify-center
              h-10
              w-10
              rounded-xl
              bg-[#EAB308]
              text-black
              font-black
              text-sm
            "
          >
            {user?.name?.[0] || "U"}
          </div>

          <div>

            <h3
              className="
                text-sm
                font-semibold
              "
            >
              {user?.name || "Usuario"}
            </h3>

            <p
              className="
                text-xs
                text-gray-500
              "
            >
              {user?.role || "Admin"}
            </p>

          </div>

        </div>

      </div>

    </header>
  );
}

export default Topbar;