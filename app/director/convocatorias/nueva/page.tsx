"use client";

import { useState, useTransition, useEffect } from "react";
import { getCatalogo, getTemario } from "@/app/aspirante/actions";

type Tab = "estilos" | "katas" | "temario";

const GRADOS_TEMARIO = [
  "1º Dan", "2º Dan", "3º Dan", "4º Dan", "5º Dan",
  "6º Dan", "7º Dan", "8º Dan", "9º Dan", "10º Dan",
];

export default function CatalogoPage() {
  const [tab, setTab] = useState<Tab>("estilos");
  const [isPending, startTransition] = useTransition();

  // Estilos
  const [estilos, setEstilos] = useState<any[]>([]);
  const [estiloSeleccionado, setEstiloSeleccionado] = useState<string>("");
  const [katas, setKatas] = useState<any[]>([]);

  // Temario
  const [gradoTemario, setGradoTemario] = useState<string>("1º Dan");
  const [preguntas, setPreguntas] = useState<any[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  // Cargar estilos al montar
  useEffect(() => {
    startTransition(async () => {
      const data = await getCatalogo();
      setEstilos(data.estilos);
    });
  }, []);

  // Cargar katas cuando cambia el estilo
  useEffect(() => {
    if (!estiloSeleccionado) return;
    startTransition(async () => {
      const data = await getCatalogo(estiloSeleccionado);
      setKatas(data.katas);
    });
  }, [estiloSeleccionado]);

  // Cargar temario cuando cambia el grado
  useEffect(() => {
    if (tab !== "temario") return;
    startTransition(async () => {
      const data = await getTemario(gradoTemario);
      setPreguntas(data.preguntas);
    });
  }, [tab, gradoTemario]);

  const basicKatas = katas.filter((k: any) => k.nivel === "básico");
  const superiorKatas = katas.filter((k: any) => k.nivel === "superior");

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="border-b border-[#54585B]/20 pb-6 mb-6">
        <p className="text-xs font-bold uppercase tracking-wide text-[#7A1F2A]">Base de conocimiento</p>
        <h1 className="mt-2 text-3xl font-bold text-[#191C1D]" style={{ fontFamily: "Montserrat, sans-serif" }}>
          Catálogo de estilos, katas y temarios
        </h1>
        <p className="mt-1 text-sm text-[#54585B]">
          Estilos reconocidos · Katas parametrizados por grado · Temario en formato Q&A
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-[#54585B]/20">
        {(["estilos", "katas", "temario"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-bold border-b-2 transition -mb-px ${
              tab === t
                ? "border-[#7A1F2A] text-[#7A1F2A]"
                : "border-transparent text-[#54585B] hover:text-[#191C1D]"
            }`}
          >
            {t === "estilos" ? "Estilos" : t === "katas" ? "Katas" : "Temario"}
          </button>
        ))}
      </div>

      {/* ─── Estilos ─── */}
      {tab === "estilos" && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {isPending && estilos.length === 0 ? (
            <p className="col-span-3 text-sm text-[#54585B] flex items-center gap-2">
              <span className="material-symbols-outlined animate-spin text-[#7A1F2A]">progress_activity</span>
              Cargando estilos…
            </p>
          ) : estilos.length === 0 ? (
            <div className="col-span-3 rounded-lg border border-[#54585B]/20 bg-white p-8 text-center">
              <span className="material-symbols-outlined text-4xl text-[#54585B]/40 mb-3">menu_book</span>
              <p className="text-sm text-[#54585B]">No hay estilos registrados en el catálogo todavía.</p>
            </div>
          ) : (
            estilos.map((e: any) => (
              <article key={e.id} className="rounded-lg border border-[#54585B]/20 bg-white p-4 hover:border-[#7A1F2A]/30 transition">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded bg-[#F8E9EB] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#7A1F2A] text-xl">sports_martial_arts</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#191C1D]">{e.nombre}</h3>
                    {e.fundador && <p className="text-xs text-[#54585B]">Fundador: {e.fundador}</p>}
                  </div>
                </div>
                {e.caracteristicas && (
                  <p className="text-sm text-[#191C1D] mt-3 leading-relaxed">{e.caracteristicas}</p>
                )}
              </article>
            ))
          )}
        </div>
      )}

      {/* ─── Katas ─── */}
      {tab === "katas" && (
        <div className="space-y-6">
          <div>
            <label className="text-sm font-semibold text-[#191C1D] block mb-2">Seleccionar Estilo</label>
            <select
              value={estiloSeleccionado}
              onChange={(e) => setEstiloSeleccionado(e.target.value)}
              className="h-10 rounded border border-[#54585B]/30 bg-white px-3 text-sm font-semibold text-[#191C1D]"
            >
              <option value="">-- Elige un estilo --</option>
              {estilos.map((est: any) => (
                <option key={est.id} value={est.id}>{est.nombre}</option>
              ))}
            </select>
          </div>

          {estiloSeleccionado && (
            isPending ? (
              <p className="text-sm text-[#54585B] flex items-center gap-2">
                <span className="material-symbols-outlined animate-spin text-[#7A1F2A]">progress_activity</span>
                Cargando katas…
              </p>
            ) : katas.length === 0 ? (
              <p className="text-sm text-[#54585B]">No hay katas registrados para este estilo.</p>
            ) : (
              <div className="grid gap-6 lg:grid-cols-2">
                <section className="rounded-lg border border-[#54585B]/20 bg-white p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#54585B] mb-3">
                    Katas básicos ({basicKatas.length})
                  </p>
                  {basicKatas.length === 0 ? (
                    <p className="text-sm text-[#54585B]">—</p>
                  ) : (
                    <div className="space-y-2">
                      {basicKatas.map((k: any, i: number) => (
                        <div key={k.id} className="flex items-center gap-3 rounded border border-[#54585B]/10 px-3 py-2">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#EAF5EF] text-[11px] font-bold text-[#2D6A4F]">
                            {i + 1}
                          </span>
                          <p className="text-sm font-semibold text-[#191C1D]">{k.nombre}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
                <section className="rounded-lg border border-[#54585B]/20 bg-white p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#54585B] mb-3">
                    Katas superiores ({superiorKatas.length})
                  </p>
                  {superiorKatas.length === 0 ? (
                    <p className="text-sm text-[#54585B]">—</p>
                  ) : (
                    <div className="space-y-2">
                      {superiorKatas.map((k: any, i: number) => (
                        <div key={k.id} className="flex items-center gap-3 rounded border border-[#54585B]/10 px-3 py-2">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F8E9EB] text-[11px] font-bold text-[#7A1F2A]">
                            {i + 1}
                          </span>
                          <p className="text-sm font-semibold text-[#191C1D]">{k.nombre}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </div>
            )
          )}
        </div>
      )}

      {/* ─── Temario ─── */}
      {tab === "temario" && (
        <div className="space-y-6">
          <div>
            <label className="text-sm font-semibold text-[#191C1D] block mb-2">Seleccionar Grado</label>
            <select
              value={gradoTemario}
              onChange={(e) => setGradoTemario(e.target.value)}
              className="h-10 rounded border border-[#54585B]/30 bg-white px-3 text-sm font-semibold text-[#191C1D]"
            >
              {GRADOS_TEMARIO.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {isPending ? (
            <p className="text-sm text-[#54585B] flex items-center gap-2">
              <span className="material-symbols-outlined animate-spin text-[#7A1F2A]">progress_activity</span>
              Cargando temario…
            </p>
          ) : preguntas.length === 0 ? (
            <div className="rounded-lg border border-[#54585B]/20 bg-white p-8 text-center">
              <p className="text-sm text-[#54585B]">No hay preguntas registradas para este grado todavía.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {preguntas.map((p: any, i: number) => (
                <div key={p.id} className="rounded-lg border border-[#54585B]/20 bg-white overflow-hidden">
                  <button
                    onClick={() => setExpanded(expanded === p.id ? null : p.id)}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-[#F8F9FA] transition"
                  >
                    <span className="text-sm font-semibold text-[#191C1D]">
                      {i + 1}. {p.pregunta}
                    </span>
                    <span className="material-symbols-outlined text-[20px] text-[#54585B] shrink-0">
                      {expanded === p.id ? "expand_less" : "expand_more"}
                    </span>
                  </button>
                  {expanded === p.id && (
                    <div className="px-5 pb-4 border-t border-[#54585B]/10 bg-[#F8F9FA]">
                      <p className="text-sm text-[#191C1D] mt-3 leading-relaxed">{p.respuesta}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
