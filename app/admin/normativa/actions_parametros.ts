"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getParametros() {
  const admin = createAdminClient();
  const { data, error } = await admin.from("parametros_sistema").select("*");
  if (error) throw new Error(error.message);
  return data;
}

export async function getParametroByClave(clave: string) {
  const admin = createAdminClient();
  const { data, error } = await admin.from("parametros_sistema").select("*").eq("clave", clave).single();
  if (error) return null;
  return data;
}

export async function updateParametro(id: string, valor: string) {
  if (!valor.trim()) return { error: "El valor no puede estar vacío." };

  const admin = createAdminClient();
  const { data: anterior } = await admin.from("parametros_sistema").select("*").eq("id", id).single();

  const { error } = await admin.from("parametros_sistema").update({ valor }).eq("id", id);
  if (error) return { error: error.message };

  // Registrar auditoría en BD (ADM-14, ADM-24)
  const { logAudit } = require("../auditoria/actions");
  await logAudit("UPDATE", "normativa", id, `Modificó parámetro ${anterior?.clave}: ${anterior?.valor} -> ${valor}`);

  revalidatePath("/admin/normativa");
  return { success: true };
}
