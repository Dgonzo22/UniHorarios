<template>
  <div class="horarios-app">
    <header class="header">
      <img
        src="https://www.obraenmadera.com/wp-content/uploads/2021/08/08-cliente-uniminuto.jpg"
        alt="Uniminuto Logo"
        class="logo"
      />
      <div class="titulo">
        <h1>Corporación Universitaria Minuto de Dios</h1>
        <h2>Gestión de Horarios - Ingeniería de Sistemas</h2>
      </div>
    </header>

    <div class="horarios-container">
      <!-- Panel Izquierdo -->
      <section class="panel">
        <h3>Nuevo Horario</h3>

        <div class="box">
          <h4>📘 Información Básica</h4>
          <label>Semestre</label>
          <select v-model="semestre">
            <option disabled value="">Seleccionar</option>
            <option v-for="n in 10" :key="n" :value="n">Semestre {{ n }}</option>
          </select>

          <label>Grupo</label>
          <select v-model="grupo">
            <option disabled value="">Seleccionar</option>
            <option
              v-for='g in ["A","B","C","D","E"]'
              :key="'grupo ' + g"
              :value="'grupo ' + g"
            >
              {{ "grupo " + g }}
            </option>
          </select>

          <label>Periodo</label>
          <input type="text" v-model="periodo" />
        </div>

        <div class="box">
          <h4>📖 Información de la Materia</h4>
          <label>Materia</label>
          <select v-model="materiaSeleccionada">
            <option disabled value="">Seleccionar</option>
            <option
              v-for="m in materias"
              :key="m.ID_MATERIA"
              :value="m"
            >
              {{ m.NOMBRE }} - NRC: {{  m.NRC }}
            </option>
          </select>

          <label>Docente</label>
          <select v-model="docenteSeleccionado">
            <option disabled value="">Seleccionar</option>
            <option
              v-for="docente in docentes"
              :key="docente.ID_DOCENTE"
              :value="docente"
            >
              {{ docente.NOMBRE }}
            </option>
          </select>
        </div>
      </section>

      <!-- Panel Derecho -->
      <section class="panel">
        <h3>Configuración de Horario</h3>

        <div class="box">
          <h4>⏰ Horas y Días</h4>

          <label>Hora Inicio</label>
          <input type="time" v-model="horaInicio" />

          <label>Hora Fin</label>
          <input type="time" v-model="horaFin" />

          <label>Días de la Semana</label>
          <select v-model="diasSeleccionados" multiple>
            <option v-for="dia in diasSemana" :key="dia" :value="dia">
              {{ dia }}
            </option>
          </select>
        </div>

        <div class="box vista-previa">
          <h4>Vista Previa de la Clase</h4>
          <p><strong>Materia:</strong> {{ materiaSeleccionada?.NOMBRE || '' }}</p>
          <p><strong>Docente:</strong> {{ docenteSeleccionado?.NOMBRE || '' }}</p>
          <p><strong>Horario:</strong> {{ horaInicio }} - {{ horaFin }}</p>
          <p><strong>Días:</strong> {{ diasSeleccionados.join(', ') }}</p>
          <p><strong>Grupo:</strong> {{ grupo }}</p>
          <p><strong>Semestre:</strong> {{ semestre }}</p>
        </div>

        <div class="acciones">
          <button class="restablecer" @click="resetFormulario">🔄 Restablecer</button>
          <button class="validar" @click="validarHorario">✔️ Validar</button>
          <button class="guardar" @click="guardarHorario">💾 Guardar</button>
        </div>
      </section>
    </div>
    <!-- Alerta de mensajes-->
    <ComDialog
      title=""
      class="modal"
      :visible="openAlertaMensaje"
      @closeDialog="openAlertaMensaje = false"
    >
      <template v-if="tipoAlerta=='error'">
        <div class="error">
          {{ mensajeAlerta  }}
        </div>
      </template>
      <template v-else-if="tipoAlerta == 'exito'"> 
        <div class="exito">
          {{ mensajeAlerta }}
        </div>
      </template>
    </ComDialog>
  </div>
</template>

<script>
import ComDialog from "../components/ComDialog.vue";

