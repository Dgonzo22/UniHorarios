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
    <ComCalendar 
    :materias="listaMaterias"
    @recargarHorarios="cargarHorarios"
    />
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
    },
    async cargarHorarios() {
      this.listaMaterias = await window.electronAPI.invoke("getHorarios")
    }
  }
}
</script>

<style scoped>
.calendario-container {
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding: 24px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  min-height: 100vh;
  font-family: "Inter", "Segoe UI", sans-serif;
  color: #1e293b;
  animation: fadeIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* --- TARJETA DE FILTROS MEJORADA --- */
.filtros-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.98) 100%);
  padding: 28px 32px;
  border-radius: 24px;
  box-shadow: 
    0 8px 32px rgba(15, 23, 42, 0.12),
    0 2px 8px rgba(15, 23, 42, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(12px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.filtros-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #3b82f6, #60a5fa, #93c5fd);
  border-radius: 24px 24px 0 0;
}

.filtros-card:hover {
  transform: translateY(-4px) scale(1.002);
  box-shadow: 
    0 16px 40px rgba(15, 23, 42, 0.18),
    0 4px 12px rgba(15, 23, 42, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.filtros-card h1 {
  font-size: 26px;
  margin-bottom: 24px;
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 800;
  text-align: left;
  display: inline-block;
  padding-bottom: 6px;
  letter-spacing: -0.2px;
  position: relative;
}

.filtros-card h1::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60%;
  height: 3px;
  background: linear-gradient(90deg, #3b82f6, transparent);
  border-radius: 2px;
}

/* --- GRID DE FILTROS MEJORADO --- */
.filtros-linea {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 22px;
  align-items: end;
}

/* --- FILTROS INDIVIDUALES MEJORADOS --- */
.filtro {
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
}

.filtro label {
  font-weight: 700;
  color: #475569;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  letter-spacing: 0.2px;
}

.filtro label::before {
  content: '▶';
  font-size: 10px;
  color: #3b82f6;
  opacity: 0.7;
  transition: transform 0.3s ease;
}

.filtro:focus-within label::before {
  transform: rotate(90deg);
  opacity: 1;
}

.filtro input[type="text"],
.filtro input[type="number"],
.filtro select {
  padding: 14px 16px;
  border: 1.5px solid #e2e8f0;
  border-radius: 14px;
  font-size: 15px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: #1e293b;
  font-weight: 500;
  box-shadow: 
    0 2px 6px rgba(15, 23, 42, 0.04),
    inset 0 1px 2px rgba(255, 255, 255, 0.8);
}

.filtro input::placeholder {
  color: #94a3b8;
  font-weight: 400;
}

.filtro input:focus,
.filtro select:focus {
  border-color: #3b82f6;
  box-shadow: 
    0 0 0 4px rgba(59, 130, 246, 0.15),
    0 4px 12px rgba(59, 130, 246, 0.1),
    inset 0 1px 2px rgba(255, 255, 255, 0.9);
  outline: none;
  transform: translateY(-2px);
  background: linear-gradient(180deg, #ffffff 0%, #f0f9ff 100%);
}

.filtro input:hover,
.filtro select:hover {
  border-color: #cbd5e1;
  transform: translateY(-1px);
  box-shadow: 
    0 4px 12px rgba(15, 23, 42, 0.08),
    inset 0 1px 2px rgba(255, 255, 255, 0.9);
}

/* --- BOTÓN APLICAR MEJORADO --- */
.acciones {
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}

.acciones button {
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #60a5fa 100%);
  color: #fff;
  padding: 14px 32px;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  font-weight: 700;
  font-size: 15px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 6px 20px rgba(37, 99, 235, 0.3),
    0 2px 8px rgba(37, 99, 235, 0.2);
}

.acciones button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.6s ease;
}

.acciones button:hover {
  background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #3b82f6 100%);
  transform: translateY(-3px) scale(1.02);
  box-shadow: 
    0 10px 30px rgba(37, 99, 235, 0.5),
    0 4px 15px rgba(37, 99, 235, 0.3);
  letter-spacing: 0.6px;
}

.acciones button:hover::before {
  left: 100%;
}

.acciones button:active {
  transform: translateY(-1px) scale(1.01);
  box-shadow: 
    0 4px 15px rgba(37, 99, 235, 0.4),
    0 2px 6px rgba(37, 99, 235, 0.3);
}

/* --- SCROLLBAR MEJORADA --- */
.calendario-container::-webkit-scrollbar {
  width: 10px;
}

.calendario-container::-webkit-scrollbar-track {
  background: rgba(241, 245, 249, 0.8);
  border-radius: 8px;
}

.calendario-container::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #cbd5e1 0%, #94a3b8 100%);
  border-radius: 8px;
  border: 2px solid rgba(241, 245, 249, 0.8);
}

.calendario-container::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #94a3b8 0%, #64748b 100%);
}

/* --- ANIMACIONES MEJORADAS --- */
@keyframes fadeIn {
  from { 
    opacity: 0; 
    transform: translateY(20px) scale(0.98); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0) scale(1); 
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* --- EFECTO DE APARICIÓN ESCALONADA PARA FILTROS --- */
.filtro {
  animation: slideIn 0.6s ease-out forwards;
  opacity: 0;
}

.filtro:nth-child(1) { animation-delay: 0.1s; }
.filtro:nth-child(2) { animation-delay: 0.2s; }
.filtro:nth-child(3) { animation-delay: 0.3s; }
.filtro:nth-child(4) { animation-delay: 0.4s; }

/* --- RESPONSIVE MEJORADO --- */
@media (max-width: 768px) {
  .calendario-container {
    padding: 16px;
    gap: 20px;
  }
  
  .filtros-card {
    padding: 20px 24px;
    border-radius: 20px;
  }
  
  .filtros-linea {
    grid-template-columns: 1fr;
    gap: 18px;
  }
  
  .filtros-card h1 {
    font-size: 22px;
  }
  
  .acciones {
    justify-content: stretch;
  }
  
  .acciones button {
    width: 100%;
    padding: 16px 24px;
  }
}

@media (max-width: 480px) {
  .calendario-container {
    padding: 12px;
  }
  
  .filtros-card {
    padding: 18px 20px;
  }
  
  .filtro input[type="text"],
  .filtro input[type="number"],
  .filtro select {
    padding: 12px 14px;
    font-size: 14px;
  }
}

/* --- ESTADOS DE CARGA Y DESHABILITADO --- */
.filtro input:disabled,
.filtro select:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.acciones button:disabled {
  background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none;
}

.acciones button:disabled:hover {
  transform: none;
  box-shadow: none;
}
</style>
