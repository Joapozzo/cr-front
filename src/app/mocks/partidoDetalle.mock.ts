import { PartidoDetalleUsuario, UltimoPartidoEquipo, HistorialPartidos } from '@/app/types/partidoDetalle';
import { Partido } from '@/app/types/partido';
import { IncidenciaPartido, JugadorPlantel } from '@/app/types/partido';

// Mock de datos del partido para vista de usuario
export const mockPartidoDetalleUsuario: PartidoDetalleUsuario & {
  ultimos_partidos_local: UltimoPartidoEquipo[];
  ultimos_partidos_visita: UltimoPartidoEquipo[];
  historial: HistorialPartidos;
} = {
  partido: {
    id_partido: 1,
    jornada: 10,
    dia: '2025-01-20',
    hora: '20:00',
    goles_local: 5,
    goles_visita: 3,
    cancha: 1,
    arbitro: 'Juan Pérez',
    estado: 'F',
    equipoLocal: {
      id_equipo: 1,
      nombre: 'Argsenal',
      img: '/img/default-team.png',
      descripcion: null
    },
    equipoVisita: {
      id_equipo: 2,
      nombre: 'CA Viejo Camino',
      img: '/img/default-team.png',
      descripcion: null
    },
    zona: null,
    categoriaEdicion: {
      id_categoria_edicion: 1,
      categoria: {
        id_categoria: 1,
        division: {
          id_division: 1,
          nombre: 'Primera',
          descripcion: null,
          genero: 'M' as const
        },
        nombreCategoria: {
          id_nombre_cat: 1,
          nombre_categoria: 'A',
          desc: null
        },
        nombre_completo: 'Primera A'
      },
      duracion_tiempo: 45,
      duracion_entretiempo: 15
    },
    jugador_destacado: {
      id_jugador: 1,
      id_usuario: '1',
      nombre: 'Juan',
      apellido: 'Pérez'
    },
    id_jugador_destacado: 1,
    hora: '20:00',
    id_categoria_edicion: 1,
    hora_inicio: null,
    hora_inicio_segundo_tiempo: null,
    pen_local: null,
    pen_visita: null
  },
  incidencias: [
    {
      tipo: 'gol',
      id: 1,
      id_jugador: 1,
      id_equipo: 1,
      minuto: 15,
      nombre: 'Juan',
      apellido: 'Pérez',
      penal: 'N',
      en_contra: 'N'
    },
    {
      tipo: 'gol',
      id: 2,
      id_jugador: 2,
      id_equipo: 2,
      minuto: 25,
      nombre: 'Carlos',
      apellido: 'González',
      penal: 'N',
      en_contra: 'N'
    },
    {
      tipo: 'gol',
      id: 3,
      id_jugador: 3,
      id_equipo: 1,
      minuto: 35,
      nombre: 'Luis',
      apellido: 'Martínez',
      penal: 'N',
      en_contra: 'N'
    },
    {
      tipo: 'asistencia',
      id: 4,
      id_jugador: 4,
      id_equipo: 1,
      minuto: 35,
      nombre: 'Pedro',
      apellido: 'Rodríguez',
      id_gol: 3
    },
    {
      tipo: 'amarilla',
      id: 5,
      id_jugador: 5,
      id_equipo: 2,
      minuto: 40,
      nombre: 'Miguel',
      apellido: 'Sánchez'
    },
    {
      tipo: 'gol',
      id: 6,
      id_jugador: 1,
      id_equipo: 1,
      minuto: 50,
      nombre: 'Juan',
      apellido: 'Pérez',
      penal: 'N',
      en_contra: 'N'
    },
    {
      tipo: 'gol',
      id: 7,
      id_jugador: 6,
      id_equipo: 2,
      minuto: 60,
      nombre: 'Andrés',
      apellido: 'Fernández',
      penal: 'N',
      en_contra: 'N'
    },
    {
      tipo: 'gol',
      id: 8,
      id_jugador: 3,
      id_equipo: 1,
      minuto: 70,
      nombre: 'Luis',
      apellido: 'Martínez',
      penal: 'N',
      en_contra: 'N'
    },
    {
      tipo: 'roja',
      id: 9,
      id_jugador: 5,
      id_equipo: 2,
      minuto: 75,
      nombre: 'Miguel',
      apellido: 'Sánchez'
    },
    {
      tipo: 'gol',
      id: 10,
      id_jugador: 2,
      id_equipo: 2,
      minuto: 80,
      nombre: 'Carlos',
      apellido: 'González',
      penal: 'N',
      en_contra: 'N'
    },
    {
      tipo: 'gol',
      id: 11,
      id_jugador: 1,
      id_equipo: 1,
      minuto: 85,
      nombre: 'Juan',
      apellido: 'Pérez',
      penal: 'N',
      en_contra: 'N'
    }
  ] as IncidenciaPartido[],
  plantel_local: [
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
      id_equipo: 1,
      dorsal: 1
    },
    {
      id_jugador: 3,
      nombre: 'Luis',
      apellido: 'Martínez',
      img: '/img/default-avatar.png',
      posicion: {
        id_posicion: 8,
        codigo: 'DEL',
        nombre: 'Delantero'
      },
      sancionado: 'N',
      eventual: 'N',
      id_equipo: 1,
      dorsal: 9
    },
    {
      id_jugador: 4,
      nombre: 'Pedro',
      apellido: 'Rodríguez',
      img: '/img/default-avatar.png',
      posicion: {
        id_posicion: 5,
        codigo: 'MC',
        nombre: 'Mediocampista Central'
      },
      sancionado: 'N',
      eventual: 'N',
      id_equipo: 1,
      dorsal: 8
    }
  ] as JugadorPlantel[],
  plantel_visita: [
    {
      id_jugador: 2,
      nombre: 'Carlos',
      apellido: 'González',
      img: '/img/default-avatar.png',
      posicion: {
        id_posicion: 8,
        codigo: 'DEL',
        nombre: 'Delantero'
      },
      sancionado: 'N',
      eventual: 'N',
      id_equipo: 2,
      dorsal: 10
    },
    {
      id_jugador: 5,
      nombre: 'Miguel',
      apellido: 'Sánchez',
      img: '/img/default-avatar.png',
      posicion: {
        id_posicion: 2,
        codigo: 'DEF',
        nombre: 'Defensor Central'
      },
      sancionado: 'N',
      eventual: 'N',
      id_equipo: 2,
      dorsal: 4
    },
    {
      id_jugador: 6,
      nombre: 'Andrés',
      apellido: 'Fernández',
      img: '/img/default-avatar.png',
      posicion: {
        id_posicion: 5,
        codigo: 'MC',
        nombre: 'Mediocampista Central'
      },
      sancionado: 'N',
      eventual: 'N',
      id_equipo: 2,
      dorsal: 6
    }
  ] as JugadorPlantel[],
  jugadores_destacados: [
    {
      id_jugador: 1,
      id_equipo: 1
    }
  ],
  // Últimos 5 partidos del equipo local
  ultimos_partidos_local: [
    {
      id_partido: 2,
      id_equipo_rival: 3,
      nombre_equipo_rival: 'Deportivo Unidos',
      img_equipo_rival: '/img/default-team.png',
      goles_equipo: 2,
      goles_rival: 1,
      es_local: false,
      resultado: 'victoria',
      fecha: '2025-01-15'
    },
    {
      id_partido: 3,
      id_equipo_rival: 4,
      nombre_equipo_rival: 'Club Atlético',
      img_equipo_rival: '/img/default-team.png',
      goles_equipo: 3,
      goles_rival: 2,
      es_local: true,
      resultado: 'victoria',
      fecha: '2025-01-10'
    },
    {
      id_partido: 4,
      id_equipo_rival: 5,
      nombre_equipo_rival: 'FC Campeones',
      img_equipo_rival: '/img/default-team.png',
      goles_equipo: 1,
      goles_rival: 1,
      es_local: false,
      resultado: 'empate',
      fecha: '2025-01-05'
    },
    {
      id_partido: 5,
      id_equipo_rival: 6,
      nombre_equipo_rival: 'Real Fútbol',
      img_equipo_rival: '/img/default-team.png',
      goles_equipo: 4,
      goles_rival: 1,
      es_local: true,
      resultado: 'victoria',
      fecha: '2024-12-30'
    },
    {
      id_partido: 6,
      id_equipo_rival: 7,
      nombre_equipo_rival: 'Los Tigres FC',
      img_equipo_rival: '/img/default-team.png',
      goles_equipo: 0,
      goles_rival: 2,
      es_local: false,
      resultado: 'derrota',
      fecha: '2024-12-25'
    }
  ] as UltimoPartidoEquipo[],
  // Últimos 5 partidos del equipo visita
  ultimos_partidos_visita: [
    {
      id_partido: 7,
      id_equipo_rival: 3,
      nombre_equipo_rival: 'Deportivo Unidos',
      img_equipo_rival: '/img/default-team.png',
      goles_equipo: 1,
      goles_rival: 0,
      es_local: true,
      resultado: 'victoria',
      fecha: '2025-01-18'
    },
    {
      id_partido: 8,
      id_equipo_rival: 4,
      nombre_equipo_rival: 'Club Atlético',
      img_equipo_rival: '/img/default-team.png',
      goles_equipo: 2,
      goles_rival: 2,
      es_local: false,
      resultado: 'empate',
      fecha: '2025-01-12'
    },
    {
      id_partido: 9,
      id_equipo_rival: 5,
      nombre_equipo_rival: 'FC Campeones',
      img_equipo_rival: '/img/default-team.png',
      goles_equipo: 3,
      goles_rival: 1,
      es_local: true,
      resultado: 'victoria',
      fecha: '2025-01-08'
    },
    {
      id_partido: 10,
      id_equipo_rival: 6,
      nombre_equipo_rival: 'Real Fútbol',
      img_equipo_rival: '/img/default-team.png',
      goles_equipo: 1,
      goles_rival: 3,
      es_local: false,
      resultado: 'derrota',
      fecha: '2025-01-02'
    },
    {
      id_partido: 11,
      id_equipo_rival: 7,
      nombre_equipo_rival: 'Los Tigres FC',
      img_equipo_rival: '/img/default-team.png',
      goles_equipo: 2,
      goles_rival: 0,
      es_local: true,
      resultado: 'victoria',
      fecha: '2024-12-28'
    }
  ] as UltimoPartidoEquipo[],
  // Historial cara a cara
  historial: {
    estadisticas: {
      victorias_local: 1, // Argsenal ganó 5-3 (partido actual)
      victorias_visita: 1, // CA Viejo Camino ganó 2-1 (partido anterior)
      empates: 0,
      total_partidos: 2,
      porcentaje_victorias_local: 50,
      porcentaje_victorias_visita: 50,
      porcentaje_empates: 0
    },
    partidos: [
      {
        id_partido: 1,
        id_equipolocal: 1,
        id_equipovisita: 2,
        jornada: 10,
        dia: '2025-01-20',
        hora: '20:00',
        goles_local: 5,
        goles_visita: 3,
        cancha: 1,
        arbitro: 'Juan Pérez',
        estado: 'F',
        equipoLocal: {
          id_equipo: 1,
          nombre: 'Argsenal',
          img: '/img/default-team.png'
        },
        equipoVisita: {
          id_equipo: 2,
          nombre: 'CA Viejo Camino',
          img: '/img/default-team.png'
        }
      },
      {
        id_partido: 12,
        id_equipolocal: 2,
        id_equipovisita: 1,
        jornada: 5,
        dia: '2024-08-15',
        hora: '21:00',
        goles_local: 2,
        goles_visita: 1,
        cancha: 2,
        arbitro: 'Carlos Gómez',
        estado: 'F',
        equipoLocal: {
          id_equipo: 2,
          nombre: 'CA Viejo Camino',
          img: '/img/default-team.png'
        },
        equipoVisita: {
          id_equipo: 1,
          nombre: 'Argsenal',
          img: '/img/default-team.png'
        }
      }
    ] as Partido[]
  } as HistorialPartidos
};

