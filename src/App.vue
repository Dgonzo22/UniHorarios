<template>
  <div>
    <h2>📌 App Principal</h2>
    <template v-if="isValid">
      <router-view />
    </template>
    <template v-else>
      <input type="text" v-model="user">
      <input type="password" v-model="password">
      <button @click="login">Ingresar</button>
    </template>
  </div>
</template>
<script>

export default {
  name: 'App',
  data(){
    return {
      isValid: false,
      user: '',
      password: ''
    }
  },
  methods: {
    async login(){

    
    }
  }
}
</script>
<style scoped>
</style>