export default {
  components: { ComDialog },
  name: "Horarios",
  data() {
    return {
      semestre: "",
      grupo: "",
      materias: [],
      materiaSeleccionada: "",
      docentes: [],
      docenteSeleccionado: "",
      horaInicio: "",
      horaFin: "",
      periodo: "",
      diasSemana: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
      diasSeleccionados: [],
      //alerta
      openAlertaMensaje: false,
      mensajeAlerta: "",
      tipoAlerta: "",
    };
  },
  async created() {
    let semestre = "1";
    if (new Date().getMonth() + 1 >= 7) {
      semestre = "2";
    }
    this.periodo = new Date().getFullYear().toString() + "-" + semestre;

    await this.cargarMaterias();
    await this.cargarDocentes();
  },
  methods: {
    mostrarAlerta (tipo, mensaje) {
      this.tipoAlerta = tipo;
      this.mensajeAlerta = mensaje;
      this.openAlertaMensaje = true;
    },
    async cargarMaterias() {
      const result = await window.electronAPI.invoke("getMaterias");
      this.materias = result || [];
    },
    async cargarDocentes() {
      this.docentes = await window.electronAPI.invoke("getDocentes");
    },
    horaADate(horaStr) {
      // Separa el string "HH:MM" en horas y minutos
      const [horas, minutos] = horaStr.split(':').map(Number);
      
      // Crea un nuevo objeto Date con la fecha de hoy
      const fecha = new Date(); 
      
      // Establece la hora y los minutos
      fecha.setHours(horas, minutos, 0, 0); // (horas, minutos, segundos, milisegundos)
      
      return fecha;
    },
    async validarHorario() {
       // resta entre la hora final e inicio regresando un objeto Date
      let diferencia =new Date(this.horaADate(this.horaFin) - this.horaADate(this.horaInicio))
      // 1. Obtener la hora y minutos SIN ajuste de zona horaria (UTC)
      const horas = diferencia.getUTCHours();
      const minutos = diferencia.getUTCMinutes();

      // 2. Formatear la duración a HH:MM
      const duracionFormateada = 
        String(horas).padStart(2, '0') + ':' + 
        String(minutos).padStart(2, '0');

      // la resta entre la hora final e inicio no sea menor a 45 minutos
      if (duracionFormateada< "00:45") {
        this.mostrarAlerta("error","⚠️ La diferencia entre la hora de inicio y fin debe ser al menos de 45 minutos.");
        return;
      }
      // la resta entre la hora final e inicio no puede ser superior a 45 minutos * 3 veces 
      if (duracionFormateada > "02:15") {
        this.mostrarAlerta("error","⚠️ La diferencia entre la hora de inicio y fin no puede ser superior a 3 credidos correspondientes a 2:15 horas.");
        return;
      }

      // la hora de inicio no puede ser mayor a la hora final
      if (duracionFormateada < 0) {
        this.mostrarAlerta("error","⚠️ La hora de inicio no puede ser posterior a la hora final.");
        return;
      }
      // la hora de inicio no debe ser menor a 7:00 am ni mayor a 10:00 pm
      if (this.horaInicio < "07:00" || this.horaInicio > "22:00") {
        this.mostrarAlerta("error","⚠️ La hora de inicio debe estar entre 7:00 am y 10:00 pm.");
        return;
      }
      // la hora de fin no debe ser menor a 7:45 am ni mayor a 10:00 pm
      if (this.horaFin < "07:45" || this.horaFin > "22:00") {
        this.mostrarAlerta("error","⚠️ La hora de fin debe estar entre 7:45 am y 10:00 pm.");
        return;
      }

      if (
        !this.materiaSeleccionada ||
        !this.docenteSeleccionado ||
        this.diasSeleccionados.length === 0
      ) {
        this.mostrarAlerta("error","⚠️ Complete todos los campos antes de validar.");
        return;
      }

      for (const dia of this.diasSeleccionados) {
        const resultado = await window.electronAPI.invoke(
          "validarConflictosHorario",
          {
            idDocente: this.docenteSeleccionado.ID_DOCENTE,
            idMateria: this.materiaSeleccionada.ID_MATERIA,
            semestre: this.semestre,
            grupo: this.grupo,
            dia: dia,
            horaInicio: this.horaInicio,
            horaFinal: this.horaFin,
            periodo: this.periodo,
          }
        );

        if (resultado.conflicto) {
          this.mostrarAlerta("error",`⚠️ ${resultado.mensaje}`);
          return;
        }
      }
      this.mostrarAlerta("exito","✅ No se detectaron conflictos.");
    },

    async guardarHorario() {
      try {
        // resta entre la hora final e inicio regresando un objeto Date
        let diferencia =new Date(this.horaADate(this.horaFin) - this.horaADate(this.horaInicio))
        // 1. Obtener la hora y minutos SIN ajuste de zona horaria (UTC)
        const horas = diferencia.getUTCHours();
        const minutos = diferencia.getUTCMinutes();

        // 2. Formatear la duración a HH:MM
        const duracionFormateada = 
          String(horas).padStart(2, '0') + ':' + 
          String(minutos).padStart(2, '0');

        // la resta entre la hora final e inicio no sea menor a 45 minutos
        if (duracionFormateada< "00:45") {
          this.mostrarAlerta("error","⚠️ La diferencia entre la hora de inicio y fin debe ser al menos de 45 minutos.");
          return;
        }
        // la resta entre la hora final e inicio no puede ser superior a 45 minutos * 3 veces 
        if (duracionFormateada > "02:15") {
          this.mostrarAlerta("error","⚠️ La diferencia entre la hora de inicio y fin no puede ser superior a 3 credidos correspondientes a 2:15 horas.");
          return;
        }

        // la hora de inicio no puede ser mayor a la hora final
        if (duracionFormateada < 0) {
          this.mostrarAlerta("error","⚠️ La hora de inicio no puede ser posterior a la hora final.");
          return;
        }
        // la hora de inicio no debe ser menor a 7:00 am ni mayor a 10:00 pm
        if (this.horaInicio < "07:00" || this.horaInicio > "22:00") {
          this.mostrarAlerta("error","⚠️ La hora de inicio debe estar entre 7:00 am y 10:00 pm.");
          return;
        }
        // la hora de fin no debe ser menor a 7:45 am ni mayor a 10:00 pm
        if (this.horaFin < "07:45" || this.horaFin > "22:00") {
          this.mostrarAlerta("error","⚠️ La hora de fin debe estar entre 7:45 am y 10:00 pm.");
          return;
        }


        if (
          !this.materiaSeleccionada ||
          !this.docenteSeleccionado ||
          this.diasSeleccionados.length === 0
        ) {
          this.mostrarAlerta("error","⚠️ Complete todos los campos antes de guardar.");
          return;
        }

        // Validar conflictos antes de guardar
        for (const dia of this.diasSeleccionados) {
          const resultado = await window.electronAPI.invoke(
            "validarConflictosHorario",
            {
              idDocente: this.docenteSeleccionado.ID_DOCENTE,
              idMateria: this.materiaSeleccionada.ID_MATERIA,
              semestre: this.semestre,
              grupo: this.grupo,
              dia: dia,
              horaInicio: this.horaInicio,
              horaFinal: this.horaFin,
              periodo: this.periodo,
            }
          );

          if (resultado.conflicto) {
            this.mostrarAlerta("error",`⚠️ ${resultado.mensaje}`);
            return;
          }
        }

        // Guardar si no hay conflictos
        const horarioGuardado = await window.electronAPI.invoke(
          "insertHorario",
          this.semestre,
          this.grupo,
          this.horaInicio,
          this.horaFin,
          this.periodo,
          this.diasSeleccionados.join(", "),
          this.docenteSeleccionado.ID_DOCENTE,
          this.materiaSeleccionada.ID_MATERIA
        );

        for (const dia of this.diasSeleccionados) {
          await window.electronAPI.invoke("insertDia", horarioGuardado.id, dia);
        }
        this.mostrarAlerta("exito","💾 Horario guardado correctamente.");
      } catch (err) {
        console.error(err);
        this.mostrarAlerta("error","❌ Error guardando el horario.");
      }
    },

    resetFormulario() {
      this.semestre = "";
      this.grupo = "";
      this.materiaSeleccionada = "";
      this.docenteSeleccionado = "";
      this.horaInicio = "";
      this.horaFin = "";
      this.diasSeleccionados = [];
    },
  },
};
</script>

