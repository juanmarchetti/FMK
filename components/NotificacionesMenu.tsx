"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  obtenerNotificacionesNoLeidas, 
  marcarNotificacionComoLeida, 
  marcarTodasComoLeidas 
} from "@/lib/notificaciones/actions";

// Icons for different notification types
const getIconForType = (tipo: string) => {
  switch (tipo) {
    case "convocatoria": return "event";
    case "documento": return "folder_open";
    case "solicitud": return "description";
    case "resultado": return "emoji_events";
    case "sistema": return "info";
    default: return "notifications";
  }
};

const getColorForType = (tipo: string) => {
  switch (tipo) {
    case "convocatoria": return "text-blue-600 bg-blue-50";
    case "documento": return "text-red-600 bg-red-50";
    case "solicitud": return "text-green-600 bg-green-50";
    case "resultado": return "text-yellow-600 bg-yellow-50";
    case "sistema": return "text-gray-600 bg-gray-50";
    default: return "text-[#7A1F2A] bg-[#7A1F2A]/10";
  }
};

export function NotificacionesMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [notificaciones, setNotificaciones] = useState<any[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchNotificaciones();
    // Setting up a polling interval for notifications every 60 seconds
    const interval = setInterval(() => {
      fetchNotificaciones();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function fetchNotificaciones() {
    const res = await obtenerNotificacionesNoLeidas();
    if (res && res.notificaciones) {
      setNotificaciones(res.notificaciones);
      setCount(res.count);
    }
  }

  async function handleNotificationClick(notif: any) {
    setLoading(true);
    await marcarNotificacionComoLeida(notif.id);
    await fetchNotificaciones();
    setOpen(false);
    setLoading(false);
    
    if (notif.enlace) {
      router.push(notif.enlace);
    }
  }

  async function handleMarkAllAsRead() {
    setLoading(true);
    await marcarTodasComoLeidas();
    await fetchNotificaciones();
    setLoading(false);
    setOpen(false);
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setOpen(!open)}
        className="relative h-10 w-10 flex items-center justify-center rounded-full hover:bg-[#54585B]/10 transition-colors"
        aria-label="Notificaciones"
      >
        <span className="material-symbols-outlined text-[#54585B]">
          notifications
        </span>
        {count > 0 && (
          <span className="absolute top-1 right-1 h-4 w-4 flex items-center justify-center rounded-full bg-[#BA1A1A] text-white text-[9px] font-bold">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-lg border border-[#54585B]/20 bg-white shadow-lg z-50 overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#54585B]/10 px-4 py-3 bg-[#F8F9FA]">
            <h3 className="font-bold text-[#191C1D]">Notificaciones</h3>
            {count > 0 && (
              <button 
                onClick={handleMarkAllAsRead}
                disabled={loading}
                className="text-xs text-[#7A1F2A] hover:underline font-medium"
              >
                Marcar todas leídas
              </button>
            )}
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {notificaciones.length === 0 ? (
              <div className="px-4 py-8 text-center flex flex-col items-center">
                <span className="material-symbols-outlined text-4xl text-[#54585B]/30 mb-2">
                  notifications_off
                </span>
                <p className="text-sm text-[#54585B]">No tienes notificaciones nuevas</p>
              </div>
            ) : (
              <div className="divide-y divide-[#54585B]/10">
                {notificaciones.map((notif) => (
                  <button
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    disabled={loading}
                    className="w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-[#F8F9FA] transition-colors"
                  >
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${getColorForType(notif.tipo)}`}>
                      <span className="material-symbols-outlined text-[18px]">
                        {getIconForType(notif.tipo)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#191C1D] leading-tight">
                        {notif.titulo}
                      </p>
                      <p className="text-xs text-[#54585B] mt-1 line-clamp-2">
                        {notif.mensaje}
                      </p>
                      <p className="text-[10px] text-[#54585B]/60 mt-1.5 uppercase font-medium">
                        {new Date(notif.created_at).toLocaleDateString("es-ES", {
                          day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
                        })}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
