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

module.exports = router;