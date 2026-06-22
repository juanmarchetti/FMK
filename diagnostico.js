const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Leer del archivo .env.local directamente
const envContent = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    envVars[parts[0].trim()] = parts.slice(1).join('=').trim();
  }
});

const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL'];
const serviceKey = envVars['SUPABASE_SERVICE_ROLE_KEY'];

if (!supabaseUrl || !serviceKey) {
  console.error("Faltan variables de entorno:", { supabaseUrl, serviceKey });
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function run() {
  // 1. Obtener la lista de usuarios en Auth
  const { data: { users }, error: usersErr } = await supabase.auth.admin.listUsers();
  if (usersErr) {
    console.error("Error obteniendo usuarios:", usersErr);
    return;
  }

  console.log("--- USUARIOS EN AUTH.USERS ---");
  for (const u of users) {
    console.log(`ID: ${u.id} | Email: ${u.email}`);
  }

  // 2. Obtener la lista de perfiles_usuario
  const { data: perfiles, error: perfErr } = await supabase.from("perfiles_usuario").select("*");
  if (perfErr) {
    console.error("Error obteniendo perfiles:", perfErr);
    return;
  }

  console.log("\n--- PERFILES EN PERFILES_USUARIO ---");
  for (const p of perfiles) {
    console.log(`User ID: ${p.user_id} | Rol: ${p.rol} | Estado: ${p.estado} | Nombre: ${p.nombre_visible}`);
  }
}

run();
