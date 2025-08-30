import { createRouter, createWebHashHistory } from "vue-router"
import ViewHome from "../views/ViewHome.vue"


const routes = [
  { path: "/", name: "Home", component: ViewHome },
]

const router = createRouter({
  history: createWebHashHistory(), // Hash porque es Electron (evita problemas de rutas)
  routes
})

export default router
