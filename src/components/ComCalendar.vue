<template>
  <div class="calendario-wrapper">
    <div class="calendario-container">
      <!-- Cabeceras -->
      <div v-for="(cabeza, i) in cabeceras"
           :key="i"
           class="celda cabecera"
           :class="{ 'cabecera-hora': i === 0, 'cabecera-dia': i > 0 }">
        {{ cabeza }}
      </div>

      <!-- Horas en la primera columna -->
      <div v-for="(hora, i) in horas"
           :key="i"
           class="celda hora"
           :style="{ gridRow: (i+2) }">
        <div class="hora-contenido">
          {{ hora }}
        </div>
      </div>

      <!-- Celdas vacías del calendario -->
      <div v-for="celda in celdasVacias" 
           :key="`empty-${celda.fila}-${celda.columna}`"
           class="celda celda-vacia"
           :style="{
             gridColumn: celda.columna,
             gridRow: celda.fila
           }">
        <div class="celda-placeholder"></div>
      </div>

      <!-- Materias -->
      <ComMateria v-for="(materia, i) in materias"
           :key="i"
           :materia="materia"
           class="celda-materia"
           :style="{
             gridColumn: getDiaColumna(materia.DIA),
             gridRow: calcularDuracion(materia.HORAINICIO, materia.HORAFINAL)
           }"
      />
    </div>
  </div>
</template>

<script>
import ComMateria from './ComMateria.vue'

