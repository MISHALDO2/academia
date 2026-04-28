const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error("Error al conectar con la base de datos", err);
  } else {
    console.log("Base de datos conectada");
  }
});

// TABLA USERS
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT,
    password TEXT,
    role TEXT DEFAULT 'user'
  )
`);

// TABLA COURSES
db.run(`
  CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT,
    descripcion TEXT,
    imagen TEXT
  )
`);
db.run(`
  INSERT INTO courses (titulo, descripcion, imagen)
  SELECT 'Curso JavaScript', 'Aprende JavaScript desde cero', 'https://via.placeholder.com/150'
  WHERE NOT EXISTS (SELECT 1 FROM courses WHERE titulo = 'Curso JavaScript')
`);

db.run(`
  INSERT INTO courses (titulo, descripcion, imagen)
  SELECT 'Curso HTML', 'Domina HTML', 'https://via.placeholder.com/150'
  WHERE NOT EXISTS (SELECT 1 FROM courses WHERE titulo = 'Curso HTML')
`);

db.run(`
  INSERT INTO courses (titulo, descripcion, imagen)
  SELECT 'Curso CSS', 'Aprende CSS moderno', 'https://via.placeholder.com/150'
  WHERE NOT EXISTS (SELECT 1 FROM courses WHERE titulo = 'Curso CSS')
`);

db.run(`
  CREATE TABLE IF NOT EXISTS user_courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    course_id INTEGER
  )
`);
module.exports = db;