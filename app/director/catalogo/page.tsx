"use client";

import { useState } from "react";

const estilos = [
  { id: "1", nombre: "Shotokan", fundador: "Gichin Funakoshi" },
  { id: "2", nombre: "Goju Ryu", fundador: "Chojun Miyagi" },
  { id: "3", nombre: "Shito Ryu", fundador: "Kenwa Mabuni" },
  { id: "4", nombre: "Wado Ryu", fundador: "Hironori Otsuka" },
  { id: "5", nombre: "Kyokushin Kai", fundador: "Masutatsu Oyama" },
  { id: "6", nombre: "Shoto Kai", fundador: "Shigeru Egami" },
  { id: "7", nombre: "Gensei Ryu", fundador: "Seiken Shukumine" },
  { id: "8", nombre: "Renbu Kai", fundador: "—" },
  { id: "9", nombre: "Uechi Ryu", fundador: "Kanbun Uechi" },
];

const katasPorEstilo: Record<string, { basicos: string[]; superiores: string[] }> = {
  Shotokan: {
    basicos: ["Taikyoku Shodan", "Heian Shodan", "Heian Nidan", "Heian Sandan", "Heian Yondan", "Heian Godan"],
    superiores: ["Tekki Shodan", "Bassai Dai", "Kanku Dai", "Jion", "Empi", "Hangetsu", "Tekki Nidan", "Bassai Sho", "Kanku Sho", "Sochin", "Nijushiho", "Gojushiho Dai", "Gojushiho Sho", "Unsu", "Meikyo"],
  },
  "Goju Ryu": {
    basicos: ["Gekisai Dai Ichi", "Gekisai Dai Ni", "Saifa"],
    superiores: ["Seiyunchin", "Shisochin", "Sanseiru", "Seipai", "Kururunfa", "Seisan", "Suparinpei", "Tensho", "Sanchin"],
  },
};

const temario = [
  { grado: "1º Dan", pregunta: "¿Cuáles son los principios del Dojo Kun?", respuesta: "Hitotsu, Jinkaku kansei ni tsutomuru koto (Buscar la perfección del carácter). Hitotsu, Makoto no michi o mamoru koto (Ser fiel). Hitotsu, Doryoku no seishin o yashinau koto (Esforzarse). Hitotsu, Reigi o omonzuru koto (Respetar a los demás). Hitotsu, Kekki no yuu o imashimuru koto (Reprimir la violencia)." },
  { grado: "1º Dan", pregunta: "¿Qué significa Karate-Do?", respuesta: "El camino de la mano vacía (kara = vacío, te = mano, do = camino)." },
  { grado: "1º Dan", pregunta: "¿Cuáles son las posiciones (dachi) fundamentales?", respuesta: "Zenkutsu dachi, Kokutsu dachi, Kiba dachi, Neko ashi dachi, Sanchin dachi, Fudo dachi, Shiko dachi." },
  { grado: "2º Dan", pregunta: "¿Qué diferencias existen entre Kumite, Bunkai y Oyo Waza?", respuesta: "Kumite es combate libre o reglado. Bunkai es la aplicación práctica de las técnicas de un kata. Oyo Waza son aplicaciones técnicas más libres derivadas de las situaciones de un kata." },
  { grado: "2º Dan", pregunta: "¿Cuántos katas básicos y superiores se exigen para 2º Dan?", respuesta: "5 katas básicos y 5 superiores, siendo uno de los superiores presentado como kata voluntario." },
];

