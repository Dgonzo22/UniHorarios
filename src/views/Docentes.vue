<template>
  <div class="docentes-container">
    <h2>👨‍🏫 Gestión de Docentes</h2>
    <!-- Tabla de docentes -->
    <table class="tabla-docentes">
      <caption>
        <button @click="openAddDocente = true" class="btn-agregar">
          ➕ Agregar Nuevo Docente
        </button>
      </caption>
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
            <button @click="openDialogEdit(docente)" class="btn-editar">
              ✏️ Editar
            </button>
            <button
              @click="eliminarDocente(docente.ID_DOCENTE)"
              class="btn-eliminar"
            >
              🗑️ Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal de edición -->
    <ComDialog
      :visible="openEditDocente"
      class="modal"
      @closeDialog="openEditDocente = false"
      title="✏️ Editar Docente"
    >
      <div class="modal-content">
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
          <label>Tipo Contrato:</label>
          <select v-model="docenteEdit.TIPO_CONTRATO">
            <option value="MT">Medio tiempo (MT)</option>
            <option value="TC">Tiempo completo (TC)</option>
          </select>
        </div>

        <div class="input-group">
          <label>Perfil:</label>
          <textarea v-model="docenteEdit.PERFIL"></textarea>
        </div>

        <div class="modal-actions">
          <button @click="actualizarDocente" class="btn-guardar">
            💾 Guardar
          </button>
          <button @click="openEditDocente = false" class="btn-cancelar">
            ❌ Cancelar
          </button>
        </div>
      </div>
    </ComDialog>
    <!-- Formulario de nuevo docente -->
    <ComDialog
      title="➕ Agregar Nuevo Docente"
      class="modal"
      :visible="openAddDocente"
      @closeDialog="openAddDocente = false"
    >
      <div class="modal-content">
        <div class="input-group">
          <label for="idIdentificacion">ID Profesor:</label>
          <input
            id="idIdentificacion"
            type="text"
            inputmode="numeric"
            maxlength="6"
            v-model="nuevoDocente.ID_IDENTIFICACION"
            required
            placeholder="Id del profesor (Máx. 6 dígitos)"
            oninput="this.value = this.value.replace(/[^0-9]/g, '').slice(0,6)"
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
          <label>Tipo Contrato:</label>
          <select v-model="nuevoDocente.TIPO_CONTRATO">
            <option value="MT">Medio tiempo (MT)</option>
            <option value="TC">Tiempo completo (TC)</option>
          </select>
        </div>

        <div class="input-group">
          <label>Perfil:</label>
          <textarea v-model="nuevoDocente.PERFIL"></textarea>
        </div>

        <button type="submit" class="btn-agregar" @click="agregarDocente">
          ➕ Agregar Docente
        </button>
      </div>
    </ComDialog>
  </div>
</template>

<script>
import ComDialog from "../components/ComDialog.vue";

export default {
  name: "Docentes",
  components: { ComDialog },
  data() {
    return {
      docentes: [],
      nuevoDocente: {
        ID_IDENTIFICACION: "",
        NOMBRE: "",
        CORREO: "",
        PERFIL: "",
        TIPO_CONTRATO: "",
      },
      docenteEdit: {
        ID_DOCENTE: null,
        ID_IDENTIFICACION: "",
        NOMBRE: "",
        CORREO: "",
        PERFIL: "",
        TIPO_CONTRATO: "",
      },
      openEditDocente: false,
      openAddDocente: false,
    };
  },

  created() {
    this.cargarDocentes();
  },
  methods: {
    async agregarDocente() {
      // Validar que todos los campos estén llenos
      if (
        !this.nuevoDocente.ID_IDENTIFICACION ||
        !this.nuevoDocente.NOMBRE ||
        !this.nuevoDocente.CORREO ||
        !this.nuevoDocente.TIPO_CONTRATO ||
        !this.nuevoDocente.PERFIL
      ) {
        alert(
          "Por favor, completa todos los campos antes de registrar el docente."
        );
        return;
      }

      await window.electronAPI.invoke(
        "insertDocente",
        Number(this.nuevoDocente.ID_IDENTIFICACION),
        this.nuevoDocente.NOMBRE,
        this.nuevoDocente.CORREO,
        this.nuevoDocente.TIPO_CONTRATO,
        this.nuevoDocente.PERFIL
      );

      this.cargarDocentes();

      this.nuevoDocente.ID_IDENTIFICACION = "";
      this.nuevoDocente.NOMBRE = "";
      this.nuevoDocente.CORREO = "";
      this.nuevoDocente.TIPO_CONTRATO = "";
      this.nuevoDocente.PERFIL = "";

      this.openAddDocente = false;
    },
    async cargarDocentes() {
      this.docentes = (await window.electronAPI.invoke("getDocentes")) || [];
    },
    openDialogEdit(docente) {
      this.openEditDocente = true;
      this.docenteEdit = { ...docente };
    },
    async actualizarDocente() {
      if (!confirm("¿Seguro que quieres guardar los cambios en este docente?"))
        return;

      await window.electronAPI.invoke(
        "updateDocente",
        this.docenteEdit.ID_DOCENTE,
        this.docenteEdit.ID_IDENTIFICACION,
        this.docenteEdit.NOMBRE,
        this.docenteEdit.CORREO,
        this.docenteEdit.TIPO_CONTRATO,
        this.docenteEdit.PERFIL
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
    },
  },
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
  background: hsl(212, 100%, 17%);
  color: #ffd200;
}

.btn-agregar:hover {
  background: #217588;
}

/* Colores institucionales para tablas modernas y legibles, sin brillo */
.tabla-docentes {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background: #fff;
  border-radius: 12px;
  /* Quitar sombra */
  box-shadow: none;
  overflow: hidden;
}
.tabla-docentes th {
  background: hsl(212, 100%, 17%);
  color: #ffd200;
  font-weight: 700;
  padding: 12px;
  text-align: center;
  border-bottom: 2px solid #f0f4f8;
}
.tabla-docentes td {
  padding: 10px;
  border-top: 1px solid #e5e7eb;
  color: #222;
  background: #fff;
}
.tabla-docentes tr:nth-child(even) td {
  background: #f7fafc;
}
.tabla-docentes tr:hover td {
  background: #e3f0ff;
}
.tabla-docentes th,
.tabla-docentes td {
  border: 1px solid #d1d5db;
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

/* ... (tu CSS existente) ... */

/* Estilos comunes para todos los campos de formulario */
input[type="text"],
input[type="number"],
input[type="email"],
select,
textarea {
  width: 100%; /* Asegura que ocupen todo el ancho del contenedor */
  padding: 10px; /* Aumenta el padding para un mejor tacto */
  border: 1px solid #ced4da;
  border-radius: 6px;
  box-sizing: border-box; /* Incluye padding y border en el ancho/alto */
  margin-top: 4px; /* Pequeño margen superior */
  margin-bottom: 8px; /* Pequeño margen inferior */
  font-size: 16px; /* Tamaño de fuente legible */
}

/* Estilo específico para el textarea, ya que debe tener más altura */
textarea {
  resize: vertical; /* Permite redimensionar verticalmente */
  min-height: 100px; /* Altura mínima para el área de texto */
}

/* Estilos de foco para mejorar la usabilidad */
input:focus,
select:focus,
textarea:focus {
  border-color: #007bff; /* Color de borde al enfocar */
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25); /* Sombra suave */
  outline: none; /* Elimina el contorno predeterminado del navegador */
}

.modal-content {
  min-width: 500px;
  font-family: Arial, sans-serif;

}
</style>
