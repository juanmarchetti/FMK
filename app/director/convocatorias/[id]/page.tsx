import { createClient, createAdminClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { changeEstadoConvocatoria, updateSedeConvocatoria } from "../actions";
import { TribunalAssignmentPanel } from "./TribunalAssignmentPanel";

export const dynamic = "force-dynamic";

export default async function ConvocatoriaDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  const { data: c, error } = await supabase
    .from("convocatorias")
    .select(`*, convocatorias_grados ( grado )`)
    .eq("id", params.id)
    .single();

  if (error || !c) {
    return notFound();
  }

  const grados = c.convocatorias_grados.map((g: any) => g.grado).join(", ");
  
  // Format dates
  const formatDate = (d: string) => {
    const dt = new Date(d);
    return `${dt.getUTCDate().toString().padStart(2, "0")}/${(dt.getUTCMonth() + 1).toString().padStart(2, "0")}/${dt.getUTCFullYear()}`;
  };

  const isBorrador = c.estado === "borrador";
  const isAbierta = c.estado === "abierta";
  
  // Contar solicitudes activas para esta convocatoria (excluye borradores).
  const adminClient = createAdminClient();
  const { count: solicitudesCount } = await adminClient
    .from("solicitudes")
    .select("id", { count: "exact", head: true })
    .eq("convocatoria_id", params.id)
    .in("estado", ["enviada", "en_revision", "validada", "programada", "finalizada"]);
  const hasSolicitudes = (solicitudesCount ?? 0) > 0;

  // Fetch available judges with user profiles
  const { data: dbJueces } = await supabase
    .from("jueces")
    .select(`
      id,
      diploma,
      fecha_obtencion_diploma,
      perfiles_usuario ( nombre_visible )
    `);

  const juecesDisponibles = (dbJueces || []).map((j: any) => ({
    id: j.id,
    nombre: j.perfiles_usuario?.nombre_visible || "Juez sin nombre",
    diploma: j.diploma || "",
    fechaDiploma: j.fecha_obtencion_diploma || "",
  }));

  // Fetch current tribunal assignment if it exists
  const { data: tribunal } = await supabase
    .from("tribunales")
    .select(`
      id,
      tribunal_jueces ( juez_id, rol )
    `)
    .eq("convocatoria_id", params.id)
    .maybeSingle();

  const juecesAsignadosIniciales = tribunal
    ? tribunal.tribunal_jueces.filter((tj: any) => tj.rol === "juez").map((tj: any) => tj.juez_id)
    : [];

  const arbitroAsignadoInicial = tribunal
    ? tribunal.tribunal_jueces.find((tj: any) => tj.rol === "arbitro_shiai_kumite")?.juez_id || null
    : null;

  return (
    <div className="mx-auto max-w-4xl">
      <nav className="mb-4 flex items-center gap-2 text-sm text-[#54585B]">
        <Link href="/director/convocatorias" className="hover:text-[#7A1F2A] hover:underline">Convocatorias</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="font-semibold text-[#191C1D]">Detalle</span>
      </nav>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
        <div>
          <span className="inline-flex items-center rounded border px-2 py-0.5 text-xs font-bold uppercase tracking-wide border-[#54585B]/30 bg-[#EEF0F1] text-[#54585B] mb-2">
            {c.estado}
          </span>
          <h1 className="text-2xl font-bold text-[#191C1D]" style={{ fontFamily: "Montserrat, sans-serif" }}>
            {c.nombre}
          </h1>
          <p className="text-sm text-[#54585B] mt-1">{grados}</p>
        </div>

        <div className="flex gap-2">
          {isBorrador && (
            <form action={async () => {
              "use server";
              await changeEstadoConvocatoria(c.id, "abierta");
            }}>
              <button type="submit" className="h-10 rounded bg-[#7A1F2A] px-4 text-sm font-bold text-white hover:bg-[#5B0616] transition">
                Publicar Convocatoria
              </button>
            </form>
          )}
          {isAbierta && (
            <>
              <form action={async () => {
                "use server";
                await changeEstadoConvocatoria(c.id, "inscripcion_cerrada");
              }}>
                <button type="submit" className="h-10 rounded border border-[#54585B]/30 bg-white px-4 text-sm font-bold text-[#54585B] hover:text-[#191C1D] transition">
                  Cerrar Inscripción
                </button>
              </form>
              <form action={async () => {
                "use server";
                await changeEstadoConvocatoria(c.id, "cancelada");
              }}>
                <button type="submit" className="h-10 rounded border border-[#BA1A1A]/30 bg-white px-4 text-sm font-bold text-[#BA1A1A] hover:bg-[#FFF1F2] transition">
                  Cancelar
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <section className="rounded-lg border border-[#54585B]/20 bg-white p-5 space-y-4">
          <h2 className="text-sm font-bold text-[#191C1D] border-b border-[#54585B]/10 pb-2">Información Logística</h2>
          
          <div>
            <p className="text-xs font-bold uppercase text-[#54585B]">Fecha del Examen</p>
            <p className="mt-1 text-sm text-[#191C1D]">{formatDate(c.fecha_examen)}</p>
          </div>
          
          <div>
            <p className="text-xs font-bold uppercase text-[#54585B]">Fecha Límite Inscripción</p>
            <p className="mt-1 text-sm text-[#191C1D]">{formatDate(c.fecha_limite_inscripcion)}</p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase text-[#54585B]">Cuota</p>
            <p className="mt-1 text-sm text-[#191C1D]">{c.cuota} €</p>
          </div>

          <form action={async (formData) => {
            "use server";
            await updateSedeConvocatoria(c.id, formData.get("sede") as string, hasSolicitudes);
          }} className="pt-2 border-t border-[#54585B]/10">
            <p className="text-xs font-bold uppercase text-[#54585B] mb-2">Sede (Modificable)</p>
            <div className="flex gap-2">
              <input 
                name="sede" 
                defaultValue={c.sede} 
                className="flex-1 h-9 rounded border border-[#54585B]/30 px-3 text-sm focus:border-[#7A1F2A] outline-none"
              />
              <button type="submit" className="h-9 px-3 rounded bg-[#54585B]/10 text-sm font-bold text-[#191C1D] hover:bg-[#54585B]/20">
                Guardar
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-lg border border-[#54585B]/20 bg-white p-5 space-y-4">
           <h2 className="text-sm font-bold text-[#191C1D] border-b border-[#54585B]/10 pb-2">Vías y Condiciones</h2>
           
           <div>
              <p className="text-xs font-bold uppercase text-[#54585B]">Vías Habilitadas</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {c.vias_habilitadas.map((via: string) => (
                  <span key={via} className="px-2 py-1 bg-[#F8F9FA] border border-[#54585B]/20 rounded text-xs font-bold text-[#191C1D] uppercase">
                    {via}
                  </span>
                ))}
              </div>
           </div>

           {c.condiciones_operativas && (
             <div>
                <p className="text-xs font-bold uppercase text-[#54585B]">Observaciones</p>
                <p className="mt-1 text-sm text-[#191C1D] whitespace-pre-wrap">{c.condiciones_operativas}</p>
             </div>
           )}
        </section>

        <TribunalAssignmentPanel
          convocatoriaId={c.id}
          juecesDisponibles={juecesDisponibles}
          juecesAsignadosIniciales={juecesAsignadosIniciales}
          arbitroAsignadoInicial={arbitroAsignadoInicial}
        />
      </div>
    </div>
  );
}
