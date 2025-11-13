import { ParticipacionEquipo } from '@/app/types/participacionEquipo';

export const mockParticipacionesEquipo: ParticipacionEquipo[] = [
  {
    id_categoria_edicion: 1,
    nombre_categoria: 'Primera A - Masculino',
    nombre_edicion: 'Clausura 2025',
    temporada: 2025,
    posicion_final: 1,
    instancia_eliminacion: 'campeon',
    goles_anotados: 45,
    goles_recibidos: 18,
    vallas_invictas: 8,
    posiciones: [
      {
        id_equipo: 1,
        nombre_equipo: 'Los Tigres FC',
        partidos_jugados: 14,
        ganados: 12,
        empatados: 2,
        perdidos: 0,
        goles_favor: 45,
        goles_contra: 18,
        diferencia_goles: 27,
        puntos: 38,
        ultima_actualizacion: '2025-01-20',
        img_equipo: '/img/default-team.png'
      },
      {
        id_equipo: 2,
        nombre_equipo: 'Real Fútbol',
        partidos_jugados: 14,
        ganados: 10,
        empatados: 2,
        perdidos: 2,
        goles_favor: 38,
        goles_contra: 22,
        diferencia_goles: 16,
        puntos: 32,
        ultima_actualizacion: '2025-01-20',
        img_equipo: '/img/default-team.png'
      },
      {
        id_equipo: 3,
        nombre_equipo: 'Deportivo Unidos',
        partidos_jugados: 14,
        ganados: 9,
        empatados: 1,
        perdidos: 4,
        goles_favor: 32,
        goles_contra: 25,
        diferencia_goles: 7,
        puntos: 28,
        ultima_actualizacion: '2025-01-20',
        img_equipo: '/img/default-team.png'
      },
      {
        id_equipo: 4,
        nombre_equipo: 'Club Atlético',
        partidos_jugados: 14,
        ganados: 8,
        empatados: 1,
        perdidos: 5,
        goles_favor: 28,
        goles_contra: 25,
        diferencia_goles: 3,
        puntos: 25,
        ultima_actualizacion: '2025-01-20',
        img_equipo: '/img/default-team.png'
      },
      {
        id_equipo: 5,
        nombre_equipo: 'FC Campeones',
        partidos_jugados: 14,
        ganados: 7,
        empatados: 1,
        perdidos: 6,
        goles_favor: 25,
        goles_contra: 26,
        diferencia_goles: -1,
        puntos: 22,
        ultima_actualizacion: '2025-01-20',
        img_equipo: '/img/default-team.png'
      }
    ],
    goleadores: [
      {
        id_jugador: 1,
        nombre: 'Juan',
        apellido: 'Pérez',
        img: '/img/default-avatar.png',
        equipo: { id_equipo: 1, nombre: 'Los Tigres FC', img: '/img/default-team.png' },
        categoria_edicion: 'Primera A - Clausura 2025',
        valor: 15
      },
      {
        id_jugador: 4,
        nombre: 'Pedro',
        apellido: 'Rodríguez',
        img: '/img/default-avatar.png',
        equipo: { id_equipo: 1, nombre: 'Los Tigres FC', img: '/img/default-team.png' },
        categoria_edicion: 'Primera A - Clausura 2025',
        valor: 12
      },
      {
        id_jugador: 5,
        nombre: 'Miguel',
        apellido: 'Sánchez',
        img: '/img/default-avatar.png',
        equipo: { id_equipo: 1, nombre: 'Los Tigres FC', img: '/img/default-team.png' },
        categoria_edicion: 'Primera A - Clausura 2025',
        valor: 10
      },
      {
        id_jugador: 2,
        nombre: 'Carlos',
        apellido: 'González',
        img: '/img/default-avatar.png',
        equipo: { id_equipo: 2, nombre: 'Real Fútbol', img: '/img/default-team.png' },
        categoria_edicion: 'Primera A - Clausura 2025',
        valor: 9
      }
    ],
    mejores_jugadores: [
      {
        id_jugador: 1,
        nombre: 'Juan',
        apellido: 'Pérez',
        img: '/img/default-avatar.png',
        equipo: { id_equipo: 1, nombre: 'Los Tigres FC', img: '/img/default-team.png' },
        categoria_edicion: 'Primera A - Clausura 2025',
        valor: 8
      },
      {
        id_jugador: 4,
        nombre: 'Pedro',
        apellido: 'Rodríguez',
        img: '/img/default-avatar.png',
        equipo: { id_equipo: 1, nombre: 'Los Tigres FC', img: '/img/default-team.png' },
        categoria_edicion: 'Primera A - Clausura 2025',
        valor: 6
      },
      {
        id_jugador: 5,
        nombre: 'Miguel',
        apellido: 'Sánchez',
        img: '/img/default-avatar.png',
        equipo: { id_equipo: 1, nombre: 'Los Tigres FC', img: '/img/default-team.png' },
        categoria_edicion: 'Primera A - Clausura 2025',
        valor: 5
      }
    ],
    maximos_asistentes: [
      {
        id_jugador: 6,
        nombre: 'Andrés',
        apellido: 'Fernández',
        img: '/img/default-avatar.png',
        equipo: { id_equipo: 1, nombre: 'Los Tigres FC', img: '/img/default-team.png' },
        categoria_edicion: 'Primera A - Clausura 2025',
        valor: 10
      },
      {
        id_jugador: 1,
        nombre: 'Juan',
        apellido: 'Pérez',
        img: '/img/default-avatar.png',
        equipo: { id_equipo: 1, nombre: 'Los Tigres FC', img: '/img/default-team.png' },
        categoria_edicion: 'Primera A - Clausura 2025',
        valor: 7
      },
      {
        id_jugador: 4,
        nombre: 'Pedro',
        apellido: 'Rodríguez',
        img: '/img/default-avatar.png',
        equipo: { id_equipo: 1, nombre: 'Los Tigres FC', img: '/img/default-team.png' },
        categoria_edicion: 'Primera A - Clausura 2025',
        valor: 6
      }
    ],
    zonas_playoff: []
  },
  {
    id_categoria_edicion: 2,
    nombre_categoria: 'Primera A - Masculino',
    nombre_edicion: 'Apertura 2024',
    temporada: 2024,
    posicion_final: 3,
    instancia_eliminacion: 'semifinal',
    goles_anotados: 38,
    goles_recibidos: 25,
    vallas_invictas: 5,
    posiciones: [
      {
        id_equipo: 2,
        nombre_equipo: 'Real Fútbol',
        partidos_jugados: 12,
        ganados: 10,
        empatados: 1,
        perdidos: 1,
        goles_favor: 40,
        goles_contra: 15,
        diferencia_goles: 25,
        puntos: 31,
        ultima_actualizacion: '2024-06-15',
        img_equipo: '/img/default-team.png'
      },
      {
        id_equipo: 3,
        nombre_equipo: 'Deportivo Unidos',
        partidos_jugados: 12,
        ganados: 9,
        empatados: 2,
        perdidos: 1,
        goles_favor: 35,
        goles_contra: 18,
        diferencia_goles: 17,
        puntos: 29,
        ultima_actualizacion: '2024-06-15',
        img_equipo: '/img/default-team.png'
      },
      {
        id_equipo: 1,
        nombre_equipo: 'Los Tigres FC',
        partidos_jugados: 12,
        ganados: 8,
        empatados: 3,
        perdidos: 1,
        goles_favor: 38,
        goles_contra: 25,
        diferencia_goles: 13,
        puntos: 27,
        ultima_actualizacion: '2024-06-15',
        img_equipo: '/img/default-team.png'
      },
      {
        id_equipo: 4,
        nombre_equipo: 'Club Atlético',
        partidos_jugados: 12,
        ganados: 7,
        empatados: 2,
        perdidos: 3,
        goles_favor: 28,
        goles_contra: 22,
        diferencia_goles: 6,
        puntos: 23,
        ultima_actualizacion: '2024-06-15',
        img_equipo: '/img/default-team.png'
      }
    ],
    goleadores: [
      {
        id_jugador: 2,
        nombre: 'Carlos',
        apellido: 'González',
        img: '/img/default-avatar.png',
        equipo: { id_equipo: 2, nombre: 'Real Fútbol', img: '/img/default-team.png' },
        categoria_edicion: 'Primera A - Apertura 2024',
        valor: 14
      },
      {
        id_jugador: 1,
        nombre: 'Juan',
        apellido: 'Pérez',
        img: '/img/default-avatar.png',
        equipo: { id_equipo: 1, nombre: 'Los Tigres FC', img: '/img/default-team.png' },
        categoria_edicion: 'Primera A - Apertura 2024',
        valor: 12
      },
      {
        id_jugador: 4,
        nombre: 'Pedro',
        apellido: 'Rodríguez',
        img: '/img/default-avatar.png',
        equipo: { id_equipo: 1, nombre: 'Los Tigres FC', img: '/img/default-team.png' },
        categoria_edicion: 'Primera A - Apertura 2024',
        valor: 9
      }
    ],
    mejores_jugadores: [
      {
        id_jugador: 2,
        nombre: 'Carlos',
        apellido: 'González',
        img: '/img/default-avatar.png',
        equipo: { id_equipo: 2, nombre: 'Real Fútbol', img: '/img/default-team.png' },
        categoria_edicion: 'Primera A - Apertura 2024',
        valor: 7
      },
      {
        id_jugador: 1,
        nombre: 'Juan',
        apellido: 'Pérez',
        img: '/img/default-avatar.png',
        equipo: { id_equipo: 1, nombre: 'Los Tigres FC', img: '/img/default-team.png' },
        categoria_edicion: 'Primera A - Apertura 2024',
        valor: 6
      },
      {
        id_jugador: 4,
        nombre: 'Pedro',
        apellido: 'Rodríguez',
        img: '/img/default-avatar.png',
        equipo: { id_equipo: 1, nombre: 'Los Tigres FC', img: '/img/default-team.png' },
        categoria_edicion: 'Primera A - Apertura 2024',
        valor: 4
      }
    ],
    maximos_asistentes: [
      {
        id_jugador: 6,
        nombre: 'Andrés',
        apellido: 'Fernández',
        img: '/img/default-avatar.png',
        equipo: { id_equipo: 1, nombre: 'Los Tigres FC', img: '/img/default-team.png' },
        categoria_edicion: 'Primera A - Apertura 2024',
        valor: 8
      },
      {
        id_jugador: 1,
        nombre: 'Juan',
        apellido: 'Pérez',
        img: '/img/default-avatar.png',
        equipo: { id_equipo: 1, nombre: 'Los Tigres FC', img: '/img/default-team.png' },
        categoria_edicion: 'Primera A - Apertura 2024',
        valor: 6
      },
      {
        id_jugador: 7,
        nombre: 'Martín',
        apellido: 'López',
        img: '/img/default-avatar.png',
        equipo: { id_equipo: 2, nombre: 'Real Fútbol', img: '/img/default-team.png' },
        categoria_edicion: 'Primera A - Apertura 2024',
        valor: 5
      }
    ],
    zonas_playoff: []
  }
];

