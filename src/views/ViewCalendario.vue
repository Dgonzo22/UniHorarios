<template>
  <div class="calendario-container">
    <div class="filtros-card">
      <h1>🎯 Filtros</h1>

      <div class="filtros-linea">
        <!-- Filtro Semestre -->
        <div class="filtro">
          <label for="semestre">Semestre</label>
          <input
            id="semestre"
            type="number"
            v-model="semestre"
            placeholder="Semestre (1-10)"
          />
        </div>

        <!-- Filtro Grupo -->
        <div class="filtro">
          <label for="grupo">Grupo</label>
          <input
            id="grupo"
            type="text"
            v-model="grupo"
            placeholder="Grupo (A, B, C...)"
          />
        </div>

        <!-- Filtro Periodo -->
        <div class="filtro">
          <label>
            <input type="checkbox" v-model="checkperiodo" />
            Periodo
          </label>
          <input
            type="text"
            v-model="periodo"
            placeholder="Periodo (2025-1, 2025-2...)"
            :disabled="!checkperiodo"
          />
        </div>

        <!-- Filtro Docente -->
        <div class="filtro">
          <label>
            <input type="checkbox" v-model="checkdocente" />
            Docente
          </label>
          <select v-model="id_docente" :disabled="!checkdocente">
            <option value="">Seleccione un docente</option>
            <option v-for="docente in listaDocentes" :key="docente.ID_DOCENTE" :value="docente.ID_DOCENTE">
              {{ docente.NOMBRE }}
            </option>
          </select>
        </div>

        <!-- Filtro Materia -->
        <div class="filtro">
          <label>
            <input type="checkbox" v-model="checkmateria" />
            Materia
          </label>
          <select v-model="id_materia" :disabled="!checkmateria">
            <option value="">Seleccione una materia</option>
            <option v-for="materia in listaMateriasDB" :key="materia.ID_MATERIA" :value="materia.ID_MATERIA">
              {{ materia.NOMBRE }}
            </option>
          </select>
        </div>

        <!-- Botón para aplicar filtros -->
        <div class="acciones">
          <button @click="filtrar">Aplicar filtros</button>
        </div>
      </div>
    </div>

    <!-- Calendario -->
    <ComCalendar :materias="listaMaterias"/>
  </div>
</template>

<script>
import ComCalendar from '../components/ComCalendar.vue'

export default {
  components: { ComCalendar },
  name: 'ViewCalendario',
  data() {
    return {
      listaMaterias: [],
      semestre: "1",
      grupo: "grupo A",
      checkperiodo: false,
      periodo: null,
      checkdocente: false,
      id_docente: null,
      checkmateria: false,
      id_materia: null,
      listaDocentes: [],
      listaMateriasDB: []
    }
  },
  async created() {
    this.listaMaterias = await window.electronAPI.invoke("getHorarios");

    this.listaMaterias.forEach(materia => {
      console.log(materia);
    });

    this.listaDocentes = await window.electronAPI.invoke("getDocentes");
    this.listaMateriasDB = await window.electronAPI.invoke("getMaterias");
  },
  methods: {
    async filtrar() {
      this.listaMaterias = await window.electronAPI.invoke(
        "getHorarioFilter",
        String(this.semestre),
        this.grupo,
        this.checkperiodo,
        this.periodo,
        this.checkdocente,
        this.id_docente,
        this.checkmateria,
        this.id_materia
      );
    }
  }
}
</script>

<style scoped>
.calendario-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 10px;
}

/* Tarjeta de filtros */
.filtros-card {
  background: #ffffff;
  padding: 20px;
  border-radius: 14px;
  box-shadow: 0px 4px 10px rgba(0,0,0,0.08);
  border: 1px solid #e0e0e0;
}

.filtros-card h1 {
  font-size: 20px;
  margin-bottom: 18px;
  color: #222;
  font-weight: bold;
  text-align: left;
  border-bottom: 2px solid #007bff;
  padding-bottom: 6px;
}

/* Línea de filtros ahora en grid */
.filtros-linea {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}

/* Cada filtro */
.filtro {
  margin-left: 5px;
  margin-right: 5px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.filtro label {
  font-weight: 600;
  color: #444;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px; /* espacio entre checkbox y texto */
}

.filtro input[type="text"],
.filtro input[type="number"],
.filtro select {
  padding: 8px 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
  width: 100%;
  transition: border 0.2s, box-shadow 0.2s;
}

.filtro input:focus,
.filtro select:focus {
  border-color: #007bff;
  box-shadow: 0px 0px 4px rgba(0, 123, 255, 0.4);
  outline: none;
}

/* Botón alineado al grid */
.acciones {
  grid-column: 1 / -1; /* ocupa toda la fila */
  display: flex;
  justify-content: flex-end;
}

.acciones button {
  background: #007bff;
  color: white;
  padding: 10px 18px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.3s;
  font-size: 14px;
}

.acciones button:hover {
  background: #0056b3;
}


</style>
