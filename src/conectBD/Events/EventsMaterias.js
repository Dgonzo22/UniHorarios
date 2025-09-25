import { ipcMain } from 'electron';
import conectBD from '../conectBD.js';

function createEvents(){
  ipcMain.handle("getMaterias",async(event) => {
    try {
      const result = await conectBD.getMaterias();
      return result
    }catch(error){
      console.log(error);
      return null
    }
  })

   ipcMain.handle("getMateriaById", async (event, idMateria) => {
    try {
      const result = await conectBD.getMateriaById(idMateria);
      return result;
    } catch (error) {
      console.error("Error en getMateriaById:", error);
      return null;
    }
  });

  ipcMain.handle("insertMateria",async(event, nombre,NRC,creditos)=> {
    try {
      const result = await conectBD.insertMateria(nombre,NRC,creditos);
      return result
    }catch(error){
      console.log(error);
      return null
    }
  });

  ipcMain.handle("deleteMateria", async(event, idMateria) => {
    try {
      const result = await conectBD.deleteMateria(idMateria)
    }catch(error){
      console.log(error);
      return null
    }
  })

  ipcMain.handle("updateMateria", async (event, idMateria, nombre, NRC, creditos) => {
    try {
      const result = await conectBD.updateMateria(idMateria, nombre, NRC, creditos);
      return result;
    } catch (error) {
      console.error("Error en updateMateria:", error);
      return null;
    }
  });
  
}

export default {createEvents};