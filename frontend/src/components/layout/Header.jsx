import { Bell, Search } from "lucide-react";

function Header() {
  return (
    <header
      className="
        h-[90px]
        border-b
        border-white/5
        bg-[#070707]
        px-8
        flex
        items-center
        justify-between
      "
    >
      <div>
        <h2 className="text-4xl font-bold">
          Dashboard
        </h2>
      </div>

      <div className="flex items-center gap-5">

        <div
          className="
            hidden
            md:flex
            items-center
            gap-3
            w-[320px]
            bg-white/[0.03]
            border
            border-white/5
            rounded-2xl
            px-5
            py-4
          "
        >
          <Search size={20} className="text-gray-400" />

          <input
            type="text"
            placeholder="Buscar..."
            className="
              bg-transparent
              outline-none
              flex-1
              text-lg
            "
          />
        </div>

        <button
          className="
            relative
            w-14
            h-14
            rounded-2xl
            bg-white/[0.03]
            border
            border-white/5
            flex
            items-center
            justify-center
          "
        >
          <Bell size={22} />

          <span
            className="
              absolute
              -top-2
              -right-2
              w-6
              h-6
              rounded-full
              bg-[#EAB308]
              text-black
              text-xs
              font-bold
              flex
              items-center
              justify-center
            "
          >
            3
          </span>
        </button>

        <div
          className="
            w-14
            h-14
            rounded-full
            bg-[#EAB308]
            text-black
            text-xl
            font-bold
            flex
            items-center
            justify-center
          "
        >
          A
        </div>

      </div>
    </header>
  );
}

export default Header;