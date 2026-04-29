const express = require('express');
const router = express.Router();
const db = require('../database');

// REGISTER
router.post('/register', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  const query = `INSERT INTO users (email, password, role) VALUES (?, ?, ?)`;

  db.run(query, [email, password, 'user'], function (err) {
    if (err) {
      return res.status(500).json({ error: "Error al registrar usuario" });
    }

    res.json({
      mensaje: "Usuario registrado",
      id: this.lastID,
      email,
      role: 'user'
    });
  });
});

// LOGIN
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = `SELECT * FROM users WHERE email = ? AND password = ?`;

  db.get(query, [email, password], (err, row) => {
    if (err) {
      return res.status(500).json({ error: "Error en login" });
    }

    if (!row) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    req.session.user = {
      id: row.id,
      email: row.email,
      role: row.role
    };

    res.json({
      mensaje: "Login correcto",
      usuario: req.session.user
    });
  });
});

// USUARIO ACTUAL
router.get('/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "No autenticado" });
  }

  res.json(req.session.user);
});

// LOGOUT
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ mensaje: "Logout correcto" });
  });
});

// ASIGNAR CURSO
router.post('/assign-course', (req, res) => {
  const { user_id, course_id } = req.body;

  if (!user_id || !course_id) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  const query = `
    INSERT INTO user_courses (user_id, course_id)
    VALUES (?, ?)
  `;

  db.run(query, [user_id, course_id], function (err) {
    if (err) {
      return res.status(500).json({ error: "Error al asignar curso" });
    }

    res.json({ mensaje: "Curso asignado correctamente" });
  });
});

// CURSOS DEL USUARIO (SESIÓN)
router.get('/my-courses', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "No autenticado" });
  }

  const userId = req.session.user.id;

  const query = `
    SELECT courses.*
    FROM courses
    JOIN user_courses 
      ON courses.id = user_courses.course_id
    WHERE user_courses.user_id = ?
  `;

  db.all(query, [userId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Error al obtener cursos" });
    }

    res.json(rows);
  });
});

module.exports = router;