<template>
  <div class="docentes">
    <h2 class="titulo">👨‍🏫 Gestión de Docentes</h2>

    <!-- Formulario Agregar -->
    <form @submit.prevent="agregarDocente" class="form">
      <h3>➕ Agregar Docente</h3>
      <div class="form-grid">
        <input v-model="nuevoDocente.NOMBRE" placeholder="Nombre completo" required />
        <input v-model="nuevoDocente.CORREO" type="email" placeholder="Correo institucional" required />
        <input v-model="nuevoDocente.CELULAR" placeholder="Celular" required />
        <input v-model="nuevoDocente.PERFIL" placeholder="Perfil académico" required />
      </div>
      <button type="submit" class="btn-agregar">➕ Agregar Docente</button>
    </form>

    <!-- Formulario Editar -->
    <ComDialog :visible="openEditDocente" @closeDialog="openEditDocente=false">
      <form @submit.prevent="actualizarDocente" class="form">
        <h3>✏️ Editar Docente</h3>
        <div class="form-grid">
          <input v-model="docenteEdit.NOMBRE" placeholder="Nombre completo" required />
          <input v-model="docenteEdit.CORREO" type="email" placeholder="Correo institucional" required />
          <input v-model="docenteEdit.CELULAR" placeholder="Celular" required />
          <input v-model="docenteEdit.PERFIL" placeholder="Perfil académico" required />
        </div>
        <button type="submit" class="btn-agregar">💾 Guardar Cambios</button>
      </form>
    </ComDialog>

    <!-- Tabla -->
    <div class="tabla-container">
      <table class="tabla">
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Celular</th>
            <th>Perfil</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(docente, index) in docentes" :key="docente.ID_DOCENTE">
            <td>{{ index + 1 }}</td>
            <td>{{ docente.NOMBRE }}</td>
            <td>{{ docente.CORREO }}</td>
            <td>{{ docente.CELULAR }}</td>
            <td>{{ docente.PERFIL }}</td>
            <td class="acciones">
              <button class="btn editar" @click="openDialogEdit(docente)">✏️ Editar</button>
              <button class="btn eliminar" @click="eliminarDocente(docente.ID_DOCENTE)">🗑️ Eliminar</button>
            </td>
          </tr>
          <tr v-if="docentes.length === 0">
            <td colspan="6" class="sin-registros">⚠️ No hay docentes registrados.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import ComDialog from '../components/ComDialog.vue';

export default {
  components: { ComDialog },
  name: "Docentes",
  data() {
    return {
      docentes: [],
      nuevoDocente: { NOMBRE: "", CORREO: "", CELULAR: "", PERFIL: "" },
      docenteEdit: { ID_DOCENTE: null, NOMBRE: "", CORREO: "", CELULAR: "", PERFIL: "" },
      openEditDocente: false,
    };
  },
  created() {
    this.cargarDocentes();
  },
  methods: {
    async agregarDocente() {
      await window.electronAPI.invoke(
        "insertDocente",
        this.nuevoDocente.NOMBRE,
        this.nuevoDocente.CORREO,
        this.nuevoDocente.CELULAR,
        this.nuevoDocente.PERFIL
      );
      this.cargarDocentes();
      this.nuevoDocente = { NOMBRE: "", CORREO: "", CELULAR: "", PERFIL: "" };
      alert("✅ Docente agregado con éxito.");
    },
    async cargarDocentes() {
      const result = await window.electronAPI.invoke("getDocentes");
      this.docentes = result || [];
    },
    openDialogEdit(docente) {
      this.openEditDocente = true;
      this.docenteEdit = { ...docente };
    },
    async actualizarDocente() {
      if (!confirm("¿Seguro que quieres guardar los cambios en este docente?")) return;

      await window.electronAPI.invoke(
        "updateDocente",
        this.docenteEdit.ID_DOCENTE,
        this.docenteEdit.NOMBRE,
        this.docenteEdit.CORREO,
        this.docenteEdit.CELULAR,
        this.docenteEdit.PERFIL
      );
      this.cargarDocentes();
      this.openEditDocente = false;

      alert("✅ Docente actualizado correctamente.");
    },
    async eliminarDocente(idDocente) {
      if (!confirm("⚠️ ¿Estás seguro de eliminar este docente?")) return;

      await window.electronAPI.invoke("deleteDocente", idDocente);
      this.cargarDocentes();

      alert("🗑️ Docente eliminado con éxito.");
    }
  }
};
</script>

<style scoped>
.docentes {
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

/* ===== FORMULARIOS ===== */
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
  border-color: #3498db;
  box-shadow: 0 0 6px rgba(52, 152, 219, 0.4);
}

.btn-agregar {
  margin-top: 1rem;
  width: 100%;
  padding: 0.8rem;
  background: #3498db;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: 0.3s;
}

.btn-agregar:hover {
  background: #2980b9;
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

.btn.editar {
  background: #27ae60;
  color: #fff;
}

.btn.editar:hover {
  background: #1e8449;
}

.btn.eliminar {
  background: #e74c3c;
  color: #fff;
}

.btn.eliminar:hover {
  background: #c0392b;
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
