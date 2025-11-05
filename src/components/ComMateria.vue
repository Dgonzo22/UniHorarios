<template>
  <div>
    <!-- Tarjeta clickeable -->
    <div class="materia-card" @click="showDialog = true">
      <div class="nombre">
        {{ infMateria?.NOMBRE || "" }} - {{ infMateria?.NRC || "" }}
      </div>
      <div class="detalles">
        {{ formateoA12(materia.HORAINICIO) }} -
        {{ formateoA12(materia.HORAFINAL) }}
      </div>
      <div class="detalles text-xs">
        Docente: {{ infoDocente?.NOMBRE || "" }}
      </div>
    </div>

    <!-- Dialog con ficha -->
    <ComDialog
      :visible="showDialog"
      :title="infMateria?.NOMBRE"
      @closeDialog="showDialog = false"
    >
      <div class="info-grid">
        <div><strong>Horario:</strong></div>
        <div>
          {{ formateoA12(materia.HORAINICIO) }} -
          {{ formateoA12(materia.HORAFINAL) }}
        </div>
        <div><strong>Grupo:</strong></div>
        <div>{{ materia.GRUPO }}</div>
        <div><strong>Semestre:</strong></div>
        <div>Semestre {{ materia.SEMESTRE }}</div>
        <div><strong>Docente:</strong></div>
        <div>{{ infoDocente?.NOMBRE }}</div>
        <div><strong>Correo:</strong></div>
        <div>{{ infoDocente?.CORREO }}</div>
        <div>
          <button class="btn" @click="showDialogEdit = true">Editar</button>
        </div>
        <div>
          <button class="btn red" @click="eliminarHorario">Eliminar</button>
        </div>
      </div>
      <ComDialog
        :visible="showDialogEdit"
        title="Editar Horario"
        @closeDialog="showDialogEdit = false"
      >
        <ComFormHorario
          :id_Horario="materia.ID_HORARIO"
          @horarioModificado="OHorarioModificado"
        />
      </ComDialog>
    </ComDialog>
    <!-- Alerta de mensajes-->
    <ComDialog
      title=""
      class="modal"
      :visible="openAlertaMensaje"
      @closeDialog="openAlertaMensaje = false"
    >
      <template v-if="tipoAlerta == 'error'">
        <div class="error">
          {{ mensajeAlerta }}
        </div>
      </template>
      <template v-else-if="tipoAlerta == 'exito'">
        <div class="exito">
          {{ mensajeAlerta }}
        </div>
      </template>
    </ComDialog>
  </div>
</template>

<script>
//eventos
//horarioEliminado

import ComDialog from "./ComDialog.vue";
import ComFormHorario from "./ComFormHorario.vue";

export default {
  name: "ComMateria",
  components: { ComDialog, ComFormHorario },
  props: {
    materia: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      infoDocente: null,
      infMateria: null,
      showDialog: false,
      //edit
      showDialogEdit: false,
      //alertas
      openAlertaMensaje: false,
      tipoAlerta: "",
      mensajeAlerta: "",
    };
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
    mostrarAlerta(tipo, mensaje) {
      this.tipoAlerta = tipo;
      this.mensajeAlerta = mensaje;
      this.openAlertaMensaje = true;
    },
    formateoA12(hora) {
      const [horaStr, minutosStr] = hora.split(":");
      let horaNum = parseInt(horaStr, 10);
      const minutosNum = parseInt(minutosStr, 10);
      const periodo = horaNum >= 12 ? "pm" : "am";

      if (horaNum > 12) {
        horaNum -= 12;
      } else if (horaNum === 0) {
        horaNum = 12;
      }

      return `${horaNum}:${minutosStr} ${periodo}`;
    },
    eliminarHorario() {
      // Lógica para eliminar el horario
      if (confirm("¿Estás seguro de que deseas eliminar este horario?")) {
        window.electronAPI
          .invoke("deleteHorario", this.materia.ID_HORARIO)
          .then(() => {
            this.$emit("horarioEliminado", this.materia.ID_HORARIO);
            this.showDialog = false;
            this.mostrarAlerta("exito", "✅ Horario eliminado con éxito");
          })
          .catch((err) => {
            this.mostrarAlerta("error", "❌ Ocurrió un error al eliminar el horario");
          });
      } else {
        this.mostrarAlerta("error", "❎ Eliminación cancelada");
      }
    },
    OHorarioModificado() {
      this.$emit("horarioModificado", this.materia.ID_HORARIO);
      this.showDialogEdit = false;
      this.showDialog = false;
      this.mostrarAlerta("exito", "✏️ Horario modificado con éxito");
    },
  },
};
</script>

<style scoped>
.materia-card {
  height: 100%;
  overflow: hidden;
}

.materia-card {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  border-radius: 10px;
  padding: 5px;
  font-size: 13px;
  line-height: 1.4;
  text-align: left;
  cursor: pointer;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  margin-bottom: 8px;
}

.materia-card:hover {
  transform: scale(1.03);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
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
  color: #ffd200;
}
.red {
  background: #b91c1c;
  color: white;
}
.btn:hover {
  background: #217588;
}

.exito, .error {
  padding: 15px;
  margin: 10px 0;
  border-radius: 8px;
  font-weight: bold;
  text-align: center;
  font-size: 1.1em;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  min-width: 400px;
}
.exito {
  background-color: #d4edda; /* Verde claro */
  color: #155724; /* Verde oscuro */
  border: 1px solid #c3e6cb;
}

.error {
  background-color: #f8d7da; /* Rojo claro/Rosado */
  color: #721c24; /* Rojo oscuro */
  border: 1px solid #f5c6cb;
}
</style>
