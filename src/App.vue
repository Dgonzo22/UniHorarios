<template>
  <div id="app">
    <template v-if="isValid">
      <div class="container">
        <aside class="menu">
          <h2>📌 Menú Principal</h2>
          <button @click="$router.push('/docentes')">Docentes</button>
          <button @click="$router.push('/horarios')">Horarios</button>
        </aside>
        <main class="views">
          <router-view />
        </main>
      </div>
    </template>

    <template v-else>
      <div class="login-container">
        <h2>Iniciar Sesión</h2>
        <input type="text" v-model="user" placeholder="Usuario" />
        <input type="password" v-model="password" placeholder="Contraseña" />
        <button @click="login">Ingresar</button>
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
      user: '',
      password: ''
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
}

/* Menú lateral */
.menu {
  width: 250px;
  background-color: #2c3e50;
  color: #ecf0f1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.menu h2 {
  margin-bottom: 20px;
  font-size: 1.5rem;
}

.menu button {
  background-color: #34495e;
  border: none;
  color: #ecf0f1;
  padding: 10px 15px;
  text-align: left;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
}

.menu button:hover {
  background-color: #1abc9c;
}

/* Área de contenido */
.views {
  flex: 1;
  padding: 30px;
  background-color: #ecf0f1;
  overflow-y: auto;
}

/* Login */
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(to right, #1abc9c, #16a085);
  color: #fff;
  padding: 20px;
  box-sizing: border-box;
}

.login-container h2 {
  margin-bottom: 20px;
  font-size: 2rem;
}

.login-container input {
  width: 250px;
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
  border: none;
  font-size: 1rem;
}

.login-container button {
  width: 270px;
  padding: 10px;
  margin-top: 10px;
  border-radius: 5px;
  border: none;
  background-color: #2c3e50;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.login-container button:hover {
  background-color: #34495e;
}
</style>
