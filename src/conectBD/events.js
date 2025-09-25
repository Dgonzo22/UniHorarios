import EventsUser from './Events/eventsUser.js';
import EventsMateria from './Events/EventsMaterias.js';
import EventsDocente from './Events/EventsDocentes.js';
import EventsHorario from './Events/EventsHorario.js';
import EventsDia from './Events/EventsDias.js';


function createEvents(){
  EventsUser.createEvents()
  EventsMateria.createEvents()
  EventsDocente.createEvents()
  EventsHorario.createEvents()
  EventsDia.createEvents()
}

export default {createEvents};