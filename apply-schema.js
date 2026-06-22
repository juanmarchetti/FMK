const fs = require('fs');
const { Client } = require('pg');

const connectionString = 'postgresql://postgres:fmkjuancortesgamez@db.mwescgdicpawmaykpiws.supabase.co:5432/postgres';

async function applyMigrations() {
    const client = new Client({ connectionString });
    try {
        await client.connect();
        console.log('Connected to Supabase PostgreSQL for migrations.');

        // 1. Initial schema
        const sqlPath1 = 'c:/Users/lisha/Downloads/FMK/supabase/migrations/20240101000000_initial_schema.sql';
        const schema1 = fs.readFileSync(sqlPath1, 'utf8');
        console.log('Applying initial schema...');
        await client.query(schema1);
        console.log('Initial schema applied.');

        // 2. Admin features complement
        const sqlPath2 = 'c:/Users/lisha/Downloads/FMK/supabase/migrations/20240101000001_admin_features.sql';
        const schema2 = fs.readFileSync(sqlPath2, 'utf8');
        console.log('Applying admin features...');
        await client.query(schema2);
        console.log('Admin features migration applied successfully.');
    } catch (err) {
        console.error('Error applying migrations:', err);
    } finally {
        await client.end();
    }
}

applyMigrations();
