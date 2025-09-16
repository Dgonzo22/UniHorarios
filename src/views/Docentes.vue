<template>
  <div class="docentes-container">
    <h2>👨‍🏫 Gestión de Docentes</h2>

    <!-- Formulario de nuevo docente -->
    <form class="form-docente" @submit.prevent="agregarDocente">
      <div class="input-group">
        <label for="idIdentificacion">ID Profesor:</label>
      <input
        id="idIdentificacion"
        type="number"
        v-model="nuevoDocente.ID_IDENTIFICACION"
        @input="limitIdLength('nuevoDocente')"
        required
        placeholder="Máx. 6 dígitos"
      />
    </div>

      <div class="input-group">
        <label for="nombre">Nombre:</label>
        <input
          id="nombre"
          type="text"
          v-model="nuevoDocente.NOMBRE"
          maxlength="30"
          required
          placeholder="Máx. 30 caracteres"
        />
      </div>

      <div class="input-group">
        <label for="correo">Correo:</label>
        <input
          id="correo"
          type="email"
          v-model="nuevoDocente.CORREO"
          placeholder="ejemplo@correo.com"
        />
      </div>

      <div class="input-group">
        <label for="perfil">Perfil:</label>
        <input
          id="perfil"
          type="text"
          v-model="nuevoDocente.PERFIL"
          placeholder="Perfil del docente"
        />
      </div>

      <button type="submit" class="btn-agregar">➕ Agregar Docente</button>
    </form>

    <!-- Tabla de docentes -->
    <table class="tabla-docentes">
      <thead>
        <tr>
          <th>ID Profesor</th>
          <th>Nombre</th>
          <th>Correo</th>
          <th>Perfil</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="docente in docentes" :key="docente.ID_DOCENTE">
          <td>{{ docente.ID_IDENTIFICACION }}</td>
          <td>{{ docente.NOMBRE }}</td>
          <td>{{ docente.CORREO }}</td>
          <td>{{ docente.PERFIL }}</td>
          <td>
            <button @click="openDialogEdit(docente)" class="btn-editar">✏️ Editar</button>
            <button @click="eliminarDocente(docente.ID_DOCENTE)" class="btn-eliminar">🗑️ Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal de edición -->
    <div v-if="openEditDocente" class="modal">
      <div class="modal-content">
        <h3>✏️ Editar Docente</h3>

        <div class="input-group">
          <label>ID Profesor:</label>
          <input
            type="number"
            v-model="docenteEdit.ID_IDENTIFICACION"
            @input="limitIdLength('docenteEdit')"
            maxlength="6"
            required
          />
        </div>

        <div class="input-group">
          <label>Nombre:</label>
          <input
            type="text"
            v-model="docenteEdit.NOMBRE"
            maxlength="30"
            required
          />
        </div>

        <div class="input-group">
          <label>Correo:</label>
          <input type="email" v-model="docenteEdit.CORREO" />
        </div>

        <div class="input-group">
          <label>Perfil:</label>
          <input type="text" v-model="docenteEdit.PERFIL" />
        </div>

        <div class="modal-actions">
          <button @click="actualizarDocente" class="btn-guardar">💾 Guardar</button>
          <button @click="openEditDocente = false" class="btn-cancelar">❌ Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>



<script>
export default {
  name: "Docentes",
  data() {
  return {
    docentes: [],
    nuevoDocente: { ID_IDENTIFICACION: "", NOMBRE: "", CORREO: "", PERFIL: "" },
    docenteEdit: { ID_DOCENTE: null, ID_IDENTIFICACION: "", NOMBRE: "", CORREO: "", PERFIL: "" },
    openEditDocente: false,
  };
},

  created() {
    this.cargarDocentes();
  },
  methods: {
          limitIdLength(objKey) {
      let value = this[objKey].ID_IDENTIFICACION?.toString() || "";
      // 1️⃣ Quitar todo lo que no sea dígito
      value = value.replace(/\D/g, "");
      // 2️⃣ Limitar a 6 dígitos
      if (value.length > 6) {
      value = value.slice(0, 6);
      }
      // 3️⃣ Convertir a número
      let num = parseInt(value, 10);
      // 4️⃣ Validar que sea mínimo 1
      if (isNaN(num) || num < 1) {
      num = 0; // siempre inicia desde 1
      } 

      // 5️⃣ Guardar
      this[objKey].ID_IDENTIFICACION = num.toString();
      },

      async agregarDocente() {
      if (!/^[0-9]{1,6}$/.test(this.nuevoDocente.ID_IDENTIFICACION)) {
        alert("❌ El ID debe ser un número de máximo 6 dígitos.");
        return;
      }
      if (this.nuevoDocente.NOMBRE.length > 30) {
        alert("❌ El nombre no puede superar los 30 caracteres.");
        return;
      }

      await window.electronAPI.invoke(
        "insertDocente",
        this.nuevoDocente.ID_IDENTIFICACION,
        this.nuevoDocente.NOMBRE,
        this.nuevoDocente.CORREO,
        this.nuevoDocente.PERFIL
      );
      this.cargarDocentes();
      this.nuevoDocente = { ID_IDENTIFICACION: "", NOMBRE: "", CORREO: "", PERFIL: "" }; // ✅ corregido
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

      if (!/^[0-9]{1,6}$/.test(this.docenteEdit.ID_IDENTIFICACION)) {
        alert("❌ El ID debe ser un número de máximo 6 dígitos.");
        return;
      }
      if (this.docenteEdit.NOMBRE.length > 30) {
        alert("❌ El nombre no puede superar los 30 caracteres.");
        return;
      }

      await window.electronAPI.invoke(
        "updateDocente",
        this.docenteEdit.ID_DOCENTE,
        this.docenteEdit.ID_IDENTIFICACION,
        this.docenteEdit.NOMBRE,
        this.docenteEdit.CORREO,
        this.docenteEdit.PERFIL,
      );
      this.cargarDocentes();
      console.log(this.docentes);
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
.docentes-container {
  max-width: 900px;
  margin: auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #2c3e50;
}

.form-docente {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 25px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.input-group {
  display: flex;
  flex-direction: column;
}

label {
  font-weight: bold;
  margin-bottom: 5px;
}

input {
  padding: 8px;
  border: 1px solid #ced4da;
  border-radius: 6px;
}

button {
  cursor: pointer;
  padding: 8px 14px;
  border-radius: 6px;
  border: none;
  font-weight: bold;
  transition: 0.3s;
}

.btn-agregar {
  grid-column: span 2;
  background: #28a745;
  color: white;
}

.btn-agregar:hover {
  background: #218838;
}

.tabla-docentes {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.tabla-docentes th,
.tabla-docentes td {
  border: 1px solid #dee2e6;
  padding: 10px;
  text-align: center;
}

.tabla-docentes th {
  background: #343a40;
  color: white;
}

.btn-editar {
  background: #ffc107;
  margin-right: 5px;
}

.btn-editar:hover {
  background: #e0a800;
}

.btn-eliminar {
  background: #dc3545;
  color: white;
}

.btn-eliminar:hover {
  background: #c82333;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 25px;
  border-radius: 10px;
  width: 400px;
}

.modal-actions {
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
}

.btn-guardar {
  background: #007bff;
  color: white;
}

.btn-guardar:hover {
  background: #0056b3;
}

.btn-cancelar {
  background: #6c757d;
  color: white;
}

.btn-cancelar:hover {
  background: #5a6268;
}
</style>
