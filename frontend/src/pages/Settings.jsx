import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import api from "../services/api";
import toast from "react-hot-toast";

const defaultSettings = {
  business_name: "CASA MAÍZ",
  nit: "",
  phone: "",
  address: "",
  iva: 19,
  logo: "",
  currency: "COP",
  theme: "dark",
  invoice_prefix: "FAC",
};

function Settings() {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadSettings() {
      try {
        const response = await api.get("/settings");

        if (!ignore) {
          setSettings({
            ...defaultSettings,
            ...response.data,
          });
        }
      } catch {
        if (!ignore) {
          toast.error("Error cargando configuración");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadSettings();
    return () => {
      ignore = true;
    };
  }, []);

  const handleChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      await api.post("/settings", settings);
      toast.success("Configuración guardada");
    } catch {
      toast.error("Error guardando configuración");
    } finally {
      setSaving(false);
    }
  };

  const handleExport = async () => {
    setDownloading(true);

    try {
      const response = await api.get("/settings/backup", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `casamaiz-backup-${new Date().toISOString().slice(0, 10)}.db`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Copia de seguridad descargada");
    } catch {
      toast.error("No se pudo exportar la base de datos");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-5xl font-black text-[var(--primary)]">Configuración</h1>
          <p className="text-[var(--muted)] text-xl mt-4">Ajustes generales del sistema.</p>
        </div>

        {loading ? (
          <div className="text-2xl text-[var(--text)]">Cargando configuración...</div>
        ) : (
          <div className="rounded-[32px] border border-[var(--border)] bg-[var(--surface)] p-8 max-w-4xl">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block mb-3 text-lg text-[var(--text)]">Nombre del negocio</label>
                <input
                  value={settings.business_name}
                  onChange={(event) => handleChange("business_name", event.target.value)}
                  type="text"
                  placeholder="CASA MAÍZ"
                  className="w-full bg-[var(--surface-strong)] border border-[var(--border)] rounded-2xl px-5 py-4 outline-none text-[var(--text)]"
                />
              </div>

              <div>
                <label className="block mb-3 text-lg text-[var(--text)]">Dirección</label>
                <input
                  value={settings.address}
                  onChange={(event) => handleChange("address", event.target.value)}
                  type="text"
                  placeholder="Dirección del negocio"
                  className="w-full bg-[var(--surface-strong)] border border-[var(--border)] rounded-2xl px-5 py-4 outline-none text-[var(--text)]"
                />
              </div>

              <div>
                <label className="block mb-3 text-lg text-[var(--text)]">NIT</label>
                <input
                  value={settings.nit}
                  onChange={(event) => handleChange("nit", event.target.value)}
                  type="text"
                  placeholder="NIT del negocio"
                  className="w-full bg-[var(--surface-strong)] border border-[var(--border)] rounded-2xl px-5 py-4 outline-none text-[var(--text)]"
                />
              </div>

              <div>
                <label className="block mb-3 text-lg text-[var(--text)]">Teléfono</label>
                <input
                  value={settings.phone}
                  onChange={(event) => handleChange("phone", event.target.value)}
                  type="text"
                  placeholder="Teléfono"
                  className="w-full bg-[var(--surface-strong)] border border-[var(--border)] rounded-2xl px-5 py-4 outline-none text-[var(--text)]"
                />
              </div>

              <div>
                <label className="block mb-3 text-lg text-[var(--text)]">IVA (%)</label>
                <input
                  value={settings.iva}
                  onChange={(event) => handleChange("iva", Number(event.target.value))}
                  type="number"
                  min="0"
                  className="w-full bg-[var(--surface-strong)] border border-[var(--border)] rounded-2xl px-5 py-4 outline-none text-[var(--text)]"
                />
              </div>

              <div>
                <label className="block mb-3 text-lg text-[var(--text)]">Prefijo de factura</label>
                <input
                  value={settings.invoice_prefix}
                  onChange={(event) => handleChange("invoice_prefix", event.target.value)}
                  type="text"
                  placeholder="FAC"
                  className="w-full bg-[var(--surface-strong)] border border-[var(--border)] rounded-2xl px-5 py-4 outline-none text-[var(--text)]"
                />
              </div>

              <div>
                <label className="block mb-3 text-lg text-[var(--text)]">Moneda</label>
                <select
                  value={settings.currency}
                  onChange={(event) => handleChange("currency", event.target.value)}
                  className="w-full bg-[var(--surface-strong)] border border-[var(--border)] rounded-2xl px-5 py-4 outline-none text-[var(--text)]"
                >
                  <option value="COP">COP</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>

              <div>
                <label className="block mb-3 text-lg text-[var(--text)]">Tema</label>
                <select
                  value={settings.theme}
                  onChange={(event) => handleChange("theme", event.target.value)}
                  className="w-full bg-[var(--surface-strong)] border border-[var(--border)] rounded-2xl px-5 py-4 outline-none text-[var(--text)]"
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end mt-6">
              <button
                onClick={handleExport}
                disabled={downloading}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] px-6 py-3 text-sm font-semibold text-[var(--text)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {downloading ? "Descargando..." : "Exportar base de datos"}
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-2xl bg-[#EAB308] px-6 py-3 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default Settings;