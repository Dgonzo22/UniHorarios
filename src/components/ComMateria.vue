<template>
  <div>
    <!-- Tarjeta clickeable -->
    <div class="materia-card" @click="showDialog = true">
      <div class="nombre">{{ materia.infMateria?.NOMBRE || '' }}</div>
      <div class="detalles">{{ formateoA12(materia.HORAINICIO) }} - {{ formateoA12(materia.HORAFINAL) }}</div>
      <div class="detalles text-xs">Grupo: {{ materia.GRUPO }}</div>
      <div class="detalles text-xs">Docente: {{ infoDocente?.NOMBRE || ""}}</div>
    </div>

    <!-- Dialog con ficha -->
    <ComDialog :visible="showDialog" :title="infMateria?.NOMBRE" @closeDialog="showDialog = false">
      <div class="info-grid">
        <div><strong>Horario:</strong></div><div>{{ formateoA12(materia.HORAINICIO) }} - {{ formateoA12(materia.HORAFINAL) }}</div>
        <div><strong>Grupo:</strong></div><div>{{ materia.GRUPO }}</div>
        <div><strong>Semestre:</strong></div><div> Semestre {{ materia.SEMESTRE }}</div>
        <div><strong>Docente:</strong></div><div>{{ infoDocente?.NOMBRE }}</div>
        <div><strong>Correo:</strong></div><div>{{ infoDocente?.CORREO }}</div>
        <div><strong>Perfil:</strong></div><div>{{ infoDocente?.PERFIL }}</div>
        <div><button class="btn" @click="showDialogEdit = true">Editar</button></div>
        <div><button class="btn red" @click="eliminarHorario">Eliminar</button></div>
      </div>
      <ComDialog :visible="showDialogEdit"
        title="Editar Horario"
        @closeDialog="showDialogEdit = false">
        <ComFormHorario
          :id_Horario="materia.ID_HORARIO"
        />
      </ComDialog>
    </ComDialog>
  </div>
</template>

<script>
//eventos
//horarioEliminado

import ComDialog from "./ComDialog.vue";
import ComFormHorario from "./ComFormHorario.vue";

export default {
  name: 'ComMateria',
  components: { ComDialog, ComFormHorario },
  props: {
    materia: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      infoDocente: null,
      infMateria: null,
      showDialog: false,
      //edit
      showDialogEdit: false,
    }
  },
  async created() {
    this.infoDocente = await window.electronAPI.invoke(
      "getDocenteById",
      this.materia.ID_DOCENTE
    );

    this.infMateria = await window.electronAPI.invoke(
      "getMateriaById",
      this.materia.ID_MATERIA
    );
  },
  methods: { 

    formateoA12(hora) {
      const [horaStr, minutosStr] = hora.split(':');
      let horaNum = parseInt(horaStr, 10);
      const minutosNum = parseInt(minutosStr, 10);
      const periodo = horaNum >= 12 ? 'pm' : 'am';

      if (horaNum > 12) {
        horaNum -= 12;
      } else if (horaNum === 0) {
        horaNum = 12;
      }

      return `${horaNum}:${minutosStr} ${periodo}`;
    },
    eliminarHorario() {
      // Lógica para eliminar el horario
      window.electronAPI.invoke("deleteHorario", this.materia.ID_HORARIO)
        .then(() => {
          this.$emit('horarioEliminado', this.materia.ID_HORARIO);
          this.showDialog = false;
        })
        .catch(err => {
          console.error("Error eliminando horario:", err);
        });
    }
   }
}
</script>

<style scoped>
.materia-card{
  height: 100%;
}

.materia-card {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  border-radius: 10px;
  padding: 10px;
  font-size: 13px;
  line-height: 1.4;
  text-align: left;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  margin-bottom: 8px;
}

.materia-card:hover {
  transform: scale(1.03);
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.nombre {
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 4px;
}

.detalles {
  font-size: 12px;
  opacity: 0.95;
}

.info-grid {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 6px 12px;
  font-size: 14px;
  color: #333;
}

button {
  cursor: pointer;
  padding: 8px 14px;
  border-radius: 6px;
  border: none;
  font-weight: bold;
  transition: 0.3s;
}


.btn {
  grid-column: span 2;
  background: hsl(212, 100%, 17%);
  color: #ffD200;
}
.red{
  background: #b91c1c;
  color: white;
}
.btn:hover {
  background: #217588;
}
</style>
