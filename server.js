const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = 3000;

// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'secreto',
  resave: false,
  saveUninitialized: true
}));

// SERVIR FRONTEND
app.use(express.static(path.join(__dirname, 'public')));

// ROUTES
const userRoutes = require('./routes/users');
const cursosRoutes = require('./routes/cursos');
const adminRoutes = require('./routes/admin');

app.use('/api/users', userRoutes);
app.use('/api/cursos', cursosRoutes);
app.use('/api/admin', adminRoutes);

// TEST
app.get('/api/test', (req, res) => {
  res.json({ mensaje: "Servidor funcionando" });
});

// START
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});