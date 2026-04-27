const express = require('express');
const router = express.Router();
const db = require('../database');

// REGISTER
router.post('/register', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  if (password.length < 4) {
    return res.status(400).json({ error: "La contraseña es muy corta" });
  }

  const query = `INSERT INTO users (email, password) VALUES (?, ?)`;

  db.run(query, [email, password], function (err) {
    if (err) {
      return res.status(500).json({ error: "Error al registrar usuario" });
    }

    res.json({
      mensaje: "Usuario registrado correctamente",
      id: this.lastID,
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

module.exports = router;