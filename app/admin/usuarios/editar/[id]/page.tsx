import { createAdminClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import EditarUsuarioClient from "./EditarUsuarioClient";

export const dynamic = 'force-dynamic';

export default async function EditarUsuarioPage({ params }: { params: Promise<{ id: string }> }) {
  const admin = createAdminClient();
  const { id: userId } = await params;

  // 1. Get auth user
  const { data: authData, error: authError } = await admin.auth.admin.getUserById(userId);
  if (authError || !authData.user) {
    return notFound();
  }

  // 2. Get profile
  const { data: profile, error: profileError } = await admin
    .from("perfiles_usuario")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (profileError || !profile) {
    return notFound();
  }

  const user = {
    id: userId,
    name: profile.nombre_visible,
    email: authData.user.email || "",
    role: profile.rol === 'director_fmk' ? 'Director FMK' : profile.rol === 'aspirante' ? 'Aspirante' : profile.rol,
  };

  return <EditarUsuarioClient user={user} />;
}
