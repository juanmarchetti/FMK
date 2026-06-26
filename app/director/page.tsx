import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export const dynamic = "force-dynamic";

function StatusPill({ children, className }: { children: React.ReactNode; className: string }) {
  return (
    <span className={`inline-flex min-h-7 items-center rounded border px-2.5 text-[11px] font-bold uppercase tracking-wide ${className}`}>
      {children}
    </span>
  );
}

function SectionTitle({ title, eyebrow }: { title: string; eyebrow?: string }) {
  return (
    <div>
      {eyebrow && (
        <p className="text-xs font-bold uppercase tracking-wide text-[#54585B]">{eyebrow}</p>
      )}
      <h2 className="mt-1 text-xl font-bold text-[#191C1D]" style={{ fontFamily: "Montserrat, sans-serif" }}>
        {title}
      </h2>
    </div>
  );
}

const ESTADO_MAP: Record<string, { label: string; className: string }> = {
  enviada: { label: "Enviada", className: "border-[#7A1F2A]/30 bg-[#F8E9EB] text-[#7A1F2A]" },
  en_revision: { label: "En revisión", className: "border-[#7A1F2A]/30 bg-[#F8E9EB] text-[#7A1F2A]" },
  documentacion_incompleta: { label: "Incompleta", className: "border-[#BA1A1A]/30 bg-[#FFF1F2] text-[#BA1A1A]" },
  validada: { label: "Validada", className: "border-[#2D6A4F]/30 bg-[#EAF5EF] text-[#2D6A4F]" },
  programada: { label: "Programada", className: "border-[#2D6A4F]/30 bg-[#EAF5EF] text-[#2D6A4F]" },
  rechazada: { label: "Rechazada", className: "border-[#BA1A1A]/30 bg-[#FFF1F2] text-[#BA1A1A]" },
  borrador: { label: "Borrador", className: "border-[#54585B]/30 bg-[#EEF0F1] text-[#54585B]" },
  finalizada: { label: "Finalizada", className: "border-[#54585B]/30 bg-[#EEF0F1] text-[#54585B]" },
};

