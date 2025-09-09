<template>
  <div class="materias">
    <h2 class="titulo">📚 Gestión de Materias</h2>
    <ComDialog 
      :visible="openNewMateria"
      @closeDialog="openNewMateria=false"
    >
      <form @submit.prevent="agregarMateria" class="form">
      <div class="form-grid">
        <input v-model="nuevaMateria.nombre" placeholder="Nombre de la materia" required />
        <input v-model="nuevaMateria.nrc" placeholder="NRC" required />
        <input v-model="nuevaMateria.creditos" type="number" placeholder="Número de créditos" min="1" max="3" required />
      </div>
      <button type="submit" class="btn-agregar">
        {{ editandoIndex !== null ? "Actualizar Materia" : "➕ Agregar Materia" }}
      </button>
    </form>
    </ComDialog>

    <!-- Tabla -->
    <div class="tabla-container">
      <table class="tabla">
        <caption>
        <button type="submit" class="btn" @click="openNewMateria = true">
          ➕ Agregar Materia
        </button>
        </caption>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>NRC</th>
            <th>Créditos</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="materia in materias" :key="materia">
            <td> {{ materia.nombre }}</td>
            <td>{{ materia.NRC }}</td>
            <td>{{ materia.Creditos }}</td>
            <td class="acciones">
              <button class="btn editar" @click="editarMateria(index)">✏️ Editar</button>
              <button class="btn eliminar" @click="eliminarMateria(materia.idMateria)">🗑️ Eliminar</button>
            </td>
          </tr>
          <tr v-if="materias.length === 0">
            <td colspan="5" class="sin-registros">⚠️ No hay materias registradas.</td>
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
      nuevaMateria: { 
        nombre: "", 
        nrc: "", 
        creditos: "" 
      },
      openNewMateria: false,
      editandoIndex: null
    };
  },
  async created(){
    const result = await window.electronAPI.invoke("getMaterias");
    this.materias = result
  },
  methods: {
    async agregarMateria() {
      await window.electronAPI.invoke("insertMateria",this.nuevaMateria.nombre, this.nuevaMateria.nrc, this.nuevaMateria.creditos);
      this.cargarMaterias()
      this.openNewMateria = false
    },
    async cargarMaterias(){
      const result = await window.electronAPI.invoke("getMaterias");
      this.materias = result
    },
    editarMateria(index) {
      this.nuevaMateria = { ...this.materias[index] };
      this.editandoIndex = index;
    },
    async eliminarMateria(idMateria) {
      if (confirm("¿Estás seguro de que quieres eliminar esta materia?")) {
        await window.electronAPI.invoke("deleteMateria",idMateria)
        this.cargarMaterias()
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

/* ===== FORMULARIO ===== */
.form {
  background: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
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
  transition: 0.2s;
}

.form input:focus {
  border-color: #4e73df;
  box-shadow: 0 0 6px rgba(78, 115, 223, 0.4);
}

.btn-agregar {
  margin-top: 1rem;
  width: 100%;
  padding: 0.8rem;
  background: #4e73df;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: 0.3s;
}
.btn{
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
.btn:hover {
  background: #3a56c4;
}

.btn-agregar:hover {
  background: #3a56c4;
}

/* ===== TABLA ===== */
.tabla-container {
  overflow-x: auto;
}

.tabla {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

th, td {
  border: 1px solid #e0e0e0;
  padding: 0.8rem;
  text-align: center;
}

th {
  background: #f8f9fa;
  color: #2c3e50;
  font-weight: bold;
}

tr:nth-child(even) {
  background: #fdfdfd;
}

.sin-registros {
  text-align: center;
  color: #7f8c8d;
  font-style: italic;
}

/* ===== BOTONES ===== */
.acciones {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.btn {
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: 0.2s;
}
caption {
  border: 1px solid #e0e0e0;
  padding: 0.8rem;
  text-align: start;
}
.btn.editar {
  background: #36b9cc;
  color: #fff;
}

.btn.editar:hover {
  background: #2c9faf;
}

.btn.eliminar {
  background: #e74a3b;
  color: #fff;
}

.btn.eliminar:hover {
  background: #d52a1a;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .tabla th, .tabla td {
    font-size: 0.85rem;
    padding: 0.6rem;
  }

  .btn {
    font-size: 0.8rem;
  }
}
</style>