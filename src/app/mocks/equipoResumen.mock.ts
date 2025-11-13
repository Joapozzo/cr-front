// Mock data para el resumen del equipo

import { EquipoResumen } from '@/app/types/equipoResumen';
import { PartidoEquipo } from '@/app/types/partido';
import { EstadoPartido } from '@/app/types/partido';
import { StatsResumen } from '@/app/types/equipoResumen';
import { JugadorEstadistica } from '@/app/types/estadisticas';

// Mock de partido próximo
const mockProximoPartido: PartidoEquipo = {
  id_partido: 100,
  id_equipolocal: 1,
  id_equipovisita: 5,
  jornada: 10,
  dia: '2025-01-20',
  hora: '20:00',
  goles_local: null,
  goles_visita: null,
  pen_local: null,
  pen_visita: null,
  cancha: 1,
  estado: 'P' as EstadoPartido,
  id_zona: 1,
  id_categoria_edicion: 1,
  equipoLocal: {
    id_equipo: 1,
    nombre: 'Los Tigres FC',
    img: '/img/default-team.png'
  },
  equipoVisita: {
    id_equipo: 5,
    nombre: 'Deportivo Central',
    img: '/img/default-team-2.png'
  },
  incidencias: {
    goles: [],
    expulsiones: []
  }
};

// Mock de último partido
const mockUltimoPartido: PartidoEquipo = {
  id_partido: 99,
  id_equipolocal: 1,
  id_equipovisita: 3,
  jornada: 9,
  dia: '2025-01-15',
  hora: '19:00',
  goles_local: 2,
  goles_visita: 1,
  pen_local: null,
  pen_visita: null,
  cancha: 2,
  estado: 'F' as EstadoPartido,
  id_zona: 1,
  id_categoria_edicion: 1,
  equipoLocal: {
    id_equipo: 1,
    nombre: 'Los Tigres FC',
    img: '/img/default-team.png'
  },
  equipoVisita: {
    id_equipo: 3,
    nombre: 'Atlético Sur',
    img: '/img/default-team-3.png'
  },
  incidencias: {
    goles: [
      {
        id: 1,
        id_equipo: 1,
        id_jugador: 1,
        nombre: 'Juan',
        apellido: 'Pérez',
        tipo: 'GOL',
        minuto: 15,
        penal: 'N',
        en_contra: 'N'
      },
      {
        id: 2,
        id_equipo: 3,
        id_jugador: 5,
        nombre: 'Carlos',
        apellido: 'García',
        tipo: 'GOL',
        minuto: 30,
        penal: 'N',
        en_contra: 'N'
      },
      {
        id: 3,
        id_equipo: 1,
        id_jugador: 2,
        nombre: 'Pedro',
        apellido: 'López',
        tipo: 'GOL',
        minuto: 65,
        penal: 'N',
        en_contra: 'N'
      }
    ],
    expulsiones: []
  }
};

// Mock de últimos partidos resumidos
const mockUltimosPartidos = [
  {
    id_partido: 99,
    id_equipo_rival: 3,
    nombre_equipo_rival: 'Atlético Sur',
    img_equipo_rival: '/img/default-team-3.png',
    goles_equipo: 2,
    goles_rival: 1,
    es_local: true,
    resultado: 'victoria' as const
  },
  {
    id_partido: 98,
    id_equipo_rival: 4,
    nombre_equipo_rival: 'Club Norte',
    img_equipo_rival: '/img/default-team-4.png',
    goles_equipo: 0,
    goles_rival: 1,
    es_local: false,
    resultado: 'derrota' as const
  },
  {
    id_partido: 97,
    id_equipo_rival: 2,
    nombre_equipo_rival: 'Estudiantes FC',
    img_equipo_rival: '/img/default-team-5.png',
    goles_equipo: 1,
    goles_rival: 0,
    es_local: true,
    resultado: 'victoria' as const
  },
  {
    id_partido: 96,
    id_equipo_rival: 6,
    nombre_equipo_rival: 'River Plate',
    img_equipo_rival: '/img/default-team-6.png',
    goles_equipo: 1,
    goles_rival: 1,
    es_local: false,
    resultado: 'empate' as const
  },
  {
    id_partido: 95,
    id_equipo_rival: 7,
    nombre_equipo_rival: 'Boca Juniors',
    img_equipo_rival: '/img/default-team-7.png',
    goles_equipo: 3,
    goles_rival: 0,
    es_local: true,
    resultado: 'victoria' as const
  }
];

