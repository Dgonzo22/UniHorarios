<template>
  <div>
    <ComCalendar  :materias="listaMaterias"/>
  </div>
</template>
<script>
import ComCalendar from '../components/ComCalendar.vue'

export default {
  components: { ComCalendar },
  name: 'ViewCalendario',
  data(){
    return {
      listaMaterias: []
    }
  },
  async created(){
    //this.listaMaterias = await window.electronAPI.invoke("getMaterias");
    this.listaMaterias = [
      {
        idCalendario: 0,
        materia: "Inglés 1",
        horaInicio: "7:00",
        horaFinal: "9:00",
        dia: "Lunes"
      },
      {
        idCalendario: 1,
        materia: "Matemáticas",
        horaInicio: "10:00",
        horaFinal: "12:00",
        dia: "Martes"
      },
      {
        idCalendario: 2,
        materia: "Programación",
        horaInicio: "14:00",
        horaFinal: "16:00",
        dia: "Miércoles"
      },
      {
        idCalendario: 3,
        materia: "Base de Datos",
        horaInicio: "8:00",
        horaFinal: "10:00",
        dia: "Jueves"
      },
      {
        idCalendario: 4,
        materia: "Física",
        horaInicio: "15:00",
        horaFinal: "18:00",
        dia: "Viernes"
      },
      {
        idCalendario: 5,
        materia: "Educación Física",
        horaInicio: "9:00",
        horaFinal: "11:00",
        dia: "Sábado"
      },
      {
        idCalendario: 6,
        materia: "Ética",
        horaInicio: "10:00",
        horaFinal: "11:00",
        dia: "Domingo"
      },
      {
        idCalendario: 6,
        materia: "Ética",
        horaInicio: "6:00",
        horaFinal: "8:00",
        dia: "Domingo"
      }
    ]

  }
}
</script>
<style scoped>
</style>