export default async function DirectorDashboard() {
  const supabase = await createClient();

  // --- Fetch metrics ---
  const { count: solicitudesPendientes } = await supabase
    .from("solicitudes")
    .select("*", { count: "exact", head: true })
    .in("estado", ["enviada", "en_revision"]);

  const { count: convocatoriasActivas } = await supabase
    .from("convocatorias")
    .select("*", { count: "exact", head: true })
    .eq("estado", "abierta");

  const { count: expedientesIncompletos } = await supabase
    .from("solicitudes")
    .select("*", { count: "exact", head: true })
    .eq("estado", "documentacion_incompleta");

  const { count: totalAspirantes } = await supabase
    .from("perfiles_usuario")
    .select("*", { count: "exact", head: true })
    .eq("rol", "aspirante")
    .eq("estado", "activo");

  const metrics = [
    { label: "Solicitudes pendientes", value: String(solicitudesPendientes ?? 0), detail: "Enviadas o en revisión", tone: "text-[#7A1F2A]" },
    { label: "Convocatorias activas", value: String(convocatoriasActivas ?? 0), detail: "Abiertas para inscripción", tone: "text-[#191C1D]" },
    { label: "Expedientes incompletos", value: String(expedientesIncompletos ?? 0), detail: "Falta documentación", tone: "text-[#BA1A1A]" },
    { label: "Total aspirantes", value: String(totalAspirantes ?? 0), detail: "Cuentas activas en el sistema", tone: "text-[#2D6A4F]" },
  ];

  // --- Fetch recent solicitudes ---
  const { data: solicitudesRaw } = await supabase
    .from("solicitudes")
    .select(`
      id,
      grado_solicitado,
      estado,
      created_at,
      practicantes (
        nombre,
        apellidos,
        grado_actual,
        clubes ( nombre )
      )
    `)
    .neq("estado", "borrador")
    .order("created_at", { ascending: false })
    .limit(5);

  const solicitudes = (solicitudesRaw ?? []).map((s: any) => {
    const pract = s.practicantes;
    const est = ESTADO_MAP[s.estado] ?? ESTADO_MAP.borrador;
    const createdAt = new Date(s.created_at);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - createdAt.getTime()) / (24 * 60 * 60 * 1000));
    const due = diffDays === 0 ? "Hoy" : diffDays === 1 ? "Hace 1 día" : `Hace ${diffDays} días`;

    return {
      id: s.id,
      name: pract ? `${pract.nombre} ${pract.apellidos}` : "—",
      current: pract?.grado_actual ?? "—",
      target: s.grado_solicitado,
      club: pract?.clubes?.nombre ?? "—",
      status: est.label,
      statusClass: est.className,
      due,
    };
  });

  // --- Fetch upcoming convocatorias ---
  const today = new Date().toISOString().split("T")[0];
  const { data: convocatoriasRaw } = await supabase
    .from("convocatorias")
    .select("id, nombre, fecha_examen, sede")
    .gte("fecha_examen", today)
    .order("fecha_examen", { ascending: true })
    .limit(5);

  const convocatorias = (convocatoriasRaw ?? []).map((c: any) => {
    const fecha = new Date(c.fecha_examen);
    const day = String(fecha.getDate()).padStart(2, "0");
    const month = fecha.toLocaleDateString("es-ES", { month: "short" }).toUpperCase().replace(".", "");
    return { id: c.id, day, month, title: c.nombre, place: c.sede };
  });

  return (
    <div className="mx-auto max-w-7xl">
      {/* Page header */}
      <div className="flex flex-col gap-4 border-b border-[#54585B]/20 pb-6 xl:flex-row xl:items-end xl:justify-between mb-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[#7A1F2A]">
            Departamento de Grados
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[#191C1D]" style={{ fontFamily: "Montserrat, sans-serif" }}>
            Panel de control
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-[#54585B]">
            Resumen operativo, solicitudes pendientes y próximas convocatorias.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            href="/director/convocatorias/nueva"
            className="h-11 rounded bg-[#7A1F2A] px-4 text-sm font-bold text-white transition hover:bg-[#5B0616] flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Nueva convocatoria
          </Link>
        </div>
      </div>

      {/* Metrics */}
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 mb-6">
        {metrics.map((m) => (
          <article key={m.label} className="rounded-lg border border-[#54585B]/20 bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-[#54585B]">{m.label}</p>
            <p className={`mt-3 text-4xl font-bold ${m.tone}`}>{m.value}</p>
            <p className="mt-2 text-sm text-[#54585B]">{m.detail}</p>
          </article>
        ))}
      </section>

      {/* Main grid */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)]">
        {/* Solicitudes recientes */}
        <section className="rounded-lg border border-[#54585B]/20 bg-white">
          <div className="flex flex-col gap-4 border-b border-[#54585B]/15 p-4 sm:flex-row sm:items-center sm:justify-between">
            <SectionTitle eyebrow="Bandeja administrativa" title="Solicitudes recientes" />
          </div>

          {solicitudes.length === 0 ? (
            <div className="p-6 text-center text-sm text-[#54585B]">
              <span className="material-symbols-outlined text-4xl text-[#54585B]/40 mb-2 block">inbox</span>
              No hay solicitudes registradas todavía.
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#F3F4F5] text-xs uppercase tracking-wide text-[#54585B]">
                    <tr>
                      <th className="px-4 py-3">Aspirante</th>
                      <th className="px-4 py-3">Grado actual</th>
                      <th className="px-4 py-3">Solicita</th>
                      <th className="px-4 py-3">Club</th>
                      <th className="px-4 py-3">Estado</th>
                      <th className="px-4 py-3 text-right">Recibida</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#54585B]/10">
                    {solicitudes.map((r) => (
                      <tr key={r.id} className="hover:bg-[#F8F9FA]">
                        <td className="px-4 py-3">
                          <Link href={`/director/solicitudes/${r.id}`} className="font-bold text-[#191C1D] hover:text-[#7A1F2A] hover:underline">
                            {r.name}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-[#54585B]">{r.current}</td>
                        <td className="px-4 py-3 font-semibold">{r.target}</td>
                        <td className="px-4 py-3 text-[#54585B]">{r.club}</td>
                        <td className="px-4 py-3">
                          <StatusPill className={r.statusClass}>{r.status}</StatusPill>
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-sm">{r.due}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="divide-y divide-[#54585B]/10 md:hidden">
                {solicitudes.map((r) => (
                  <Link key={r.id} href={`/director/solicitudes/${r.id}`} className="block p-4 hover:bg-[#F8F9FA]">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-bold text-[#191C1D]">{r.name}</p>
                        <p className="mt-0.5 text-sm text-[#54585B]">{r.club}</p>
                      </div>
                      <StatusPill className={r.statusClass}>{r.status}</StatusPill>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <p className="text-xs font-bold uppercase text-[#54585B]">Actual</p>
                        <p className="font-semibold">{r.current}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase text-[#54585B]">Solicita</p>
                        <p className="font-semibold">{r.target}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase text-[#54585B]">Recibida</p>
                        <p className="font-semibold">{r.due}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}

          <div className="p-4 border-t border-[#54585B]/15">
            <Link href="/director/solicitudes" className="text-sm font-bold text-[#7A1F2A] hover:underline flex items-center gap-1">
              Ver todas las solicitudes
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
        </section>

        {/* Right column — Próximas convocatorias */}
        <aside className="space-y-6">
          <section className="rounded-lg border border-[#54585B]/20 bg-white p-4">
            <SectionTitle eyebrow="Próximas fechas" title="Convocatorias" />
            <div className="mt-4 space-y-3">
              {convocatorias.length === 0 ? (
                <p className="text-sm text-[#54585B]">No hay convocatorias próximas programadas.</p>
              ) : (
                convocatorias.map((call) => (
                  <article key={call.id} className="flex gap-3 border-b border-[#54585B]/10 pb-3 last:border-b-0 last:pb-0">
                    <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded bg-[#F8E9EB] text-[#7A1F2A]">
                      <span className="text-[10px] font-bold">{call.month}</span>
                      <span className="text-xl font-bold">{call.day}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-[#191C1D]">{call.title}</h3>
                      <p className="mt-0.5 text-sm text-[#54585B]">{call.place}</p>
                    </div>
                  </article>
                ))
              )}
            </div>
            <Link href="/director/convocatorias" className="mt-4 flex h-10 items-center justify-center rounded border border-[#54585B]/30 text-sm font-bold text-[#54585B] hover:bg-[#F3F4F5] transition">
              Ver todas las convocatorias
            </Link>
          </section>
        </aside>
      </div>
    </div>
  );
}
