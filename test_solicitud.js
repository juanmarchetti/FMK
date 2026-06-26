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
  auth: { autoRefreshToken: false, persistSession: false }
});

async function run() {
  const id = '7ad3dbc1-96a9-4916-b3a7-c21a91910daa'; // from the user's screenshot URL
  const { data: solicitud, error } = await supabase
    .from("solicitudes")
    .select(`
      *,
      practicantes (
        id,
        nombre,
        apellidos,
        dni,
        fecha_nacimiento,
        grado_actual,
        fecha_obtencion_grado,
        estilo,
        clubes ( nombre )
      )
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error:", error);
    return;
  }
  console.log("Solicitud:", JSON.stringify(solicitud, null, 2));
}

run();
