import { createRouter, createWebHashHistory } from "vue-router"
import ViewHome from "../views/ViewHome.vue"
import Horarios from "../views/Horarios.vue"
const routes = [
  { path: "/", name: "Home", component: ViewHome },
  { path: "/Horarios", name: "Horarios", component: Horarios },
]

const router = createRouter({
  history: createWebHashHistory(), // Hash porque es Electron (evita problemas de rutas)
  routes
})




export default router
