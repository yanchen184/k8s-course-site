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

async function processTask(task) {
  console.log(`Processing task ${task.id}: ${task.title}`);

  // 模擬任務執行（實際場景可以是寄 Email、產生報表等）
  await new Promise(resolve => setTimeout(resolve, 500));

  await pool.query(
    `UPDATE tasks SET status = 'done', executed_at = NOW() WHERE id = $1`,
    [task.id]
  );

  console.log(`Task ${task.id} done`);
}

async function run() {
  console.log('task-runner started, waiting for tasks...');

  while (true) {
    try {
      // BLPOP 阻塞等待，timeout 0 代表永遠等
      const result = await redis.blpop('task-queue', 0);
      if (!result) continue;

      const [, raw] = result;
      const task = JSON.parse(raw);
      await processTask(task);
    } catch (err) {
      console.error('Runner error:', err.message);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}

run();
