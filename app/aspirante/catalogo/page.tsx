"use client";

import { useState, useTransition, useEffect } from "react";
import { getCatalogo, getTemario } from "@/app/aspirante/actions";

const GRADOS = [
  "Cinturón Blanco", "Cinturón Amarillo", "Cinturón Naranja", "Cinturón Verde",
  "Cinturón Azul", "Cinturón Marrón", "Cinturón Negro", "1º Dan", "2º Dan",
  "3º Dan", "4º Dan", "5º Dan", "6º Dan", "7º Dan",
];

type Tab = "estilos" | "katas" | "temario";

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

  // Load estilos on mount
  useEffect(() => {
    startTransition(async () => {
      const data = await getCatalogo();
      setEstilos(data.estilos);
    });
  }, []);

  // Load katas when estilo changes
  useEffect(() => {
    if (!estiloSeleccionado) return;
    startTransition(async () => {
      const data = await getCatalogo(estiloSeleccionado);
      setKatas(data.katas);
    });
  }, [estiloSeleccionado]);

  // Load temario when grade changes
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
    <div className="mx-auto max-w-4xl">
      <div className="border-b border-[#54585B]/20 pb-6 mb-6">
        <p className="text-xs font-bold uppercase tracking-wide text-[#7A1F2A]">Recursos de Estudio</p>
        <h1 className="mt-2 text-3xl font-bold text-[#191C1D]" style={{ fontFamily: "Montserrat, sans-serif" }}>
          Catálogo FMK
        </h1>
        <p className="mt-1 text-sm text-[#54585B]">Estilos reconocidos, katas recomendados y temario por grado.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-[#54585B]/20">
        {(["estilos", "katas", "temario"] as Tab[]).map((t) => (
          <button
            key={t}
            id={`tab-${t}`}
            onClick={() => { setTab(t); }}
            className={`px-5 py-2.5 text-sm font-bold capitalize border-b-2 transition -mb-px ${
              tab === t ? "border-[#7A1F2A] text-[#7A1F2A]" : "border-transparent text-[#54585B] hover:text-[#191C1D]"
            }`}
          >
            {t === "estilos" ? "Estilos" : t === "katas" ? "Katas" : "Temario"}
          </button>
        ))}
      </div>

      {/* ─── Estilos (ASP-35) ─── */}
      {tab === "estilos" && (
        <div className="space-y-4">
          {isPending && estilos.length === 0 ? (
            <p className="text-sm text-[#54585B] flex items-center gap-2">
              <span className="material-symbols-outlined animate-spin text-[#7A1F2A]">progress_activity</span>
              Cargando estilos…
            </p>
          ) : estilos.length === 0 ? (
            <div className="rounded-lg border border-[#54585B]/20 bg-white p-8 text-center">
              <span className="material-symbols-outlined text-4xl text-[#54585B]/40 mb-3">menu_book</span>
              <p className="text-sm text-[#54585B]">No hay estilos registrados en el catálogo todavía.</p>
            </div>
          ) : (
            estilos.map((est: any) => (
              <div key={est.id} className="rounded-lg border border-[#54585B]/20 bg-white p-5">
                <h3 className="font-bold text-[#191C1D] text-lg" style={{ fontFamily: "Montserrat, sans-serif" }}>
                  {est.nombre}
                </h3>
                {est.fundador && (
                  <p className="text-sm text-[#54585B] mt-1">
                    <span className="font-semibold">Fundador:</span> {est.fundador}
                  </p>
                )}
                {est.caracteristicas && (
                  <p className="text-sm text-[#191C1D] mt-2 leading-relaxed">{est.caracteristicas}</p>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* ─── Katas (ASP-36) ─── */}
      {tab === "katas" && (
        <div className="space-y-6">
          <div>
            <label className="text-sm font-semibold text-[#191C1D] block mb-2">Seleccionar Estilo</label>
            <select
              id="select-estilo-kata"
              value={estiloSeleccionado}
              onChange={(e) => setEstiloSeleccionado(e.target.value)}
              className="w-full sm:w-72 rounded border border-[#54585B]/20 px-3 py-2 text-sm text-[#191C1D] focus:outline-none focus:ring-2 focus:ring-[#7A1F2A]/30"
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
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-lg border border-[#54585B]/20 bg-white p-5">
                  <h3 className="font-bold text-[#191C1D] text-sm uppercase tracking-wide mb-3">Katas Básicos</h3>
                  {basicKatas.length === 0 ? (
                    <p className="text-sm text-[#54585B]">—</p>
                  ) : (
                    <ul className="space-y-2">
                      {basicKatas.map((kata: any) => (
                        <li key={kata.id} className="flex items-center gap-2 text-sm text-[#191C1D]">
                          <span className="material-symbols-outlined text-[16px] text-[#2D6A4F]">sports_martial_arts</span>
                          {kata.nombre}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="rounded-lg border border-[#54585B]/20 bg-white p-5">
                  <h3 className="font-bold text-[#191C1D] text-sm uppercase tracking-wide mb-3">Katas Superiores</h3>
                  {superiorKatas.length === 0 ? (
                    <p className="text-sm text-[#54585B]">—</p>
                  ) : (
                    <ul className="space-y-2">
                      {superiorKatas.map((kata: any) => (
                        <li key={kata.id} className="flex items-center gap-2 text-sm text-[#191C1D]">
                          <span className="material-symbols-outlined text-[16px] text-[#7A1F2A]">star</span>
                          {kata.nombre}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )
          )}
        </div>
      )}

      {/* ─── Temario (ASP-37) ─── */}
      {tab === "temario" && (
        <div className="space-y-6">
          <div>
            <label className="text-sm font-semibold text-[#191C1D] block mb-2">Seleccionar Grado</label>
            <select
              id="select-grado-temario"
              value={gradoTemario}
              onChange={(e) => setGradoTemario(e.target.value)}
              className="w-full sm:w-72 rounded border border-[#54585B]/20 px-3 py-2 text-sm text-[#191C1D] focus:outline-none focus:ring-2 focus:ring-[#7A1F2A]/30"
            >
              {GRADOS.map((g) => (
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
              <p className="text-sm text-[#54585B]">No hay preguntas registradas en el temario para este grado todavía.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {preguntas.map((p: any, i: number) => (
                <div key={p.id} className="rounded-lg border border-[#54585B]/20 bg-white overflow-hidden">
                  <button
                    id={`pregunta-${i}`}
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
                    <div className="px-5 pb-4 border-t border-[#54585B]/10">
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
