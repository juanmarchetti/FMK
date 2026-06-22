import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { DocumentReviewPanel } from "./DocumentReviewPanel";
import { SpecialActionPanel } from "./SpecialActionPanel";

export const dynamic = "force-dynamic";

export default async function DetalleSolicitudPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch solicitud with related data
  const { data: solicitud, error } = await supabase
    .from("solicitudes")
    .select(`
      *,
      practicantes (
        id,
        nombre,
        apellidos,
        dni,
        fecha_nacimiento,
        grado_actual,
        fecha_obtencion_grado,
        estilo,
        clubes ( nombre )
      ),
      convocatorias (
        id,
        nombre,
        fecha_examen,
        fecha_limite_inscripcion,
        sede
      )
    `)
    .eq("id", id)
    .single();

  if (error || !solicitud) {
    return notFound();
  }

  // Fetch documents for this solicitud
  const { data: documentos } = await supabase
    .from("documentos")
    .select("*")
    .eq("solicitud_id", id)
    .order("created_at", { ascending: true });

  // Fetch reglas normativas for the grado solicitado (for auto-validation display)
  const { data: regla } = await supabase
    .from("reglas_normativas")
    .select("*")
    .eq("grado", solicitud.grado_solicitado)
    .single();

  // Fetch parametro de días (35 by default)
  const { data: configDias } = await supabase
    .from("parametros_sistema")
    .select("valor")
    .eq("clave", "dias_cierre_inscripcion")
    .single();

  const diasAntelacion = configDias?.valor ? parseInt(configDias.valor) : 35;

  const pract = solicitud.practicantes as any;
  const conv = solicitud.convocatorias as any;
  const docs = documentos ?? [];

  // Calculate age
  const edad = pract?.fecha_nacimiento
    ? Math.floor(
        (Date.now() - new Date(pract.fecha_nacimiento).getTime()) /
          (365.25 * 24 * 60 * 60 * 1000)
      )
    : null;

  // Calculate permanencia
  const permanenciaMeses = pract?.fecha_obtencion_grado
    ? Math.floor(
        (Date.now() - new Date(pract.fecha_obtencion_grado).getTime()) /
          (30.44 * 24 * 60 * 60 * 1000)
      )
    : null;

  // DIR-11: Check 35-day deadline alert
  let alertaPlazo = false;
  let diasDiferencia = 0;
  if (conv?.fecha_examen && solicitud.created_at) {
    const fechaExamen = new Date(conv.fecha_examen);
    const fechaSolicitud = new Date(solicitud.created_at);
    diasDiferencia = Math.floor(
      (fechaExamen.getTime() - fechaSolicitud.getTime()) / (24 * 60 * 60 * 1000)
    );
    alertaPlazo = diasDiferencia < diasAntelacion;
  }

  // Auto-validation checks
  const validacionAuto = [];
  if (regla) {
    validacionAuto.push({
      label: "Edad mínima",
      requerido: `${regla.edad_minima} años`,
      actual: edad !== null ? `${edad} años` : "Sin datos",
      cumple: edad !== null && edad >= regla.edad_minima,
    });
    validacionAuto.push({
      label: "Permanencia en grado",
      requerido: `${regla.permanencia_minima_meses} meses`,
      actual: permanenciaMeses !== null ? `${permanenciaMeses} meses` : "Sin datos",
      cumple: permanenciaMeses !== null && permanenciaMeses >= regla.permanencia_minima_meses,
    });
  }

  // Counts
  const totalDocs = docs.length;
  const validados = docs.filter((d: any) => d.estado_validacion === "validado").length;
  const rechazados = docs.filter((d: any) => d.estado_validacion === "rechazado").length;
  const pendientes = totalDocs - validados - rechazados;
  const progressPct = totalDocs > 0 ? Math.round((validados / totalDocs) * 100) : 0;

  const formatDate = (d: string) => {
    const dt = new Date(d);
    return dt.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  const nombreCompleto = pract ? `${pract.nombre} ${pract.apellidos}` : "—";
  const initials = pract
    ? `${(pract.nombre?.[0] ?? "").toUpperCase()}${(pract.apellidos?.[0] ?? "").toUpperCase()}`
    : "??";

  return (
    <div className="mx-auto max-w-7xl">
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-2 text-sm text-[#54585B]">
        <Link href="/director/solicitudes" className="hover:text-[#7A1F2A] hover:underline">
          Solicitudes
        </Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="font-semibold text-[#191C1D]">{nombreCompleto}</span>
      </nav>

      {/* DIR-11: Alert if deadline not met */}
      {alertaPlazo && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-[#BA1A1A]/30 bg-[#FFF1F2] p-4">
          <span className="material-symbols-outlined text-[22px] text-[#BA1A1A] mt-0.5 shrink-0">warning</span>
          <div>
            <p className="text-sm font-bold text-[#BA1A1A]">
              ⚠ Incumplimiento del plazo de antelación
            </p>
            <p className="mt-1 text-sm text-[#54585B]">
              La documentación fue presentada con <strong>{diasDiferencia} días</strong> de antelación
              al examen. El mínimo requerido es de <strong>{diasAntelacion} días</strong>.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-[#54585B]/20 pb-6 mb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-[#7A1F2A] flex items-center justify-center text-white font-bold text-lg shrink-0">
              {initials}
            </div>
            <div>
              <h1
                className="text-2xl font-bold text-[#191C1D]"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {nombreCompleto}
              </h1>
              <p className="text-sm text-[#54585B]">
                {pract?.clubes?.nombre ?? "—"} · {pract?.estilo ?? "—"} · DNI: {pract?.dni ?? "—"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.65fr)]">
        {/* Left column */}
        <div className="space-y-6">
          {/* Info card */}
          <section className="rounded-lg border border-[#54585B]/20 bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-[#54585B] mb-3">
              Datos de la solicitud
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ["Grado actual", pract?.grado_actual ?? "—"],
                ["Grado solicitado", solicitud.grado_solicitado],
                ["Vía elegida", solicitud.via_elegida ?? "No seleccionada"],
                ["Fecha nacimiento", pract?.fecha_nacimiento ? formatDate(pract.fecha_nacimiento) : "—"],
                ["Edad", edad !== null ? `${edad} años` : "—"],
                ["Fecha grado actual", pract?.fecha_obtencion_grado ? formatDate(pract.fecha_obtencion_grado) : "—"],
              ].map(([label, value]) => (
                <div key={label} className="rounded border border-[#54585B]/15 bg-[#F8F9FA] p-3">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#54585B]">{label}</p>
                  <p className="mt-1 text-sm font-semibold text-[#191C1D]">{value}</p>
                </div>
              ))}
            </div>
            {conv && (
              <div className="mt-3 rounded border border-[#7A1F2A]/20 bg-[#F8E9EB] px-3 py-2">
                <p className="text-xs text-[#54585B]">
                  <span className="font-bold text-[#7A1F2A]">Convocatoria:</span>{" "}
                  {conv.nombre} · {conv.sede} · {formatDate(conv.fecha_examen)}
                </p>
              </div>
            )}
          </section>

          {/* Validación automática */}
          {validacionAuto.length > 0 && (
            <section className="rounded-lg border border-[#54585B]/20 bg-white p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-[#54585B] mb-4">
                Validación automática de requisitos
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {validacionAuto.map((v) => (
                  <div
                    key={v.label}
                    className={`rounded border p-3 ${
                      v.cumple
                        ? "border-[#2D6A4F]/20 bg-[#EAF5EF]"
                        : "border-[#BA1A1A]/20 bg-[#FFF1F2]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`material-symbols-outlined text-[18px] ${
                          v.cumple ? "text-[#2D6A4F]" : "text-[#BA1A1A]"
                        }`}
                      >
                        {v.cumple ? "check_circle" : "error"}
                      </span>
                      <p className="text-xs font-bold uppercase text-[#54585B]">{v.label}</p>
                    </div>
                    <p className={`mt-1 text-sm font-semibold ${v.cumple ? "text-[#2D6A4F]" : "text-[#BA1A1A]"}`}>
                      {v.actual}
                    </p>
                    <p className="text-xs text-[#54585B]">Mínimo: {v.requerido}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* DIR-08/09/10/12/13: Document Review Panel (Client Component) */}
          <DocumentReviewPanel
            solicitudId={id}
            solicitudEstado={solicitud.estado}
            documentos={docs}
            gradoSolicitado={solicitud.grado_solicitado}
          />
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Estado */}
          <section className="rounded-lg border border-[#7A1F2A]/25 bg-[#F8E9EB] p-5 text-center">
            <p className="text-xs font-bold uppercase tracking-wide text-[#7A1F2A]">Estado actual</p>
            <span className="mt-2 inline-flex items-center rounded border border-[#7A1F2A]/30 bg-white px-3 py-1.5 text-sm font-bold uppercase text-[#7A1F2A]">
              {solicitud.estado.replace(/_/g, " ")}
            </span>
            <p className="mt-3 text-sm text-[#54585B]">
              {validados} de {totalDocs} documentos validados
              {rechazados > 0 && ` · ${rechazados} rechazados`}
              {pendientes > 0 && ` · ${pendientes} pendientes`}
            </p>
            <div className="mt-3 h-2 rounded-full bg-white overflow-hidden">
              <div
                className="h-full rounded-full bg-[#7A1F2A] transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </section>

          {/* Situación especial */}
          {solicitud.situacion_especial && (
            <section className="rounded-lg border border-[#54585B]/20 bg-white p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-[#54585B] mb-2">
                Situación especial declarada
              </p>
              <p className="text-sm text-[#191C1D]">{solicitud.situacion_especial}</p>
            </section>
          )}

          {/* Información de pago */}
          <section className="rounded-lg border border-[#54585B]/20 bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-[#54585B] mb-3">
              Estado de pago
            </p>
            <div className="flex items-center gap-2">
              <span
                className={`material-symbols-outlined text-[18px] ${
                  solicitud.estado_pago === "pagado" || solicitud.estado_pago === "exento"
                    ? "text-[#2D6A4F]"
                    : "text-[#BA1A1A]"
                }`}
              >
                {solicitud.estado_pago === "pagado" || solicitud.estado_pago === "exento"
                  ? "check_circle"
                  : "pending"}
              </span>
              <p className="text-sm font-semibold text-[#191C1D] capitalize">
                {solicitud.estado_pago}
              </p>
            </div>
            {solicitud.importe_final && (
              <p className="mt-2 text-xs text-[#54585B]">
                Importe: <strong>{solicitud.importe_final} €</strong>
              </p>
            )}
          </section>

          {/* Special action panel for Director */}
          <SpecialActionPanel
            solicitudId={id}
            solicitudEstado={solicitud.estado}
            estadoPago={solicitud.estado_pago}
            importeFinal={solicitud.importe_final ? Number(solicitud.importe_final) : null}
            situacionEspecial={solicitud.situacion_especial}
          />
        </div>
      </div>
    </div>
  );
}
