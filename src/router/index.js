import { createRouter, createWebHashHistory } from "vue-router";
import ViewHome from "../views/ViewHome.vue";
import Docentes from "../views/Docentes.vue";
import Horarios from "../views/Horarios.vue";
import Materias from "../views/Materias.vue";
import VistaDeHorario from "../views/VistaDeHorario.vue"
import ViewCalendario from "../views/ViewCalendario.vue"
const routes = [
  { path: "/", name: "Home", component: ViewHome },
  { path: "/docentes", name: "Docentes", component: Docentes },
  { path: "/Horarios", name: "Horarios", component: Horarios },
  { path: "/Materias", name: "Materias", component: Materias },
  { path: "/VistaDeHorario", name: "VistaDeHorario", component: VistaDeHorario },
  { path: "/ViewCalendario", name: "ViewCalendario", component: ViewCalendario}
];

const router = createRouter({
  history: createWebHashHistory(), // Hash porque es Electron (evita problemas de rutas)
  routes,
});

export default router;
