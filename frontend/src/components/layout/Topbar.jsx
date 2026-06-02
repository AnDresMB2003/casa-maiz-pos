import useAuth from "../../context/useAuth";
import NotificationMenu from "./NotificationMenu";
import ThemeSwitcher from "./ThemeSwitcher";

function Topbar() {
  const { user } = useAuth();

  return (
    <header
      className="
        flex
        flex-col
        lg:flex-row
        items-center
        justify-between
        gap-5
        mb-10
      "
    >
      <div
        className="
          flex
          flex-col
          sm:flex-row
          sm:items-center
          gap-4
          w-full
        "
      >
        <div className="ml-auto flex items-center gap-3">
          
          <ThemeSwitcher />
          <NotificationMenu />
                  <div
          className="
            flex
            items-center
            gap-3
            rounded-2xl
            border
            border-[var(--border)]
            bg-[var(--surface-strong)]
            px-4
            py-3
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
                text-[var(--text)]
              "
            >
              {user?.name || "Usuario"}
            </h3>

            <p
              className="
                text-xs
                text-[var(--muted)]
              "
            >
              {user?.role || "Admin"}
            </p>
          </div>
        </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;