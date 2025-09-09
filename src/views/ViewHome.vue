<template>
  <div class="home">
    <div class="logo-container">
      <img src="./img/logoUniminuto.png" alt="Logo UniMinuto" class="university-logo">
    </div>
    <h1>🏫 Bienvenido a UniHorarios</h1>
    <p>Selecciona una opción del menú lateral para comenzar.</p>
  </div>
</template>

<script>
export default {
  name: "ViewHome",
};
</script>

<style scoped>
.home {
  padding: 2rem;
  text-align: center;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo-container {
  margin-bottom: 2rem;
  padding: 1rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  max-width: 300px;
}

.university-logo {
  max-width: 100%;
  height: auto;
  display: block;
}

.home h1 {
  font-size: 2.2rem;
  margin-bottom: 1rem;
  color: #2c3e50;
  font-weight: 700;
}

.home p {
  color: #6c757d;
  font-size: 1.1rem;
  max-width: 500px;
  line-height: 1.6;
}

/* Responsive */
@media (max-width: 768px) {
  .home {
    padding: 1.5rem;
  }
  
  .home h1 {
    font-size: 1.8rem;
  }
  
  .logo-container {
    max-width: 250px;
  }
}
</style>