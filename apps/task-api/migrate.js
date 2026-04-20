const { Client } = require('pg');

async function migrate() {
  const client = new Client({
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    database: process.env.POSTGRES_DB || 'taskdb',
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD,
  });

  await client.connect();
  console.log('Connected to PostgreSQL');

  await client.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      status VARCHAR(50) DEFAULT 'pending',
      scheduled_at TIMESTAMP,
      executed_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  console.log('Migration complete: tasks table ready');
  await client.end();
}

migrate().catch(err => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
