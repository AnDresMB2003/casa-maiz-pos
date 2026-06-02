import Sidebar from "../components/layout/Sidebar";

import Topbar from "../components/layout/Topbar";

function MainLayout({
  children,
}) {

  return (
    <div
      className="
        flex
        min-h-screen
        bg-[var(--bg)]
        text-[var(--text)]
      "
    >

      <Sidebar />

      <main
        className="
          flex-1
          overflow-x-hidden
        "
      >

        <div
          className="
            max-w-[1700px]
            mx-auto
            px-6
            lg:px-10
            py-8
          "
        >

          <Topbar />

          {children}

        </div>

      </main>

    </div>
  );
}

export default MainLayout;