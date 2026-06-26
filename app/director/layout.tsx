import { createClient } from "@/lib/supabase/server";
import { DirectorLayoutClient } from "./DirectorLayoutClient";

export default async function DirectorLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: perfil } = await supabase
    .from("perfiles_usuario")
    .select("nombre_visible")
    .eq("user_id", user?.id ?? "")
    .single();

  const nombre  = perfil?.nombre_visible ?? "Director FMK";
  const email   = user?.email ?? "";
  const iniciales = nombre
    .split(" ")
    .slice(0, 2)
    .map((w: string) => w[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <DirectorLayoutClient nombre={nombre} email={email} iniciales={iniciales}>
      {children}
    </DirectorLayoutClient>
  );
}
