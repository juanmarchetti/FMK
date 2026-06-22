"use client";

import { useState } from "react";
import { updateNormativa } from "./actions";

export function NormativaClient({ initialData }: { initialData: any[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingId) return;

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await updateNormativa(editingId, formData);
    
    setLoading(false);
    if (res.error) {
      alert(res.error);
    } else {
      setEditingId(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-[#F3F4F5] text-xs uppercase tracking-wide text-[#54585B]">
          <tr>
            <th className="px-4 py-3">Grado</th>
            <th className="px-4 py-3">Edad Mínima</th>
            <th className="px-4 py-3">Permanencia (meses)</th>
            <th className="px-4 py-3">Licencias Consec.</th>
            <th className="px-4 py-3">Licencias Alt.</th>
            <th className="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#54585B]/10">
          {initialData.map((regla) => {
            const isEditing = editingId === regla.id;

            if (isEditing) {
              return (
                <tr key={regla.id} className="bg-[#EAF5EF]">
                  <td colSpan={6} className="p-0">
                    <form onSubmit={handleSubmit} className="p-4 flex flex-col md:flex-row gap-4 items-end">
                      <div className="flex-1 min-w-[120px]">
                        <label className="block text-xs font-bold text-[#191C1D] mb-1">Grado</label>
                        <input disabled value={regla.grado} className="w-full h-9 rounded border border-[#54585B]/30 bg-[#F3F4F5] px-2 text-sm text-[#54585B] cursor-not-allowed" />
                      </div>
                      <div className="w-24">
                        <label htmlFor="edad_minima" className="block text-xs font-bold text-[#191C1D] mb-1">Edad mín.</label>
                        <input type="number" name="edad_minima" id="edad_minima" defaultValue={regla.edad_minima} required min={0} className="w-full h-9 rounded border border-[#54585B]/30 bg-white px-2 text-sm text-[#191C1D] focus:border-[#7A1F2A] focus:outline-none focus:ring-1 focus:ring-[#7A1F2A]" />
                      </div>
                      <div className="w-32">
                        <label htmlFor="permanencia_minima_meses" className="block text-xs font-bold text-[#191C1D] mb-1">Perm. (meses)</label>
                        <input type="number" name="permanencia_minima_meses" id="permanencia_minima_meses" defaultValue={regla.permanencia_minima_meses} required min={0} className="w-full h-9 rounded border border-[#54585B]/30 bg-white px-2 text-sm text-[#191C1D] focus:border-[#7A1F2A] focus:outline-none focus:ring-1 focus:ring-[#7A1F2A]" />
                      </div>
                      <div className="w-32">
                        <label htmlFor="licencias_consecutivas_min" className="block text-xs font-bold text-[#191C1D] mb-1">Licencias Cons.</label>
                        <input type="number" name="licencias_consecutivas_min" id="licencias_consecutivas_min" defaultValue={regla.licencias_consecutivas_min} required min={0} className="w-full h-9 rounded border border-[#54585B]/30 bg-white px-2 text-sm text-[#191C1D] focus:border-[#7A1F2A] focus:outline-none focus:ring-1 focus:ring-[#7A1F2A]" />
                      </div>
                      <div className="w-32">
                        <label htmlFor="licencias_alternas_min" className="block text-xs font-bold text-[#191C1D] mb-1">Licencias Alt.</label>
                        <input type="number" name="licencias_alternas_min" id="licencias_alternas_min" defaultValue={regla.licencias_alternas_min} required min={0} className="w-full h-9 rounded border border-[#54585B]/30 bg-white px-2 text-sm text-[#191C1D] focus:border-[#7A1F2A] focus:outline-none focus:ring-1 focus:ring-[#7A1F2A]" />
                      </div>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => setEditingId(null)} className="h-9 rounded border border-[#54585B]/35 bg-white px-3 text-xs font-bold text-[#54585B] transition hover:bg-[#F3F4F5]">Cancelar</button>
                        <button type="submit" disabled={loading} className="h-9 rounded bg-[#7A1F2A] px-3 text-xs font-bold text-white transition hover:bg-[#5B0616] disabled:opacity-70">{loading ? "Guardando..." : "Guardar"}</button>
                      </div>
                    </form>
                  </td>
                </tr>
              );
            }

            return (
              <tr key={regla.id} className="hover:bg-[#F8F9FA]">
                <td className="px-4 py-3 font-bold text-[#191C1D]">{regla.grado}</td>
                <td className="px-4 py-3 text-[#54585B]">{regla.edad_minima} años</td>
                <td className="px-4 py-3 text-[#54585B]">{regla.permanencia_minima_meses} meses</td>
                <td className="px-4 py-3 text-[#54585B]">{regla.licencias_consecutivas_min}</td>
                <td className="px-4 py-3 text-[#54585B]">{regla.licencias_alternas_min}</td>
                <td className="px-4 py-3 text-right">
                  <button 
                    onClick={() => setEditingId(regla.id)}
                    className="text-[#7A1F2A] hover:text-[#5B0616] font-semibold text-sm"
                  >
                    Editar
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
