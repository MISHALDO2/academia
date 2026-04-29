const adminMiddleware = require('./middlewares/admin');
const express = require('express');
const router = express.Router();
const db = require('../database');

// GET cursos desde base de datos
router.get('/', (req, res) => {
  const query = `SELECT * FROM courses`;

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Error al obtener cursos" });
    }

    res.json(rows);
  });
});
// CREAR CURSO
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
// tu código...



module.exports = router;