export default function CatalogoPage() {
  const [tab, setTab] = useState<"estilos" | "katas" | "temario">("estilos");
  const [estiloSel, setEstiloSel] = useState("Shotokan");

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="border-b border-[#54585B]/20 pb-6 mb-6">
        <p className="text-xs font-bold uppercase tracking-wide text-[#7A1F2A]">Base de conocimiento</p>
        <h1 className="mt-2 text-3xl font-bold text-[#191C1D]" style={{ fontFamily: "Montserrat, sans-serif" }}>
          Catálogo de estilos, katas y temarios
        </h1>
        <p className="mt-1 text-sm text-[#54585B]">
          9 estilos reconocidos · Katas parametrizados por grado · Temario en formato Q&A
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-[#54585B]/20">
        {(["estilos", "katas", "temario"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-bold border-b-2 transition ${
              tab === t
                ? "border-[#7A1F2A] text-[#7A1F2A]"
                : "border-transparent text-[#54585B] hover:text-[#191C1D]"
            }`}
          >
            {t === "estilos" ? "Estilos" : t === "katas" ? "Katas" : "Temario"}
          </button>
        ))}
      </div>

      {/* Estilos */}
      {tab === "estilos" && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {estilos.map((e) => (
            <article key={e.id} className="rounded-lg border border-[#54585B]/20 bg-white p-4 hover:border-[#7A1F2A]/30 transition">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded bg-[#F8E9EB] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#7A1F2A] text-xl">sports_martial_arts</span>
                </div>
                <div>
                  <h3 className="font-bold text-[#191C1D]">{e.nombre}</h3>
                  <p className="text-xs text-[#54585B]">Fundador: {e.fundador}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Katas */}
      {tab === "katas" && (
        <div>
          <div className="mb-4">
            <select
              value={estiloSel}
              onChange={(e) => setEstiloSel(e.target.value)}
              className="h-10 rounded border border-[#54585B]/30 bg-white px-3 text-sm font-semibold text-[#191C1D]"
            >
              {Object.keys(katasPorEstilo).map((e) => (
                <option key={e}>{e}</option>
              ))}
            </select>
          </div>
          {katasPorEstilo[estiloSel] && (
            <div className="grid gap-6 lg:grid-cols-2">
              <section className="rounded-lg border border-[#54585B]/20 bg-white p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-[#54585B] mb-3">
                  Katas básicos ({katasPorEstilo[estiloSel].basicos.length})
                </p>
                <div className="space-y-2">
                  {katasPorEstilo[estiloSel].basicos.map((k, i) => (
                    <div key={k} className="flex items-center gap-3 rounded border border-[#54585B]/10 px-3 py-2">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#EAF5EF] text-[11px] font-bold text-[#2D6A4F]">
                        {i + 1}
                      </span>
                      <p className="text-sm font-semibold text-[#191C1D]">{k}</p>
                    </div>
                  ))}
                </div>
              </section>
              <section className="rounded-lg border border-[#54585B]/20 bg-white p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-[#54585B] mb-3">
                  Katas superiores ({katasPorEstilo[estiloSel].superiores.length})
                </p>
                <div className="space-y-2">
                  {katasPorEstilo[estiloSel].superiores.map((k, i) => (
                    <div key={k} className="flex items-center gap-3 rounded border border-[#54585B]/10 px-3 py-2">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F8E9EB] text-[11px] font-bold text-[#7A1F2A]">
                        {i + 1}
                      </span>
                      <p className="text-sm font-semibold text-[#191C1D]">{k}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      )}

      {/* Temario */}
      {tab === "temario" && (
        <div className="space-y-3">
          {temario.map((t, i) => (
            <details key={i} className="group rounded-lg border border-[#54585B]/20 bg-white overflow-hidden">
              <summary className="flex items-center gap-3 p-4 cursor-pointer hover:bg-[#F8F9FA] transition list-none">
                <span className="inline-flex min-h-6 items-center rounded border border-[#7A1F2A]/30 bg-[#F8E9EB] px-2 text-[11px] font-bold uppercase text-[#7A1F2A]">
                  {t.grado}
                </span>
                <p className="text-sm font-bold text-[#191C1D] flex-1">{t.pregunta}</p>
                <span className="material-symbols-outlined text-[#54585B] text-[20px] shrink-0 group-open:rotate-180 transition-transform">
                  expand_more
                </span>
              </summary>
              <div className="border-t border-[#54585B]/10 px-4 py-3 bg-[#F8F9FA]">
                <p className="text-sm text-[#191C1D] leading-6">{t.respuesta}</p>
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
