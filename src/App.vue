<template>
  <div id="app">
    <template v-if="isValid">
      <div class="container">
        <!-- Menú lateral -->
        <aside class="menu">
          <img src="/src/views/img/backgroundUNI.jpg" alt="Fondo Uniminuto" style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;opacity:0.35;z-index:0;background-color: rgba(2, 7, 69, 0.5);">
          <div style="position:relative;z-index:1;display:flex;flex-direction:column;height:100%;">
            <h2>📌 Menú Principal</h2>
            <button @click="$router.push('/docentes')">👨‍🏫 Docentes</button>
            <button @click="$router.push('/horarios')">📅 Carga De Horarios</button>
            <button @click="$router.push('/Materias')">📝 Materias</button>
            <button @click="$router.push('/ViewCalendario')">⌛ Vista De Horario</button>
            <hr />
            <button class="btn-exit" @click="cerrarApp">❌ Salir del programa</button>
          </div>
        </aside>

        <!-- Vista dinámica -->
        <main class="views">          
          <router-view />
        </main>
      </div>
    </template>

    <!-- Login -->
    <template v-else>
      <div class="login-container">
        <div class="login-card">
          <h2>🔐 Iniciar Sesión</h2>
          <input type="text" v-model="user" placeholder="Usuario" />
          <input type="password" v-model="password" placeholder="Contraseña" />
          <button @click="login">Ingresar</button>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { onMounted } from "vue";

export default {
  name: 'App',
  data() {
    return {
      isValid: false,
      user: 'Admin',
      password: '123'
    };
  },
  methods: {
    async login() {
      const result = await window.electronAPI.invoke("checkLogin", this.user, this.password);
      if (!result) {
        alert("Usuario o contraseña incorrectos");
      } else {
        this.isValid = true;
      }
    },
    cerrarApp() {
      console.log('Cerrando la aplicación...');
      window.electronAPI.closeApp(); // Requiere exponer esto en preload.js
    }
  },
  setup() {
    onMounted(() => {
      document.querySelectorAll("input").forEach(input => {
        input.setAttribute("autocomplete", "off");
        input.setAttribute("autocorrect", "off");
        input.setAttribute("autocapitalize", "off");
        input.setAttribute("spellcheck", "false");
      });
    });
  }

  };
</script>
<style scoped>
/* Contenedor principal */
.container {
  display: flex;
  height: 100vh;
  min-height: 100vh;
  font-size: 15px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #FFFFFF;
  overflow: hidden;
}

/* Menú lateral */
.menu {
  width: 260px;
  position: relative;
  color: #FFD200; 
  padding: 25px 20px;
  display: flex;
  flex-direction: column;
  gap: 25px; /* Espaciado más amplio entre elementos */
  box-shadow: 2px 0 10px rgba(0,0,0,0.2);
}

.menu h2 {
  margin-bottom: 25px;
  font-size: 1.6rem;
  text-align: center;
  font-weight: 600;
  color: #FFD200;
  background: rgba(2, 7, 69, 0.7); /* Fondo azul institucional semitransparente solo para el título */
  border-radius: 10px;
  padding: 12px 0;
}

.menu button {
  background: rgba(2, 7, 69, 0.7);
  border: none;
  color: #ffffff;
  padding: 12px 15px;
  text-align: left;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
}

.menu button:hover {
  background: #FFD200; 
  color: #002855;     
  transform: translateX(5px);
}

.menu div {
  display: flex;
  flex-direction: column;
  gap: 22px; 
}

/* Área de contenido */
.views {
  flex: 1;
  padding: 40px;
  background-color: transparent; /* Elimina el fondo blanco */
  overflow-y: auto;
  border-radius: 20px 0 0 10px;
}

/* Login */
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #002855, #001B40);
  position: center;
}

.login-container::before {
  content: "";
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: url('/src/views/img/backgroundUNI.jpg') no-repeat center center;
  background-size: cover;
  opacity: 0.7;
  z-index: 0;
}

.login-card {
  position: relative;
  z-index: 1;
  background: #fff;
  padding: 40px 20px;
  border-radius: 15px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  text-align: center;
  width: 320px;
  align-items: center;
}

.login-card h2 {
  margin-bottom: 20px;
  font-size: 1.8rem;
  color: #002855;
}

.login-card input {
  width: 90%;
  padding: 12px;
  margin: 10px 0;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
  outline: none;
  transition: border 0.2s;
}

.login-card input:focus {
  border-color: #FFD200;
  box-shadow: 0 0 6px rgba(255, 210, 0, 0.6);
}

.login-card button {
  width: 100%;
  padding: 12px;
  margin-top: 15px;
  border-radius: 8px;
  border: none;
  background: #FFD200;
  color: #002855; 
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.login-card button:hover {
  background: #002855; 
  color: #FFD200; 
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.2);
}

.btn-logout {
  background: #ffcc00;
  color: #002855;
  margin-top: 20px;
}

.btn-logout:hover {
  background: #e6b800;
  color: #002855;
}

.btn-exit {
  background: #e74c3c;
  color: white;
}

.btn-exit:hover {
  background: #c0392b;


}
</style>

