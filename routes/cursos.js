const express = require('express');
const router = express.Router();
const db = require('../database');
const adminMiddleware = require('./middlewares/admin');

// VALIDACIÓN
function validarCurso(titulo, descripcion) {
  if (!titulo || !descripcion) return "Faltan datos";
  if (titulo.length < 3) return "El título es muy corto";
  if (descripcion.length < 5) return "La descripción es muy corta";
  return null;
}

// GET CURSOS COMPLETO
router.get('/', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const search = req.query.search || "";
  const sort = req.query.sort || "id";
  const order = req.query.order === "desc" ? "DESC" : "ASC";
  const offset = (page - 1) * limit;

  const validSortFields = ["id", "titulo"];
  const sortField = validSortFields.includes(sort) ? sort : "id";

  const searchTerm = `%${search}%`;

  // 1. contar total
  const countQuery = `
    SELECT COUNT(*) as total
    FROM courses
    WHERE titulo LIKE ? OR descripcion LIKE ?
  `;

  db.get(countQuery, [searchTerm, searchTerm], (err, countResult) => {
    if (err) return res.status(500).json({ error: "Error al contar cursos" });

    const total = countResult.total;
    const totalPages = Math.ceil(total / limit);

    // 2. obtener datos
    const dataQuery = `
      SELECT * FROM courses
      WHERE titulo LIKE ? OR descripcion LIKE ?
      ORDER BY ${sortField} ${order}
      LIMIT ? OFFSET ?
    `;

    db.all(dataQuery, [searchTerm, searchTerm, limit, offset], (err, rows) => {
      if (err) return res.status(500).json({ error: "Error al obtener cursos" });

      res.json({
        page,
        limit,
        total,
        totalPages,
        data: rows
      });
    });
  });
});

// CREAR
router.post('/', adminMiddleware, (req, res) => {
  const { titulo, descripcion, imagen } = req.body;

  const error = validarCurso(titulo, descripcion);
  if (error) return res.status(400).json({ error });

  db.run(
    `INSERT INTO courses (titulo, descripcion, imagen) VALUES (?, ?, ?)`,
    [titulo, descripcion, imagen],
    function (err) {
      if (err) return res.status(500).json({ error: "Error al crear curso" });
      res.json({ mensaje: "Curso creado", id: this.lastID });
    }
  );
});

// EDITAR
router.put('/:id', adminMiddleware, (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion, imagen } = req.body;

  const error = validarCurso(titulo, descripcion);
  if (error) return res.status(400).json({ error });

  db.run(
    `UPDATE courses SET titulo = ?, descripcion = ?, imagen = ? WHERE id = ?`,
    [titulo, descripcion, imagen, id],
    function (err) {
      if (err) return res.status(500).json({ error: "Error al actualizar curso" });
      if (this.changes === 0) {
        return res.status(404).json({ error: "Curso no encontrado" });
      }
      res.json({ mensaje: "Curso actualizado" });
    }
  );
});

// ELIMINAR
router.delete('/:id', adminMiddleware, (req, res) => {
  const { id } = req.params;

  db.get(`SELECT * FROM courses WHERE id = ?`, [id], (err, row) => {
    if (err) return res.status(500).json({ error: "Error al buscar curso" });
    if (!row) return res.status(404).json({ error: "Curso no encontrado" });

    db.run(`DELETE FROM user_courses WHERE course_id = ?`, [id], (err) => {
      if (err) return res.status(500).json({ error: "Error al eliminar relaciones" });

      db.run(`DELETE FROM courses WHERE id = ?`, [id], (err) => {
        if (err) return res.status(500).json({ error: "Error al eliminar curso" });

        res.json({ mensaje: "Curso eliminado correctamente" });
      });
    });
  });
});

module.exports = router;