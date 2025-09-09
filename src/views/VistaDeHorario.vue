<template>
  <div class="horario-app">
    <!-- Encabezado -->
    <header class="encabezado">
      <div class="marca">
        <div class="logo">🗓️</div>
        <div>
          <h1>Vista de Horario Universitario</h1>
          <p class="subtitulo">Consulta semanal por semestre y grupo</p>
        </div>
      </div>

      <!-- Controles -->
      <div class="controles">
        <div class="control">
          <label for="semestre">Semestre</label>
          <select id="semestre" v-model="filtro.semestre">
            <option value="">Todos</option>
            <option v-for="s in semestres" :key="s" :value="s">Semestre {{ s }}</option>
          </select>
        </div>
        <div class="control">
          <label for="grupo">Grupo</label>
          <select id="grupo" v-model="filtro.grupo">
            <option value="">Todos</option>
            <option v-for="g in grupos" :key="g" :value="g">{{ g }}</option>
          </select>
        </div>
        <div class="control ancho">
          <label for="buscador">Buscar</label>
          <input id="buscador" v-model="busqueda" type="text" placeholder="Materia o docente" />
        </div>
      </div>
    </header>

    <!-- Leyenda -->
    <section class="leyenda">
    
      <span class="chip" v-for="(color, key) in colores" :key="key" :style="{ background: color }">
        Semestre {{ key }}
      </span>
    </section>

    <!-- Calendario semanal -->
    <section class="calendario">
      <table class="tabla-horario">
        <thead>
          <tr>
            <th class="col-hora">Hora</th>
            <th v-for="dia in diasSemana" :key="dia">{{ dia }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="slot in slots" :key="slot.id">
            <td class="col-hora">
              <div class="hora">
                <span>{{ slot.inicio }}</span>
                <span class="separador">–</span>
                <span>{{ slot.fin }}</span>
              </div>
            </td>
            <td v-for="dia in diasSemana" :key="dia" class="celda">
              <div class="celda-contenido">
                <template v-for="bloque in bloquesEnCelda(dia, slot.inicio, slot.fin)" :key="bloque.id">
                  <article
                    class="bloque"
                    :style="estiloBloque(bloque)"
                    :title="tooltip(bloque)"
                  >
                    <header class="bloque-titulo">{{ bloque.materia }}</header>
                    <div class="bloque-detalles">
                      <span>👨‍🏫 {{ bloque.docente }}</span>
                      <span>👥 {{ bloque.grupo }} · S{{ bloque.semestre }}</span>
                      <span>⏰ {{ bloque.horaInicio }}–{{ bloque.horaFin }}</span>
                    </div>
                  </article>
                </template>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Resumen del día seleccionado -->
    <section class="resumen">
      <h2>Resumen del día</h2>
      <div class="resumen-grid">
        <div v-for="dia in diasSemana" :key="dia" class="card">
          <h3>{{ dia }}</h3>
          <ul>
            <li v-for="b in bloquesDelDia(dia)" :key="b.id">
              <strong>{{ b.materia }}</strong> · {{ b.horaInicio }}–{{ b.horaFin }} · {{ b.grupo }} (S{{ b.semestre }}) — {{ b.docente }}
            </li>
            <li v-if="bloquesDelDia(dia).length === 0" class="muted">Sin clases</li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "VistaDeHorario",
  data() {
    return {
      // Catálogos
      diasSemana: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
      semestres: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      grupos: ["Grupo A", "Grupo B"],

      // Filtros / búsqueda
      filtro: { semestre: "", grupo: "" },
      busqueda: "",

      // Paleta por semestre
      colores: {
        1: "#22c55e", // verde
        2: "#3b82f6", // azul
        3: "#a855f7", // morado
        4: "#f59e0b", // ámbar
        5: "#ef4444", // rojo
        6: "#14b8a6", // cian
        7: "#f97316", // naranja
        8: "#0ea5e9", // celeste
        9: "#84cc16", // lima
        10: "#e11d48", // rosado
      },

      // Definición de slots (bloques de 90 minutos)
      slots: [
        { id: 1, inicio: "07:00", fin: "08:30" },
        { id: 2, inicio: "08:30", fin: "10:00" },
        { id: 3, inicio: "10:00", fin: "11:30" },
        { id: 4, inicio: "11:30", fin: "13:00" },
        { id: 5, inicio: "14:00", fin: "15:30" },
        { id: 6, inicio: "15:30", fin: "17:00" },
        { id: 7, inicio: "18:15", fin: "19:45" },
        { id: 8, inicio: "19:45", fin: "21:15" },
      ],

    
      bloques: [
        // Semestre 10
        { id: 1, dia: "Lunes", materia: "Gestión de Proyectos", docente: "Juan  Herrera", grupo: "Grupo A", semestre: 10, horaInicio: "19:45", horaFin: "21:15" },
        { id: 2, dia: "Martes", materia: "Electiva Cp3", docente: "Nieto Olaya", grupo: "Grupo A", semestre: 10,  horaInicio: "18:15", horaFin: "19:45" },
        { id: 3, dia: "Martes", materia: "Electiva Cp3", docente: "Nieto Olaya", grupo: "Grupo A", semestre: 10,  horaInicio: "19:45", horaFin: "21:15" },
        { id: 4, dia: "Miércoles", materia: "Gestión de Proyectos", docente: "Juan  Herrera", grupo: "Grupo A", semestre: 10,  horaInicio: "18:15", horaFin: "19:45" },
        { id: 5, dia: "Jueves", materia: "Sistermas Distribuidos", docente: "Julian Diaz", grupo: "Grupo A", semestre: 10,  horaInicio: "18:15", horaFin: "19:45" },
        { id: 6, dia: "Jueves", materia: "Calidad de Software", docente: "Julian Diaz", grupo: "Grupo A", semestre: 10,  horaInicio: "19:45", horaFin: "21:15" },
        { id: 7, dia: "Viernes", materia: "Sistermas Distribuidos", docente: "Julian Diaz", grupo: "Grupo A", semestre: 10,  horaInicio: "18:15", horaFin: "19:45" },
        { id: 8, dia: "Viernes", materia: "Calidad de Software", docente: "Julian Diaz", grupo: "Grupo A", semestre: 10,  horaInicio: "19:45", horaFin: "21:15" },
    
      ],
    };
  },
  computed: {
    bloquesFiltradosTodos() {
      const termino = this.busqueda.trim().toLowerCase();
      return this.bloques.filter((b) => {
        const coincideSem = this.filtro.semestre ? b.semestre === Number(this.filtro.semestre) : true;
        const coincideGrupo = this.filtro.grupo ? b.grupo === this.filtro.grupo : true;
        const coincideTexto = termino
          ? [b.materia, b.docente, b.grupo].some((v) => String(v).toLowerCase().includes(termino))
          : true;
        return coincideSem && coincideGrupo && coincideTexto;
      });
    },
  },
  methods: {
    // Devuelve bloques que caen dentro de un rango de celda
    bloquesEnCelda(dia, desde, hasta) {
      return this.bloquesFiltradosTodos.filter((b) => b.dia === dia && this.seSolapan(b.horaInicio, b.horaFin, desde, hasta));
    },
    // Comprueba solape de intervalos [a1, a2) y [b1, b2)
    seSolapan(a1, a2, b1, b2) {
      return this.minuto(a1) < this.minuto(b2) && this.minuto(b1) < this.minuto(a2);
    },
    minuto(hhmm) {
      const [h, m] = hhmm.split(":" ).map(Number);
      return h * 60 + m;
    },
    estiloBloque(b) {
      const color = this.colores[b.semestre] || "#64748b";
      return { background: this.tinte(color, 0.15), borderLeft: `5px solid ${color}` };
    },
    tinte(hex, alpha = 0.2) {
      // convierte #rrggbb a rgba(r,g,b,a)
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    },
    tooltip(b) {
      return `${b.materia} — ${b.docente}\n${b.grupo} · Semestre ${b.semestre}\n${b.dia}, ${b.horaInicio}–${b.horaFin}`;
    },
    bloquesDelDia(dia) {
      return this.bloquesFiltradosTodos
        .filter((b) => b.dia === dia)
        .sort((a, z) => this.minuto(a.horaInicio) - this.minuto(z.horaInicio));
    },
  },
};
</script>

