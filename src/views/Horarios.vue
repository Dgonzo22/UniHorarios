<template>
  <div class="horarios-app">
    <!-- Encabezado -->
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

        <!-- Información Básica -->
        <div class="box">
          <h4>📘 Información Básica</h4>
          <label>Semestre</label>
          <select v-model="semestre">
            <option v-for="n in 10" :key="n" :value="n">Semestre {{ n }}</option>
          </select>

          <label>Grupo</label>
          <select v-model="grupo">
            <option v-for="(g, i) in grupos" :key="i" :value="g">{{ g }}</option>
          </select>
        </div>

        <!-- Información de la Materia -->
        <div class="box">
          <h4>📖 Información de la Materia</h4>
          <label>Materia</label>
          <select v-model="materia">
            <option v-for="(m, i) in materias" :key="i" :value="m">{{ m }}</option>
          </select>

          <label>Docente</label>
          <select v-model="docente">
            <option v-for="(d, i) in docentes" :key="i" :value="d">{{ d }}</option>
          </select>
        </div>
      </section>

      <!-- Panel Derecho -->
      <section class="panel">
        <h3>Configuración de Horario</h3>

        <!-- Horas y Días -->
        <div class="box">
          <h4>⏰ Horas y Días</h4>
          <label>Hora Inicio</label>
          <input type="time" v-model="horaInicio" />

          <label>Hora Fin</label>
          <input type="time" v-model="horaFin" />

          <label>Días de la Semana</label>
          <div class="dias">
            <label v-for="dia in diasSemana" :key="dia">
              <input type="checkbox" v-model="diasSeleccionados" :value="dia" />
              {{ dia }}
            </label>
          </div>
        </div>

        <!-- Vigencia -->
        <div class="box">
          <h4>📅 Vigencia del Horario</h4>
          <label>Fecha Inicio</label>
          <input type="date" v-model="fechaInicio" />

          <label>Fecha Fin</label>
          <input type="date" v-model="fechaFin" />
        </div>

        <!-- Vista Previa -->
        <div class="box vista-previa">
          <h4>Vista Previa de la Clase</h4>
          <p><strong>Materia:</strong> {{ materia }}</p>
          <p><strong>Docente:</strong> {{ docente }}</p>
          <p><strong>Horario:</strong> {{ horaInicio }} - {{ horaFin }}</p>
          <p><strong>Días:</strong> {{ diasSeleccionados.join(', ') }}</p>
          <p><strong>Grupo:</strong> {{ grupo }}</p>
          <p><strong>Semestre:</strong> {{ semestre }}</p>
        </div>

        <!-- Botones -->
        <div class="acciones">
          <button class="cancelar">❌ Cancelar</button>
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
      materias: ["Ingeniería de Software", "Bases de Datos"],
      materia: "Ingeniería de Software",
      docentes: ["Dr. Javier Ruiz", "Ing. María Torres"],
      docente: "Dr. Javier Ruiz",
      horaInicio: "07:00",
      horaFin: "08:30",
      diasSemana: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
      diasSeleccionados: [],
      fechaInicio: "",
      fechaFin: ""
    };
  },
  methods: {
    validarHorario() {
      alert("Validación correcta ✅");
    },
    guardarHorario() {
      alert("Horario guardado 💾");
    },
  }
};
</script>

<style scoped>
/* Fondo general azul */
.horarios-app {
  background: #003366; /* Azul Uniminuto */
  min-height: 100vh;
}

/* Encabezado */
.header {
  display: flex;
  align-items: center;
  gap: 15px;
  background: #002244; /* Azul más oscuro */
  color: #fff;
  padding: 12px 20px;
  border-bottom: 4px solid #facc15; /* Amarillo Uniminuto */
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
  color: #facc15; /* Amarillo institucional */
}

/* Contenedor de horarios */
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
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
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

input, select {
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
  border-left: 4px solid #facc15; /* Amarillo Uniminuto */
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

.grupo-actions {
  display: flex;
  gap: 6px;
  margin-top: 8px;
}

.grupo-actions input {
  flex: 1;
}
</style>