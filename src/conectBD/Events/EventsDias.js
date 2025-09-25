import { ipcMain } from 'electron';
import conectBD from '../conectBD.js';
  
function createEvents(){
  ipcMain.handle("getDias", async (event) => {
    try {
      const result = await conectBD.getDias();
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  });
  
  ipcMain.handle("getDiasByHorario", async (event, idHorario) => {
    // Obtener todos los días por ID_HORARIO
    try {
      const result = await conectBD.getDiasByHorario(idHorario);
      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  });
  
  
  ipcMain.handle("insertDia", async (event, idHorario, dia) => {
    try {
      const result = await conectBD.insertDia(idHorario, dia);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  });
  
  ipcMain.handle("updateDia", async (event, idDia, idHorario, dia) => {
    try {
      const result = await conectBD.updateDia(idDia, idHorario, dia);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  });
  
  ipcMain.handle("deleteDia", async (event, idDia) => {
    try {
      const result = await conectBD.deleteDia(idDia);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  });
  
}

export default {createEvents};