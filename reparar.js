const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

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

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function repair() {
  console.log("Creando perfiles_usuario faltantes...");

  // fmk.admin@gmail.com
  const adminUserId = '830e6de8-a95c-40e3-8ad7-d569df1306fe';
  const { error: err1 } = await supabase.from("perfiles_usuario").upsert({
    user_id: adminUserId,
    rol: 'administrador',
    nombre_visible: 'Admin FMK',
    estado: 'activo'
  });
  if (err1) console.error("Error insertando admin:", err1);
  else console.log("Perfil Administrador insertado correctamente.");

  // juancortescg@gmail.com (asumimos director_fmk o según corresponda, vamos a ponerlo como director_fmk)
  const directorUserId = 'a24c82ef-15f5-4496-bec5-9433e9f16b04';
  const { error: err2 } = await supabase.from("perfiles_usuario").upsert({
    user_id: directorUserId,
    rol: 'director_fmk',
    nombre_visible: 'Juan Cortés',
    estado: 'activo'
  });
  if (err2) console.error("Error insertando director:", err2);
  else console.log("Perfil Director FMK insertado correctamente.");
}

repair();
