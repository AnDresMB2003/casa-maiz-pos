import { useEffect, useState } from "react";
import api from "../../services/api";
import Button from "../ui/Button";

export default function NotificationMenu() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function loadNotifications() {
      try {
        const response = await api.get("/notifications");
        setNotifications(response.data || []);
      } catch (error) {
        console.error("Error cargando notificaciones", error);
      }
    }
    loadNotifications();
  }, []);

  return (
    <div className="relative">
      <Button
        variant="secondary"
        className="px-3 py-2"
        onClick={() => setOpen((prev) => !prev)}
      >
        Notificaciones
      </Button>
      {open && (
        <div className="absolute right-0 z-20 mt-2 w-80 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-xl">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold">Centro de notificaciones</span>
            <button
              type="button"
              className="text-sm text-slate-400 hover:text-white"
              onClick={() => setOpen(false)}
            >
              Cerrar
            </button>
          </div>
          {notifications.length === 0 ? (
            <p className="text-sm text-slate-400">Sin notificaciones nuevas</p>
          ) : (
            <ul className="space-y-3">
              {notifications.map((item) => (
                <li key={item.id} className="rounded-2xl border border-slate-700 bg-slate-900 p-3">
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="mt-1 text-xs text-slate-400">{item.message}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
