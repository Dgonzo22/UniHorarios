<template>
  <div class="horarios-container">
    <section class="panel">

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
          <option v-for='g in ["A","B", "C","D","E"]' :key="'grupo ' + g" :value="'grupo ' + g">{{ "grupo " + g }}</option>
        </select>

        
        <label>periodo</label>
        <input type="text" v-model="periodo" />
      </div>

      <div class="box">
        <h4>📖 Información de la Materia</h4>
        <label>Materia</label>
        <select v-model="materiaSeleccionada">
          <option disabled value="">Seleccionar</option>
          <option v-for="m in materias" :key="m.ID_MATERIA" :value="m">{{ m.NOMBRE }}</option>
        </select>

        <label>Docente</label>
        <select v-model="docenteSeleccionado">
          <option disabled value="">Seleccionar</option>
          <option v-for="docente in docentes" 
            :key="docente.ID_DOCENTE" 
            :value="docente">{{ docente.NOMBRE }}</option>
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
          <option v-for="dia in diasSemana" :key="dia" :value="dia">{{ dia }}</option>
        </select>
      </div>

    </section>
    <section>

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
export default {
  name: "ComFormHorario",
  props: {
    id_Horario: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      grupo: "",
      semestre: "",
      grupos: ["Grupo A", "Grupo B"],
      materias: [],
      materiaSeleccionada: "",
      docentes: [],
      docenteSeleccionado: "",
      horaInicio: "",
      horaFin: "",
      periodo: "",
      dia: "",
      diasSemana: ["Lunes","Martes","Miércoles","Jueves","Viernes"],
      diasSeleccionados: [],
      fechaInicio: "",
      fechaFin: "",
      //alerta mensaje
      openAlertaMensaje: false,
      mensajeAlerta: "",
      tipoAlerta: "",
    };
  },
  async mounted() {
    let registroHorario = await window.electronAPI.invoke("getHorarioById", this.id_Horario);

    await this.cargarMaterias();
    await this.cargarDocentes();
    
    this.grupo = registroHorario.GRUPO;
    this.semestre = registroHorario.SEMESTRE;
    this.horaInicio = registroHorario.HORAINICIO?.slice(0,5) || "";
    this.horaFin = registroHorario.HORAFINAL?.slice(0,5) || "";

    this.periodo = registroHorario.PERIODO;
    this.diasSeleccionados = [registroHorario.DIA];

    this.materiaSeleccionada = this.materias.find(m => m.ID_MATERIA === registroHorario.ID_MATERIA) || "";
    this.docenteSeleccionado = this.docentes.find(d => d.ID_DOCENTE === registroHorario.ID_DOCENTE) || "";

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
    validarHorario() {
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
      if(!this.materiaSeleccionada || !this.docenteSeleccionado || this.diasSeleccionados.length === 0){
        this.mostrarAlerta("error","Complete todos los campos antes de validar ⚠️");
        return;
      }
      this.mostrarAlerta("exito","Validación correcta ✅");
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
        // la resta entre la hora final e inicio no sea menor a 45 minutos
        if (this.horaFin - this.horaInicio < "00:45") {
          this.mostrarAlerta("error","⚠️ La diferencia entre la hora de inicio y fin debe ser al menos de 45 minutos.");
          return;
        }
        // la resta entre la hora final e inicio no puede ser superior a 45 minutos * 3 veces 
        if (this.horaFin - this.horaFin > "02:15") {
          this.mostrarAlerta("error","⚠️ La diferencia entre la hora de inicio y fin no puede ser superior a 3 credidos correspondientes a 2:15 horas.");
          eturn;
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

        if (!this.materiaSeleccionada || !this.docenteSeleccionado || this.diasSeleccionados.length === 0) {
          this.mostrarAlerta("error","Complete todos los campos antes de guardar ⚠️");
          return;
        }

        const horariosExistentes = await window.electronAPI.invoke("getHorarios");
        ///validacion de conflictos
        for (const dia of this.diasSeleccionados) {
          const conflicto = horariosExistentes.find(h =>
            h.ID_HORARIO !== this.id_Horario && // excluir validacion del mismo horario
            h.GRUPO === this.grupo &&          
            h.DIA === dia &&                   
            !(
              this.horaFin <= h.HORA_INICIO || 
              this.horaInicio >= h.HORA_FINAL  
            )
          );

          if (conflicto) {
            this.mostrarAlerta("error",`⚠️ Conflicto detectado: ya existe una clase el ${dia} de ${conflicto.HORA_INICIO} a ${conflicto.HORA_FINAL}`);
            return; 
          }
        }

        const horarioGuardado = await window.electronAPI.invoke(
          "updateHorario",
          this.id_Horario,
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
          await window.electronAPI.invoke("insertDia", horarioGuardado.id_Horario, dia);
        }

        this.$emit("horarioModificado");
      } catch (err) {
        console.error(err);
        this.mostrarAlerta("error","Error guardando horario ❌");
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
      this.fechaInicio = "";
      this.fechaFin = "";
    }
  }
};
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  gap: 10px;
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
  background: #003366;
  display: flex;
  border-radius: 8px;
  gap: 20px;
  height: auto;
  padding: 10px;
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
  padding: 10px;
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
  color: black;
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
