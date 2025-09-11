<template>
  <div class="materias">
    <h2 class="titulo">📚 Gestión de Materias</h2>

    <!-- Modal para agregar/editar -->
    <ComDialog 
      :visible="openNewMateria"
      @closeDialog="cerrarDialog"
    >
      <form @submit.prevent="guardarMateria" class="form">
        <div class="form-grid">
          <input v-model="nuevaMateria.nombre" placeholder="Nombre de la materia" required />
          <input v-model="nuevaMateria.nrc" placeholder="NRC" required />
          <input v-model="nuevaMateria.creditos" type="number" placeholder="Número de créditos" min="1" max="3" required />
        </div>
        <button type="submit" class="btn-agregar">
          {{ editandoIndex !== null ? "💾 Actualizar Materia" : "➕ Agregar Materia" }}
        </button>
      </form>
    </ComDialog>

    <!-- Tabla -->
    <div class="tabla-container">
      <table class="tabla">
        <caption>
          <button type="button" class="btn" @click="nuevaMateriaDialog">
            ➕ Agregar Materia
          </button>
        </caption>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>NRC</th>
            <th>Créditos</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(materia, index) in materias" :key="materia.ID_MATERIA">
            <td>{{ materia.NOMBRE }}</td>
            <td>{{ materia.NRC }}</td>
            <td>{{ materia.CREDITOS }}</td>
            <td class="acciones">
              <button class="btn editar" @click="editarMateria(index)">✏️ Editar</button>
              <button class="btn eliminar" @click="eliminarMateria(materia.ID_MATERIA)">🗑️ Eliminar</button>
            </td>
          </tr>
          <tr v-if="materias.length === 0">
            <td colspan="4" class="sin-registros">⚠️ No hay materias registradas.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import ComDialog from '../components/ComDialog.vue'

export default {
  components: { ComDialog },
  name: "Materias",
  data() {
    return {
      materias: [],
      nuevaMateria: { nombre: "", nrc: "", creditos: "" },
      openNewMateria: false,
      editandoIndex: null
    };
  },
  async created() {
    this.cargarMaterias();
  },
  methods: {
    async cargarMaterias() {
      const result = await window.electronAPI.invoke("getMaterias");
      this.materias = result || [];
    },

    nuevaMateriaDialog() {
      this.nuevaMateria = { nombre: "", nrc: "", creditos: "" };
      this.editandoIndex = null;
      this.openNewMateria = true;
    },

    cerrarDialog() {
      this.openNewMateria = false;
      this.nuevaMateria = { nombre: "", nrc: "", creditos: "" };
      this.editandoIndex = null;
    },

    async guardarMateria() {
      if (this.editandoIndex === null) {
        // Insertar
        await window.electronAPI.invoke(
          "insertMateria",
          this.nuevaMateria.nombre,
          this.nuevaMateria.nrc,
          this.nuevaMateria.creditos
        );
      } else {
        // Actualizar
        const materia = this.materias[this.editandoIndex];
        await window.electronAPI.invoke(
          "updateMateria",
          materia.ID_MATERIA,
          this.nuevaMateria.nombre,
          this.nuevaMateria.nrc,
          this.nuevaMateria.creditos
        );
      }
      this.cargarMaterias();
      this.cerrarDialog();
    },

    editarMateria(index) {
      this.nuevaMateria = { 
        nombre: this.materias[index].NOMBRE, 
        nrc: this.materias[index].NRC, 
        creditos: this.materias[index].CREDITOS 
      };
      this.editandoIndex = index;
      this.openNewMateria = true;
    },

    async eliminarMateria(idMateria) {
      if (confirm("¿Estás seguro de que quieres eliminar esta materia?")) {
        await window.electronAPI.invoke("deleteMateria", idMateria);
        this.cargarMaterias();
      }
    }
  }
};
</script>



<style scoped>
.materias {
  padding: 2rem;
  max-width: 1100px;
  margin: auto;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}
.titulo {
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  color: #2c3e50;
}
.form {
  background: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 1rem;
}
.form input {
  padding: 0.7rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  outline: none;
}
.form input:focus {
  border-color: #4e73df;
  box-shadow: 0 0 6px rgba(78,115,223,0.4);
}
.btn-agregar, .btn {
  margin-top: 1rem;
  padding: 0.8rem;
  background: #4e73df;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: 0.3s;
}
.btn:hover { background: #3a56c4; }
.tabla-container { overflow-x: auto; margin-top: 1rem; }
.tabla { width: 100%; border-collapse: collapse; }
th, td { border: 1px solid #e0e0e0; padding: 0.8rem; text-align: center; }
th { background: #f8f9fa; color: #2c3e50; font-weight: bold; }
.sin-registros { text-align: center; color: #7f8c8d; font-style: italic; }
.acciones { display: flex; gap: 0.5rem; justify-content: center; }
.btn.editar { background: #36b9cc; }
.btn.editar:hover { background: #2c9faf; }
.btn.eliminar { background: #e74a3b; }
.btn.eliminar:hover { background: #d52a1a; }
</style>