<style scoped>
/* Layout general */
.horario-app { background: #f3f6fb; min-height: 100vh; padding-bottom: 32px; }

/* Encabezado */
.encabezado { display: flex; flex-wrap: wrap; gap: 16px; align-items: center; justify-content: space-between; padding: 16px 20px; background: #0f172a; color: #fff; border-bottom: 4px solid #facc15; }
.marca { display: flex; align-items: center; gap: 12px; }
.logo { width: 44px; height: 44px; display: grid; place-items: center; background: #1e293b; border-radius: 12px; font-size: 22px; }
.encabezado h1 { margin: 0; font-size: 1.4rem; }
.subtitulo { margin: 0; opacity: .9; }

/* Controles */
.controles { display: flex; gap: 12px; flex-wrap: wrap; }
.control { display: grid; gap: 6px; }
.control.ancho { min-width: 260px; }
select, input[type="text"] { padding: 8px 10px; border-radius: 8px; border: 1px solid #cbd5e1; background: #fff; min-width: 160px; outline: none; transition: box-shadow .2s, border-color .2s; }
select:focus, input[type="text"]:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,.2); }

/* Leyenda */
.leyenda { display: flex; gap: 8px; flex-wrap: wrap; padding: 12px 20px; }
.chip { display: inline-flex; align-items: center; gap: 6px; color: #0b1325; font-weight: 600; padding: 6px 10px; border-radius: 999px; box-shadow: 0 1px 0 rgba(0,0,0,.08) inset; }

/* Calendario */
.calendario { padding: 0 20px; }
.tabla-horario { width: 100%; border-collapse: separate; border-spacing: 0; background: #fff; border-radius: 14px; overflow: hidden; box-shadow: 0 8px 24px rgba(2,6,23,.08); }
.tabla-horario thead th { background: #0f172a; color: #fff; font-weight: 700; letter-spacing: .2px; padding: 12px; text-align: center; }
.col-hora { width: 140px; background: #0b1325; color: #e2e8f0; font-weight: 700; }
.tabla-horario tbody td { border-top: 1px solid #e2e8f0; border-right: 1px solid #eef2f7; vertical-align: top; }
.tabla-horario tbody tr td:first-child { position: sticky; left: 0; background: #0b1325; color: #e2e8f0; z-index: 2; }

.hora { display: flex; justify-content: center; align-items: center; gap: 6px; padding: 10px; font-variant-numeric: tabular-nums; }
.hora .separador { opacity: .7; }

.celda { height: 120px; }
.celda-contenido { display: flex; flex-direction: column; gap: 8px; padding: 10px; min-height: 100%; background: linear-gradient(180deg, rgba(241,245,249,0.6), rgba(255,255,255,0)); }

/* Bloques */
.bloque { display: grid; gap: 6px; background: #e2e8f0; border-left: 5px solid #64748b; border-radius: 10px; padding: 10px; box-shadow: 0 4px 10px rgba(2,6,23,.06); transition: transform .1s ease, box-shadow .1s ease; }
.bloque:hover { transform: translateY(-1px); box-shadow: 0 8px 18px rgba(2,6,23,.12); }
.bloque-titulo { font-weight: 800; color: #0f172a; }
.bloque-detalles { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 4px 10px; font-size: .85rem; color: #334155; }

/* Resumen */
.resumen { padding: 20px; }
.resumen h2 { margin: 0 0 10px; color: #0f172a; }
.resumen-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 12px; }
.card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px; box-shadow: 0 6px 16px rgba(2,6,23,.06); }
.card h3 { margin: 0 0 8px; color: #0b1325; }
.card ul { margin: 0; padding-left: 18px; }
.card li { margin-bottom: 6px; }
.muted { color: #64748b; font-style: italic; }

/* Responsive */
@media (max-width: 900px) {
  .col-hora { width: 100px; }
  .celda { height: 140px; }
  .bloque-detalles { grid-template-columns: 1fr; }
}

@media (max-width: 640px) {
  .controles { width: 100%; }
  .control { width: 100%; }
  .calendario { padding: 0 12px; }
}
</style>
