import { ipcMain } from 'electron';
import conectBD from '../conectBD.js';

function createEvents(){
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

  /// crear usuarios defecto 
  let listaUser = [
    {
      USER: "Admin",
      PASSWORD: "123",
      NAME: "Admin",
      LASTNAME: "Admin"
    }
  ];

  listaUser.forEach(async (u) => {
    try {
      const existingUser = await conectBD.getUsuarioByUser(u.USER);

      if (!existingUser) {
        await conectBD.insertUsuario(u.USER, u.PASSWORD, u.NAME, u.LASTNAME);
      } 
      
    } catch (err) {
      console.error(err);
    }
  });

}






export default {createEvents};