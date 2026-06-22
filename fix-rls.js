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

const { Client } = require('pg');
const connectionString = 'postgresql://postgres:fmkjuancortesgamez@db.mwescgdicpawmaykpiws.supabase.co:5432/postgres';

async function fixRLS() {
    const client = new Client({ connectionString });
    try {
        await client.connect();
        console.log('Connected to DB');

        // Drop recursive policies on perfiles_usuario
        await client.query(`DROP POLICY IF EXISTS "Admins_Directors read perfiles" ON perfiles_usuario`);
        await client.query(`DROP POLICY IF EXISTS "Admins manage perfiles" ON perfiles_usuario`);
        
        console.log('Dropped recursive policies successfully');
    } catch (e) {
        console.error('Error:', e);
    } finally {
        await client.end();
    }
}

fixRLS();
