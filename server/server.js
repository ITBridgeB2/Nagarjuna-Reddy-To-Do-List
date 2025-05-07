// server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST ,
  user: process.env.DB_USER,
  password: process.env.DB_PASS ,
  database: process.env.DB_NAME 
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL Connected');
});

// Create task
app.post('/tasks', (req, res) => {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ error: "Title is required" });

  const sql = "INSERT INTO tasks (title, description) VALUES (?, ?)";
  db.query(sql, [title, description], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    const newTask = {
      id: result.insertId,
      title,
      description,
      completed: false,
      created_at: new Date().toISOString()
    };
    res.status(201).json(newTask);
  });
});

// Get all tasks
app.get('/tasks', (req, res) => {
  db.query("SELECT * FROM tasks", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
});

// Update a task
app.put('/tasks/:id', (req, res) => {
  const { title, description, completed } = req.body;
  const { id } = req.params;

  const sql = "UPDATE tasks SET title = ?, description = ?, completed = ? WHERE id = ?";
  db.query(sql, [title, description, completed, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Task not found" });
    res.status(200).json({ id: Number(id), title, description, completed, created_at: new Date().toISOString() });
  });
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM tasks WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Task not found" });
    res.status(204).send();
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
