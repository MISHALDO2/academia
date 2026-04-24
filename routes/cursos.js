const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json([
    {
      id: 1,
      titulo: "Curso JavaScript",
      progreso: 30,
      descripcion: "Aprende JavaScript desde cero",
      imagen: "public/assets/img/JavaScript.png"
    },
    {
      id: 2,
      titulo: "Curso HTML",
      progreso: 80,
      descripcion: "Domina HTML",
      imagen: "public/assets/img/HTML.png"
    },
    {
      id: 3,
      titulo: "Curso CSS",
      progreso: 50,
      descripcion: "Aprende CSS moderno",
      imagen: "public/assets/img/CSS.png"
    },
    {
      id: 99,
      titulo: "CURSO NUEVO PRUEBA",
      progreso: 10,
      descripcion: "test",
      imagen: ""
    }
  ]);
});

module.exports = router;