<style scoped>
/* --- Estilos idénticos al anterior --- */
.horarios-app {
  background: #003366;
  min-height: 100vh;
}
.header {
  display: flex;
  align-items: center;
  gap: 15px;
  background: #002244;
  color: #fff;
  padding: 12px 20px;
  border-bottom: 4px solid #facc15;
}
.logo {
  height: 50px;
}
.titulo {
  display: flex;
  flex-direction: column;
}
.header h1 {
  font-size: 1.4rem;
  font-weight: bold;
  margin: 0;
}
.header h2 {
  font-size: 1rem;
  font-weight: normal;
  margin: 0;
  color: #facc15;
}
.horarios-container {
  display: flex;
  gap: 20px;
  padding: 20px;
  color: #fff;
}
.panel {
  flex: 1;
  background: #f9fafb;
  color: #000;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
.box {
  background: white;
  padding: 12px;
  margin-bottom: 16px;
  border-radius: 6px;
  border: 1px solid #ddd;
}
label {
  display: block;
  font-weight: bold;
  margin-top: 8px;
}
input,
select {
  width: 100%;
  padding: 6px;
  margin-top: 4px;
  border-radius: 4px;
  border: 1px solid #ccc;
}
.vista-previa {
  background: #fffbea;
  border-left: 4px solid #facc15;
}
.acciones {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}
button {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.restablecer {
  background: #fbbf24;
  color: white;
}
.validar {
  background: #60a5fa;
  color: white;
}
.guardar {
  background: #34d399;
  color: white;
}

.exito, .error {
  padding: 15px;
  margin: 10px 0;
  border-radius: 8px;
  font-weight: bold;
  text-align: center;
  font-size: 1.1em;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  min-width: 400px;
}
.exito {
  background-color: #d4edda; /* Verde claro */
  color: #155724; /* Verde oscuro */
  border: 1px solid #c3e6cb;
}

.error {
  background-color: #f8d7da; /* Rojo claro/Rosado */
  color: #721c24; /* Rojo oscuro */
  border: 1px solid #f5c6cb;
}
</style>
