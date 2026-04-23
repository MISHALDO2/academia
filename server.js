const express = require('express');
const app = express();

// Permite usar JSON
app.use(express.json());

// Sirve el frontend desde /public
app.use(express.static('public'));

// Endpoint de prueba
app.get('/api/test', (req, res) => {
  res.json({ mensaje: "Backend funcionando" });
});

// Endpoint de cursos
app.get('/api/cursos', (req, res) => {
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

// Endpoint del chatbot
app.post('/api/chat', (req, res) => {
  const { mensaje } = req.body;

  res.json({
    respuesta: "Respuesta simulada del chatbot: " + mensaje
  });
});

// Arrancar servidor
app.listen(3000, () => {
  console.log("Servidor en http://localhost:3000");
});