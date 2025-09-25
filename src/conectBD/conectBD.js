// conectBD.js
const sqlite3 = require('sqlite3');

const db = new sqlite3.Database('src/data/data.db');

// Crear tabla si no existe
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS USUARIOS (
      USER TEXT PRIMARY KEY,
      PASSWORD TEXT NOT NULL,
      NAME TEXT NOT NULL,
      LASTNAME TEXT NOT NULL
    );
  `);
});

db.run(`
  CREATE TABLE IF NOT EXISTS DOCENTES (
      ID_DOCENTE INTEGER PRIMARY KEY AUTOINCREMENT,
      ID_IDENTIFICACION INTEGER NOT NULL UNIQUE,
      NOMBRE TEXT NOT NULL,
      CORREO TEXT NOT NULL UNIQUE,
      PERFIL TEXT
  );
`);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS DIAS (
        ID_DIAS INTEGER PRIMARY KEY AUTOINCREMENT,
        ID_HORARIO INTEGER NOT NULL,
        DIA TEXT NOT NULL,
        FOREIGN KEY (ID_HORARIO) REFERENCES HORARIOS(ID_HORARIO)
    );
  `);
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS MATERIAS (
        ID_MATERIA INTEGER PRIMARY KEY AUTOINCREMENT,
        NOMBRE TEXT NOT NULL,
        NRC TEXT NOT NULL UNIQUE,
        CREDITOS INTEGER NOT NULL
    );
  `);
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS HORARIOS (
        ID_HORARIO INTEGER PRIMARY KEY AUTOINCREMENT,
        SEMESTRE TEXT NOT NULL,
        GRUPO TEXT NOT NULL,
        HORAINICIO VARCHAR(5) NOT NULL,
        HORAFINAL VARCHAR(5) NOT NULL,
        PERIODO TEXT NOT NULL,
        DIA TEXT,
        -- Claves foráneas
        ID_DOCENTE INTEGER NOT NULL,
        ID_MATERIA INTEGER NOT NULL,

        FOREIGN KEY (ID_DOCENTE) REFERENCES DOCENTES(ID_DOCENTE),
        FOREIGN KEY (ID_MATERIA) REFERENCES MATERIAS(ID_MATERIA)
    );
  `);
});

// ---------------- LOGIN ----------------
function checkLogin(user, password) {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM USUARIOS WHERE USER = ? AND PASSWORD = ?`;
    db.get(query, [user, password], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function getUsuarios() {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM USUARIOS';
    db.all(query, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function getUsuarioByUser(user) {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM USUARIOS WHERE USER = ?`;
    db.get(query, [user], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}
function insertUsuario(user, password, name, lastname) {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO USUARIOS (USER, PASSWORD, NAME, LASTNAME)
      VALUES (?, ?, ?, ?)
    `;
    db.run(query, [user, password, name, lastname], function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID });
    });
  });
}


// ---------------- MATERIAS ----------------
function getMaterias() {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM MATERIAS';
    db.all(query, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function getMateriaById(idMateria) {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM MATERIAS WHERE ID_MATERIA = ?";
    db.get(query, [idMateria], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}


function insertMateria(nombre, NRC, Creditos) {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO MATERIAS(NOMBRE, NRC, CREDITOS) VALUES (?,?,?)';
    db.run(query, [nombre, NRC, Creditos], function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID });
    });
  });
}

function updateMateria(ID_MATERIA, nombre, NRC, Creditos) {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE MATERIAS 
      SET NOMBRE = ?, NRC = ?, CREDITOS = ?
      WHERE ID_MATERIA = ?
    `;
    db.run(query, [nombre, NRC, Creditos, ID_MATERIA], function (err) {
      if (err) reject(err);
      else resolve({ changes: this.changes });
    });
  });
}

function deleteMateria(idMateria) {
  return new Promise((resolve, reject) => {
    const query = "DELETE FROM MATERIAS WHERE ID_MATERIA = ?";
    db.run(query, [idMateria], function (err) {
      if (err) reject(err);
      else resolve({ changes: this.changes });
    });
  });
}

