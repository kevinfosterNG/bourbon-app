import { readdirSync, readFileSync } from 'node:fs';
import { Client } from 'pg';
import { loadSupabaseDbEnv } from './lib/supabase-env.mjs';

const client = new Client(loadSupabaseDbEnv());

function getSqlFiles() {
  const migrationsDir = new URL('../supabase/migrations/', import.meta.url);
  try {
    const files = readdirSync(migrationsDir, { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.endsWith('.sql'))
      .map((entry) => entry.name)
      .sort();

    if (files.length > 0) {
      return files.map((fileName) => new URL(`../supabase/migrations/${fileName}`, import.meta.url));
    }
  } catch {
    // Fall back to the legacy consolidated schema file when no migrations exist yet.
  }

  return [new URL('../supabase/schema.sql', import.meta.url)];
}

try {
  await client.connect();
  for (const sqlFile of getSqlFiles()) {
    const sql = readFileSync(sqlFile, 'utf8');
    await client.query(sql);
  }
  console.log('Supabase schema applied successfully.');
} finally {
  await client.end().catch(() => {});
}
