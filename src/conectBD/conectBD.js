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
        NOMBRE TEXT NOT NULL,
        CORREO TEXT NOT NULL UNIQUE,
        CELULAR TEXT,
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
        HORAINICIO TEXT NOT NULL,
        HORAFINAL TEXT NOT NULL,
        PERIODO TEXT NOT NULL,
        ANIO INTEGER NOT NULL,

        -- Claves foráneas
        USER TEXT NOT NULL,
        ID_DOCENTE INTEGER NOT NULL,
        ID_MATERIA INTEGER NOT NULL,

        FOREIGN KEY (USER) REFERENCES USUARIO(USER),
        FOREIGN KEY (ID_DOCENTE) REFERENCES DOCENTES(ID_DOCENTE),
        FOREIGN KEY (ID_MATERIA) REFERENCES MATERIA(ID_MATERIA)
    );
  `);
});


// Función de login
function checkLogin(user, password) {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM USUARIOS WHERE USER = ? AND PASSWORD = ?`;
    db.get(query, [user, password], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

/////////////////////////////////////////// Materias
function getMaterias() {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM MATERIAS';
    db.all(query, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
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

function deleteMateria(idMateria) {
  return new Promise((resolve, reject) => {
    const query = "DELETE FROM MATERIAS WHERE ID_MATERIA = ?";
    db.run(query, [idMateria], function (err) {
      if (err) reject(err);
      else resolve({ changes: this.changes });
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
/////////////////////////////////////////// Docentes
function getDocentes() {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM DOCENTES';
    db.all(query, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function insertDocente(nombre, correo, celular, perfil) {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO DOCENTES(NOMBRE, CORREO, CELULAR, PERFIL) VALUES (?,?,?,?)';
    db.run(query, [nombre, correo, celular, perfil], function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID });
    });
  });
}

function updateDocente(idDocente, nombre, correo, celular, perfil) {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE DOCENTES 
      SET NOMBRE = ?, CORREO = ?, CELULAR = ?, PERFIL = ? 
      WHERE ID_DOCENTE = ?
    `;
    db.run(query, [nombre, correo, celular, perfil, idDocente], function (err) {
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
/////////////////////////////////////////// Horarios
function getHorarios() {
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT H.ID_HORARIO, H.SEMESTRE, H.GRUPO, H.HORAINICIO, H.HORAFINAL, H.PERIODO, H.ANIO,
             D.DIA, M.NOMBRE AS NOMBRE_MATERIA, DOC.NOMBRE AS NOMBRE_DOCENTE
      FROM HORARIOS H
      LEFT JOIN MATERIAS M ON H.ID_MATERIA = M.ID_MATERIA
      LEFT JOIN DOCENTES DOC ON H.ID_DOCENTE = DOC.ID_DOCENTE
      LEFT JOIN DIAS D ON H.ID_HORARIO = D.ID_HORARIO
    `, [], (err, rows) => {
      if(err) reject(err);
      else resolve(rows);
    });
  });
}

function insertHorario(semestre, grupo, horaInicio, horaFinal, periodo, anio, user, idDocente, idMateria) {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO HORARIOS(SEMESTRE, GRUPO, HORAINICIO, HORAFINAL, PERIODO, ANIO, USER, ID_DOCENTE, ID_MATERIA)
      VALUES (?,?,?,?,?,?,?,?,?)
    `;
    db.run(query, [semestre, grupo, horaInicio, horaFinal, periodo, anio, user, idDocente, idMateria], function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID });
    });
  });
}

function updateHorario(idHorario, semestre, grupo, horaInicio, horaFinal, periodo, anio, user, idDocente, idMateria) {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE HORARIOS
      SET SEMESTRE = ?, GRUPO = ?, HORAINICIO = ?, HORAFINAL = ?, PERIODO = ?, ANIO = ?, USER = ?, ID_DOCENTE = ?, ID_MATERIA = ?
      WHERE ID_HORARIO = ?
    `;
    db.run(query, [semestre, grupo, horaInicio, horaFinal, periodo, anio, user, idDocente, idMateria, idHorario], function (err) {
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

/////////////////////////////////////////// Dias
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
  // Obtener todos los días por ID_HORARIO
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
  checkLogin,
  getMaterias,
  insertMateria,
  updateMateria,
  deleteMateria,
  getDocentes,
  insertDocente,
  updateDocente,
  deleteDocente,
  getHorarios,
  insertHorario,
  updateHorario,
  deleteHorario,
  getDias,
  getDiasByHorario,
  insertDia,
  updateDia,
  deleteDia
};
