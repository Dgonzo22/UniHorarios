<template>
  <div class="horarios-app">
    <header class="header">
      <img src="https://www.obraenmadera.com/wp-content/uploads/2021/08/08-cliente-uniminuto.jpg" alt="Uniminuto Logo" class="logo"/>
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
            <option v-for="n in 10" :key="n" :value="n">Semestre {{ n }}</option>
          </select>

          <label>Grupo</label>
          <select v-model="grupo">
            <option v-for="g in grupos" :key="g" :value="g">{{ g }}</option>
          </select>
        </div>

        <div class="box">
          <h4>📖 Información de la Materia</h4>
          <label>Materia</label>
          <select v-model="materiaSeleccionada">
            <option v-for="m in materias" :key="m.ID_MATERIA" :value="m">{{ m.NOMBRE }}</option>
          </select>

          <label>Docente</label>
          <select v-model="docenteSeleccionado">
            <option v-for="d in docentes" :key="d.ID_DOCENTE" :value="d">{{ d.NOMBRE }}</option>
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

        <div class="box">
          <h4>📅 Vigencia del Horario</h4>
          <label>Fecha Inicio</label>
          <input type="date" v-model="fechaInicio" />
          <label>Fecha Fin</label>
          <input type="date" v-model="fechaFin" />
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
          <button class="cancelar" @click="resetFormulario">❌ Cancelar</button>
          <button class="validar" @click="validarHorario">✔️ Validar</button>
          <button class="guardar" @click="guardarHorario">💾 Guardar</button>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: "Horarios",
  data() {
    return {
      semestre: 1,
      grupo: "Grupo 101",
      grupos: ["Grupo 101", "Grupo 102"],
      materias: [],
      materiaSeleccionada: null,
      docentes: [],
      docenteSeleccionado: null,
      horaInicio: "08:00",
      horaFin: "10:00",
      diasSemana: ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"],
      diasSeleccionados: [],
      fechaInicio: "",
      fechaFin: ""
    };
  },
  async created() {
    await this.cargarMaterias();
    await this.cargarDocentes();
  },
  methods: {
    async cargarMaterias() {
      try {
        const result = await window.electronAPI.invoke("getMaterias");
        this.materias = result || [];
        this.materiaSeleccionada = this.materias[0] || null;
      } catch (err) {
        console.error("Error cargando materias:", err);
      }
    },
    async cargarDocentes() {
      try {
        const result = await window.electronAPI.invoke("getDocentes");
        this.docentes = result || [];
        this.docenteSeleccionado = this.docentes[0] || null;
      } catch (err) {
        console.error("Error cargando docentes:", err);
      }
    },
    validarHorario() {
      if(!this.materiaSeleccionada || !this.docenteSeleccionado || this.diasSeleccionados.length === 0){
        alert("Complete todos los campos antes de validar ⚠️");
        return;
      }
      alert("Validación correcta ✅");
    },
async guardarHorario() {
  try {
    if (!this.materiaSeleccionada || !this.docenteSeleccionado || this.diasSeleccionados.length === 0) {
      alert("Complete todos los campos antes de guardar ⚠️");
      return;
    }

    // Insertar horario
    const horarioId = await window.electronAPI.invoke(
      "insertHorario",
      this.semestre,
      this.grupo,
      this.horaInicio,
      this.horaFin,
      "Periodo 1", // ejemplo
      new Date().getFullYear(),
      "admin", // usuario logueado
      this.docenteSeleccionado.ID_DOCENTE,
      this.materiaSeleccionada.ID_MATERIA
    );

    // Insertar días asociados al horario
    for (const dia of this.diasSeleccionados) {
      await window.electronAPI.invoke("insertDia", horarioId.id, dia);
    }

    alert("Horario guardado 💾");
    this.resetFormulario();
  } catch (err) {
    console.error(err);
    alert("Error guardando horario ❌");
  }
},

    resetFormulario() {
      this.semestre = 1;
      this.grupo = this.grupos[0];
      this.materiaSeleccionada = this.materias[0] || null;
      this.docenteSeleccionado = this.docentes[0] || null;
      this.horaInicio = "08:00";
      this.horaFin = "10:00";
      this.diasSeleccionados = [];
      this.fechaInicio = "";
      this.fechaFin = "";
    }
  }
};
</script>


<style scoped>
/* === Estilos iguales a los que compartiste === */
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
.dias {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
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
.cancelar {
  background: #f87171;
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
</style>
