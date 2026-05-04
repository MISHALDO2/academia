const express = require('express');
const router = express.Router();
const db = require('../database');
const adminMiddleware = require('./middlewares/admin');

// OBTENER TODOS LOS CURSOS
router.get('/', (req, res) => {
  const query = `SELECT * FROM courses`;

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Error al obtener cursos" });
    }

    res.json(rows);
  });
});

// CREAR CURSO (solo admin)
router.post('/', adminMiddleware, (req, res) => {
  const { titulo, descripcion, imagen } = req.body;

  if (!titulo || !descripcion) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  const query = `
    INSERT INTO courses (titulo, descripcion, imagen)
    VALUES (?, ?, ?)
  `;

  db.run(query, [titulo, descripcion, imagen], function (err) {
    if (err) {
      return res.status(500).json({ error: "Error al crear curso" });
    }

    res.json({
      mensaje: "Curso creado",
      id: this.lastID
    });
  });
});

// ELIMINAR CURSO (solo admin)
router.delete('/:id', adminMiddleware, (req, res) => {
  const { id } = req.params;

  const query = `DELETE FROM courses WHERE id = ?`;

  db.run(query, [id], function (err) {
    if (err) {
      return res.status(500).json({ error: "Error al eliminar curso" });
    }

    res.json({ mensaje: "Curso eliminado" });
  });
});

module.exports = router;