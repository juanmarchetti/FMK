"use client";

import { useState } from "react";
import { updateParametro } from "./actions_parametros";

export function ParametrosClient({ initialParametros }: { initialParametros: any[] }) {
  const [parametros, setParametros] = useState(initialParametros);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [valor, setValor] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSave(id: string) {
    setLoading(true);
    const res = await updateParametro(id, valor);
    setLoading(false);
    if (res.error) {
      alert(res.error);
    } else {
      setEditingId(null);
      setValor("");
      window.location.reload();
    }
  }

  function startEdit(p: any) {
    setEditingId(p.id);
    setValor(p.valor);
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-[#54585B]/20 bg-white mt-6">
      <table className="w-full text-left text-sm">
        <thead className="bg-[#F3F4F5] text-xs uppercase tracking-wide text-[#54585B]">
          <tr>
            <th className="px-4 py-3">Clave / Concepto</th>
            <th className="px-4 py-3">Valor Configurado</th>
            <th className="px-4 py-3">Descripción</th>
            <th className="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#54585B]/10">
          {parametros.map((p) => {
            const isEditing = editingId === p.id;
            return (
              <tr key={p.id} className={isEditing ? "bg-[#EAF5EF]" : "hover:bg-[#F8F9FA]"}>
                <td className="px-4 py-3 font-mono text-xs font-bold text-[#191C1D]">{p.clave}</td>
                <td className="px-4 py-3 font-bold">
                  {isEditing ? (
                    <input
                      type="text"
                      value={valor}
                      onChange={(e) => setValor(e.target.value)}
                      className="h-8 rounded border border-[#54585B]/30 px-2 text-sm bg-white focus:outline-none"
                    />
                  ) : (
                    p.valor
                  )}
                </td>
                <td className="px-4 py-3 text-[#54585B] text-xs">{p.descripcion}</td>
                <td className="px-4 py-3 text-right">
                  {isEditing ? (
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingId(null)}
                        className="h-8 rounded border border-[#54585B]/35 px-3 text-xs font-bold text-[#54585B] bg-white"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => handleSave(p.id)}
                        disabled={loading}
                        className="h-8 rounded bg-[#7A1F2A] px-3 text-xs font-bold text-white"
                      >
                        Guardar
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => startEdit(p)}
                      className="text-[#7A1F2A] hover:text-[#5B0616] font-semibold text-sm"
                    >
                      Editar
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
