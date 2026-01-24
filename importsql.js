const { Client } = require('pg');
const fs = require('fs');

// Remplace par ton URL Neon
const connectionString = 'postgresql://neondb_owner:npg_tInp5Pu0QFLh@ep-falling-sun-ahx17jgf-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

// Lis le fichier SQL
const sql = fs.readFileSync('backup_clean.sql', 'utf8');

// Découpe le SQL en statements (attention : basique, ne gère pas les COPY ou les ; dans les strings)
const statements = sql
  .split(/;\s*$/m)
  .map(s => s.trim())
  .filter(s => s.length > 0);

async function run() {
  const client = new Client({ connectionString });
  await client.connect();

  for (const statement of statements) {
    try {
      await client.query(statement);
      console.log('OK:', statement.substring(0, 60).replace(/\n/g, ' '));
    } catch (err) {
      console.error('Erreur sur statement:', statement.substring(0, 60));
      console.error(err.message);
    }
  }

  await client.end();
}

run();