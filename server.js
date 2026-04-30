const express = require('express');
const session = require('express-session');
const app = express();

const cursosRoutes = require('./routes/cursos');
const chatRoutes = require('./routes/chat');
const usersRoutes = require('./routes/users');

// Middlewares
app.use(express.json());
app.use(express.static('.'));
app.use(express.static('public'));

// SESIONES
app.use(session({
  secret: 'secreto_super_seguro',
  resave: false,
  saveUninitialized: true
}));

// Rutas
app.use('/api/cursos', cursosRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/users', usersRoutes);

// Test
app.get('/api/test', (req, res) => {
  res.json({ mensaje: "Backend funcionando" });
});

// Servidor
app.listen(3000, () => {
  console.log("Servidor en http://localhost:3000");
});