export default {
  components: { ComMateria },
  name: 'ComCalendar',
  props: {
    materias: {
      type: Array,
      default: () => []
    }
  },
  data(){
    return {
      cabeceras: ["Hora/Día","Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
      horas: [
        "6:00 am","7:00 am","8:00 am","9:00 am","10:00 am","11:00 am",
        "12:00 pm","1:00 pm","2:00 pm","3:00 pm","4:00 pm","5:00 pm",
        "6:00 pm","7:00 pm","8:00 pm","9:00 pm"
      ]
    }
  },
  computed: {
    celdasVacias() {
      const celdas = [];
      // 16 horas + 1 fila de cabecera = 17 filas
      // 8 columnas (hora + 7 días)
      for (let fila = 2; fila <= 17; fila++) {
        for (let columna = 2; columna <= 8; columna++) {
          celdas.push({ fila, columna });
        }
      }
      return celdas;
    }
  },
  methods:{
    getDiaColumna(dia){
      const index = this.cabeceras.indexOf(dia);
      return index !== -1 ? index + 1 : 2; // Default a Lunes si no encuentra
    },
    calcularDuracion(horaInicio, horaFinal){
      const hIni = parseInt(horaInicio.split(':')[0])
      const hFin = parseInt(horaFinal.split(':')[0])
      const offset = 6 // porque empezamos a las 6am
      const start = hIni - offset + 2 // +2 porque fila 1 son cabeceras, fila 2 = 6am
      const end = hFin - offset + 2
      return `${start} / span ${end - start}`
    }
  }
}
</script>

<style scoped>
.calendario-wrapper {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 24px;
  padding: 4px;
  box-shadow: 
    0 8px 32px rgba(15, 23, 42, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.calendario-container {
  display: grid;
  grid-template-columns: 120px repeat(7, 1fr);
  grid-auto-rows: 60px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 
    0 4px 20px rgba(15, 23, 42, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  overflow: hidden;
  font-family: "Inter", "SF Pro Display", -apple-system, sans-serif;
  color: #1e293b;
  position: relative;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.6);
}

/* Celdas base */
.celda {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  border-right: 1px solid rgba(241, 245, 249, 0.6);
  transition: all 0.2s ease;
}

/* Eliminar bordes extremos */
.calendario-container .celda:nth-child(8n+1) {
  border-right: 1px solid rgba(226, 232, 240, 0.8);
}

.calendario-container .celda:nth-child(n+1):nth-child(-n+8) {
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
}

/* Cabecera de horas (esquina superior izquierda) */
.cabecera-hora {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: #f8fafc;
  font-weight: 800;
  font-size: 0.95rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  border: none;
  position: relative;
  z-index: 3;
}

.cabecera-hora::after {
  content: '';
  position: absolute;
  bottom: 0;
  right: 0;
  width: 1px;
  height: 100%;
  background: linear-gradient(transparent, rgba(59, 130, 246, 0.4), transparent);
}

/* Cabeceras de días */
.cabecera-dia {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  color: #f8fafc;
  font-weight: 700;
  font-size: 0.9rem;
  letter-spacing: 0.3px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  border: none;
  position: relative;
  transition: all 0.3s ease;
}

.cabecera-dia:hover {
  background: linear-gradient(135deg, #334155 0%, #475569 100%);
  transform: translateY(-1px);
}

.cabecera-dia::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, 
    rgba(59, 130, 246, 0.6), 
    rgba(139, 92, 246, 0.6), 
    rgba(236, 72, 153, 0.6)
  );
  opacity: 0.7;
}

/* Columna de horas */
.hora {
  background: linear-gradient(135deg, #f1f5f9 0%, #f8fafc 100%);
  color: #475569;
  font-size: 0.85rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  border-right: 1px solid rgba(226, 232, 240, 0.8);
  position: sticky;
  left: 0;
  z-index: 2;
  box-shadow: 2px 0 8px rgba(15, 23, 42, 0.06);
}

.hora-contenido {
  padding: 8px;
  text-align: center;
}

/* Celdas vacías del calendario */
.celda-vacia {
  background: 
    linear-gradient(180deg, rgba(248, 250, 252, 0.6) 0%, rgba(255, 255, 255, 0.8) 100%);
  position: relative;
}

.celda-vacia:hover {
  background: 
    linear-gradient(180deg, rgba(239, 246, 255, 0.7) 0%, rgba(255, 255, 255, 0.9) 100%);
}

.celda-placeholder {
  width: 100%;
  height: 100%;
  opacity: 0.3;
  background: 
    radial-gradient(circle at center, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
}

/* Materias container */
.celda-materia {
  position: relative;
  z-index: 1;
  padding: 2px;
}

/* Efectos de hover en filas y columnas */
.calendario-container:hover .celda-vacia {
  background: 
    linear-gradient(180deg, rgba(248, 250, 252, 0.8) 0%, rgba(255, 255, 255, 0.9) 100%);
}

/* Scrollbar personalizada */
.calendario-wrapper {
  max-height: 80vh;
  overflow: auto;
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f1f5f9;
}

.calendario-wrapper::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}

.calendario-wrapper::-webkit-scrollbar-track {
  background: 
    linear-gradient(180deg, rgba(241, 245, 249, 0.9) 0%, rgba(226, 232, 240, 0.8) 100%);
  border-radius: 10px;
  border: 2px solid rgba(255, 255, 255, 0.8);
}

.calendario-wrapper::-webkit-scrollbar-thumb {
  background: 
    linear-gradient(180deg, #cbd5e1 0%, #94a3b8 50%, #64748b 100%);
  border-radius: 10px;
  border: 2px solid rgba(255, 255, 255, 0.8);
  box-shadow: 
    inset 0 1px 0 rgba(255, 255, 255, 0.4),
    inset 0 -1px 0 rgba(0, 0, 0, 0.1);
}

.calendario-wrapper::-webkit-scrollbar-thumb:hover {
  background: 
    linear-gradient(180deg, #94a3b8 0%, #64748b 50%, #475569 100%);
}

/* Responsive */
@media (max-width: 1024px) {
  .calendario-container {
    grid-template-columns: 100px repeat(7, 1fr);
    grid-auto-rows: 55px;
  }
  
  .cabecera-dia {
    font-size: 0.85rem;
  }
  
  .hora {
    font-size: 0.8rem;
  }
}

@media (max-width: 768px) {
  .calendario-wrapper {
    border-radius: 16px;
    margin: 8px;
  }
  
  .calendario-container {
    grid-template-columns: 80px repeat(7, 1fr);
    grid-auto-rows: 50px;
    border-radius: 14px;
  }
  
  .cabecera-dia {
    font-size: 0.75rem;
    padding: 4px;
  }
  
  .hora {
    font-size: 0.75rem;
  }
  
  .cabecera-hora {
    font-size: 0.8rem;
  }
}

@media (max-width: 640px) {
  .calendario-container {
    grid-template-columns: 60px repeat(7, 1fr);
    grid-auto-rows: 45px;
  }
  
  .cabecera-dia {
    font-size: 0.7rem;
    writing-mode: vertical-rl;
    text-orientation: mixed;
  }
  
  .hora {
    font-size: 0.7rem;
  }
}

/* Animaciones suaves */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.calendario-container {
  animation: fadeInUp 0.6s ease-out;
}

.celda-materia {
  animation: fadeInUp 0.4s ease-out;
}
</style>