'use client';

import React from 'react';
import { ParticipacionEquipo } from '@/app/types/participacionEquipo';
import { ParticipacionCard } from './ParticipacionCard';
import { ParticipacionesTabSkeleton } from '@/app/components/skeletons/ParticipacionesTabSkeleton';

interface ParticipacionesTabProps {
  idEquipo: number;
  participaciones: ParticipacionEquipo[];
  loading?: boolean;
}

export const ParticipacionesTab: React.FC<ParticipacionesTabProps> = ({
  idEquipo,
  participaciones,
  loading = false
}) => {
  // Ordenar participaciones por temporada (más reciente primero)
  const participacionesOrdenadas = React.useMemo(() => {
    if (!participaciones || participaciones.length === 0) return [];
    
    return [...participaciones].sort((a, b) => {
      // Primero por temporada (descendente)
      if (b.temporada !== a.temporada) {
        return b.temporada - a.temporada;
      }
      // Si misma temporada, ordenar por id_categoria_edicion (descendente)
      return b.id_categoria_edicion - a.id_categoria_edicion;
    });
  }, [participaciones]);

  if (loading) {
    return <ParticipacionesTabSkeleton />;
  }

  if (!participaciones || participaciones.length === 0) {
    return (
      <div className="py-4">
        <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-6 sm:p-8 text-center">
          <p className="text-[#737373] text-xs sm:text-sm">No hay participaciones disponibles</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 space-y-6 sm:space-y-8">
      {participacionesOrdenadas.map((participacion) => (
        <ParticipacionCard
          key={participacion.id_categoria_edicion}
          participacion={participacion}
          idEquipo={idEquipo}
        />
      ))}
    </div>
  );
};

