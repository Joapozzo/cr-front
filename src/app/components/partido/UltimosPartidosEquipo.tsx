'use client';

import React from 'react';
import { UltimoPartidoEquipo } from '@/app/types/partidoDetalle';
import { ImagenPublica } from '@/app/components/common/ImagenPublica';
import { Shield } from 'lucide-react';

interface UltimosPartidosEquipoProps {
  partidos: UltimoPartidoEquipo[];
  titulo: string;
  loading?: boolean;
}

export const UltimosPartidosEquipo: React.FC<UltimosPartidosEquipoProps> = ({
  partidos,
  titulo,
  loading = false
}) => {
  if (loading) {
    return (
      <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-4">
        <h4 className="text-white font-semibold text-sm mb-3">{titulo}</h4>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-2 p-2 bg-[var(--black-800)] rounded-lg animate-pulse">
              <div className="w-8 h-8 rounded-full bg-[#262626]" />
              <div className="flex-1 space-y-1">
                <div className="h-3 bg-[#262626] rounded w-20" />
                <div className="h-2 bg-[#262626] rounded w-12" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!partidos || partidos.length === 0) {
    return (
      <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-4">
        <h4 className="text-white font-semibold text-sm mb-3">{titulo}</h4>
        <p className="text-[#737373] text-xs text-center py-4">No hay partidos recientes</p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-4">
      <h4 className="text-white font-semibold text-sm mb-3">{titulo}</h4>
      <div className="space-y-2">
        {partidos.map((partido) => {
          const colorResultado = 
            partido.resultado === 'victoria' 
              ? 'bg-[var(--green)]' 
              : partido.resultado === 'derrota' 
                ? 'bg-red-500' 
                : 'bg-[#737373]';
          
          return (
            <div
              key={partido.id_partido}
              className="flex items-center gap-3 p-2 hover:bg-[var(--black-800)] rounded-lg transition-colors"
            >
              {/* Escudo del rival */}
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-[var(--black-800)] flex-shrink-0 flex items-center justify-center border border-[#262626]">
                <ImagenPublica
                  src={partido.img_equipo_rival || '/img/default-team.png'}
                  alt={partido.nombre_equipo_rival}
                  width={40}
                  height={40}
                  fallbackIcon={<Shield className="w-4 h-4 sm:w-5 sm:h-5 text-[#737373]" />}
                />
              </div>

              {/* Resultado y nombre */}
              <div className="flex-1 min-w-0">
                {/* Resultado arriba */}
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white text-xs sm:text-sm font-bold">
                    {partido.goles_equipo} - {partido.goles_rival}
                  </span>
                </div>
                {/* Nombre del rival y barra de color */}
                <div className="flex items-center gap-2">
                  <p className="text-[#737373] text-[10px] sm:text-xs truncate flex-1">
                    {partido.nombre_equipo_rival}
                  </p>
                  {/* Barra de color */}
                  <div className={`w-1 h-4 rounded-full flex-shrink-0 ${colorResultado}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

