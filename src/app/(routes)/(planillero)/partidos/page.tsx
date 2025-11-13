'use client';

import { useState, useMemo } from 'react';
import { UserPageWrapper } from '@/app/components/layouts/UserPageWrapper';
import { EdicionLayout } from '@/app/components/layouts/EdicionLayout';
import { FiltrosFixture } from '@/app/components/fixture/FiltrosFixture';
import { ListaPartidos } from '@/app/components/fixture/ListaPartidos';
import { FixtureSkeleton } from '@/app/components/skeletons/FixtureSkeleton';
import { Partido } from '@/app/types/partido';

// Mock data
const mockJornadas = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

const mockPartidos: Partido[] = [
  {
    id_partido: 1,
    id_equipolocal: 1,
    id_equipovisita: 2,
    jornada: 5,
    dia: '2025-11-15',
    hora: '20:00',
    goles_local: null,
    goles_visita: null,
    cancha: 1,
    arbitro: 'Juan Pérez',
    estado: 'P',
    equipoLocal: { id_equipo: 1, nombre: 'Los Cracks FC', img: '/img/team1.png' },
    equipoVisita: { id_equipo: 2, nombre: 'Real Fútbol', img: '/img/team2.png' }
  },
  {
    id_partido: 2,
    id_equipolocal: 3,
    id_equipovisita: 4,
    jornada: 5,
    dia: '2025-11-15',
    hora: '21:00',
    goles_local: null,
    goles_visita: null,
    cancha: 2,
    arbitro: 'Carlos Gómez',
    estado: 'P',
    equipoLocal: { id_equipo: 3, nombre: 'Deportivo Unidos', img: '/img/team3.png' },
    equipoVisita: { id_equipo: 4, nombre: 'Club Atlético', img: '/img/team4.png' }
  },
  {
    id_partido: 3,
    id_equipolocal: 5,
    id_equipovisita: 1,
    jornada: 5,
    dia: '2025-11-15',
    hora: '22:00',
    goles_local: 2,
    goles_visita: 1,
    cancha: 1,
    arbitro: 'Diego Martínez',
    estado: 'C2',
    equipoLocal: { id_equipo: 5, nombre: 'FC Campeones', img: '/img/team5.png' },
    equipoVisita: { id_equipo: 1, nombre: 'Los Cracks FC', img: '/img/team1.png' }
  },
  {
    id_partido: 4,
    id_equipolocal: 2,
    id_equipovisita: 3,
    jornada: 4,
    dia: '2025-11-10',
    hora: '20:30',
    goles_local: 3,
    goles_visita: 2,
    cancha: 1,
    arbitro: 'Martín López',
    estado: 'T',
    equipoLocal: { id_equipo: 2, nombre: 'Real Fútbol', img: '/img/team2.png' },
    equipoVisita: { id_equipo: 3, nombre: 'Deportivo Unidos', img: '/img/team3.png' }
  },
  {
    id_partido: 5,
    id_equipolocal: 4,
    id_equipovisita: 5,
    jornada: 4,
    dia: '2025-11-10',
    hora: '21:30',
    goles_local: 1,
    goles_visita: 1,
    cancha: 2,
    arbitro: 'Lucas Fernández',
    estado: 'T',
    equipoLocal: { id_equipo: 4, nombre: 'Club Atlético', img: '/img/team4.png' },
    equipoVisita: { id_equipo: 5, nombre: 'FC Campeones', img: '/img/team5.png' }
  },
  {
    id_partido: 6,
    id_equipolocal: 1,
    id_equipovisita: 4,
    jornada: 6,
    dia: '2025-11-20',
    hora: '19:00',
    goles_local: null,
    goles_visita: null,
    cancha: 1,
    arbitro: 'Pablo Ramírez',
    estado: 'P',
    equipoLocal: { id_equipo: 1, nombre: 'Los Cracks FC', img: '/img/team1.png' },
    equipoVisita: { id_equipo: 4, nombre: 'Club Atlético', img: '/img/team4.png' }
  },
  {
    id_partido: 7,
    id_equipolocal: 2,
    id_equipovisita: 5,
    jornada: 6,
    dia: '2025-11-20',
    hora: '20:00',
    goles_local: null,
    goles_visita: null,
    cancha: 2,
    arbitro: 'Sebastián Torres',
    estado: 'P',
    equipoLocal: { id_equipo: 2, nombre: 'Real Fútbol', img: '/img/team2.png' },
    equipoVisita: { id_equipo: 5, nombre: 'FC Campeones', img: '/img/team5.png' }
  }
];

