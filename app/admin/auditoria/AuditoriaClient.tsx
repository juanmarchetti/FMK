"use client";

import { useState } from "react";

export function AuditoriaClient({ initialLogs }: { initialLogs: any[] }) {
  const [logs, setLogs] = useState(initialLogs);
  const [filtroAccion, setFiltroAccion] = useState("");
  const [filtroEntidad, setFiltroEntidad] = useState("");

  const filteredLogs = logs.filter((log) => {
    const matchAccion = filtroAccion ? log.action === filtroAccion : true;
    const matchEntidad = filtroEntidad ? log.entity_type === filtroEntidad : true;
    return matchAccion && matchEntidad;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center justify-between p-4 border border-[#54585B]/20 bg-white rounded-lg">
        <div className="flex flex-wrap gap-3 items-center">
          <div>
            <label className="block text-xs font-bold text-[#54585B] mb-1">Filtrar por Acción</label>
            <select
              value={filtroAccion}
              onChange={(e) => setFiltroAccion(e.target.value)}
              className="h-10 rounded border border-[#54585B]/30 px-3 text-sm bg-white"
            >
              <option value="">Todas las acciones</option>
              <option value="CREATE">Creación (CREATE)</option>
              <option value="UPDATE">Actualización (UPDATE)</option>
              <option value="DELETE">Eliminación (DELETE)</option>
              <option value="SUSPEND">Suspensión (SUSPEND)</option>
              <option value="ANULAR">Anulación de Acta (ANULAR)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-[#54585B] mb-1">Filtrar por Entidad</label>
            <select
              value={filtroEntidad}
              onChange={(e) => setFiltroEntidad(e.target.value)}
              className="h-10 rounded border border-[#54585B]/30 px-3 text-sm bg-white"
            >
              <option value="">Todas las entidades</option>
              <option value="usuario">Usuario</option>
              <option value="normativa">Normativa</option>
              <option value="estilo">Estilo</option>
              <option value="kata">Kata</option>
              <option value="acta">Acta</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-[#54585B]/20 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#F3F4F5] text-xs uppercase tracking-wide text-[#54585B]">
            <tr>
              <th className="px-4 py-3">Fecha y Hora</th>
              <th className="px-4 py-3">Usuario Responsable</th>
              <th className="px-4 py-3">Acción</th>
              <th className="px-4 py-3">Tipo Entidad</th>
              <th className="px-4 py-3">ID Entidad</th>
              <th className="px-4 py-3">Detalles de la Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#54585B]/10">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-[#F8F9FA]">
                <td className="px-4 py-3 text-[#54585B]">
                  {new Date(log.created_at).toLocaleString("es-ES")}
                </td>
                <td className="px-4 py-3 font-semibold text-[#191C1D]">{log.user_email || "Sistema"}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-bold ${
                    log.action === "CREATE" ? "bg-green-100 text-green-800" :
                    log.action === "UPDATE" ? "bg-blue-100 text-blue-800" :
                    log.action === "DELETE" ? "bg-red-100 text-red-800" :
                    log.action === "SUSPEND" ? "bg-yellow-100 text-yellow-800" :
                    "bg-purple-100 text-purple-800"
                  }`}>
                    {log.action}
                  </span>
                </td>
                <td className="px-4 py-3 text-[#54585B] capitalize">{log.entity_type}</td>
                <td className="px-4 py-3 text-[#54585B] text-xs font-mono truncate max-w-[120px]" title={log.entity_id}>
                  {log.entity_id || "N/A"}
                </td>
                <td className="px-4 py-3 text-[#54585B]">{log.details}</td>
              </tr>
            ))}
            {filteredLogs.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-[#54585B]">
                  No hay registros de auditoría en la base de datos que coincidan con la búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
