"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getEstilos() {
  const admin = createAdminClient();
  const { data, error } = await admin.from("estilos").select("*").order("nombre", { ascending: true });
  if (error) throw new Error(error.message);
  return data;
}

export async function createEstilo(nombre: string, descripcion: string) {
  if (!nombre.trim()) return { error: "El nombre es obligatorio." };

  const admin = createAdminClient();
  const { data, error } = await admin.from("estilos").insert({ nombre, descripcion }).select().single();
  if (error) return { error: error.message };

  // Registrar en auditoría (ADM-14)
  const { logAudit } = require("../auditoria/actions");
  await logAudit("CREATE", "estilo", data.id, `Creado estilo de karate: ${nombre}`);

  revalidatePath("/admin/estilos");
  return { success: true };
}

export async function updateEstilo(id: string, nombre: string, descripcion: string) {
  if (!nombre.trim()) return { error: "El nombre es obligatorio." };

  const admin = createAdminClient();
  const { error } = await admin.from("estilos").update({ nombre, descripcion }).eq("id", id);
  if (error) return { error: error.message };

  // Registrar en auditoría (ADM-14)
  const { logAudit } = require("../auditoria/actions");
  await logAudit("UPDATE", "estilo", id, `Actualizado estilo de karate: ${nombre}`);

  revalidatePath("/admin/estilos");
  return { success: true };
}

export async function deleteEstilo(id: string) {
  const admin = createAdminClient();
  
  // Obtener nombre antes de borrar para el log
  const { data: estilo } = await admin.from("estilos").select("nombre").eq("id", id).single();

  const { error } = await admin.from("estilos").delete().eq("id", id);
  if (error) return { error: error.message };

  // Registrar en auditoría (ADM-14)
  const { logAudit } = require("../auditoria/actions");
  await logAudit("DELETE", "estilo", id, `Eliminado estilo de karate: ${estilo?.nombre || id}`);

  revalidatePath("/admin/estilos");
  return { success: true };
}
