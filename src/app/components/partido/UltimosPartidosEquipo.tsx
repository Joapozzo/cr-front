'use client';

import React from 'react';
import { UltimoPartidoEquipo } from '@/app/types/partidoDetalle';
import { ImagenPublica } from '@/app/components/common/ImagenPublica';
import { Shield } from 'lucide-react';
import UltimosPartidosEquiposSkeleton from '../skeletons/UltimosPartidosEquipos';

interface UltimosPartidosEquipoProps {
  partidos: UltimoPartidoEquipo[];
  titulo: string;
  loading?: boolean;
  imgEquipo?: string | null;
}

export const UltimosPartidosEquipo: React.FC<UltimosPartidosEquipoProps> = ({
  partidos,
  titulo,
  loading = false,
  imgEquipo = null
}) => {

  if (loading) {
    return (
      <UltimosPartidosEquiposSkeleton />
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
    <div className="p-4">
      <h4 className="text-white font-semibold text-sm mb-3 px-2">{titulo}</h4>
      <div className="space-y-2">
        {partidos.map((partido) => {
          const colorResultado =
            partido.resultado === 'victoria'
              ? 'bg-[var(--green)]'
              : partido.resultado === 'derrota'
                ? 'bg-red-500'
                : 'bg-[#737373]';

          const esLocal = partido.es_local;

          return (
            <div
              key={partido.id_partido}
              className={`flex flex-col gap-2 p-2 hover:bg-[var(--black-800)] rounded-lg transition-colors ${esLocal ? 'items-start' : 'items-end'}`}
            >
              {/* Barra de color arriba */}
              <div className={`w-6 h-1 rounded-full mx-auto ${colorResultado}`}/>
              
              {/* Contenido: escudos y resultado */}
              <div className={`flex items-center gap-2 ${esLocal ? 'flex-row' : 'flex-row-reverse'}`}>
                {/* Escudo del equipo principal */}
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-[var(--black-800)] flex-shrink-0 flex items-center justify-center border border-[#262626]">
                  <ImagenPublica
                    src={imgEquipo || '/img/default-team.png'}
                    alt={titulo}
                    width={40}
                    height={40}
                    fallbackIcon={<Shield className="w-4 h-4 sm:w-5 sm:h-5 text-[#737373]" />}
                  />
                </div>

                {/* Resultado */}
                <div className="text-white text-xs sm:text-sm font-bold">
                  {partido.goles_equipo} - {partido.goles_rival}
                </div>

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
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

