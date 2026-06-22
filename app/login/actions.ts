"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Correo y contraseña son obligatorios." };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Credenciales incorrectas. Verifica tu correo y contraseña." };
  }

  // Leer el perfil con el cliente del usuario autenticado
  const { data: profile, error: profileError } = await supabase
    .from("perfiles_usuario")
    .select("rol, estado")
    .eq("user_id", data.user.id)
    .single();

  if (profileError || !profile) {
    console.error("Error leyendo perfil:", profileError?.message, "user_id:", data.user.id);
    await supabase.auth.signOut();
    return { error: "Tu cuenta no tiene un perfil configurado. Contacta al administrador." };
  }

  if (profile.estado === "suspendido") {
    await supabase.auth.signOut();
    return { error: "Tu cuenta está suspendida. Contacta al administrador." };
  }

  // Redirigir según rol
  if (profile.rol === "administrador") {
    redirect("/admin");
  } else if (profile.rol === "director_fmk") {
    redirect("/director");
  } else if (profile.rol === "aspirante") {
    redirect("/aspirante");
  } else {
    redirect("/login");
  }
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}