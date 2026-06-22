"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import fs from "fs/promises";
import path from "path";

export async function getNormativa() {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("reglas_normativas")
    .select("*")
    .order("edad_minima", { ascending: true }); // A simple order

  if (error) throw new Error(error.message);
  
  // Define standard order
  const orderArray = ['Cinturón Blanco', 'Cinturón Amarillo', 'Cinturón Naranja', 'Cinturón Verde', 'Cinturón Azul', 'Cinturón Marrón', 'Cinturón Negro', '1º Dan', '2º Dan', '3º Dan', '4º Dan', '5º Dan', '6º Dan', '7º Dan', '8º Dan', '9º Dan', '10º Dan'];
  
  // Sort by the predefined enum order
  data.sort((a, b) => {
    return orderArray.indexOf(a.grado) - orderArray.indexOf(b.grado);
  });

  return data;
}

export async function updateNormativa(id: string, formData: FormData) {
  const admin = createAdminClient();
  
  const edad_minima = parseInt(formData.get("edad_minima") as string);
  const permanencia_minima_meses = parseInt(formData.get("permanencia_minima_meses") as string);
  const licencias_consecutivas_min = parseInt(formData.get("licencias_consecutivas_min") as string);
  const licencias_alternas_min = parseInt(formData.get("licencias_alternas_min") as string);

  // Obtener valor actual para auditoría
  const { data: anterior } = await admin.from("reglas_normativas").select("*").eq("id", id).single();

  const { error } = await admin.from("reglas_normativas").update({
    edad_minima,
    permanencia_minima_meses,
    licencias_consecutivas_min,
    licencias_alternas_min
  }).eq("id", id);

  if (error) return { error: error.message };

  // Log de auditoría en BD (ADM-14)
  try {
    const { logAudit } = require("../auditoria/actions");
    let changes = `Modificó normativa (Grado: ${anterior?.grado}) -> `;
    changes += `Edad mínima: ${anterior?.edad_minima} -> ${edad_minima}, `;
    changes += `Permanencia: ${anterior?.permanencia_minima_meses} -> ${permanencia_minima_meses}, `;
    changes += `Licencias cons.: ${anterior?.licencias_consecutivas_min} -> ${licencias_consecutivas_min}, `;
    changes += `Licencias alt.: ${anterior?.licencias_alternas_min} -> ${licencias_alternas_min}`;

    await logAudit("UPDATE", "normativa", id, changes);
  } catch (e) {
    console.error("No se pudo registrar auditoría en BD", e);
  }

  // Log de auditoría en archivo local (Legacy)
  try {
    const logPath = path.join(process.cwd(), "audit.log");
    const timestamp = new Date().toISOString();
    const currentUser = (await admin.auth.admin.listUsers()).data.users[0]?.email || "Administrador"; // We log as Admin since this is server action with service role
    
    let changes = `[${timestamp}] Usuario: ${currentUser} | Modificó normativa (ID: ${id}, Grado: ${anterior?.grado}) -> `;
    changes += `Edad mínima: ${anterior?.edad_minima} -> ${edad_minima}, `;
    changes += `Permanencia: ${anterior?.permanencia_minima_meses} -> ${permanencia_minima_meses}, `;
    changes += `Licencias cons.: ${anterior?.licencias_consecutivas_min} -> ${licencias_consecutivas_min}, `;
    changes += `Licencias alt.: ${anterior?.licencias_alternas_min} -> ${licencias_alternas_min}\n`;

    await fs.appendFile(logPath, changes);
  } catch (e) {
    console.error("No se pudo escribir el log de auditoría", e);
  }

  revalidatePath("/admin/normativa");
  return { success: true };
}
