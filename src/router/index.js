import { createRouter, createWebHashHistory } from "vue-router";
import ViewHome from "../views/ViewHome.vue";
import Docentes from "../views/Docentes.vue";
const routes = [
  { path: "/", name: "Home", component: ViewHome },
  { path: "/docentes", name: "Docentes", component: Docentes },
];

const router = createRouter({
  history: createWebHashHistory(), // Hash porque es Electron (evita problemas de rutas)
  routes,
});

export default router;
