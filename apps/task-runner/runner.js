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

async function processTask(task) {
  console.log(`Processing task ${task.id}: ${task.title}`);

  // 模擬任務執行（實際場景可以是寄 Email、產生報表等）
  await new Promise(resolve => setTimeout(resolve, 500));

  await pool.query(
    `UPDATE tasks SET status = 'done', executed_at = NOW() WHERE id = ?`,
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
