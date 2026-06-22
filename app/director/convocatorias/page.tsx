import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function ConvocatoriasPage() {
  const supabase = await createClient();

  const { data: convocatorias, error } = await supabase
    .from("convocatorias")
    .select(`
      id,
      nombre,
      fecha_examen,
      sede,
      fecha_limite_inscripcion,
      cuota,
      estado,
      convocatorias_grados (
        grado
      )
    `)
    .order("fecha_examen", { ascending: false });

  if (error) {
    console.error("Error fetching convocatorias:", error);
  }

  const items = (convocatorias || []).map((c: any) => {
    const gradosArr = c.convocatorias_grados.map((g: any) => g.grado);
    const gradosLabel = gradosArr.length > 0 ? gradosArr.join(", ") : "Sin grados";

    let statusClass = "border-[#54585B]/30 bg-[#EEF0F1] text-[#54585B]";
    if (c.estado === "abierta") statusClass = "border-[#2D6A4F]/30 bg-[#EAF5EF] text-[#2D6A4F]";
    if (c.estado === "borrador") statusClass = "border-[#54585B]/30 bg-[#EEF0F1] text-[#54585B]";

    // Format dates manually to avoid hydration issues and ensure DD/MM/YYYY
    const fe = new Date(c.fecha_examen);
    const fl = new Date(c.fecha_limite_inscripcion);
    const formatDate = (d: Date) => `${d.getUTCDate().toString().padStart(2, "0")}/${(d.getUTCMonth() + 1).toString().padStart(2, "0")}/${d.getUTCFullYear()}`;

    return {
      id: c.id,
      grados: gradosLabel,
      fecha: formatDate(fe),
      month: fe.getUTCMonth(),
      year: fe.getUTCFullYear(),
      sede: c.sede,
      fechaLimite: formatDate(fl),
      cuota: `${c.cuota} €`,
      solicitudes: 0, // Por ahora 0, en fase posterior lo enlazaremos
      estado: c.estado.charAt(0).toUpperCase() + c.estado.slice(1),
      statusClass,
    };
  });

  const abiertas = items.filter(i => i.estado === "Abierta").length;
  const borradores = items.filter(i => i.estado === "Borrador").length;

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-[#54585B]/20 pb-6 mb-6 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[#7A1F2A]">Calendario de exámenes</p>
          <h1 className="mt-2 text-3xl font-bold text-[#191C1D]" style={{ fontFamily: "Montserrat, sans-serif" }}>
            Convocatorias
          </h1>
          <p className="mt-1 text-sm text-[#54585B]">
            {abiertas} convocatorias abiertas · {borradores} borradores
          </p>
        </div>
        <Link
          href="/director/convocatorias/nueva"
          className="h-11 rounded bg-[#7A1F2A] px-4 text-sm font-bold text-white hover:bg-[#5B0616] transition flex items-center justify-center gap-2 shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Nueva convocatoria
        </Link>
      </div>

      {/* Cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((c) => {
          const monthNames = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
          return (
            <Link href={`/director/convocatorias/${c.id}`} key={c.id}>
              <article className="rounded-lg border border-[#54585B]/20 bg-white overflow-hidden hover:border-[#7A1F2A]/30 transition h-full">
              <div className="flex items-center justify-between gap-3 border-b border-[#54585B]/10 px-4 py-3 bg-[#F8F9FA]">
                <span className={`inline-flex min-h-6 items-center rounded border px-2 text-[11px] font-bold uppercase tracking-wide ${c.statusClass}`}>
                  {c.estado}
                </span>
                <p className="text-xs text-[#54585B]">{c.solicitudes} solicitudes</p>
              </div>

              <div className="p-4">
                <div className="flex gap-3 mb-3">
                  <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded bg-[#F8E9EB] text-[#7A1F2A]">
                    <span className="text-[10px] font-bold">{monthNames[c.month]}</span>
                    <span className="text-xl font-bold">{c.fecha.split("/")[0]}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#191C1D] text-sm" style={{ fontFamily: "Montserrat, sans-serif" }}>
                      {c.grados.length > 35 ? c.grados.substring(0, 35) + "..." : c.grados}
                    </h3>
                    <p className="text-sm text-[#54585B] mt-0.5">{c.sede}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded border border-[#54585B]/10 bg-[#F8F9FA] p-2">
                    <p className="font-bold uppercase text-[#54585B]">Fecha examen</p>
                    <p className="font-semibold text-[#191C1D] mt-0.5">{c.fecha}</p>
                  </div>
                  <div className="rounded border border-[#54585B]/10 bg-[#F8F9FA] p-2">
                    <p className="font-bold uppercase text-[#54585B]">Cierre inscripción</p>
                    <p className="font-semibold text-[#191C1D] mt-0.5">{c.fechaLimite}</p>
                  </div>
                  <div className="rounded border border-[#54585B]/10 bg-[#F8F9FA] p-2">
                    <p className="font-bold uppercase text-[#54585B]">Cuota</p>
                    <p className="font-semibold text-[#191C1D] mt-0.5">{c.cuota}</p>
                  </div>
                  <div className="rounded border border-[#54585B]/10 bg-[#F8F9FA] p-2">
                    <p className="font-bold uppercase text-[#54585B]">Solicitudes</p>
                    <p className="font-semibold text-[#191C1D] mt-0.5">{c.solicitudes}</p>
                  </div>
                </div>
              </div>
            </article>
            </Link>
          );
        })}

        {items.length === 0 && (
          <div className="col-span-full py-12 text-center text-[#54585B]">
            <span className="material-symbols-outlined text-[48px] opacity-20 mb-3">event_busy</span>
            <p>No hay convocatorias registradas.</p>
          </div>
        )}
      </div>
    </div>
  );
}