// Mock de goleadores
const mockGoleadores: JugadorEstadistica[] = [
  {
    id_jugador: 1,
    nombre: 'Juan',
    apellido: 'Pérez',
    img: '/img/default-avatar.png',
    equipo: {
      id_equipo: 1,
      nombre: 'Los Tigres FC',
      img: '/img/default-team.png'
    },
    categoria_edicion: 'Primera A',
    valor: 12
  },
  {
    id_jugador: 2,
    nombre: 'Pedro',
    apellido: 'López',
    img: '/img/default-avatar.png',
    equipo: {
      id_equipo: 1,
      nombre: 'Los Tigres FC',
      img: '/img/default-team.png'
    },
    categoria_edicion: 'Primera A',
    valor: 8
  },
  {
    id_jugador: 3,
    nombre: 'Carlos',
    apellido: 'García',
    img: '/img/default-avatar.png',
    equipo: {
      id_equipo: 1,
      nombre: 'Los Tigres FC',
      img: '/img/default-team.png'
    },
    categoria_edicion: 'Primera A',
    valor: 6
  }
];

// Mock de MVPs
const mockMVPs: JugadorEstadistica[] = [
  {
    id_jugador: 1,
    nombre: 'Juan',
    apellido: 'Pérez',
    img: '/img/default-avatar.png',
    equipo: {
      id_equipo: 1,
      nombre: 'Los Tigres FC',
      img: '/img/default-team.png'
    },
    categoria_edicion: 'Primera A',
    valor: 5
  },
  {
    id_jugador: 2,
    nombre: 'Pedro',
    apellido: 'López',
    img: '/img/default-avatar.png',
    equipo: {
      id_equipo: 1,
      nombre: 'Los Tigres FC',
      img: '/img/default-team.png'
    },
    categoria_edicion: 'Primera A',
    valor: 3
  },
  {
    id_jugador: 4,
    nombre: 'Miguel',
    apellido: 'Martínez',
    img: '/img/default-avatar.png',
    equipo: {
      id_equipo: 1,
      nombre: 'Los Tigres FC',
      img: '/img/default-team.png'
    },
    categoria_edicion: 'Primera A',
    valor: 2
  }
];

// Mock de amarillas
const mockAmarillas: JugadorEstadistica[] = [
  {
    id_jugador: 5,
    nombre: 'Luis',
    apellido: 'Rodríguez',
    img: '/img/default-avatar.png',
    equipo: {
      id_equipo: 1,
      nombre: 'Los Tigres FC',
      img: '/img/default-team.png'
    },
    categoria_edicion: 'Primera A',
    valor: 4
  },
  {
    id_jugador: 6,
    nombre: 'Roberto',
    apellido: 'Fernández',
    img: '/img/default-avatar.png',
    equipo: {
      id_equipo: 1,
      nombre: 'Los Tigres FC',
      img: '/img/default-team.png'
    },
    categoria_edicion: 'Primera A',
    valor: 3
  },
  {
    id_jugador: 2,
    nombre: 'Pedro',
    apellido: 'López',
    img: '/img/default-avatar.png',
    equipo: {
      id_equipo: 1,
      nombre: 'Los Tigres FC',
      img: '/img/default-team.png'
    },
    categoria_edicion: 'Primera A',
    valor: 2
  }
];

// Mock de rojas
const mockRojas: JugadorEstadistica[] = [
  {
    id_jugador: 7,
    nombre: 'Diego',
    apellido: 'Sánchez',
    img: '/img/default-avatar.png',
    equipo: {
      id_equipo: 1,
      nombre: 'Los Tigres FC',
      img: '/img/default-team.png'
    },
    categoria_edicion: 'Primera A',
    valor: 1
  },
  {
    id_jugador: 8,
    nombre: 'Andrés',
    apellido: 'Torres',
    img: '/img/default-avatar.png',
    equipo: {
      id_equipo: 1,
      nombre: 'Los Tigres FC',
      img: '/img/default-team.png'
    },
    categoria_edicion: 'Primera A',
    valor: 1
  }
];

// Mock de stats resumen
const mockStats: StatsResumen[] = [
  {
    tipo: 'goleadores',
    titulo: 'Goleadores',
    jugadores: mockGoleadores,
    verTodosUrl: '/equipos/1/stats?tipo=goleadores'
  },
  {
    tipo: 'mvps',
    titulo: 'MVPs',
    jugadores: mockMVPs,
    verTodosUrl: '/equipos/1/stats?tipo=mvps'
  },
  {
    tipo: 'amarillas',
    titulo: 'Amarillas',
    jugadores: mockAmarillas,
    verTodosUrl: '/equipos/1/stats?tipo=amarillas'
  },
  {
    tipo: 'rojas',
    titulo: 'Rojas',
    jugadores: mockRojas,
    verTodosUrl: '/equipos/1/stats?tipo=rojas'
  }
];

// Mock completo del resumen
export const mockEquipoResumen: EquipoResumen = {
  proximo_partido: mockProximoPartido,
  ultimo_partido: mockUltimoPartido,
  ultimos_partidos: mockUltimosPartidos,
  stats: mockStats
};

