const express = require('express');
const router = express.Router();
const db = require('../database');

// REGISTER
router.post('/register', (req, res) => {
  const { email, password } = req.body;

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

// LOGIN
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = `SELECT * FROM users WHERE email = ? AND password = ?`;

  db.get(query, [email, password], (err, row) => {
    if (err) {
      return res.status(500).json({ error: "Error en login" });
    }

    if (!row) {
      return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
    }

    res.json({
      mensaje: "Login correcto",
      usuario: {
        id: row.id,
        email: row.email
      }
    });
  });
});

module.exports = router;