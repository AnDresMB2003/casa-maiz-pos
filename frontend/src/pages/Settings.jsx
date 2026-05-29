/* frontend/src/pages/Settings.jsx */

import {
  useState,
} from "react";

import axios from "axios";

import toast from "react-hot-toast";

import MainLayout from "../layouts/MainLayout";

/* =========================================
   LOAD SETTINGS OUTSIDE COMPONENT
========================================= */

async function getSettings() {

  try {

    const response =
      await axios.get(
        "http://localhost:4000/api/settings"
      );

    return (
      response.data || {
        business_name: "",
        nit: "",
        phone: "",
        address: "",
        iva: "19",
        logo: "",
      }
    );

  } catch (error) {

    console.log(error);

    return {
      business_name: "",
      nit: "",
      phone: "",
      address: "",
      iva: "19",
      logo: "",
    };
  }
}

function Settings() {

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [initialized, setInitialized] =
    useState(false);

  const [settings, setSettings] =
    useState({
      business_name: "",
      nit: "",
      phone: "",
      address: "",
      iva: "19",
      logo: "",
    });

  /* =========================================
     INITIAL LOAD
  ========================================= */

  if (
    !initialized
  ) {

    setInitialized(true);

    getSettings()
      .then((data) => {

        setSettings({
          business_name:
            data.business_name || "",

          nit:
            data.nit || "",

          phone:
            data.phone || "",

          address:
            data.address || "",

          iva:
            data.iva || "19",

          logo:
            data.logo || "",
        });

        setLoading(false);
      });
  }

  /* =========================================
     HANDLE CHANGE
  ========================================= */

  function handleChange(e) {

    const {
      name,
      value,
    } = e.target;

    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  /* =========================================
     SAVE SETTINGS
  ========================================= */

  async function saveSettings() {

    try {

      setSaving(true);

      await axios.post(
        "http://localhost:4000/api/settings",
        settings
      );

      toast.success(
        "Configuración guardada"
      );

    } catch (error) {

      console.log(error);

      toast.error(
        "Error guardando configuración"
      );

    } finally {

      setSaving(false);
    }
  }

  /* =========================================
     LOADING
  ========================================= */

  if (loading) {

    return (

      <MainLayout>

        <div
          className="
            text-2xl
            font-bold
          "
        >
          Cargando configuración...
        </div>

      </MainLayout>
    );
  }

  /* =========================================
     UI
  ========================================= */

  return (

    <MainLayout>

      <div className="space-y-10">

        <div>

          <h1
            className="
              text-5xl
              font-black
              text-[#EAB308]
            "
          >
            Configuración
          </h1>

          <p
            className="
              text-gray-400
              text-xl
              mt-4
            "
          >
            Ajustes generales del sistema.
          </p>

        </div>

        <div
          className="
            rounded-[36px]
            border
            border-white/[0.06]
            bg-gradient-to-br
            from-white/[0.04]
            to-white/[0.02]
            p-8
            max-w-5xl
            backdrop-blur-xl
          "
        >

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-6
            "
          >

            {/* BUSINESS NAME */}

            <div>

              <label
                className="
                  block
                  mb-3
                  text-lg
                  font-semibold
                "
              >
                Nombre del negocio
              </label>

              <input
                type="text"
                name="business_name"
                value={
                  settings.business_name
                }
                onChange={
                  handleChange
                }
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
                  text-white
                "
              />

            </div>

            {/* NIT */}

            <div>

              <label
                className="
                  block
                  mb-3
                  text-lg
                  font-semibold
                "
              >
                NIT
              </label>

              <input
                type="text"
                name="nit"
                value={
                  settings.nit
                }
                onChange={
                  handleChange
                }
                placeholder="901456789-1"
                className="
                  w-full
                  bg-black/30
                  border
                  border-white/10
                  rounded-2xl
                  px-5
                  py-4
                  outline-none
                  text-white
                "
              />

            </div>

            {/* PHONE */}

            <div>

              <label
                className="
                  block
                  mb-3
                  text-lg
                  font-semibold
                "
              >
                Teléfono
              </label>

              <input
                type="text"
                name="phone"
                value={
                  settings.phone
                }
                onChange={
                  handleChange
                }
                placeholder="+57 300 000 0000"
                className="
                  w-full
                  bg-black/30
                  border
                  border-white/10
                  rounded-2xl
                  px-5
                  py-4
                  outline-none
                  text-white
                "
              />

            </div>

            {/* IVA */}

            <div>

              <label
                className="
                  block
                  mb-3
                  text-lg
                  font-semibold
                "
              >
                IVA (%)
              </label>

              <input
                type="number"
                name="iva"
                value={
                  settings.iva
                }
                onChange={
                  handleChange
                }
                placeholder="19"
                className="
                  w-full
                  bg-black/30
                  border
                  border-white/10
                  rounded-2xl
                  px-5
                  py-4
                  outline-none
                  text-white
                "
              />

            </div>

            {/* ADDRESS */}

            <div
              className="
                md:col-span-2
              "
            >

              <label
                className="
                  block
                  mb-3
                  text-lg
                  font-semibold
                "
              >
                Dirección
              </label>

              <input
                type="text"
                name="address"
                value={
                  settings.address
                }
                onChange={
                  handleChange
                }
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
                  text-white
                "
              />

            </div>

            {/* LOGO */}

            <div
              className="
                md:col-span-2
              "
            >

              <label
                className="
                  block
                  mb-3
                  text-lg
                  font-semibold
                "
              >
                URL del logo
              </label>

              <input
                type="text"
                name="logo"
                value={
                  settings.logo
                }
                onChange={
                  handleChange
                }
                placeholder="https://..."
                className="
                  w-full
                  bg-black/30
                  border
                  border-white/10
                  rounded-2xl
                  px-5
                  py-4
                  outline-none
                  text-white
                "
              />

            </div>

          </div>

          {/* PREVIEW */}

          <div
            className="
              mt-10
              rounded-[28px]
              border
              border-white/10
              bg-black/20
              p-6
            "
          >

            <p
              className="
                text-sm
                uppercase
                tracking-[4px]
                text-gray-500
                mb-4
              "
            >
              Vista previa factura
            </p>

            <h2
              className="
                text-4xl
                font-black
                text-[#EAB308]
              "
            >
              {settings.business_name ||
                "CASA MAÍZ"}
            </h2>

            <div
              className="
                mt-4
                space-y-2
                text-gray-300
              "
            >

              <p>
                NIT:
                {" "}
                {settings.nit ||
                  "901456789-1"}
              </p>

              <p>
                {settings.address ||
                  "Dirección del negocio"}
              </p>

              <p>
                {settings.phone ||
                  "+57 300 000 0000"}
              </p>

              <p>
                IVA:
                {" "}
                {settings.iva || "19"}
                %
              </p>

            </div>

          </div>

          {/* BUTTON */}

          <div
            className="
              flex
              justify-end
              mt-10
            "
          >

            <button
              onClick={
                saveSettings
              }
              disabled={saving}
              className="
                bg-[#EAB308]
                text-black
                font-black
                px-8
                py-4
                rounded-2xl
                hover:scale-[1.02]
                transition
              "
            >

              {saving
                ? "Guardando..."
                : "Guardar cambios"}

            </button>

          </div>

        </div>

      </div>

    </MainLayout>
  );
}

export default Settings;