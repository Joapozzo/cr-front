'use client';

import { Calendar } from 'lucide-react';
import { BaseCard, CardHeader } from '../BaseCard';
import { PartidoEquipo } from '@/app/types/partido';
import MatchCard from '../CardPartidoGenerico';
import MatchCardSkeleton from '../skeletons/CardPartidoGenericoSkeleton';
import { usePartidosEquipoCard } from '@/app/hooks/usePartidosEquipoCard';

interface PartidosEquipoCardProps {
  partidos?: PartidoEquipo[];
  misEquiposIds?: number[];
  loading?: boolean;
}

export const PartidosEquipoCard = ({
  partidos,
  misEquiposIds,
  loading,
}: PartidosEquipoCardProps) => {
  const {
    partidosPasados,
    partidosFuturos,
    partidosActivos,
    misEquiposIds: equiposIds,
    loading: isLoading,
    error,
    activeTab,
    slideDirection,
    handleTabChange,
  } = usePartidosEquipoCard({ partidos, misEquiposIds, loading });

  // Estado de error
  if (error && !partidos) {
    return (
      <BaseCard>
        <CardHeader
          icon={<Calendar size={18} className="text-[var(--color-primary)]" />}
          title="Mis partidos"
          subtitle="Error al cargar"
        />
        <div className="flex flex-col items-center justify-center py-12 px-6">
          <p className="text-[#737373] text-sm text-center">{error.message}</p>
        </div>
      </BaseCard>
    );
  }

  // Estado vacío - solo mostrar si NO hay partidos en ninguna categoría
  if (!isLoading && partidosPasados.length === 0 && partidosFuturos.length === 0) {
    return (
      <BaseCard>
        <CardHeader
          icon={<Calendar size={18} className="text-[var(--color-primary)]" />}
          title="Mis partidos"
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

  // Estado de carga
  if (isLoading) {
    return (
      <BaseCard>
        <CardHeader
          icon={<Calendar size={18} className="text-[var(--color-primary)]" />}
          title="Mis partidos"
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
          icon={<Calendar size={18} className="text-[var(--color-primary)]" />}
          title="Mis partidos"
        />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#262626]">
        <button
          onClick={() => handleTabChange('ultimos')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === 'ultimos'
              ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]'
              : partidosPasados.length === 0
              ? 'text-[#525252] cursor-pointer'
              : 'text-[#737373] hover:text-white'
          }`}
        >
          Últimos partidos
        </button>
        <button
          onClick={() => handleTabChange('proximos')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === 'proximos'
              ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]'
              : partidosFuturos.length === 0
              ? 'text-[#525252] cursor-pointer'
              : 'text-[#737373] hover:text-white'
          }`}
        >
          Próximos partidos
        </button>
      </div>

      {/* Contenido de los partidos */}
      <div className="w-full overflow-hidden">
        {partidosActivos.length > 0 ? (
          <div
            key={activeTab}
            className={`flex flex-col divide-y divide-[#262626] max-h-[540px] overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--color-primary)] scrollbar-track-[#1a1a1a] ${
              slideDirection === 'left' ? 'animate-slide-in-left' : 'animate-slide-in-right'
            }`}
          >
            {partidosActivos.map((partido) => (
              <div key={`partido-${partido.id_partido}-${partido.goles_local ?? 0}-${partido.goles_visita ?? 0}`} className="w-full">
                <MatchCard partido={partido} misEquiposIds={equiposIds} />
              </div>
            ))}
          </div>
        ) : (
          <div
            key={`empty-${activeTab}`}
            className={`flex flex-col items-center justify-center py-8 px-6 ${
              slideDirection === 'left' ? 'animate-slide-in-left' : 'animate-slide-in-right'
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
