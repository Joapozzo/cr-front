import { JugadorEstadistica } from '@/app/types/estadisticas';
import { EquipoPosicion } from '@/app/types/posiciones';

export const mockEquipoStats = {
  // Posiciones de la tabla (todos los equipos de la categoría, pero destacando el equipo actual)
  posiciones: [
    {
      id_equipo: 1,
      nombre_equipo: 'Los Tigres FC',
      partidos_jugados: 10,
      ganados: 8,
      empatados: 1,
      perdidos: 1,
      goles_favor: 25,
      goles_contra: 8,
      diferencia_goles: 17,
      puntos: 25,
      ultima_actualizacion: '2025-01-10',
      img_equipo: '/img/default-team.png'
    },
    {
      id_equipo: 2,
      nombre_equipo: 'Real Fútbol',
      partidos_jugados: 10,
      ganados: 7,
      empatados: 2,
      perdidos: 1,
      goles_favor: 22,
      goles_contra: 10,
      diferencia_goles: 12,
      puntos: 23,
      ultima_actualizacion: '2025-01-10',
      img_equipo: '/img/default-team.png'
    },
    {
      id_equipo: 3,
      nombre_equipo: 'Deportivo Unidos',
      partidos_jugados: 10,
      ganados: 6,
      empatados: 2,
      perdidos: 2,
      goles_favor: 18,
      goles_contra: 12,
      diferencia_goles: 6,
      puntos: 20,
      ultima_actualizacion: '2025-01-10',
      img_equipo: '/img/default-team.png'
    },
    {
      id_equipo: 4,
      nombre_equipo: 'Club Atlético',
      partidos_jugados: 10,
      ganados: 5,
      empatados: 3,
      perdidos: 2,
      goles_favor: 16,
      goles_contra: 11,
      diferencia_goles: 5,
      puntos: 18,
      ultima_actualizacion: '2025-01-10',
      img_equipo: '/img/default-team.png'
    },
    {
      id_equipo: 5,
      nombre_equipo: 'FC Campeones',
      partidos_jugados: 10,
      ganados: 4,
      empatados: 4,
      perdidos: 2,
      goles_favor: 14,
      goles_contra: 10,
      diferencia_goles: 4,
      puntos: 16,
      ultima_actualizacion: '2025-01-10',
      img_equipo: '/img/default-team.png'
    }
  ] as EquipoPosicion[],

  // Estadísticas de jugadores del equipo (solo jugadores del equipo actual)
  goleadores: [
    {
      id_jugador: 1,
      nombre: 'Juan',
      apellido: 'Pérez',
      img: '/img/default-avatar.png',
      equipo: { id_equipo: 1, nombre: 'Los Tigres FC', img: '/img/default-team.png' },
      categoria_edicion: 'Primera A - Clausura 2025',
      valor: 12
    },
    {
      id_jugador: 4,
      nombre: 'Pedro',
      apellido: 'Rodríguez',
      img: '/img/default-avatar.png',
      equipo: { id_equipo: 1, nombre: 'Los Tigres FC', img: '/img/default-team.png' },
      categoria_edicion: 'Primera A - Clausura 2025',
      valor: 8
    },
    {
      id_jugador: 5,
      nombre: 'Miguel',
      apellido: 'Sánchez',
      img: '/img/default-avatar.png',
      equipo: { id_equipo: 1, nombre: 'Los Tigres FC', img: '/img/default-team.png' },
      categoria_edicion: 'Primera A - Clausura 2025',
      valor: 6
    },
    {
      id_jugador: 2,
      nombre: 'Carlos',
      apellido: 'González',
      img: '/img/default-avatar.png',
      equipo: { id_equipo: 1, nombre: 'Los Tigres FC', img: '/img/default-team.png' },
      categoria_edicion: 'Primera A - Clausura 2025',
      valor: 5
    }
  ] as JugadorEstadistica[],
  
  asistencias: [
    {
      id_jugador: 6,
      nombre: 'Andrés',
      apellido: 'Fernández',
      img: '/img/default-avatar.png',
      equipo: { id_equipo: 1, nombre: 'Los Tigres FC', img: '/img/default-team.png' },
      categoria_edicion: 'Primera A - Clausura 2025',
      valor: 7
    },
    {
      id_jugador: 1,
      nombre: 'Juan',
      apellido: 'Pérez',
      img: '/img/default-avatar.png',
      equipo: { id_equipo: 1, nombre: 'Los Tigres FC', img: '/img/default-team.png' },
      categoria_edicion: 'Primera A - Clausura 2025',
      valor: 5
    },
    {
      id_jugador: 4,
      nombre: 'Pedro',
      apellido: 'Rodríguez',
      img: '/img/default-avatar.png',
      equipo: { id_equipo: 1, nombre: 'Los Tigres FC', img: '/img/default-team.png' },
      categoria_edicion: 'Primera A - Clausura 2025',
      valor: 4
    }
  ] as JugadorEstadistica[],
  
  amarillas: [
    {
      id_jugador: 3,
      nombre: 'Luis',
      apellido: 'Martínez',
      img: '/img/default-avatar.png',
      equipo: { id_equipo: 1, nombre: 'Los Tigres FC', img: '/img/default-team.png' },
      categoria_edicion: 'Primera A - Clausura 2025',
      valor: 4
    },
    {
      id_jugador: 6,
      nombre: 'Andrés',
      apellido: 'Fernández',
      img: '/img/default-avatar.png',
      equipo: { id_equipo: 1, nombre: 'Los Tigres FC', img: '/img/default-team.png' },
      categoria_edicion: 'Primera A - Clausura 2025',
      valor: 3
    },
    {
      id_jugador: 1,
      nombre: 'Juan',
      apellido: 'Pérez',
      img: '/img/default-avatar.png',
      equipo: { id_equipo: 1, nombre: 'Los Tigres FC', img: '/img/default-team.png' },
      categoria_edicion: 'Primera A - Clausura 2025',
      valor: 2
    }
  ] as JugadorEstadistica[],
  
  rojas: [
    {
      id_jugador: 3,
      nombre: 'Luis',
      apellido: 'Martínez',
      img: '/img/default-avatar.png',
      equipo: { id_equipo: 1, nombre: 'Los Tigres FC', img: '/img/default-team.png' },
      categoria_edicion: 'Primera A - Clausura 2025',
      valor: 1
    },
    {
      id_jugador: 6,
      nombre: 'Andrés',
      apellido: 'Fernández',
      img: '/img/default-avatar.png',
      equipo: { id_equipo: 1, nombre: 'Los Tigres FC', img: '/img/default-team.png' },
      categoria_edicion: 'Primera A - Clausura 2025',
      valor: 1
    }
  ] as JugadorEstadistica[],
  
  mvps: [
    {
      id_jugador: 1,
      nombre: 'Juan',
      apellido: 'Pérez',
      img: '/img/default-avatar.png',
      equipo: { id_equipo: 1, nombre: 'Los Tigres FC', img: '/img/default-team.png' },
      categoria_edicion: 'Primera A - Clausura 2025',
      valor: 5
    },
    {
      id_jugador: 4,
      nombre: 'Pedro',
      apellido: 'Rodríguez',
      img: '/img/default-avatar.png',
      equipo: { id_equipo: 1, nombre: 'Los Tigres FC', img: '/img/default-team.png' },
      categoria_edicion: 'Primera A - Clausura 2025',
      valor: 3
    },
    {
      id_jugador: 5,
      nombre: 'Miguel',
      apellido: 'Sánchez',
      img: '/img/default-avatar.png',
      equipo: { id_equipo: 1, nombre: 'Los Tigres FC', img: '/img/default-team.png' },
      categoria_edicion: 'Primera A - Clausura 2025',
      valor: 2
    }
  ] as JugadorEstadistica[],

  // Zonas de playoff (si aplica)
  zonasPlayoff: [] as any[]
};
