const { Pool } = require('pg');
const Redis = require('ioredis');

const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DB || 'taskdb',
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD,
});

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
});

async function enqueueDueTasks() {
  console.log('Scanning for due tasks...');

  const result = await pool.query(
    `SELECT id, title FROM tasks
     WHERE status = 'pending'
       AND scheduled_at IS NOT NULL
       AND scheduled_at <= NOW()`
  );

  if (result.rows.length === 0) {
    console.log('No due tasks found');
    process.exit(0);
  }

  for (const task of result.rows) {
    await redis.rpush('task-queue', JSON.stringify({ id: task.id, title: task.title }));
    console.log(`Enqueued task ${task.id}: ${task.title}`);
  }

  console.log(`Enqueued ${result.rows.length} tasks`);
  process.exit(0);
}

enqueueDueTasks().catch(err => {
  console.error('Scheduler error:', err.message);
  process.exit(1);
});
