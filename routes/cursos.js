const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json([
    {
      id: 1,
      titulo: "Curso JavaScript",
      progreso: 30,
      descripcion: "Aprende JavaScript desde cero",
      imagen: "https://via.placeholder.com/150"
    },
    {
      id: 2,
      titulo: "Curso HTML",
      progreso: 80,
      descripcion: "Domina HTML",
      imagen: "https://via.placeholder.com/150"
    },
    {
      id: 3,
      titulo: "Curso CSS",
      progreso: 50,
      descripcion: "Aprende CSS moderno",
      imagen: "https://via.placeholder.com/150"
    },
    {
      id: 99,
      titulo: "CURSO NUEVO PRUEBA",
      progreso: 10,
      descripcion: "test",
      imagen: "https://via.placeholder.com/150"
    }
  ]);
});

module.exports = router;