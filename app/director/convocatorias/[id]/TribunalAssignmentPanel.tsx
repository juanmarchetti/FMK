"use client";

import { useState, useTransition } from "react";
import { guardarTribunal } from "../../resultados/actions";

interface JuezOption {
  id: string;
  nombre: string;
  diploma: string;
  fechaDiploma: string;
}

export function TribunalAssignmentPanel({
  convocatoriaId,
  juecesDisponibles,
  juecesAsignadosIniciales,
  arbitroAsignadoInicial,
}: {
  convocatoriaId: string;
  juecesDisponibles: JuezOption[];
  juecesAsignadosIniciales: string[];
  arbitroAsignadoInicial: string | null;
}) {
  const [isPending, startTransition] = useTransition();
  const [juecesSelected, setJuecesSelected] = useState<string[]>(juecesAsignadosIniciales);
  const [arbitroSelected, setArbitroSelected] = useState<string>(arbitroAsignadoInicial || "");
  const [feedback, setFeedback] = useState<{ type: "success" | "warning" | "error"; message: string } | null>(null);

  const toggleJuez = (juezId: string) => {
    if (juecesSelected.includes(juezId)) {
      setJuecesSelected(juecesSelected.filter((id) => id !== juezId));
    } else {
      setJuecesSelected([...juecesSelected, juezId]);
    }
  };

  const handleSave = () => {
    startTransition(async () => {
      try {
        const res = await guardarTribunal(
          convocatoriaId,
          juecesSelected,
          arbitroSelected || undefined
        );
        if (res.advertenciaPar) {
          setFeedback({
            type: "warning",
            message: "⚠ Tribunal guardado. Advertencia: Se recomienda constituir tribunales con número impar de miembros.",
          });
        } else {
          setFeedback({
            type: "success",
            message: "✅ Tribunal guardado correctamente con número impar de miembros.",
          });
        }
      } catch (err: any) {
        setFeedback({ type: "error", message: err.message });
      }
      setTimeout(() => setFeedback(null), 7000);
    });
  };

  return (
    <section className="rounded-lg border border-[#54585B]/20 bg-white p-5 space-y-4 col-span-full mt-6">
      <div className="border-b border-[#54585B]/10 pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#191C1D]" style={{ fontFamily: "Montserrat, sans-serif" }}>
            Constitución del Tribunal (DIR-14 a DIR-18)
          </h2>
          <p className="text-xs text-[#54585B] mt-0.5">
            Selecciona los jueces diplomados y el árbitro de Shiai Kumite para esta convocatoria.
          </p>
        </div>
        <button
          type="button"
          disabled={isPending}
          onClick={handleSave}
          className="h-10 rounded bg-[#7A1F2A] px-4 text-sm font-bold text-white hover:bg-[#5B0616] transition disabled:opacity-50"
        >
          {isPending ? "Guardando..." : "Guardar Composición"}
        </button>
      </div>

      {feedback && (
        <div
          className={`rounded border p-3 text-sm font-semibold ${
            feedback.type === "success"
              ? "border-[#2D6A4F]/30 bg-[#EAF5EF] text-[#2D6A4F]"
              : feedback.type === "warning"
              ? "border-[#E3A008]/30 bg-[#FDF6B2] text-[#85750D]"
              : "border-[#BA1A1A]/30 bg-[#FFF1F2] text-[#BA1A1A]"
          }`}
        >
          {feedback.message}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Panel Jueces */}
        <div>
          <p className="text-xs font-bold uppercase text-[#54585B] mb-2">
            Jueces Diplomados Habilitados (Seleccionados: {juecesSelected.length})
          </p>
          <div className="space-y-2 max-h-[220px] overflow-y-auto border border-[#54585B]/15 rounded p-2">
            {juecesDisponibles.map((juez) => (
              <label
                key={juez.id}
                className={`flex items-center gap-3 p-2 rounded cursor-pointer transition ${
                  juecesSelected.includes(juez.id)
                    ? "bg-[#F8E9EB] border border-[#7A1F2A]/30"
                    : "hover:bg-[#F8F9FA] border border-transparent"
                }`}
              >
                <input
                  type="checkbox"
                  checked={juecesSelected.includes(juez.id)}
                  onChange={() => toggleJuez(juez.id)}
                  disabled={arbitroSelected === juez.id}
                  className="accent-[#7A1F2A]"
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#191C1D]">{juez.nombre}</p>
                  <p className="text-xs text-[#54585B]">
                    Diploma: {juez.diploma || "No vigente"} (Obtenido: {juez.fechaDiploma})
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Panel Árbitro */}
        <div>
          <p className="text-xs font-bold uppercase text-[#54585B] mb-2">
            Árbitro de Shiai Kumite (DIR-17)
          </p>
          <div className="space-y-2">
            <select
              value={arbitroSelected}
              onChange={(e) => setArbitroSelected(e.target.value)}
              className="w-full h-11 rounded border border-[#54585B]/30 px-3 text-sm bg-white font-semibold text-[#191C1D]"
            >
              <option value="">-- Sin árbitro asignado --</option>
              {juecesDisponibles
                .filter((j) => !juecesSelected.includes(j.id))
                .map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.nombre} (Diploma: {j.diploma})
                  </option>
                ))}
            </select>
            <div className="rounded border border-[#7A1F2A]/20 bg-[#FFF8F8] p-3 text-xs text-[#54585B] leading-5">
              <span className="font-bold text-[#7A1F2A]">Regla del Tribunal:</span>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Se exige un número impar de miembros para evitar empates.</li>
                <li>Todos los jueces deben poseer un diploma de la FMK vigente.</li>
                <li>El árbitro de Shiai Kumite participa y consta en la acta del tribunal de Kumite.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
