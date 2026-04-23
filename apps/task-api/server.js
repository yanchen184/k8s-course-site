const express = require('express');
const mysql = require('mysql2/promise');
const Redis = require('ioredis');
const k8s = require('@kubernetes/client-node');

const app = express();
app.use(express.json());

let pool;
let redis;

async function loadConfigFromK8s() {
  const kc = new k8s.KubeConfig();
  kc.loadFromCluster();
  const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

  const namespace = 'tasks';
  const result = await k8sApi.readNamespacedConfigMap('app-config', namespace);
  const data = result.body.data;

  console.log('Loaded ConfigMap from K8s API:', Object.keys(data));
  return data;
}

async function init() {
  const config = await loadConfigFromK8s();

  pool = mysql.createPool({
    host: config.MYSQL_HOST,
    port: parseInt(config.MYSQL_PORT),
    database: config.MYSQL_DATABASE,
    user: 'root',
    password: process.env.MYSQL_PASSWORD,
    waitForConnections: true,
    connectionLimit: 10,
  });

  redis = new Redis({
    host: config.REDIS_HOST,
    port: parseInt(config.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`task-api listening on port ${PORT}`);
  });
}

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/tasks', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM tasks ORDER BY created_at DESC LIMIT 50'
    );
    res.json({ tasks: rows });
  } catch (err) {
    console.error('GET /tasks error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/tasks', async (req, res) => {
  const { title, description, scheduled_at } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'title is required' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO tasks (title, description, scheduled_at, status)
       VALUES (?, ?, ?, 'pending')`,
      [title, description || null, scheduled_at || null]
    );
    const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [result.insertId]);
    const task = rows[0];

    await redis.rpush('task-queue', JSON.stringify({ id: task.id, title: task.title }));
    console.log(`Task ${task.id} created and queued`);

    res.status(201).json({ task });
  } catch (err) {
    console.error('POST /tasks error:', err.message);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

init().catch(err => {
  console.error('Failed to initialize:', err.message);
  process.exit(1);
});
