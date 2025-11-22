'use client';

import { useState } from 'react';
import Link from 'next/link';
import { EquipoPosicion } from '@/app/types/posiciones';
import { Zona } from '@/app/types/zonas';
import PlayoffBracket from '../playoff/PlayoffBracket';
import { ImagenPublica } from '../common/ImagenPublica';
import { BaseCardTableSkeleton } from '../skeletons/BaseCardTableSkeleton';

interface TablaPosicionesCompletaProps {
  posiciones: EquipoPosicion[];
  zonasPlayoff?: Zona[];
  isLoading?: boolean;
  userTeamIds?: number[]; // IDs de los equipos del usuario para resaltar
}

export const TablaPosicionesCompleta: React.FC<TablaPosicionesCompletaProps> = ({
  posiciones,
  zonasPlayoff = [],
  isLoading = false,
  userTeamIds = []
}) => {
  const [activeTab, setActiveTab] = useState<'posiciones' | 'playoff'>(
    posiciones.length > 0 ? 'posiciones' : 'playoff'
  );

  const hasPlayoffs = zonasPlayoff && zonasPlayoff.length > 0;
  const hasPositions = posiciones && posiciones.length > 0;
  console.log(hasPlayoffs);
  // Si solo hay una de las dos, no mostrar tabs
  const showTabs = hasPlayoffs && hasPositions;

  return (
    <div className="space-y-4">
      {/* Tabs */}
      {showTabs && (
        <div className="flex gap-2 bg-[var(--black-900)] border border-[#262626] rounded-xl p-2">
          <button
            onClick={() => setActiveTab('posiciones')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'posiciones'
                ? 'bg-[var(--green)] text-white'
                : 'text-[#737373] hover:text-white hover:bg-[var(--black-800)]'
            }`}
          >
            Posiciones
          </button>
          <button
            onClick={() => setActiveTab('playoff')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'playoff'
                ? 'bg-[var(--green)] text-white'
                : 'text-[#737373] hover:text-white hover:bg-[var(--black-800)]'
            }`}
          >
            Playoffs
          </button>
        </div>
      )}

      {/* Contenido */}
      <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl overflow-hidden">
        {activeTab === 'posiciones' ? (
          isLoading ? (
            <>
            <BaseCardTableSkeleton
              columns={4} 
              rows={6}
              hasAvatar={false}
            />
          </>
          ) : hasPositions ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[var(--black-800)] border-b border-[#262626]">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#737373] uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#737373] uppercase tracking-wider">
                      Equipo
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-[#737373] uppercase tracking-wider">
                      PJ
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-[#737373] uppercase tracking-wider">
                      G
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-[#737373] uppercase tracking-wider">
                      E
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-[#737373] uppercase tracking-wider">
                      P
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-[#737373] uppercase tracking-wider">
                      GF
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-[#737373] uppercase tracking-wider">
                      GC
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-[#737373] uppercase tracking-wider">
                      DIF
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-[#737373] uppercase tracking-wider">
                      PTS
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#262626]">
                  {posiciones.map((equipo, index) => {
                    const isUserTeam = userTeamIds.includes(equipo.id_equipo);
                    
                    return (
                      <tr
                        key={equipo.id_equipo}
                        className={`hover:bg-[var(--black-800)] transition-colors ${
                          isUserTeam ? 'bg-[var(--green)]/5' : ''
                        }`}
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          <Link 
                            href={`/equipos/${equipo.id_equipo}`}
                            className="block"
                          >
                            <span className={`text-sm font-semibold ${
                              isUserTeam ? 'text-[var(--green)]' : 'text-white'
                            }`}>
                              {index + 1}
                            </span>
                          </Link>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <Link 
                            href={`/equipos/${equipo.id_equipo}`}
                            className="block"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full overflow-hidden bg-[var(--black-800)] flex-shrink-0">
                                <ImagenPublica
                                  src={equipo.img_equipo || '/img/default-team.png'}
                                  alt={equipo.nombre_equipo}
                                  width={32}
                                  height={32}
                                  fallbackIcon="Shield"
                                />
                              </div>
                              <span className={`text-sm font-medium ${
                                isUserTeam ? 'text-[var(--green)]' : 'text-white'
                              }`}>
                                {equipo.nombre_equipo}
                              </span>
                            </div>
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Link 
                            href={`/equipos/${equipo.id_equipo}`}
                            className="block"
                          >
                            <span className="text-sm text-[#737373]">{equipo.partidos_jugados}</span>
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Link 
                            href={`/equipos/${equipo.id_equipo}`}
                            className="block"
                          >
                            <span className="text-sm text-[#737373]">{equipo.ganados}</span>
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Link 
                            href={`/equipos/${equipo.id_equipo}`}
                            className="block"
                          >
                            <span className="text-sm text-[#737373]">{equipo.empatados}</span>
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Link 
                            href={`/equipos/${equipo.id_equipo}`}
                            className="block"
                          >
                            <span className="text-sm text-[#737373]">{equipo.perdidos}</span>
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Link 
                            href={`/equipos/${equipo.id_equipo}`}
                            className="block"
                          >
                            <span className="text-sm text-[#737373]">{equipo.goles_favor}</span>
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Link 
                            href={`/equipos/${equipo.id_equipo}`}
                            className="block"
                          >
                            <span className="text-sm text-[#737373]">{equipo.goles_contra}</span>
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Link 
                            href={`/equipos/${equipo.id_equipo}`}
                            className="block"
                          >
                            <span className={`text-sm font-medium ${
                              equipo.diferencia_goles > 0 
                                ? 'text-[var(--green)]' 
                                : equipo.diferencia_goles < 0 
                                  ? 'text-red-400' 
                                  : 'text-[#737373]'
                            }`}>
                              {equipo.diferencia_goles > 0 ? '+' : ''}{equipo.diferencia_goles}
                            </span>
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Link 
                            href={`/equipos/${equipo.id_equipo}`}
                            className="block"
                          >
                            <span className="text-sm font-bold text-white">{equipo.puntos}</span>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-[#737373] text-sm">No hay posiciones disponibles</p>
            </div>
          )
        ) : (
          // Vista de Playoffs
          hasPlayoffs ? (
            <div className="p-4">
              <PlayoffBracket zonas={zonasPlayoff} />
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-[#737373] text-sm">No hay playoffs disponibles</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