type VistaType = 'fecha' | 'jornada';

const formatearFecha = (fecha: string) => {
  const date = new Date(fecha);
  const dias = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
  const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  
  const diaSemana = dias[date.getDay()];
  const dia = date.getDate();
  const mes = meses[date.getMonth()];
  
  return `${diaSemana}, ${dia} ${mes}`;
};

export default function PartidosPage() {
  const [vistaActiva, setVistaActiva] = useState<VistaType>('jornada');
  const [jornadaSeleccionada, setJornadaSeleccionada] = useState(5);
  const [isLoading] = useState(false);

  // TODO: Usar hooks reales
  // const { data: partidos, isLoading } = usePartidosPorJornadaYCategoria(jornadaSeleccionada, id_categoria_edicion);

  // Agrupar partidos por jornada
  const partidosPorJornada = useMemo(() => {
    return mockPartidos.reduce((acc, partido) => {
      if (!acc[partido.jornada]) {
        acc[partido.jornada] = [];
      }
      acc[partido.jornada].push(partido);
      return acc;
    }, {} as Record<number, Partido[]>);
  }, []);

  // Obtener partidos de la jornada seleccionada
  const partidosJornadaActual = partidosPorJornada[jornadaSeleccionada] || [];

  // Agrupar partidos por fecha (día)
  const partidosPorDia = useMemo(() => {
    return mockPartidos.reduce((acc, partido) => {
      const fecha = partido.dia;
      if (!acc[fecha]) {
        acc[fecha] = [];
      }
      acc[fecha].push(partido);
      return acc;
    }, {} as Record<string, Partido[]>);
  }, []);

  // Ordenar fechas de más reciente a más antigua
  const fechasOrdenadas = useMemo(() => {
    return Object.keys(partidosPorDia).sort((a, b) => 
      new Date(b).getTime() - new Date(a).getTime()
    );
  }, [partidosPorDia]);

  return (
    <UserPageWrapper>
      <EdicionLayout
        nombreEdicion="Copa Relámpago"
        temporada="Clausura 2025"
        nombreCategoria="Primera - Masculino"
        loading={isLoading}
      >
        <div className="space-y-4">
          {/* Tabs y Filtros */}
          <div className="flex items-center justify-between gap-4">
            {/* Tabs */}
            <div className="flex gap-2 bg-[var(--black-900)] border border-[#262626] rounded-xl p-1">
              <button
                onClick={() => setVistaActiva('jornada')}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                  vistaActiva === 'jornada'
                    ? 'bg-[var(--green)] text-white'
                    : 'text-[#737373] hover:text-white'
                }`}
              >
                Por Jornada
              </button>
              <button
                onClick={() => setVistaActiva('fecha')}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                  vistaActiva === 'fecha'
                    ? 'bg-[var(--green)] text-white'
                    : 'text-[#737373] hover:text-white'
                }`}
              >
                Por Fecha
              </button>
            </div>

            {/* Filtros */}
            {vistaActiva === 'jornada' && (
              <FiltrosFixture
                jornadas={mockJornadas}
                jornadaActual={jornadaSeleccionada}
                onJornadaChange={setJornadaSeleccionada}
                loading={isLoading}
              />
            )}
          </div>

          {/* Contenido */}
          <div>
            {isLoading ? (
              <FixtureSkeleton />
            ) : vistaActiva === 'jornada' ? (
              // Vista por Jornada
              partidosJornadaActual.length > 0 ? (
                <ListaPartidos
                  partidos={partidosJornadaActual}
                  titulo={`Jornada ${jornadaSeleccionada}`}
                  subtitulo={formatearFecha(partidosJornadaActual[0]?.dia)}
                />
              ) : (
                <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-8 text-center">
                  <p className="text-[#737373] text-sm">
                    No hay partidos programados para esta jornada
                  </p>
                </div>
              )
            ) : (
              // Vista por Fecha (Día)
              <div className="space-y-4">
                {fechasOrdenadas.map((fecha) => (
                  <ListaPartidos
                    key={fecha}
                    partidos={partidosPorDia[fecha]}
                    titulo={formatearFecha(fecha)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </EdicionLayout>
    </UserPageWrapper>
  );
}

