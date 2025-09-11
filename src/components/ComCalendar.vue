<template>
  <div class="grid-layout">
    <!-- Cabeceras -->
    <div v-for="(cabeza, i) in cabeceras"
         :key="i"
         class="box cabeceza">
      {{ cabeza }}
    </div>

    <!-- Horas en la primera columna -->
    <div v-for="(hora, i) in horas"
         :key="i"
         class="box calendario hora"
         :style="{ gridRow: (i+2) }"> <!-- +2 porque la fila 1 son cabeceras -->
      {{ hora }}
    </div>

    <!-- Materias -->
    <div v-for="(materia, i) in materias"
         :key="i"
         class="box calendario materia"
         :style="{
           gridColumn: getDiaColumna(materia.dia),
           gridRow: calcularDuracion(materia.horaInicio, materia.horaFinal)
         }">
      {{ materia.materia }} ({{ materia.horaInicio }} - {{ materia.horaFinal }})
    </div>
  </div>
</template>

<script>
export default {
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
  methods:{
    getDiaColumna(dia){
      return this.cabeceras.indexOf(dia) + 1
    },
    calcularDuracion(horaInicio, horaFinal){
      const hIni = parseInt(horaInicio.split(':')[0])
      const hFin = parseInt(horaFinal.split(':')[0])
      const offset = 6 // porque empezamos a las 6am
      const start = hIni - offset + 2 // +2 porque fila 1 son cabeceras, fila 2 = 6am
      const end = hFin - offset + 2
      return start + " / " + end
    }
  }
}
</script>

<style scoped>
.grid-layout {
  display: grid;
  grid-template-columns: 10% repeat(7, 1fr);
  grid-auto-rows: 40px; /* alto base de una hora */
}

.box {
  border: 1px solid #ccc;
}

.cabeceza {
  background-color: #3b82f6;
  color: white;
  font-weight: bold;
  text-align: center;
  border: 1px solid #2563eb;
}

.hora {
  font-weight: bold;
  text-align: right;
  padding-right: 10px;
  background: #f9fafb;
}

.calendario {
  text-align: center;
}

.materia {
  background: #e0f2fe;
  border: 2px solid #3b82f6;
  border-radius: 6px;
}
</style>
