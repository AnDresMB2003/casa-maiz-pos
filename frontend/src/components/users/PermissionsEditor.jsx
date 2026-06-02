import { useEffect, useState } from "react";
import api from "../../services/api";
import Card from "../ui/Card";
import Button from "../ui/Button";

const roleOptions = [
  { label: "Administrador", value: "admin" },
  { label: "Vendedor", value: "vendedor" },
];

const defaultPerms = [
  { module: "dashboard", label: "Dashboard" },
  { module: "inventory", label: "Inventario" },
  { module: "sales", label: "Ventas" },
  { module: "customers", label: "Clientes" },
  { module: "reports", label: "Reportes" },
  { module: "users", label: "Usuarios" },
  { module: "settings", label: "Configuración" },
];

const actions = [
  { key: "view", label: "Ver" },
  { key: "create", label: "Crear" },
  { key: "edit", label: "Editar" },
  { key: "delete", label: "Borrar" },
  { key: "export", label: "Exportar" },
];

export default function PermissionsEditor() {
  const [role, setRole] = useState("admin");
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    async function loadPermissions() {
      setLoading(true);
      try {
        const response = await api.get(`/permissions/${role}`);
        setPermissions(response.data?.permissions || {});
      } catch (error) {
        console.error(error);
        setPermissions({});
      } finally {
        setLoading(false);
      }
    }
    loadPermissions();
  }, [role]);

  const togglePermission = (module, action) => {
    setPermissions((current) => ({
      ...current,
      [module]: {
        ...current[module],
        [action]: !current[module]?.[action],
      },
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await api.post(`/permissions/${role}`, { permissions });
      setStatus("Permisos guardados correctamente");
    } catch (error) {
      console.error(error);
      setStatus("Error guardando permisos");
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(""), 3000);
    }
  };

  return (
    <Card className="space-y-4 p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Permisos de roles</h2>
          <p className="text-sm text-slate-400">Define qué acciones puede realizar cada rol.</p>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-200">Rol</label>
          <select
            value={role}
            onChange={(event) => setRole(event.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
          >
            {roleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p>Cargando permisos...</p>
      ) : (
        <form onSubmit={handleSave} className="space-y-4">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400">
                  <th className="px-3 py-2">Módulo</th>
                  {actions.map((action) => (
                    <th key={action.key} className="px-3 py-2">{action.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {defaultPerms.map((item) => (
                  <tr key={item.module} className="border-b border-slate-800">
                    <td className="px-3 py-2 font-medium text-slate-200">{item.label}</td>
                    {actions.map((action) => (
                      <td key={action.key} className="px-3 py-2">
                        <input
                          type="checkbox"
                          checked={!!permissions[item.module]?.[action.key]}
                          onChange={() => togglePermission(item.module, action.key)}
                          className="h-4 w-4 rounded border-slate-600 text-indigo-500"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {status && <p className="text-sm text-slate-300">{status}</p>}
            <Button type="submit" disabled={loading}>
              Guardar permisos
            </Button>
          </div>
        </form>
      )}
    </Card>
  );
}
