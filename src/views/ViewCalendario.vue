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
    this.listaMaterias = await window.electronAPI.invoke("getHorarios");
  }
}
</script>
<style scoped>
</style>