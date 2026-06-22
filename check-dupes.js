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

const supabase = createClient(supabaseUrl, serviceKey);

async function check() {
  const userId = '830e6de8-a95c-40e3-8ad7-d569df1306fe';
  const { data, error } = await supabase.from('perfiles_usuario').select('*').eq('user_id', userId);
  
  if (error) {
    console.error("Error:", error);
    return;
  }
  
  console.log(`Encontrados ${data.length} registros para admin:`);
  console.log(data);
}

check();
