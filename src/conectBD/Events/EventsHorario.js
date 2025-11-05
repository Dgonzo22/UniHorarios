import { ipcMain } from 'electron';
import conectBD from '../conectBD.js';

function createEvents(){
  ipcMain.handle("getHorarios", async (event) => {
    try {
      const result = await conectBD.getHorarios();
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  });
  ipcMain.handle("getHorarioById", async (event, idHorario) => {
    try {
      const result = await conectBD.getHorarioById(idHorario);
      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  });

  ipcMain.handle("getHorarioFilter", async (event, CHECKSEMESTRE,SEMESTRE,CHECKGRUPO, GRUPO, CHECKPERIODO, PERIODO, CHECKDOCENTE, ID_DOCENTE, CHECKMATERIA, ID_MATERIA) => {
    try {
      const result = await conectBD.getHorarioFilter(CHECKSEMESTRE,SEMESTRE,CHECKGRUPO, GRUPO, CHECKPERIODO, PERIODO, CHECKDOCENTE, ID_DOCENTE, CHECKMATERIA, ID_MATERIA);
      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  })
  
  ipcMain.handle("getHorariosJoinsMateriasDocentes", async (event) => {
    try {
      const result = await conectBD.getHorarios();
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  });

  ipcMain.handle('getHorariosConDias', async () => {
    try {
      const horarios = await conectBD.getHorarios(); // usa conectBD, no db
      const horariosConDias = [];
  
      for (const h of horarios) {
        const dias = await conectBD.getDiasByHorario(h.ID_HORARIO); // igual, conectBD
        horariosConDias.push({
          ...h,
          dias: dias.map(d => d.DIA)
        });
      }
  
      return horariosConDias;
    } catch (err) {
      console.error(err);
      throw err;
    }
  });


  
  
  ipcMain.handle("insertHorario", async (event, semestre, grupo, horaInicio, horaFinal, periodo, dia, idDocente, idMateria) => {
    try {
      const result = await conectBD.insertHorario(semestre, grupo, horaInicio, horaFinal, periodo, dia, idDocente, idMateria);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  });
  
  ipcMain.handle("updateHorario", async (event, idHorario, semestre, grupo, horaInicio, horaFinal, periodo, dia, anio, user, idDocente, idMateria) => {
    try {
      const result = await conectBD.updateHorario(idHorario, semestre, grupo, horaInicio, horaFinal, periodo,dia, anio, user, idDocente, idMateria);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  });
  
  ipcMain.handle("deleteHorario", async (event, idHorario) => {
    try {
      const result = await conectBD.deleteHorario(idHorario);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  });
}

export default {createEvents};