#!/usr/bin/env node
import pg from 'pg';
import { readFileSync } from 'fs';

const { Client } = pg;

const client = new Client({
  host: 'db.dfdnkhvllevapeomwosa.supabase.co',
  port: 6543,
  database: 'postgres',
  user: 'postgres',
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false },
});

async function run() {
  console.log('Connecting to Supabase Postgres...');
  await client.connect();
  console.log('Connected!\n');

  const files = process.argv.slice(2);
  for (const file of files) {
    console.log(`Running: ${file}`);
    const sql = readFileSync(file, 'utf-8');
    try {
      await client.query(sql);
      console.log(`  ✓ ${file} completed\n`);
    } catch (err) {
      console.error(`  ERROR in ${file}: ${err.message}\n`);
    }
  }

  await client.end();
  console.log('Done.');
}

run().catch(err => { console.error(err); process.exit(1); });