// ---------------- DOCENTES ----------------
function getDocentes() {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM DOCENTES';
    db.all(query, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function getDocenteById(idDocente) {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM DOCENTES WHERE ID_DOCENTE = ?";
    db.get(query, [idDocente], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function insertDocente(ID_IDENTIFICACION, NOMBRE, CORREO, PERFIL) {
  return new Promise((resolve, reject) => {

    const query = 'INSERT INTO DOCENTES(ID_IDENTIFICACION, NOMBRE, CORREO, PERFIL) VALUES (?,?,?,?)';
    db.run(query, [ID_IDENTIFICACION, NOMBRE, CORREO, PERFIL], function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID });
    });
  });
}

function updateDocente(IDDOCENTE, ID_IDENTIFICACION, NOMBRE, CORREO, PERFIL) {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE DOCENTES 
      SET ID_IDENTIFICACION = ?, NOMBRE = ?, CORREO = ?, PERFIL = ? 
      WHERE ID_DOCENTE = ?
    `;
    db.run(query, [ID_IDENTIFICACION, NOMBRE, CORREO, PERFIL, IDDOCENTE], function (err) {
      if (err) reject(err);
      else resolve({ changes: this.changes });
    });
  });
}

function deleteDocente(idDocente) {
  return new Promise((resolve, reject) => {
    const query = "DELETE FROM DOCENTES WHERE ID_DOCENTE = ?";
    db.run(query, [idDocente], function (err) {
      if (err) reject(err);
      else resolve({ changes: this.changes });
    });
  });
}

// ---------------- HORARIOS ----------------
function getHorarios() {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        ID_HORARIO,
        SEMESTRE,
        GRUPO,
        HORAINICIO,
        HORAFINAL,
        PERIODO,
        DIA,
        ID_DOCENTE,
        ID_MATERIA
      FROM HORARIOS
    `;
    db.all(query, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function getHorarioById(idHorario) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        ID_HORARIO,
        SEMESTRE,
        GRUPO,
        HORAINICIO,
        HORAFINAL,
        PERIODO,
        DIA,
        ID_DOCENTE,
        ID_MATERIA
      FROM HORARIOS
      WHERE ID_HORARIO = ?
    `;
    db.get(query, [idHorario], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function insertHorario(semestre, grupo, horaInicio, horaFinal, periodo, dia, idDocente, idMateria) {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO HORARIOS(SEMESTRE, GRUPO, HORAINICIO, HORAFINAL, PERIODO, DIA, ID_DOCENTE, ID_MATERIA)
      VALUES (?,?,?,?,?,?,?,?)
    `;
    db.run(query, [semestre, grupo, horaInicio, horaFinal, periodo,dia, idDocente, idMateria], function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID });
    });
  });
}

function updateHorario(idHorario, semestre, grupo, horaInicio, horaFinal, periodo, dia, idDocente, idMateria) {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE HORARIOS
      SET SEMESTRE = ?, GRUPO = ?, HORAINICIO = ?, HORAFINAL = ?, PERIODO = ?, DIA = ?, ID_DOCENTE = ?, ID_MATERIA = ?
      WHERE ID_HORARIO = ?
    `;
    db.run(query, [semestre, grupo, horaInicio, horaFinal, periodo, dia, idDocente, idMateria, idHorario], function (err) {
      if (err) reject(err);
      else resolve({ changes: this.changes });
    });
  });
}

function deleteHorario(idHorario) {
  return new Promise((resolve, reject) => {
    const query = "DELETE FROM HORARIOS WHERE ID_HORARIO = ?";
    db.run(query, [idHorario], function (err) {
      if (err) reject(err);
      else resolve({ changes: this.changes });
    });
  });
}

// ---------------- DIAS ----------------
function getDias() {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM DIAS';
    db.all(query, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function getDiasByHorario(idHorario) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM DIAS WHERE ID_HORARIO = ?';
    db.all(query, [idHorario], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function insertDia(idHorario, dia) {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO DIAS(ID_HORARIO, DIA) VALUES (?, ?)';
    db.run(query, [idHorario, dia], function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID });
    });
  });
}

function updateDia(idDia, idHorario, dia) {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE DIAS
      SET ID_HORARIO = ?, DIA = ?
      WHERE ID_DIAS = ?
    `;
    db.run(query, [idHorario, dia, idDia], function (err) {
      if (err) reject(err);
      else resolve({ changes: this.changes });
    });
  });
}

function deleteDia(idDia) {
  return new Promise((resolve, reject) => {
    const query = "DELETE FROM DIAS WHERE ID_DIAS = ?";
    db.run(query, [idDia], function (err) {
      if (err) reject(err);
      else resolve({ changes: this.changes });
    });
  });
}

export default {
  //usuarios
  checkLogin,
  getUsuarios,
  getUsuarioByUser,
  insertUsuario,
  //materias
  getMaterias,
  getMateriaById,
  insertMateria,
  updateMateria,
  deleteMateria,
  //docentes
  getDocentes,
  getDocenteById,
  insertDocente,
  updateDocente,
  deleteDocente,
  //horarios
  getHorarios,
  getHorarioById,
  insertHorario,
  updateHorario,
  deleteHorario,
  //dias
  getDias,
  getDiasByHorario,
  insertDia,
  updateDia,
  deleteDia
};
