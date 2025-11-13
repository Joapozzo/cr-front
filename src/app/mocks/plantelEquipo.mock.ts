import { PlantelEquipo } from '@/app/types/plantelEquipo';

export const mockPlantelEquipo: PlantelEquipo = {
  id_equipo: 1,
  jugadores: [
    {
      id_jugador: 1,
      nombre: 'Juan',
      apellido: 'Pérez',
      img: '/img/default-avatar.png',
      posicion: {
        id_posicion: 1,
        codigo: 'ARQ',
        nombre: 'Arquero'
      },
      sancionado: 'N',
      eventual: 'N',
      es_capitan: true
    },
    {
      id_jugador: 2,
      nombre: 'Carlos',
      apellido: 'González',
      img: '/img/default-avatar.png',
      posicion: {
        id_posicion: 2,
        codigo: 'DEF',
        nombre: 'Defensor Central'
      },
      sancionado: 'N',
      eventual: 'N',
      es_capitan: false
    },
    {
      id_jugador: 3,
      nombre: 'Luis',
      apellido: 'Martínez',
      img: '/img/default-avatar.png',
      posicion: {
        id_posicion: 5,
        codigo: 'MC',
        nombre: 'Mediocampista Central'
      },
      sancionado: 'S',
      eventual: 'N',
      es_capitan: false
    },
    {
      id_jugador: 4,
      nombre: 'Pedro',
      apellido: 'Rodríguez',
      img: '/img/default-avatar.png',
      posicion: {
        id_posicion: 8,
        codigo: 'DEL',
        nombre: 'Delantero'
      },
      sancionado: 'N',
      eventual: 'S',
      es_capitan: false
    },
    {
      id_jugador: 5,
      nombre: 'Miguel',
      apellido: 'Sánchez',
      img: '/img/default-avatar.png',
      posicion: {
        id_posicion: 3,
        codigo: 'LD',
        nombre: 'Lateral Derecho'
      },
      sancionado: 'N',
      eventual: 'N',
      es_capitan: false
    },
    {
      id_jugador: 6,
      nombre: 'Andrés',
      apellido: 'Fernández',
      img: '/img/default-avatar.png',
      posicion: {
        id_posicion: 6,
        codigo: 'MI',
        nombre: 'Mediocampista Izquierdo'
      },
      sancionado: 'S',
      eventual: 'S',
      es_capitan: false
    },
    {
      id_jugador: 7,
      nombre: 'Diego',
      apellido: 'López',
      img: null,
      posicion: null,
      sancionado: 'N',
      eventual: 'N',
      es_capitan: false
    }
  ]
};

