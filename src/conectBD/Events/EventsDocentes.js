import { ipcMain } from 'electron';
import conectBD from '../conectBD.js';

function createEvents(){
  ipcMain.handle("getDocentes",async(event) => {
    try {
      const result = await conectBD.getDocentes();
      return result
    }catch(error){
      console.log(error);
      return null
    }
  })

  ipcMain.handle("getDocenteById", async (event, idDocente) => {
    try {
      const result = await conectBD.getDocenteById(idDocente);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  });

  ipcMain.handle("insertDocente",async(event, ID_IDENTIFICACION, NOMBRE, CORREO, TIPO_CONTRATO, PERFIL)=> {
    try {
      const result = await conectBD.insertDocente(ID_IDENTIFICACION, NOMBRE, CORREO, TIPO_CONTRATO, PERFIL);
      return result
    }catch(error){
      console.log(error);
      return null
    }
  })

  ipcMain.handle("deleteDocente", async(event, idDocente) => {
    try {
      const result = await conectBD.deleteDocente(idDocente)
    }catch(error){
      console.log(error);
      return null
    }
  })
  
  ipcMain.handle("updateDocente", async (event, IDDOCENTE, ID_IDENTIFICACION, NOMBRE, CORREO, TIPO_CONTRATO, PERFIL) => {
    try {
      const result = await conectBD.updateDocente(IDDOCENTE, ID_IDENTIFICACION, NOMBRE, CORREO, TIPO_CONTRATO, PERFIL);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  });
}


export default {createEvents};