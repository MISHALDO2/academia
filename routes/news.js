const express = require('express');
const router = express.Router();
const db = require('../database');
const adminMiddleware = require('./middlewares/admin');

// OBTENER TODAS LAS NOTICIAS CON PAGINACIÓN Y BÚSQUEDA
router.get('/', (req, res) => {

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const search = req.query.search || "";
  const offset = (page - 1) * limit;

  const searchTerm = `%${search}%`;

  const countQuery = `
    SELECT COUNT(*) as total
    FROM news
    WHERE titulo LIKE ? OR contenido LIKE ?
  `;

  db.get(countQuery, [searchTerm, searchTerm], (err, countResult) => {

    if (err) {
      return res.status(500).json({ error: "Error al contar noticias" });
    }

    const total = countResult.total;
    const totalPages = Math.ceil(total / limit);

    const query = `
      SELECT * FROM news
      WHERE titulo LIKE ? OR contenido LIKE ?
      ORDER BY fecha DESC
      LIMIT ? OFFSET ?
    `;

    db.all(query, [searchTerm, searchTerm, limit, offset], (err, rows) => {

      if (err) {
        return res.status(500).json({ error: "Error al obtener noticias" });
      }

      res.json({
        page,
        limit,
        total,
        totalPages,
        search,
        data: rows
      });

    });

  });

});

// OBTENER UNA NOTICIA POR ID
router.get('/:id', (req, res) => {

  const { id } = req.params;

  const query = `
    SELECT * FROM news
    WHERE id = ?
  `;

  db.get(query, [id], (err, row) => {

    if (err) {
      return res.status(500).json({ error: "Error al obtener noticia" });
    }

    if (!row) {
      return res.status(404).json({ error: "Noticia no encontrada" });
    }

    res.json(row);

  });

});

// CREAR NOTICIA
router.post('/', adminMiddleware, (req, res) => {

  const { titulo, contenido } = req.body;

  if (!titulo || !contenido) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  const query = `
    INSERT INTO news (titulo, contenido)
    VALUES (?, ?)
  `;

  db.run(query, [titulo, contenido], function (err) {

    if (err) {
      return res.status(500).json({ error: "Error al crear noticia" });
    }

    res.json({
      mensaje: "Noticia creada",
      id: this.lastID
    });

  });

});

// EDITAR NOTICIA
router.put('/:id', adminMiddleware, (req, res) => {

  const { id } = req.params;
  const { titulo, contenido } = req.body;

  if (!titulo || !contenido) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  const query = `
    UPDATE news
    SET titulo = ?, contenido = ?
    WHERE id = ?
  `;

  db.run(query, [titulo, contenido, id], function (err) {

    if (err) {
      return res.status(500).json({ error: "Error al actualizar noticia" });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Noticia no encontrada" });
    }

    res.json({ mensaje: "Noticia actualizada" });

  });

});

// ELIMINAR NOTICIA
router.delete('/:id', adminMiddleware, (req, res) => {

  const { id } = req.params;

  const query = `DELETE FROM news WHERE id = ?`;

  db.run(query, [id], function (err) {

    if (err) {
      return res.status(500).json({ error: "Error al eliminar noticia" });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Noticia no encontrada" });
    }

    res.json({ mensaje: "Noticia eliminada" });

  });

});

module.exports = router;