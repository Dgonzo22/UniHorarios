<template>
  <div class="materias">
    <h2 class="titulo">📚 Gestión de Materias</h2>

    <!-- Modal para agregar/editar -->
    <ComDialog 
      :visible="openNewMateria"
      class="modal"
      @closeDialog="openNewMateria = false"
      title="📝 Nueva Materia"
    >
      <div class="modal-content">
        <div class="input-group">
          <label>Nombre de la materia:</label>
          <input 
            type="text" 
            v-model="nuevaMateria.nombre" 
            placeholder="Nombre de la materia" 
            required 
          />
        </div>

        <div class="input-group">
          <label>NRC:</label>
          <input 
            type="text" 
            v-model="nuevaMateria.nrc" 
            placeholder="NRC" 
            required 
          />
        </div>

        <div class="input-group">
          <label>Número de créditos:</label>
          <input 
            type="number" 
            v-model="nuevaMateria.creditos" 
            placeholder="Número de créditos" 
            min="1" 
            max="3" 
            required 
          />
        </div>

        <div class="modal-actions">
          <button type="submit" 
            @click="guardarMateria" class="btn-guardar">
            ➕ Guardar Materia
          </button>
          <button @click="openNewMateria = false" class="btn-cancelar">❌ Cancelar</button>
        </div>
      </div>
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
    <!-- Alerta de mensajes-->
    <ComDialog
      title=""
      class="modal"
      :visible="openAlertaMensaje"
      @closeDialog="openAlertaMensaje = false"
    >
      <template v-if="tipoAlerta=='error'">
        <div class="error">
          {{ mensajeAlerta  }}
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
import ComDialog from '../components/ComDialog.vue'

export default {
  components: { ComDialog },
  name: "Materias",
  data() {
    return {
      materias: [],
      nuevaMateria: { nombre: "", nrc: "", creditos: "" },
      openNewMateria: false,
      editandoIndex: null,
      //alerta mensaje
      openAlertaMensaje: false,
      mensajeAlerta: "",
      tipoAlerta: "",
    };
  },
  async created() {
    this.cargarMaterias();
  },
  methods: {
    mostrarAlerta (tipo, mensaje) {
      this.tipoAlerta = tipo;
      this.mensajeAlerta = mensaje;
      this.openAlertaMensaje = true;
    },
    async cargarMaterias() {
      const result = await window.electronAPI.invoke("getMaterias");
      this.materias = result || [];
    },

    nuevaMateriaDialog() {
      this.nuevaMateria = { nombre: "", nrc: "", creditos: "" };
      this.editandoIndex = null;
      this.openNewMateria = true;
    },



    async guardarMateria() {
      if (this.editandoIndex === null) {
        //validacion antes de editar
        if (
          !this.nuevaMateria.nombre ||
          !this.nuevaMateria.nrc ||
          !this.nuevaMateria.creditos
        ) {
          this.mostrarAlerta("error","⚠️ Por favor, completa todos los campos antes de guardar.");
          return;
        }

        //validacion de creditos
        const creditos = parseInt(this.nuevaMateria.creditos);
        if (isNaN(creditos) || creditos < 1 || creditos > 3) {
          this.mostrarAlerta("error","⚠️ El número de créditos debe ser un valor entre 1 y 3.");
          return;
        }

        // Insertar
        await window.electronAPI.invoke(
          "insertMateria",
          this.nuevaMateria.nombre,
          this.nuevaMateria.nrc,
          this.nuevaMateria.creditos
        );
      } else {
        //validacion antes de editar
        if (
          !this.nuevaMateria.nombre ||
          !this.nuevaMateria.nrc ||
          !this.nuevaMateria.creditos
        ) {
          this.mostrarAlerta("error","⚠️ Por favor, completa todos los campos antes de guardar.");
          return;
        }
        //validacion de creditos
        const creditos = parseInt(this.nuevaMateria.creditos);
        if (isNaN(creditos) || creditos < 1 || creditos > 3) {
          this.mostrarAlerta("error","⚠️ El número de créditos debe ser un valor entre 1 y 3.");
          return;
        }

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
      this.openNewMateria = false;
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
  background: hsl(212, 100%, 17%);
  color: #ffD200;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: 0.3s;
}
.btn:hover { background: #3a56c4; }
.tabla-container {
  overflow-x: auto;
  margin-top: 1rem;
}
.tabla caption {
  caption-side: top;
  text-align: center;
  margin-bottom: 18px; /* Espacio extra debajo del botón */
}
.btn {
  margin-bottom: 0;
}

.btn-guardar {
  background: #007bff;
  color: white;
}

.btn-guardar:hover {
  background: #0056b3;
}

/* Colores institucionales para tablas modernas y legibles, sin brillo */
.tabla {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 12px;
  /* Quitar sombra */
  box-shadow: none;
  overflow: hidden;
}
/* Encabezado sin brillo ni amarillo, institucional y moderno */
th {
  background: #002855;
  color: #ffD200;
  font-weight: 700;
  padding: 12px;
  text-align: center;
  border-bottom: 2px solid #f0f4f8;
}
td {
  padding: 10px;
  border-top: 1px solid #e5e7eb;
  color: #222;
  background: #fff;
}
tr:nth-child(even) td {
  background: #f7fafc;
}
tr:hover td {
  background: #e3f0ff;
}
th, td {
  border: 1px solid #d1d5db;
}
.sin-registros { text-align: center; color: #7f8c8d; font-style: italic; }
.acciones { display: flex; gap: 0.5rem; justify-content: center; }
.btn.editar { background: #36b9cc; }
.btn.editar:hover { background: #2c9faf; }
.btn.eliminar { background: #e74a3b; }
.btn.eliminar:hover { background: #d52a1a; }

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
