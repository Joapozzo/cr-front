'use client';

import React from 'react';
import { Partido } from '@/app/types/partido';
import { EscudoEquipo } from '@/app/components/common/EscudoEquipo';
import UltimosPartidosEquiposSkeleton from '../skeletons/UltimosPartidosEquipos';
import { useRouter } from 'next/navigation';

interface UltimosPartidosEquipoProps {
  partidos: Partido[];
  idEquipoPrincipal?: number;
  titulo: string;
  loading?: boolean;
  imgEquipo?: string | null;
}

export const UltimosPartidosEquipo: React.FC<UltimosPartidosEquipoProps> = ({
  partidos,
  idEquipoPrincipal,
  titulo,
  loading = false,
  imgEquipo = null
}) => {

  const router = useRouter();
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
          // Determinar si el equipo principal es local o visitante
          const esLocal = idEquipoPrincipal ? partido.id_equipolocal === idEquipoPrincipal : false;
          const equipoPrincipal = esLocal ? partido.equipoLocal : partido.equipoVisita;
          const equipoRival = esLocal ? partido.equipoVisita : partido.equipoLocal;
          
          // Obtener goles del equipo principal y del rival
          const golesEquipoPrincipal = esLocal ? (partido.goles_local ?? 0) : (partido.goles_visita ?? 0);
          const golesEquipoRival = esLocal ? (partido.goles_visita ?? 0) : (partido.goles_local ?? 0);
          
          // Calcular resultado
          let resultado: 'victoria' | 'derrota' | 'empate';
          if (golesEquipoPrincipal > golesEquipoRival) {
            resultado = 'victoria';
          } else if (golesEquipoPrincipal < golesEquipoRival) {
            resultado = 'derrota';
          } else {
            resultado = 'empate';
          }

          const colorResultado =
            resultado === 'victoria'
              ? 'bg-[var(--green)]'
              : resultado === 'derrota'
                ? 'bg-red-500'
                : 'bg-[#737373]';

          return (
            <div
              key={partido.id_partido}
              className={`flex flex-col gap-2 p-2 hover:bg-[var(--black-800)] rounded-lg transition-colors cursor-pointer ${esLocal ? 'items-start' : 'items-end'}`}
              onClick={() => router.push(`/partidos/${partido.id_partido}`)}
            >
              {/* Barra de color arriba */}
              <div className={`w-6 h-1 rounded-full mx-auto ${colorResultado}`}/>
              
              {/* Contenido: escudos y resultado */}
              <div className={`flex items-center gap-2 ${esLocal ? 'flex-row' : 'flex-row-reverse'}`}>
                {/* Escudo del equipo principal */}
                <EscudoEquipo
                  src={imgEquipo || equipoPrincipal?.img}
                  alt={equipoPrincipal?.nombre || titulo}
                  size={40}
                  className="flex-shrink-0"
                />

                {/* Resultado: siempre equipo principal - rival */}
                <div className="text-white text-xs sm:text-sm font-bold">
                  {golesEquipoPrincipal} - {golesEquipoRival}
                </div>

                {/* Escudo del rival */}
                <EscudoEquipo
                  src={equipoRival?.img}
                  alt={equipoRival?.nombre || 'Rival'}
                  size={40}
                  className="flex-shrink-0"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

