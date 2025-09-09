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
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS Materias (
      idMateria INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      NRC INTEGER,
      Creditos TEXT
    )
  `);
});
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS docentes (
      idDocente INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      correo TEXT NOT NULL,
      celular TEXT NOT NULL,
      perfil TEXT NOT NULL
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

/////////////////////////////////////////// Materias
function getMaterias() {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM Materias';
    db.all(query, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function insertMateria(nombre, NRC, Creditos) {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO Materias(nombre, NRC, Creditos) VALUES (?,?,?)';
    db.run(query, [nombre, NRC, Creditos], function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID });
    });
  });
}
function deleteMateria(idMateria){
  return new Promise((resolve, reject)=> {
    const query = "DELETE FROM Materias WHERE Materias.idMateria = ?"
    db.run(query, [idMateria], function (err){
      if (err){
        reject(err)
      }else{
        resolve({ changes: this.changes }); 
      }
    })

  })
}

/////////////////////////////////////////// Docentes
function getDocentes() {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM docentes';
    db.all(query, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function insertDocente(nombre, correo, celular, perfil) {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO docentes(nombre, correo, celular, perfil) VALUES (?,?,?,?)';
    db.run(query, [nombre, correo, celular, perfil], function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID });
    });
  });
}

function updateDocente(id, nombre, correo, celular, perfil) {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE docentes 
      SET nombre = ?, correo = ?, celular = ?, perfil = ? 
      WHERE id = ?
    `;
    db.run(query, [nombre, correo, celular, perfil, id], function (err) {
      if (err) reject(err);
      else resolve({ changes: this.changes }); // número de filas modificadas
    });
  });
}

function deleteDocente(idDocente){
  return new Promise((resolve, reject)=> {
    const query = "DELETE FROM docentes WHERE docentes.idDocente = ?"
    db.run(query, [idDocente], function (err){
        if (err){
        reject(err)
      }else{
        resolve({ changes: this.changes }); 
      }
         })
  })
}




export default {
  checkLogin,
  getMaterias,
  insertMateria,
  deleteMateria,
  getDocentes,
  insertDocente,
  updateDocente,
  deleteDocente
};
