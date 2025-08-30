const sqlite3 = require('sqlite3');
const path = require('path');


const db = new sqlite3.Database('src/data/data.db');

// create a table and insert a row
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

function checkLogin(user, password) {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM Users WHERE user = ? AND password = ?`;
    db.get(query, [user, password], (err, row) => {
      if (err) reject(err);
      else resolve(row); // row será null si no encuentra usuario
    });
  });
}

export default {
  checkLogin
}