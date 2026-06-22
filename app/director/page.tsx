import Link from "next/link";

type Metric = { label: string; value: string; detail: string; tone: string };
type Request = {
  name: string;
  current: string;
  target: string;
  club: string;
  status: string;
  statusClass: string;
  due: string;
  id: string;
};
type Call = { day: string; month: string; title: string; place: string };
type ChecklistItem = { label: string; value: string; done: boolean };

const metrics: Metric[] = [
  { label: "Solicitudes pendientes", value: "12", detail: "4 requieren revisión hoy", tone: "text-[#7A1F2A]" },
  { label: "Convocatorias activas", value: "3", detail: "Próximo cierre en 9 días", tone: "text-[#191C1D]" },
  { label: "Expedientes incompletos", value: "2", detail: "Falta aval o licencia vigente", tone: "text-[#BA1A1A]" },
  { label: "Aspirantes elegibles", value: "48", detail: "Detectados por reglas automáticas", tone: "text-[#2D6A4F]" },
];

const requests: Request[] = [
  { id: "1", name: "Antonio García Martínez", current: "1º Dan", target: "2º Dan", club: "Karate Madrid-Sur", status: "En revisión", statusClass: "border-[#7A1F2A]/30 bg-[#F8E9EB] text-[#7A1F2A]", due: "2 días" },
  { id: "2", name: "Elena Martínez Gómez", current: "Cinturón Marrón", target: "1º Dan", club: "Shotokan Alcalá", status: "Pendiente", statusClass: "border-[#54585B]/30 bg-[#EEF0F1] text-[#54585B]", due: "5 días" },
  { id: "3", name: "Javier Sanz López", current: "2º Dan", target: "3º Dan", club: "Karate Retiro", status: "Validada", statusClass: "border-[#2D6A4F]/30 bg-[#EAF5EF] text-[#2D6A4F]", due: "Programada" },
  { id: "4", name: "Lucía Navarro Pérez", current: "3º Dan", target: "4º Dan", club: "Budokan Madrid", status: "Incompleta", statusClass: "border-[#BA1A1A]/30 bg-[#FFF1F2] text-[#BA1A1A]", due: "Hoy" },
];

const calls: Call[] = [
  { day: "15", month: "OCT", title: "Examen 1º-4º Dan", place: "Polideportivo Magariños" },
  { day: "05", month: "NOV", title: "Alto grado (5º-7º Dan)", place: "Sede Federación" },
  { day: "22", month: "NOV", title: "Repesca técnica", place: "Centro de Tecnificación" },
];

const checklist: ChecklistItem[] = [
  { label: "Edad reglamentaria", value: "32 años — mínimo 18", done: true },
  { label: "Tiempo en grado", value: "2 años desde 1º Dan", done: true },
  { label: "Licencias federativas", value: "2024, 2025 y 2026", done: true },
  { label: "DNI y carnet de grados", value: "Documentos validados", done: true },
  { label: "Aval del club", value: "Pendiente de firma digital", done: false },
];

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

