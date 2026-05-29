import MainLayout from "../layouts/MainLayout";

function Settings() {
  return (
    <MainLayout>

      <div className="space-y-8">

        <div>
          <h1 className="text-5xl font-black text-[#EAB308]">
            Configuración
          </h1>

          <p className="text-gray-400 text-xl mt-4">
            Ajustes generales del sistema.
          </p>
        </div>

        <div
          className="
            rounded-[32px]
            border
            border-white/[0.06]
            bg-white/[0.03]
            p-8
            max-w-3xl
          "
        >

          <div className="space-y-6">

            <div>
              <label className="block mb-3 text-lg">
                Nombre del negocio
              </label>

              <input
                type="text"
                placeholder="CASA MAÍZ"
                className="
                  w-full
                  bg-black/30
                  border
                  border-white/10
                  rounded-2xl
                  px-5
                  py-4
                  outline-none
                "
              />
            </div>

            <div>
              <label className="block mb-3 text-lg">
                Dirección
              </label>

              <input
                type="text"
                placeholder="Dirección del negocio"
                className="
                  w-full
                  bg-black/30
                  border
                  border-white/10
                  rounded-2xl
                  px-5
                  py-4
                  outline-none
                "
              />
            </div>

            <button
              className="
                mt-4
                bg-[#EAB308]
                text-black
                font-bold
                px-8
                py-4
                rounded-2xl
              "
            >
              Guardar cambios
            </button>

          </div>

        </div>

      </div>

    </MainLayout>
  );
}

export default Settings;