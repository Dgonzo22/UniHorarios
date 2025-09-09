<template>
  <div id="app">
    <template v-if="isValid">
      <div class="container">
        <!-- Menú lateral -->
        <aside class="menu">
          <h2>📌 Menú Principal</h2>
          <button @click="$router.push('/docentes')">👨‍🏫 Docentes</button>
          <button @click="$router.push('/horarios')">📅 Horarios</button>
          <button @click="$router.push('/Materias')">📝 Materias</button>
          <button @click="$router.push('/VistaDeHorario')">⌛ Vista de Horario</button>
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
export default {
  name: 'App',
  data() {
    return {
      isValid: false,
      user: 'davidggomez',
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
    }
  }
};
</script>

<style scoped>
/* Contenedor principal */
.container {
  display: flex;
  height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #FFFFFF; 
}

/* Menú lateral */
.menu {
  width: 260px;
  background: #002855; 
  color: #FFD200; 
  padding: 25px 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  box-shadow: 2px 0 10px rgba(0,0,0,0.2);
}

.menu h2 {
  margin-bottom: 25px;
  font-size: 1.6rem;
  text-align: center;
  font-weight: 600;
  color: #FFD200;
}

.menu button {
  background: rgba(255,255,255,0.1);
  border: none;
  color: #fff;
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

/* Área de contenido */
.views {
  flex: 1;
  padding: 40px;
  background-color: #F9F9F9; 
  overflow-y: auto;
  border-radius: 20px 0 0 20px;
  box-shadow: inset 0 0 10px rgba(0,0,0,0.05);
}

/* Login */
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #002855, #001B40);
}

.login-card {
  background: #fff;
  padding: 40px 30px;
  border-radius: 15px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  text-align: center;
  width: 320px;
}

.login-card h2 {
  margin-bottom: 20px;
  font-size: 1.8rem;
  color: #002855;
}

.login-card input {
  width: 100%;
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
</style>

