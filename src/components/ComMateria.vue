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
/* ====== TARJETA DE MATERIA ====== */
.materia-card {
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  color: #fff;
  border-radius: 14px;
  padding: 12px 14px;
  font-size: 0.85rem;
  line-height: 1.4;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 4px 10px rgba(15, 23, 42, 0.25);
  position: relative;
  overflow: hidden;
}

.materia-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.35);
}

/* ====== VARIACIONES POR GRUPO ====== */
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

/* ====== TEXTO INTERNO ====== */
.nombre {
  font-weight: 700;
  font-size: 1rem;
  margin-bottom: 6px;
  text-shadow: 0 1px 2px rgba(0,0,0,0.25);
}

.detalles {
  font-size: 0.8rem;
  opacity: 0.95;
}

/* ====== DIALOGO DE INFORMACIÓN ====== */
.info-grid {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 8px 14px;
  font-size: 0.9rem;
  color: #1e293b;
  padding: 6px 4px;
  background: #f9fafb;
  border-radius: 12px;
  margin-top: 8px;
}

.info-grid strong {
  color: #0f172a;
}

/* ====== BOTONES ====== */
.btn {
  grid-column: span 2;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  padding: 10px 14px;
  margin-top: 6px;
  transition: all 0.25s ease;
  cursor: pointer;
}

.btn:not(.red) {
  background: linear-gradient(135deg, #1e3a8a, #1d4ed8);
  color: #facc15;
  box-shadow: 0 3px 6px rgba(0,0,0,0.15);
}

.btn:not(.red):hover {
  background: linear-gradient(135deg, #2563eb, #1e40af);
  transform: translateY(-2px);
}

.btn.red {
  background: linear-gradient(135deg, #b91c1c, #7f1d1d);
  color: #fff;
  box-shadow: 0 3px 6px rgba(185, 28, 28, 0.25);
}

.btn.red:hover {
  background: linear-gradient(135deg, #dc2626, #991b1b);
  transform: translateY(-2px);
}

/* ====== ANIMACIÓN DE APARICIÓN ====== */
.materia-card {
  animation: fadeIn 0.4s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>

