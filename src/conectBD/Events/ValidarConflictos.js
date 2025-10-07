// src/conectBD/Events/ValidarConflictos.js
import { ipcMain } from 'electron';
import dbModule from '../conectBD.js';
const db = dbModule.db;   // 👈 obtienes la conexión real
/* ===========================
   Registrar eventos IPC
=========================== */
export function createEvents() {
  // Conflicto por docente
  ipcMain.handle("hayConflictoDocente", async (event, idDocente, dia, horaInicio, horaFinal, periodo) => {
    try {
      return await hayConflictoDocente(idDocente, dia, horaInicio, horaFinal, periodo);
    } catch (error) {
      console.error(error);
      return null;
    }
  });

  // Conflicto por materia
  ipcMain.handle("hayConflictoMateria", async (event, idMateria, dia, horaInicio, horaFinal, periodo) => {
    try {
      return await hayConflictoMateria(idMateria, dia, horaInicio, horaFinal, periodo);
    } catch (error) {
      console.error(error);
      return null;
    }
  });

  // Conflicto por semestre y grupo
  ipcMain.handle("hayConflictoSemestreGrupo", async (event, semestre, grupo, dia, horaInicio, horaFinal, periodo) => {
    try {
      return await hayConflictoSemestreGrupo(semestre, grupo, dia, horaInicio, horaFinal, periodo);
    } catch (error) {
      console.error(error);
      return null;
    }
  });

  // ✅ Nuevo handler para validar todo el horario
  ipcMain.handle("validarConflictosHorario", async (event, horario) => {
    try {
      return await validarConflictosHorario(horario);
    } catch (error) {
      console.error("Error en validarConflictosHorario:", error);
      throw error;
    }
  });
}

/* ===========================
   Funciones de validación SQL
=========================== */

// Verificar conflicto de docente
export function hayConflictoDocente(idDocente, dia, horaInicio, horaFinal, periodo) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * FROM HORARIOS
      WHERE ID_DOCENTE = ? AND DIA = ? AND PERIODO = ?
      AND (
        (HORAINICIO <= ? AND HORAFINAL > ?) OR 
        (HORAINICIO < ? AND HORAFINAL >= ?)
      )
    `;
    db.all(query, [idDocente, dia, periodo, horaInicio, horaInicio, horaFinal, horaFinal], (err, rows) => {
      if (err) reject(err);
      else resolve(rows.length > 0); // true si hay conflicto
    });
  });
}

// Verificar conflicto de materia
export function hayConflictoMateria(idMateria, dia, horaInicio, horaFinal, periodo) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * FROM HORARIOS
      WHERE ID_MATERIA = ? AND DIA = ? AND PERIODO = ?
      AND (
        (HORAINICIO <= ? AND HORAFINAL > ?) OR 
        (HORAINICIO < ? AND HORAFINAL >= ?)
      )
    `;
    db.all(query, [idMateria, dia, periodo, horaInicio, horaInicio, horaFinal, horaFinal], (err, rows) => {
      if (err) reject(err);
      else resolve(rows.length > 0);
    });
  });
}

// Verificar conflicto de semestre y grupo
export function hayConflictoSemestreGrupo(semestre, grupo, dia, horaInicio, horaFinal, periodo) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * FROM HORARIOS
      WHERE SEMESTRE = ? AND GRUPO = ? AND DIA = ? AND PERIODO = ?
      AND (
        (HORAINICIO <= ? AND HORAFINAL > ?) OR 
        (HORAINICIO < ? AND HORAFINAL >= ?)
      )
    `;
    db.all(query, [semestre, grupo, dia, periodo, horaInicio, horaInicio, horaFinal, horaFinal], (err, rows) => {
      if (err) reject(err);
      else resolve(rows.length > 0);
    });
  });
}

/* ===========================
   Función integral de validación
=========================== */
export async function validarConflictosHorario(horario) {
  const { idDocente, idMateria, semestre, grupo, dia, horaInicio, horaFinal, periodo } = horario;

  // Validar conflicto con docente
  const conflictoDocente = await hayConflictoDocente(idDocente, dia, horaInicio, horaFinal, periodo);
  if (conflictoDocente) {
    return { conflicto: true, tipo: "Docente", mensaje: "El docente ya tiene una clase en este horario." };
  }

  // Validar conflicto con materia
  const conflictoMateria = await hayConflictoMateria(idMateria, dia, horaInicio, horaFinal, periodo);
  if (conflictoMateria) {
    return { conflicto: true, tipo: "Materia", mensaje: "La materia ya está asignada en este horario." };
  }

  // Validar conflicto con semestre y grupo
  const conflictoSemestreGrupo = await hayConflictoSemestreGrupo(semestre, grupo, dia, horaInicio, horaFinal, periodo);
  if (conflictoSemestreGrupo) {
    return { conflicto: true, tipo: "Semestre/Grupo", mensaje: "Ya existe una clase para este semestre y grupo en este horario." };
  }

  // Sin conflictos
  return { conflicto: false, mensaje: "No se detectaron conflictos ✅" };
}
