'use client';

import React from 'react';
import { PartidoEquipo } from '@/app/types/partido';
import MatchCard from '@/app/components/CardPartidoGenerico';
import { BaseCard } from '@/app/components/BaseCard';
import { ProximoPartidoSkeleton } from '@/app/components/skeletons/ProximoPartidoSkeleton';

interface ProximoPartidoCardProps {
  partido: PartidoEquipo | null;
  idEquipoActual: number;
  loading?: boolean;
}

export const ProximoPartidoCard: React.FC<ProximoPartidoCardProps> = ({
  partido,
  idEquipoActual,
  loading = false
}) => {
  if (loading) {
    return <ProximoPartidoSkeleton />;
  }

  if (!partido) {
    return (
      <div className="space-y-3">
        <h3 className="text-white font-semibold text-sm">Próximo partido</h3>
        <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-6 text-center">
          <p className="text-[#737373] text-sm">No hay partidos programados</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-white font-semibold text-sm px-1">Próximo partido</h3>
      <BaseCard className="p-3 sm:p-4">
        <MatchCard 
          partido={partido} 
          misEquiposIds={[idEquipoActual]} 
        />
      </BaseCard>
    </div>
  );
};

