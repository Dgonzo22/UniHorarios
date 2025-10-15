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
/* ====== CONTENEDOR PRINCIPAL ====== */
.calendario-grid {
  display: grid;
  grid-template-columns: 80px repeat(7, 1fr);
  grid-auto-rows: 80px;
  background: linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%);
  border-radius: 20px;
  overflow: hidden;
  box-shadow:
    0 10px 25px rgba(15, 23, 42, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border: 1px solid #e2e8f0;
}

/* ====== ENCABEZADOS DE DÍAS ====== */
.calendario-grid .header {
  background: linear-gradient(135deg, #2563eb, #1e40af);
  color: white;
  font-weight: 700;
  text-align: center;
  line-height: 50px;
  font-size: 0.95rem;
  border-right: 1px solid rgba(255, 255, 255, 0.2);
}

.calendario-grid .hora {
  background: #f1f5f9;
  font-weight: 600;
  text-align: right;
  padding-right: 12px;
  color: #334155;
  border-bottom: 1px solid #e2e8f0;
  font-size: 0.9rem;
}

/* ====== CELDAS ====== */
.calendario-grid .celda {
  position: relative;
  border-bottom: 1px solid #e2e8f0;
  border-right: 1px solid #e2e8f0;
  transition: background 0.2s;
}

.calendario-grid .celda:hover {
  background: rgba(37, 99, 235, 0.05);
}

/* ====== TARJETAS DE MATERIA ====== */
.materia-card {
  position: absolute;
  left: 4px;
  right: 4px;
  background: linear-gradient(135deg, #3b82f6, #1e3a8a);
  color: #fff;
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 0.8rem;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.25);
  transition: all 0.25s ease;
  overflow: hidden;
  cursor: pointer;
  animation: fadeIn 0.4s ease-out;
}

.materia-card:hover {
  transform: translateY(-3px);
  background: linear-gradient(135deg, #2563eb, #1e40af);
  box-shadow: 0 6px 14px rgba(37, 99, 235, 0.3);
}

/* ====== CONTENIDO TARJETA ====== */
.materia-card strong {
  font-size: 0.9rem;
  display: block;
  margin-bottom: 4px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
}

.materia-card small {
  display: block;
  opacity: 0.9;
  line-height: 1.3;
}

/* ====== DIFERENCIAR POR GRUPO ====== */
.materia-card[data-grupo="A"] {
  background: linear-gradient(135deg, #2563eb, #1e3a8a);
}
.materia-card[data-grupo="B"] {
  background: linear-gradient(135deg, #059669, #065f46);
}
.materia-card[data-grupo="C"] {
  background: linear-gradient(135deg, #ca8a04, #b45309);
}
.materia-card[data-grupo="D"] {
  background: linear-gradient(135deg, #dc2626, #7f1d1d);
}

/* ====== ANIMACIÓN ====== */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

/* ====== SCROLL ====== */
.calendario-wrapper {
  overflow-x: auto;
  overflow-y: auto;
  max-height: calc(100vh - 220px);
  border-radius: 16px;
}

/* Scrollbar moderna */
.calendario-wrapper::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

.calendario-wrapper::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #93c5fd, #3b82f6);
  border-radius: 10px;
}

.calendario-wrapper::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #2563eb, #1d4ed8);
}
</style>

