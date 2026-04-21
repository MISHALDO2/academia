const express = require('express');
const app = express();

app.use(express.json());

app.get('/api/test', (req, res) => {
  res.json({ mensaje: "Backend funcionando" });
});

app.listen(3000, () => {
  console.log("Servidor en http://localhost:3000");
});
app.get('/api/cursos', (req, res) => {
  res.json([
    { titulo: "Curso JS", progreso: 30 },
    { titulo: "Curso HTML", progreso: 80 },
    { titulo: "Curso CSS", progreso: 50 }
  ]);
});