export default function AdminDashboard() {
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
          <button className="h-11 rounded border border-[#54585B]/35 bg-white px-4 text-sm font-bold text-[#54585B] transition hover:border-[#7A1F2A] hover:text-[#7A1F2A]" type="button">
            Descargar reporte
          </button>
          <Link
            href="/admin/convocatorias/nueva"
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
            <div className="flex gap-2">
              <select
                aria-label="Filtrar por grado"
                className="h-10 rounded border border-[#54585B]/30 bg-white px-3 text-sm font-semibold text-[#54585B]"
              >
                <option>Todos los grados</option>
                <option>1º Dan</option>
                <option>2º Dan</option>
                <option>3º Dan+</option>
              </select>
              <select
                aria-label="Filtrar por estado"
                className="h-10 rounded border border-[#54585B]/30 bg-white px-3 text-sm font-semibold text-[#54585B]"
              >
                <option>Cualquier estado</option>
                <option>Pendiente</option>
                <option>En revisión</option>
                <option>Validada</option>
              </select>
            </div>
          </div>

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
                  <th className="px-4 py-3 text-right">Plazo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#54585B]/10">
                {requests.map((r) => (
                  <tr key={r.id} className="hover:bg-[#F8F9FA]">
                    <td className="px-4 py-3">
                      <Link href={`/admin/solicitudes/${r.id}`} className="font-bold text-[#191C1D] hover:text-[#7A1F2A] hover:underline">
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
            {requests.map((r) => (
              <Link key={r.id} href={`/admin/solicitudes/${r.id}`} className="block p-4 hover:bg-[#F8F9FA]">
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
                    <p className="text-xs font-bold uppercase text-[#54585B]">Plazo</p>
                    <p className="font-semibold">{r.due}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="p-4 border-t border-[#54585B]/15">
            <Link href="/admin/solicitudes" className="text-sm font-bold text-[#7A1F2A] hover:underline flex items-center gap-1">
              Ver todas las solicitudes
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
        </section>

        {/* Right column */}
        <aside className="space-y-6">
          {/* Checklist documental */}
          <section className="rounded-lg border border-[#54585B]/20 bg-white p-4">
            <SectionTitle eyebrow="Expediente activo" title="Validación documental" />
            <div className="mt-4 rounded border border-[#7A1F2A]/25 bg-[#FFF8F8] p-3">
              <p className="text-sm font-bold text-[#7A1F2A]">Antonio García Martínez</p>
              <p className="mt-0.5 text-sm text-[#54585B]">Solicitud para 2º Dan · Karate Madrid-Sur</p>
            </div>
            <div className="mt-4 space-y-3">
              {checklist.map((item) => (
                <div key={item.label} className="flex items-start gap-3 border-b border-[#54585B]/10 pb-3 last:border-b-0 last:pb-0">
                  <span
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold ${
                      item.done
                        ? "border-[#2D6A4F] bg-[#EAF5EF] text-[#2D6A4F]"
                        : "border-[#7A1F2A] bg-white text-[#7A1F2A]"
                    }`}
                  >
                    {item.done ? "✓" : "!"}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-[#191C1D]">{item.label}</p>
                    <p className="text-sm text-[#54585B]">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/admin/solicitudes/1"
              className="mt-4 flex h-10 items-center justify-center rounded border border-[#7A1F2A] text-sm font-bold text-[#7A1F2A] hover:bg-[#F8E9EB] transition"
            >
              Ver expediente completo
            </Link>
          </section>

          {/* Próximas convocatorias */}
          <section className="rounded-lg border border-[#54585B]/20 bg-white p-4">
            <SectionTitle eyebrow="Próximas fechas" title="Convocatorias" />
            <div className="mt-4 space-y-3">
              {calls.map((call) => (
                <article key={`${call.month}-${call.day}`} className="flex gap-3 border-b border-[#54585B]/10 pb-3 last:border-b-0 last:pb-0">
                  <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded bg-[#F8E9EB] text-[#7A1F2A]">
                    <span className="text-[10px] font-bold">{call.month}</span>
                    <span className="text-xl font-bold">{call.day}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#191C1D]">{call.title}</h3>
                    <p className="mt-0.5 text-sm text-[#54585B]">{call.place}</p>
                  </div>
                </article>
              ))}
            </div>
            <Link href="/admin/convocatorias" className="mt-4 flex h-10 items-center justify-center rounded border border-[#54585B]/30 text-sm font-bold text-[#54585B] hover:bg-[#F3F4F5] transition">
              Ver todas las convocatorias
            </Link>
          </section>
        </aside>
      </div>

      {/* Elegibilidad preview */}
      <section className="mt-6 rounded-lg border border-[#54585B]/20 bg-white p-5">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,0.75fr)_minmax(280px,0.25fr)] lg:items-center">
          <div>
            <SectionTitle eyebrow="Vista estudiante" title="Elegibilidad hacia el siguiente grado" />
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#54585B]">
              El panel del practicante muestra por qué puede o no iniciar una solicitud: edad, tiempo de permanencia, licencias y temario aplicable según grado y estilo.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                ["Edad mínima", "Cumplida", "text-[#2D6A4F]"],
                ["Permanencia", "18/24 meses", "text-[#7A1F2A]"],
                ["Licencias", "3 verificadas", "text-[#2D6A4F]"],
              ].map(([label, value, color]) => (
                <div key={label} className="rounded border border-[#54585B]/15 bg-[#F8F9FA] p-3">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#54585B]">{label}</p>
                  <p className={`mt-2 text-lg font-bold ${color}`}>{value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-[#7A1F2A]/25 bg-[#F8E9EB] p-5 text-center">
            <p className="text-xs font-bold uppercase tracking-wide text-[#7A1F2A]">Objetivo</p>
            <p className="mt-2 text-4xl font-bold text-[#7A1F2A]">2º Dan</p>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-white">
              <div className="h-full w-3/4 rounded-full bg-[#7A1F2A]" />
            </div>
            <p className="mt-3 text-sm font-semibold text-[#54585B]">
              Elegibilidad estimada: 15 oct 2026
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
