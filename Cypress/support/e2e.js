// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
// Mockear electronAPI cuando NO existe (modo Cypress)
Cypress.on("window:before:load", (win) => {
  if (!win.electronAPI) {
    win.electronAPI = {
      invoke: (channel, ...args) => {
        console.log("MOCK electronAPI.invoke", channel, args);

        const mockDB = {
          getDocentes: [],
          getMaterias: []
        };

        // Retornos falsos seguros
        return Promise.resolve(mockDB[channel] || []);
      },
    };
  }
});
// ------------------------------
// 🟩 BASE DE DATOS FALSA GLOBAL
// ------------------------------
let fakeDB = {
  usuarios: [],
  docentes: [],
  materias: [],
  horarios: []
};

Cypress.on("window:before:load", (win) => {
  win.window.electronAPI = {
    invoke: (channel, ...args) => {
      return new Promise((resolve) => {
        switch (channel) {

          // -------------------------
          // USUARIOS
          // -------------------------
          case "insertUsuario":
            fakeDB.usuarios.push({
              ID: Date.now(),
              NOMBRE: args[0],
              APELLIDO: args[1],
              USERNAME: args[2],
              PASSWORD: args[3],
            });
            return resolve(true);

          case "loginUsuario":
            const user = fakeDB.usuarios.find(
              u => u.USERNAME === args[0] && u.PASSWORD === args[1]
            );
            return resolve(user ? true : false);


          // -------------------------
          // DOCENTES CRUD COMPLETO
          // -------------------------
          case "getDocentes":
            return resolve(fakeDB.docentes);

          case "insertDocente":
            fakeDB.docentes.push({
              ID_DOCENTE: Date.now(),
              ID_IDENTIFICACION: args[0],
              NOMBRE: args[1],
              CORREO: args[2],
              TIPO_CONTRATO: args[3],
              PERFIL: args[4]
            });
            return resolve(true);

          case "updateDocente":
            fakeDB.docentes = fakeDB.docentes.map(d =>
              d.ID_DOCENTE === args[0]
                ? {
                    ...d,
                    ID_IDENTIFICACION: args[1],
                    NOMBRE: args[2],
                    CORREO: args[3],
                    TIPO_CONTRATO: args[4],
                    PERFIL: args[5]
                  }
                : d
            );
            return resolve(true);

          case "deleteDocente":
            fakeDB.docentes = fakeDB.docentes.filter(
              d => d.ID_DOCENTE !== args[0]
            );
            return resolve(true);


          // -------------------------
          // MATERIAS CRUD COMPLETO
          // -------------------------
          case "getMaterias":
            return resolve(fakeDB.materias);

          case "insertMateria":
            fakeDB.materias.push({
              ID_MATERIA: Date.now(),
              NOMBRE: args[0],
              GRUPO: args[1],
              CREDITOS: args[2]
            });
            return resolve(true);


          // -------------------------
          // HORARIOS
          // -------------------------
          case "getHorarios":
            return resolve(fakeDB.horarios);

          case "insertHorario":
            fakeDB.horarios.push({
              ID: Date.now(),
              MATERIA: args[0],
              DOCENTE: args[1],
              DIA: args[2],
              INICIO: args[3],
              FIN: args[4]
            });
            return resolve(true);

          default:
            return resolve(true);
        }
      });
    }
  };
});
