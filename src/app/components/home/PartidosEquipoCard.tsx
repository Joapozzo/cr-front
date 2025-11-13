'use client';

import { Calendar } from 'lucide-react';
import { useState } from 'react';
import { BaseCard, CardHeader } from '../BaseCard';
import { PartidoEquipo } from '@/app/types/partido';
import MatchCard from '../CardPartidoGenerico';
import MatchCardSkeleton from '../skeletons/CardPartidoGenericoSkeleton';

interface PartidosEquipoCardProps {
  partidos?: PartidoEquipo[];
  misEquiposIds?: number[]; // IDs de los equipos del usuario
  loading?: boolean;
}

type TabType = 'ultimos' | 'proximos';

export const PartidosEquipoCard = ({ partidos, misEquiposIds = [], loading = false }: PartidosEquipoCardProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('proximos');
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');

  // Separar partidos en últimos y próximos
  const partidosPasados = partidos?.filter(p => ['F', 'T'].includes(p.estado)) || [];
  const partidosFuturos = partidos?.filter(p => ['P', 'C1', 'C2', 'E'].includes(p.estado)) || [];

  const partidosActivos = activeTab === 'ultimos' ? partidosPasados : partidosFuturos;

  // Manejar cambio de tab con dirección de animación
  const handleTabChange = (tab: TabType) => {
    if (tab === activeTab) return;

    // Determinar dirección del slide
    // "Últimos" está a la izquierda, "Próximos" está a la derecha
    if (tab === 'ultimos') {
      setSlideDirection('left'); // Entra desde la izquierda
    } else {
      setSlideDirection('right'); // Entra desde la derecha
    }

    setActiveTab(tab);
  };

  // Casos vacíos
  if (!partidos || partidos.length === 0) {
    return (
      <BaseCard>
        <CardHeader
          icon={<Calendar size={18} className="text-[var(--green)]" />}
          title="Mis Partidos"
          subtitle="Últimos y Próximos"
        />
        <div className="flex flex-col items-center justify-center py-12 px-6">
          <div className="w-16 h-16 bg-[#262626] rounded-full flex items-center justify-center mb-4">
            <Calendar size={32} className="text-[#737373]" />
          </div>
          <p className="text-[#737373] text-sm text-center">
            No hay partidos disponibles
          </p>
          <p className="text-[#525252] text-xs text-center mt-2">
            Los partidos de tu equipo aparecerán aquí
          </p>
        </div>
      </BaseCard>
    );
  }

  // Loading state
  if (loading) {
    return (
      <BaseCard>
        <CardHeader
          icon={<Calendar size={18} className="text-[var(--green)]" />}
          title="Mis Partidos"
          subtitle="Cargando..."
        />
        <MatchCardSkeleton />
        <MatchCardSkeleton />
      </BaseCard>
    );
  }

  return (
    <BaseCard>
      <div className="rounded-t-2xl overflow-hidden">
        <CardHeader
          icon={<Calendar size={18} className="text-[var(--green)]" />}
          title="Mis Partidos"
        />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#262626]">
        <button
          onClick={() => handleTabChange('ultimos')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'ultimos'
              ? 'text-[var(--green)] border-b-2 border-[var(--green)]'
              : 'text-[#737373] hover:text-white'
            }`}
          disabled={partidosPasados.length === 0}
        >
          Últimos Partidos
        </button>
        <button
          onClick={() => handleTabChange('proximos')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'proximos'
              ? 'text-[var(--green)] border-b-2 border-[var(--green)]'
              : 'text-[#737373] hover:text-white'
            }`}
          disabled={partidosFuturos.length === 0}
        >
          Próximos Partidos
        </button>
      </div>

      {/* Contenido de los partidos - Scroll vertical máximo ~2 partidos visibles */}
      <div className="w-full overflow-hidden">
        {partidosActivos.length > 0 ? (
          <div
            key={activeTab}
            className={`flex flex-col divide-y divide-[#262626] max-h-[540px] overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--green)] scrollbar-track-[#1a1a1a] ${slideDirection === 'left' ? 'animate-slide-in-left' : 'animate-slide-in-right'
              }`}
          >
            {partidosActivos.map((partido) => (
              <div key={partido.id_partido} className="w-full">
                <MatchCard
                  partido={partido}
                  misEquiposIds={misEquiposIds}
                />
              </div>
            ))}
          </div>
        ) : (
          <div
            key={`empty-${activeTab}`}
            className={`flex flex-col items-center justify-center py-8 px-6 ${slideDirection === 'left' ? 'animate-slide-in-left' : 'animate-slide-in-right'
              }`}
          >
            <p className="text-[#737373] text-sm">
              {activeTab === 'ultimos' ? 'No hay partidos jugados' : 'No hay próximos partidos'}
            </p>
          </div>
        )}
      </div>

      {/* CSS para la animación slide */}
      <style jsx>{`
        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.3s ease-out;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </BaseCard>
  );
};

// ============================================
// 🎨 MOCK DATA PARA TESTING
// ============================================

export const mockPartidos: PartidoEquipo[] = [
  // Último partido jugado
  {
    id_partido: 1,
    id_equipolocal: 1,
    id_equipovisita: 2,
    jornada: 5,
    dia: '2024-11-05',
    hora: '20:00',
    cancha: 1,
    estado: 'F', // Finalizado
    goles_local: 3,
    goles_visita: 2,
    pen_local: null,
    pen_visita: null,
    id_zona: 1,
    id_categoria_edicion: 1,
    equipoLocal: {
      nombre: 'Los Tigres FC',
      img: null,
    },
    equipoVisita: {
      nombre: 'Águilas United',
      img: null,
    },
    incidencias: {
      goles: [
        { id: 1, id_equipo: 1, id_jugador: 1, nombre: 'Juan', apellido: 'Pérez', tipo: 'GOL', minuto: 15, penal: 'N', en_contra: 'N' },
        { id: 2, id_equipo: 2, id_jugador: 2, nombre: 'Miguel', apellido: 'González', tipo: 'GOL', minuto: 23, penal: 'S', en_contra: 'N' },
        { id: 3, id_equipo: 1, id_jugador: 3, nombre: 'Antonio', apellido: 'Martínez', tipo: 'GOL', minuto: 35, penal: 'N', en_contra: 'N' },
        { id: 4, id_equipo: 1, id_jugador: 4, nombre: 'Luis', apellido: 'Rodríguez', tipo: 'GOL', minuto: 58, penal: 'N', en_contra: 'N' },
        { id: 5, id_equipo: 2, id_jugador: 5, nombre: 'Carlos', apellido: 'López', tipo: 'GOL', minuto: 72, penal: 'N', en_contra: 'N' },
      ],
      expulsiones: [],
    },
  },

  // Próximo partido
  {
    id_partido: 2,
    id_equipolocal: 3,
    id_equipovisita: 1,
    jornada: 6,
    dia: '2024-11-15',
    hora: '19:30',
    cancha: 2,
    estado: 'P', // Programado
    goles_local: null,
    goles_visita: null,
    pen_local: null,
    pen_visita: null,
    id_zona: 1,
    id_categoria_edicion: 1,
    equipoLocal: {
      nombre: 'Deportivo Huracán',
      img: null,
    },
    equipoVisita: {
      nombre: 'Los Tigres FC',
      img: null,
    },
    incidencias: {
      goles: [],
      expulsiones: [],
    },
  },

  // Partido en vivo (opcional)
  {
    id_partido: 3,
    id_equipolocal: 1,
    id_equipovisita: 4,
    jornada: 7,
    dia: '2024-11-11',
    hora: '21:00',
    cancha: 3,
    estado: 'C1', // Primer tiempo
    goles_local: 1,
    goles_visita: 1,
    pen_local: null,
    pen_visita: null,
    id_zona: 1,
    id_categoria_edicion: 1,
    equipoLocal: {
      nombre: 'Los Tigres FC',
      img: null,
    },
    equipoVisita: {
      nombre: 'Rayos FC',
      img: null,
    },
    incidencias: {
      goles: [
        { id: 1, id_equipo: 1, id_jugador: 1, nombre: 'Juan', apellido: 'Pérez', tipo: 'GOL', minuto: 12, penal: 'N', en_contra: 'N' },
        { id: 2, id_equipo: 4, id_jugador: 6, nombre: 'Fernando', apellido: 'Ramírez', tipo: 'GOL', minuto: 28, penal: 'N', en_contra: 'N' },
      ],
      expulsiones: [],
    },
  },

  // Otro próximo partido
  {
    id_partido: 4,
    id_equipolocal: 5,
    id_equipovisita: 3,
    jornada: 8,
    dia: '2024-11-20',
    hora: '18:00',
    cancha: 1,
    estado: 'P', // Programado
    goles_local: null,
    goles_visita: null,
    pen_local: null,
    pen_visita: null,
    id_zona: 1,
    id_categoria_edicion: 1,
    equipoLocal: {
      nombre: 'Relámpagos FC',
      img: null,
    },
    equipoVisita: {
      nombre: 'Deportivo Huracán',
      img: null,
    },
    incidencias: {
      goles: [],
      expulsiones: [],
    },
  },
];

