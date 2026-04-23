const cursosRoutes = require('./routes/cursos');
const express = require('express');
const app = express();

// Permite usar JSON
app.use(express.json());

// Sirve el frontend desde /public
app.use(express.static('.'));
app.use('/api/cursos', cursosRoutes);

// Endpoint de prueba
app.get('/api/test', (req, res) => {
  res.json({ mensaje: "Backend funcionando" });
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