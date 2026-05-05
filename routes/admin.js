const express = require('express');
const router = express.Router();
const db = require('../database');
const adminMiddleware = require('./middlewares/admin');

router.get('/stats', adminMiddleware, (req, res) => {

  const stats = {};

  db.get(`SELECT COUNT(*) as total FROM users`, [], (err, row) => {
    if (err) return res.status(500).json({ error: "Error usuarios" });

    stats.totalUsers = row.total;

    db.get(`SELECT COUNT(*) as total FROM courses`, [], (err, row) => {
      if (err) return res.status(500).json({ error: "Error cursos" });

      stats.totalCourses = row.total;

      db.get(`SELECT COUNT(*) as total FROM user_courses`, [], (err, row) => {
        if (err) return res.status(500).json({ error: "Error asignaciones" });

        stats.totalAssignments = row.total;

        res.json(stats);
      });
    });
  });

});

module.exports = router;