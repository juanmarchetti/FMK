"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function crearNotificacion(
  userId: string,
  titulo: string,
  mensaje: string,
  tipo: "convocatoria" | "documento" | "solicitud" | "resultado" | "sistema",
  enlace?: string
) {
  try {
    const admin = createAdminClient();
    const { error } = await admin.from("notificaciones").insert({
      user_id: userId,
      titulo,
      mensaje,
      tipo,
      enlace,
      leida: false,
    });
    if (error) throw error;
    
    // Attempt to revalidate paths where notifications might be displayed
    revalidatePath("/", "layout");
    
    return { success: true };
  } catch (err: any) {
    console.error("Error al crear notificación:", err);
    return { error: err.message };
  }
}

export async function obtenerNotificacionesNoLeidas() {
  try {
    const supabase = await createClient();
    const { data: userData, error: authError } = await supabase.auth.getUser();
    
    if (authError || !userData?.user) {
      return { notificaciones: [], count: 0 };
    }

    const { data, error } = await supabase
      .from("notificaciones")
      .select("*")
      .eq("user_id", userData.user.id)
      .eq("leida", false)
      .order("created_at", { ascending: false });
      
    if (error) throw error;
    
    return { notificaciones: data || [], count: data?.length || 0 };
  } catch (err: any) {
    console.error("Error al obtener notificaciones:", err);
    return { error: err.message, notificaciones: [], count: 0 };
  }
}

export async function marcarNotificacionComoLeida(notificacionId: string) {
  try {
    const supabase = await createClient();
    const { data: userData, error: authError } = await supabase.auth.getUser();
    
    if (authError || !userData?.user) {
      return { error: "No autorizado" };
    }

    const { error } = await supabase
      .from("notificaciones")
      .update({ leida: true })
      .eq("id", notificacionId)
      .eq("user_id", userData.user.id);
      
    if (error) throw error;
    
    revalidatePath("/", "layout");
    
    return { success: true };
  } catch (err: any) {
    console.error("Error al marcar notificación como leída:", err);
    return { error: err.message };
  }
}

export async function marcarTodasComoLeidas() {
  try {
    const supabase = await createClient();
    const { data: userData, error: authError } = await supabase.auth.getUser();
    
    if (authError || !userData?.user) {
      return { error: "No autorizado" };
    }

    const { error } = await supabase
      .from("notificaciones")
      .update({ leida: true })
      .eq("user_id", userData.user.id)
      .eq("leida", false);
      
    if (error) throw error;
    
    revalidatePath("/", "layout");
    
    return { success: true };
  } catch (err: any) {
    console.error("Error al marcar todas como leídas:", err);
    return { error: err.message };
  }
}
