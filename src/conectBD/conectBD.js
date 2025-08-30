// conectBD.js
const sqlite3 = require('sqlite3');
const path = require('path');

const db = new sqlite3.Database('src/data/data.db');

// Crear tabla si no existe
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS Users (
      user TEXT UNIQUE,
      password TEXT,
      name TEXT,
      lastName TEXT
    )
  `);
});

// Función de login usando promesas
function checkLogin(user, password) {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM Users WHERE user = ? AND password = ?`;
    db.get(query, [user, password], (err, row) => {
      if (err) reject(err);
      else resolve(row); // devuelve null si no existe
    });
  });
}

export default {
  checkLogin
};
