'use client';

import React from 'react';
import { PartidoResumido } from '@/app/types/equipoResumen';
import { ImagenPublica } from '@/app/components/common/ImagenPublica';
import { Shield } from 'lucide-react';
import { UltimosPartidosResumenSkeleton } from '@/app/components/skeletons/UltimosPartidosResumenSkeleton';

interface UltimosPartidosResumenProps {
  partidos: PartidoResumido[];
  loading?: boolean;
}

const getResultadoColor = (resultado: 'victoria' | 'derrota' | 'empate'): string => {
  switch (resultado) {
    case 'victoria':
      return 'bg-[var(--green)] text-white';
    case 'derrota':
      return 'bg-red-600 text-white';
    case 'empate':
      return 'bg-[#525252] text-white';
    default:
      return 'bg-[#525252] text-white';
  }
};

export const UltimosPartidosResumen: React.FC<UltimosPartidosResumenProps> = ({
  partidos,
  loading = false
}) => {
  if (loading) {
    return <UltimosPartidosResumenSkeleton />;
  }

  if (!partidos || partidos.length === 0) {
    return (
      <div className="space-y-2">
        <h3 className="text-white font-semibold text-xs sm:text-sm px-1">Últimos partidos</h3>
        <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-4 sm:p-6 text-center">
          <p className="text-[#737373] text-xs sm:text-sm">No hay partidos recientes</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-white font-semibold text-sm px-1">Últimos partidos</h3>
      <div className="w-full grid grid-cols-5 gap-2 sm:gap-3">
        {partidos.slice(0, 5).map((partido) => (
          <div
            key={partido.id_partido}
            className="flex flex-col items-center gap-2"
          >
            {/* Resultado */}
            <div
              className={`w-full px-1.5 py-1 rounded text-[10px] sm:text-xs font-bold text-center ${getResultadoColor(
                partido.resultado
              )}`}
            >
              {partido.goles_equipo}-{partido.goles_rival}
            </div>
            {/* Escudo del rival */}
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-[var(--black-800)] border border-[#262626] flex items-center justify-center">
              <ImagenPublica
                src={partido.img_equipo_rival || '/img/default-team.png'}
                alt={partido.nombre_equipo_rival}
                width={48}
                height={48}
                className="w-full h-full object-cover"
                fallbackIcon={<Shield size={16} className="text-[#737373]" />}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

