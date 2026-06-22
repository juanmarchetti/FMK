"use client";

import { useState } from "react";
import { anularActa } from "./actions";

export function ActasClient({ initialConvocatorias }: { initialConvocatorias: any[] }) {
  const [convocatorias, setConvocatorias] = useState(initialConvocatorias);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [motivo, setMotivo] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAnular(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedId) return;

    if (!confirm("¿Estás completamente seguro de que deseas anular esta acta? Esto revertirá el estado de todos los aspirantes asociados a 'validada' y cambiará la convocatoria a 'cerrada'.")) {
      return;
    }

    setLoading(true);
    const res = await anularActa(selectedId, motivo);
    setLoading(false);

    if (res.error) {
      alert(res.error);
    } else {
      alert("Acta anulada exitosamente.");
      setSelectedId(null);
      setMotivo("");
      window.location.reload();
    }
  }

  return (
    <div className="space-y-6">
      {selectedId && (
        <form onSubmit={handleAnular} className="p-5 border border-[#BA1A1A]/30 bg-[#FFF1F2] rounded-lg space-y-4">
          <h3 className="font-bold text-[#BA1A1A] flex items-center gap-2">
            <span className="material-symbols-outlined">warning</span>
            Anular Acta de Examen (ADM-22)
          </h3>
          <p className="text-sm text-[#54585B]">
            Ingresa el motivo de anulación oficial. Esta acción es crítica y quedará registrada en el log de auditoría.
          </p>
          <div>
            <label className="block text-xs font-bold text-[#191C1D] mb-1">Motivo de Anulación *</label>
            <textarea
              required
              rows={3}
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="w-full rounded border border-[#BA1A1A]/30 bg-white px-3 py-2 text-sm focus:outline-none"
              placeholder="Ej. Incidente técnico, error en actas físicas..."
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setSelectedId(null)}
              className="h-9 rounded border border-[#54585B]/35 px-4 text-xs font-bold text-[#54585B]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="h-9 rounded bg-[#BA1A1A] px-4 text-xs font-bold text-white hover:bg-[#93000A]"
            >
              {loading ? "Anulando..." : "Confirmar Anulación"}
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-lg border border-[#54585B]/20 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#F3F4F5] text-xs uppercase tracking-wide text-[#54585B]">
            <tr>
              <th className="px-4 py-3">Nombre Convocatoria</th>
              <th className="px-4 py-3">Fecha de Examen</th>
              <th className="px-4 py-3">Sede</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#54585B]/10">
            {convocatorias.map((c) => (
              <tr key={c.id} className="hover:bg-[#F8F9FA]">
                <td className="px-4 py-3 font-bold text-[#191C1D]">{c.nombre}</td>
                <td className="px-4 py-3 text-[#54585B]">{new Date(c.fecha_examen).toLocaleDateString("es-ES")}</td>
                <td className="px-4 py-3 text-[#54585B]">{c.sede}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => setSelectedId(c.id)}
                    className="text-[#BA1A1A] hover:text-[#93000A] font-semibold text-sm"
                  >
                    Anular Acta
                  </button>
                </td>
              </tr>
            ))}
            {convocatorias.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-[#54585B]">
                  No hay convocatorias finalizadas con actas disponibles para anular.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
