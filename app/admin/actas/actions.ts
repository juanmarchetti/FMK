"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getConvocatoriasFinalizadas() {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("convocatorias")
    .select("*")
    .eq("estado", "finalizada")
    .order("fecha_examen", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function anularActa(convocatoriaId: string, motivo: string) {
  if (!motivo.trim()) return { error: "El motivo de anulación es obligatorio." };

  const admin = createAdminClient();

  // 1. Obtener datos de la convocatoria
  const { data: convocatoria, error: cErr } = await admin
    .from("convocatorias")
    .select("nombre")
    .eq("id", convocatoriaId)
    .single();

  if (cErr || !convocatoria) return { error: "No se encontró la convocatoria." };

  // 2. Modificar estado de la convocatoria a 'cerrada'
  const { error: updateConvocatoriaErr } = await admin
    .from("convocatorias")
    .update({ estado: "cerrada" })
    .eq("id", convocatoriaId);

  if (updateConvocatoriaErr) return { error: updateConvocatoriaErr.message };

  // 3. Revertir solicitudes de esta convocatoria de 'finalizada'/'apto'/'no_apto' a 'validada'
  const { error: updateSolicitudesErr } = await admin
    .from("solicitudes")
    .update({ estado: "validada" })
    .eq("convocatoria_id", convocatoriaId);

  if (updateSolicitudesErr) return { error: updateSolicitudesErr.message };

  // 4. Registrar en auditoría (ADM-22, ADM-23)
  const { logAudit } = require("../auditoria/actions");
  await logAudit("ANULAR", "acta", convocatoriaId, `Acta anulada para Convocatoria: ${convocatoria.nombre}. Motivo: ${motivo}`);

  revalidatePath("/admin/actas");
  return { success: true };
}
