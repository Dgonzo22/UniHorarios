const { defineConfig } = require("cypress");
const sqlite3 = require("sqlite3").verbose();

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",

    setupNodeEvents(on, config) {
      on("task", {
        resetDB() {
          const db = new sqlite3.Database("src/Data/data.db");

          return new Promise((resolve, reject) => {
            db.serialize(() => {
              db.run("DELETE FROM USUARIOS");
              db.run("DELETE FROM DOCENTES");
              db.run("DELETE FROM MATERIAS");
              db.run("DELETE FROM HORARIOS");
              db.run("DELETE FROM DIAS", (err) => {
                if (err) reject(err);
                else resolve(true);
              });
            });
          });
        }
      });

      return config;
    }
  }
});
