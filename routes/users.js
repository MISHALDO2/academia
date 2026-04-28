const express = require('express');
const router = express.Router();
const db = require('../database');

// REGISTER
router.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Faltan datos (nombre, email o contraseña)" });
  }

  if (password.length < 4) {
    return res.status(400).json({ error: "La contraseña es muy corta" });
  }
  const query = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;

  db.run(query, [name, email, password], function (err) {
    if (err) {
      if (err.message.includes("UNIQUE constraint failed")) {
        return res.status(400).json({ error: "El email ya está registrado" });
      }
      return res.status(500).json({ error: "Error al registrar usuario" });
    }

    res.json({
      mensaje: "Usuario registrado correctamente",
      id: this.lastID,
      nombre: name,
      email
    });
  });
});

// LOGIN CON SESIÓN
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  const query = `SELECT * FROM users WHERE email = ? AND password = ?`;

  db.get(query, [email, password], (err, row) => {
    if (err) {
      return res.status(500).json({ error: "Error en login" });
    }

    if (!row) {
      return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
    }

    //  GUARDAMOS SESIÓN
    req.session.user = {
      id: row.id,
      email: row.email
    };

    res.json({
      mensaje: "Login correcto",
      usuario: req.session.user
    });
  });
});

//  VER USUARIO ACTUAL
router.get('/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "No autenticado" });
  }

  res.json({
    usuario: req.session.user
  });
});

//  LOGOUT
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ mensaje: "Logout correcto" });
  });
});
// ASIGNAR CURSO A USUARIO
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

    res.json({
      mensaje: "Curso asignado correctamente"
    });
  });
});
// OBTENER CURSOS DE UN USUARIO
router.get('/my-courses/:userId', (req, res) => {
  const { userId } = req.params;

  const query = `
    SELECT courses.*
    FROM courses
    JOIN user_courses 
      ON courses.id = user_courses.course_id
    WHERE user_courses.user_id = ?
  `;

  db.all(query, [userId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Error al obtener cursos del usuario" });
    }

    res.json(rows);
  });
});

module.exports = router;