"use server";

import { revalidatePath } from "next/cache";
import { logAudit } from "@/app/admin/auditoria/actions";
import { createAdminClient } from "@/lib/supabase/server";

export async function createConvocatoria(data: {
  grados: string[];
  fechaExamen: string;
  sede: string;
  fechaLimite: string;
  cuota: number;
  vias: { kumite: boolean; campeonatos: boolean; tecnica: boolean };
  observaciones: string;
  estado: "borrador" | "abierta";
}) {
  const supabase = await createClient();
  const { data: userData, error: authError } = await supabase.auth.getUser();

  if (authError || !userData?.user) {
    throw new Error("No autenticado");
  }

  // Verificar rol
  const { data: profile } = await supabase
    .from("perfiles_usuario")
    .select("rol")
    .eq("user_id", userData.user.id)
    .single();

  if (!profile || profile.rol !== "director_fmk") {
    throw new Error("No tienes permisos para realizar esta acción");
  }

  // Preparar array de vías
  const viasHabilitadas = [];
  if (data.vias.kumite) viasHabilitadas.push("kumite");
  if (data.vias.campeonatos) viasHabilitadas.push("campeonatos");
  if (data.vias.tecnica) viasHabilitadas.push("tecnica");

  // Crear nombre genérico basado en grados y fecha
  const nombre = `Convocatoria ${data.fechaExamen.split("-")[0]} - ${data.grados.length} Grados`;

  // Insertar en convocatorias
  const { data: convData, error: convError } = await supabase
    .from("convocatorias")
    .insert({
      nombre,
      fecha_examen: data.fechaExamen,
      sede: data.sede,
      fecha_limite_inscripcion: data.fechaLimite,
      cuota: data.cuota,
      vias_habilitadas: viasHabilitadas,
      estado: data.estado,
      condiciones_operativas: data.observaciones || null,
    })
    .select("id")
    .single();

  if (convError) {
    console.error("Error creating convocatoria:", convError);
    throw new Error("Error al crear la convocatoria");
  }

  // Insertar grados
  const gradosInsert = data.grados.map((g) => ({
    convocatoria_id: convData.id,
    grado: g,
  }));

  const { error: gradosError } = await supabase
    .from("convocatorias_grados")
    .insert(gradosInsert);

  if (gradosError) {
    console.error("Error inserting grados:", gradosError);
    // Podríamos hacer rollback aquí o dejarlo, asumimos que no falla si los grados son válidos
    throw new Error("Error al asignar los grados a la convocatoria");
  }

  await logAudit(
    userData.user.id,
    userData.user.email ?? "",
    "create",
    "convocatorias",
    convData.id,
    { nombre, estado: data.estado, descripcion: `Convocatoria creada en estado ${data.estado}` }
  );

  revalidatePath("/admin/convocatorias");
  revalidatePath("/director/convocatorias");
  
  return { success: true, id: convData.id };
}

export async function changeEstadoConvocatoria(id: string, nuevoEstado: string) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData?.user) throw new Error("No autenticado");

  // TODO: verificar rol

  const { error } = await supabase
    .from("convocatorias")
    .update({ estado: nuevoEstado })
    .eq("id", id);

  if (error) {
    throw new Error("Error al cambiar estado");
  }

  if (nuevoEstado === "abierta") {
    // Notify ALL practicantes
    const adminClient = createAdminClient();
    const { data: practicantes } = await adminClient.from("practicantes").select("user_id");
    if (practicantes && practicantes.length > 0) {
      const notifs = practicantes.map(p => ({
        user_id: p.user_id,
        titulo: "Nueva Convocatoria Abierta",
        mensaje: "Se ha abierto una nueva convocatoria. Revisa en tu panel si cumples los requisitos para inscribirte.",
        tipo: "convocatoria",
        enlace: "/aspirante/catalogo"
      }));
      await adminClient.from("notificaciones").insert(notifs);
    }
  }

  await logAudit(
    userData.user.id,
    userData.user.email ?? "",
    "update",
    "convocatorias",
    id,
    { estado: nuevoEstado, descripcion: `Estado cambiado a ${nuevoEstado}` }
  );
  
  revalidatePath(`/director/convocatorias/${id}`);
  revalidatePath("/director/convocatorias");
}

export async function updateSedeConvocatoria(id: string, nuevaSede: string, hasSolicitudes: boolean) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData?.user) throw new Error("No autenticado");

  const { error } = await supabase
    .from("convocatorias")
    .update({ sede: nuevaSede })
    .eq("id", id);

  if (error) throw new Error("Error al cambiar sede");

  await logAudit(
    userData.user.id,
    userData.user.email ?? "",
    "update",
    "convocatorias",
    id,
    { sede: nuevaSede, descripcion: "Sede modificada" }
  );

  if (hasSolicitudes) {
    // DIR-04: Notificar a los aspirantes inscritos
    const adminClient = createAdminClient();
    const { data: solicitudes } = await adminClient
      .from("solicitudes")
      .select("practicantes(user_id)")
      .eq("convocatoria_id", id) as any;

    if (solicitudes && solicitudes.length > 0) {
      const notifs = solicitudes
        .filter((s: any) => s.practicantes?.user_id)
        .map((s: any) => ({
          user_id: s.practicantes.user_id,
          titulo: "Cambio de Sede de Convocatoria",
          mensaje: `La sede de tu convocatoria ha cambiado a: ${nuevaSede}`,
          tipo: "sistema",
          enlace: "/aspirante/solicitud"
        }));
      if (notifs.length > 0) {
        await adminClient.from("notificaciones").insert(notifs);
      }
    }
  }

  revalidatePath(`/director/convocatorias/${id}`);
  revalidatePath("/director/convocatorias");
}
