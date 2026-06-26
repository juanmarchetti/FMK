const fs = require('fs');
const { Client } = require('pg');

const connectionString = 'postgresql://postgres:fmkjuancortesgamez@db.mwescgdicpawmaykpiws.supabase.co:5432/postgres';

async function applyMigrations() {
    const client = new Client({ connectionString });
    try {
        await client.connect();
        console.log('Connected to Supabase PostgreSQL for migrations.');

        const sqlPath = 'c:/Users/lisha/Downloads/FMK/supabase/migrations/20240101000004_notificaciones.sql';
        const schema = fs.readFileSync(sqlPath, 'utf8');
        console.log('Applying notificaciones schema...');
        await client.query(schema);
        console.log('Notificaciones schema applied.');
    } catch (err) {
        console.error('Error applying migrations:', err);
    } finally {
        await client.end();
    }
}

applyMigrations();
