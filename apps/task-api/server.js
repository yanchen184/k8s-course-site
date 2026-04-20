const express = require('express');
const { Pool } = require('pg');
const Redis = require('ioredis');

const app = express();
app.use(express.json());

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

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/tasks', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM tasks ORDER BY created_at DESC LIMIT 50'
    );
    res.json({ tasks: result.rows });
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
    const result = await pool.query(
      `INSERT INTO tasks (title, description, scheduled_at, status)
       VALUES ($1, $2, $3, 'pending') RETURNING *`,
      [title, description || null, scheduled_at || null]
    );
    const task = result.rows[0];

    await redis.rpush('task-queue', JSON.stringify({ id: task.id, title: task.title }));
    console.log(`Task ${task.id} created and queued`);

    res.status(201).json({ task });
  } catch (err) {
    console.error('POST /tasks error:', err.message);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`task-api listening on port ${PORT}`);
});
