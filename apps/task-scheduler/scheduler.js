const mysql = require('mysql2/promise');
const Redis = require('ioredis');

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  database: process.env.MYSQL_DATABASE || 'taskdb',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
});

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
});

async function enqueueDueTasks() {
  console.log('Scanning for due tasks...');

  const [rows] = await pool.query(
    `SELECT id, title FROM tasks
     WHERE status = 'pending'
       AND scheduled_at IS NOT NULL
       AND scheduled_at <= NOW()`
  );

  if (rows.length === 0) {
    console.log('No due tasks found');
    process.exit(0);
  }

  for (const task of rows) {
    await redis.rpush('task-queue', JSON.stringify({ id: task.id, title: task.title }));
    console.log(`Enqueued task ${task.id}: ${task.title}`);
  }

  console.log(`Enqueued ${rows.length} tasks`);
  process.exit(0);
}

enqueueDueTasks().catch(err => {
  console.error('Scheduler error:', err.message);
  process.exit(1);
});
