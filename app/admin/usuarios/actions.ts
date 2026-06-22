"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getUsuarios() {
  const admin = createAdminClient();
  
  // 1. Get auth users
  const { data: authData, error: authError } = await admin.auth.admin.listUsers();
  if (authError) throw new Error(authError.message);
  
  // 2. Get profiles
  const { data: profiles, error: profileError } = await admin
    .from("perfiles_usuario")
    .select("*");
  if (profileError) throw new Error(profileError.message);

  // Merge
  const users = profiles.map((profile) => {
    const authUser = authData.users.find((u) => u.id === profile.user_id);
    return {
      id: profile.user_id,
      name: profile.nombre_visible,
      email: authUser?.email || "Sin correo",
      role: profile.rol === 'director_fmk' ? 'Director FMK' : profile.rol === 'aspirante' ? 'Aspirante' : profile.rol,
      rawRole: profile.rol,
      status: profile.estado === 'activo' ? 'Activo' : 'Suspendido',
      statusClass: profile.estado === 'activo' 
        ? "border-[#2D6A4F]/30 bg-[#EAF5EF] text-[#2D6A4F]" 
        : "border-[#BA1A1A]/30 bg-[#FFF1F2] text-[#BA1A1A]"
    };
  });

  return users;
}

export async function createUsuario(formData: FormData) {
  const admin = createAdminClient();
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const role = formData.get("role") as string; // 'Aspirante' | 'Director FMK'
  const password = formData.get("password") as string;

  if (!name || !email || !role || !password) {
    return { error: "Todos los campos obligatorios deben completarse." };
  }

  // 1. Create in auth.users
  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError) {
    if (authError.message.includes("already registered") || authError.status === 422) {
      return { error: "El correo electrónico ya está en uso." }; // ADM-03
    }
    return { error: authError.message };
  }

  const userId = authData.user.id;
  const dbRole = role === "Director FMK" ? "director_fmk" : "aspirante";

  // 2. Create profile
  const { error: profileError } = await admin.from("perfiles_usuario").insert({
    user_id: userId,
    nombre_visible: name,
    rol: dbRole,
    estado: "activo",
  });

  if (profileError) {
    // Rollback
    await admin.auth.admin.deleteUser(userId);
    return { error: profileError.message };
  }

  // 3. If Aspirante, optionally create practicantes record
  if (dbRole === "aspirante") {
    const parts = name.split(" ");
    const firstName = parts[0];
    const lastName = parts.slice(1).join(" ") || "Apellidos";
    
    await admin.from("practicantes").insert({
      user_id: userId,
      nombre: firstName,
      apellidos: lastName,
      grado_actual: 'Cinturón Blanco',
    });
  }

  // Registrar auditoría en BD (ADM-14)
  const { logAudit } = require("../auditoria/actions");
  await logAudit("CREATE", "usuario", userId, `Creado usuario ${name} con email ${email} y rol ${dbRole}`);

  revalidatePath("/admin/usuarios");
  return { success: true };
}

export async function updateUsuario(userId: string, formData: FormData) {
  const admin = createAdminClient();
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

  if (!name || !email) {
    return { error: "Nombre y correo son obligatorios." };
  }

  // Update Auth email
  const { error: authError } = await admin.auth.admin.updateUserById(userId, { email });
  if (authError) return { error: authError.message };

  // Update Profile
  const { error: profileError } = await admin.from("perfiles_usuario").update({ nombre_visible: name }).eq("user_id", userId);
  if (profileError) return { error: profileError.message };

  // Registrar auditoría en BD (ADM-14)
  const { logAudit } = require("../auditoria/actions");
  await logAudit("UPDATE", "usuario", userId, `Actualizado nombre a ${name} y email a ${email}`);

  revalidatePath("/admin/usuarios");
  return { success: true };
}

export async function suspenderUsuario(userId: string) {
  const admin = createAdminClient();
  
  // Check role first
  const { data: profile } = await admin.from("perfiles_usuario").select("rol, nombre_visible").eq("user_id", userId).single();
  
  if (profile?.rol === "aspirante") {
    // ADM-07: check active requests
    const { data: practicante } = await admin.from("practicantes").select("id").eq("user_id", userId).single();
    if (practicante) {
      const { data: solicitudes } = await admin.from("solicitudes")
        .select("id")
        .eq("practicante_id", practicante.id)
        .eq("estado", "validada");
        
      if (solicitudes && solicitudes.length > 0) {
        return { warning: "Este Aspirante tiene solicitudes en estado Validada. ¿Confirmas la suspensión?" };
      }
    }
  }

  const { error } = await admin.from("perfiles_usuario").update({ estado: "suspendido" }).eq("user_id", userId);
  if (error) return { error: error.message };

  // Registrar auditoría en BD (ADM-14)
  const { logAudit } = require("../auditoria/actions");
  await logAudit("SUSPEND", "usuario", userId, `Suspendido usuario ${profile?.nombre_visible || userId}`);

  revalidatePath("/admin/usuarios");
  return { success: true };
}

export async function confirmarSuspension(userId: string) {
  const admin = createAdminClient();
  const { data: profile } = await admin.from("perfiles_usuario").select("nombre_visible").eq("user_id", userId).single();
  const { error } = await admin.from("perfiles_usuario").update({ estado: "suspendido" }).eq("user_id", userId);
  if (error) return { error: error.message };

  // Registrar auditoría en BD (ADM-14)
  const { logAudit } = require("../auditoria/actions");
  await logAudit("SUSPEND", "usuario", userId, `Confirmada suspensión del usuario ${profile?.nombre_visible || userId}`);

  revalidatePath("/admin/usuarios");
  return { success: true };
}

export async function reactivarUsuario(userId: string) {
  const admin = createAdminClient();
  const { data: profile } = await admin.from("perfiles_usuario").select("nombre_visible").eq("user_id", userId).single();
  const { error } = await admin.from("perfiles_usuario").update({ estado: "activo" }).eq("user_id", userId);
  if (error) return { error: error.message };

  // Registrar auditoría en BD (ADM-14)
  const { logAudit } = require("../auditoria/actions");
  await logAudit("UPDATE", "usuario", userId, `Reactivado usuario ${profile?.nombre_visible || userId}`);

  revalidatePath("/admin/usuarios");
  return { success: true };
}

export async function eliminarUsuario(userId: string) {
  const admin = createAdminClient();
  const { data: profile } = await admin.from("perfiles_usuario").select("nombre_visible").eq("user_id", userId).single();
  
  // ADM-08: Borrado lógico o eliminar cuenta si no tiene expedientes
  // Actually the schema says ON DELETE CASCADE for most things, but safe is to delete from auth
  const { error } = await admin.auth.admin.deleteUser(userId);
  if (error) return { error: error.message };

  // Registrar auditoría en BD (ADM-14)
  const { logAudit } = require("../auditoria/actions");
  await logAudit("DELETE", "usuario", userId, `Eliminado usuario permanentemente: ${profile?.nombre_visible || userId}`);

  revalidatePath("/admin/usuarios");
  return { success: true };
}
