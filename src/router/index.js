import { createRouter, createWebHashHistory } from "vue-router";
import ViewHome from "../views/ViewHome.vue";
import Docentes from "../views/Docentes.vue";
import Horarios from "../views/Horarios.vue"
const routes = [
  { path: "/", name: "Home", component: ViewHome },
  { path: "/docentes", name: "Docentes", component: Docentes },
  { path: "/Horarios", name: "Horarios", component: Horarios },
];

const router = createRouter({
  history: createWebHashHistory(), // Hash porque es Electron (evita problemas de rutas)
  routes,
});

export default router;
