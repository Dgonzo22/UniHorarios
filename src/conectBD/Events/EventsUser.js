import { ipcMain } from "electron";
import conectBD from "../conectBD.js";

function createEvents() {
  /// LOGIN ///
  ipcMain.handle("checkLogin", async (event, user, password) => {
    try {
      const result = await conectBD.checkLogin(user, password);
      return result; // esto irá al renderer
    } catch (err) {
      console.error(err);
      return null;
    }
  });
  // ------------------- CRUD USUARIOS -------------------

  // Obtener todos los usuarios
  ipcMain.handle("getUsuarios", async () => {
    try {
      return await conectBD.getUsuarios();
    } catch (err) {
      console.error(err);
      return [];
    }
  });

  // Obtener un usuario por USER
  ipcMain.handle("getUsuarioByUser", async (event, user) => {
    try {
      return await conectBD.getUsuarioByUser(user);
    } catch (err) {
      console.error(err);
      return null;
    }
  });

  // Insertar nuevo usuario
  ipcMain.handle(
    "insertUsuario",
    async (event, USER, PASSWORD, NAME, LASTNAME) => {
      try {
      
        const result = await conectBD.insertUsuario(
          USER, PASSWORD, NAME, LASTNAME
        );
        return result;
      } catch (err) {
        console.error(err);
        return { error: err.message };
      }
    }
  );

  // Actualizar usuario existente
  ipcMain.handle(
    "updateUsuario",
    async (event, user, password, name, lastname) => {
      try {
        const result = await conectBD.updateUsuario(
          user,
          password,
          name,
          lastname
        );
        return result;
      } catch (err) {
        console.error(err);
        return { error: err.message };
      }
    }
  );

  // Eliminar usuario
  ipcMain.handle("deleteUsuario", async (event, user) => {
    try {
      const result = await conectBD.deleteUsuario(user);
      return result;
    } catch (err) {
      console.error(err);
      return { error: err.message };
    }
  });

}

export default { createEvents };
