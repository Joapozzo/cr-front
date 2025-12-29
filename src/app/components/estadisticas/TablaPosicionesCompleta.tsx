'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Trophy } from 'lucide-react';
import { EquipoPosicion } from '@/app/types/posiciones';
import { Zona, FormatoPosicion } from '@/app/types/zonas';
import PlayoffBracket from '../playoff/PlayoffBracket';
import { EscudoEquipo } from '../common/EscudoEquipo';
import { BaseCardTableSkeleton } from '../skeletons/BaseCardTableSkeleton';
import { useZonaStore } from '@/app/stores/zonaStore';
import { FormatoPosicionBadge, FormatoPosicionLeyenda } from '../posiciones/FormatoPosicionBadge';

interface TablaPosicionesCompletaProps {
  posiciones: EquipoPosicion[];
  zonasPlayoff?: Zona[];
  isLoading?: boolean;
  userTeamIds?: number[];
  formatosPosicion?: FormatoPosicion[];
}

export const TablaPosicionesCompleta: React.FC<TablaPosicionesCompletaProps> = ({
  posiciones,
  zonasPlayoff = [],
  isLoading = false,
  userTeamIds = [],
  formatosPosicion = []
}) => {
  const [activeTab, setActiveTab] = useState<'posiciones' | 'playoff'>('posiciones');
  const [etapaPlayoffActiva, setEtapaPlayoffActiva] = useState<number>(0);
  const { zonaSeleccionada, setZonaSeleccionada } = useZonaStore();

  const hasPlayoffs = zonasPlayoff && zonasPlayoff.length > 0;
  const hasPositions = posiciones && posiciones.length > 0;

  // Separar zonas de todos contra todos y playoff
  const zonasTodosContraTodos = useMemo(() => {
    return zonasPlayoff.filter(z => 
      z.tipoZona?.nombre === 'todos-contra-todos' || 
      z.tipoZona?.nombre === 'todos-contra-todos-ida-vuelta'
    );
  }, [zonasPlayoff]);

  const zonasPlayoffFiltradas = useMemo(() => {
    return zonasPlayoff.filter(z => 
      z.tipoZona?.nombre === 'eliminacion-directa' || 
      z.tipoZona?.nombre === 'eliminacion-directa-ida-vuelta'
    );
  }, [zonasPlayoff]);

  // Obtener etapas únicas de playoffs
  const etapasPlayoff = useMemo(() => {
    return Array.from(
      new Map(zonasPlayoffFiltradas.map(z => [z.etapa.id_etapa, z.etapa])).values()
    );
  }, [zonasPlayoffFiltradas]);

  // Establecer etapa de playoff activa inicial
  useEffect(() => {
    if (etapasPlayoff.length > 0 && etapaPlayoffActiva === 0) {
      setEtapaPlayoffActiva(etapasPlayoff[0].id_etapa);
    }
  }, [etapasPlayoff, etapaPlayoffActiva]);

  // Filtrar zonas de playoff por etapa activa
  const zonasPlayoffEtapaActiva = useMemo(() => {
    return zonasPlayoffFiltradas.filter(z => z.etapa.id_etapa === etapaPlayoffActiva);
  }, [zonasPlayoffFiltradas, etapaPlayoffActiva]);

  // Inicializar zona seleccionada
  useEffect(() => {
    if (zonasTodosContraTodos.length > 0 && zonaSeleccionada === 0) {
      setZonaSeleccionada(zonasTodosContraTodos[0].id_zona);
    }
  }, [zonasTodosContraTodos, zonaSeleccionada, setZonaSeleccionada]);

  // Determinar vista inicial
  useEffect(() => {
    if (hasPositions || zonasTodosContraTodos.length > 0) {
      setActiveTab('posiciones');
    } else if (hasPlayoffs || zonasPlayoffFiltradas.length > 0) {
      setActiveTab('playoff');
    }
  }, [hasPositions, hasPlayoffs, zonasTodosContraTodos.length, zonasPlayoffFiltradas.length]);

  // Si solo hay una de las dos, no mostrar tabs
  const showTabs = (hasPlayoffs || zonasPlayoffFiltradas.length > 0) && (hasPositions || zonasTodosContraTodos.length > 0);

  // Determinar si mostrar selector de zonas
  const mostrarSelectorZonas = activeTab === 'posiciones' && zonasTodosContraTodos.length > 1;

  // Determinar si mostrar selector de etapas (solo en playoff)
  const mostrarSelectorEtapas = activeTab === 'playoff' && etapasPlayoff.length > 1;

  // Obtener zona actual
  const zonaActual = zonasTodosContraTodos.find(z => z.id_zona === zonaSeleccionada);

  // Obtener posiciones de la zona actual si hay múltiples zonas
  // Si hay una sola zona o no hay zonas de todos contra todos, usar las posiciones pasadas directamente
  const posicionesAMostrar = useMemo(() => {
    if (zonasTodosContraTodos.length > 1 && zonaActual) {
      // Si hay múltiples zonas y hay una zona seleccionada, necesitamos las posiciones de esa zona
      // Pero las posiciones vienen como prop, así que las usamos directamente
      // En este caso, las posiciones ya deberían estar filtradas por zona en la página padre
      return posiciones;
    }
    return posiciones;
  }, [posiciones, zonasTodosContraTodos.length, zonaActual]);

  // console.log(posicionesAMostrar);

  return (
    <div className="space-y-4">
      {/* Header con tabs y selectores */}
      {showTabs && (
        <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#262626]">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[var(--green)]" />
                {activeTab === 'posiciones' ? 'Tabla de posiciones' : 'Playoffs'}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('posiciones')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                    activeTab === 'posiciones'
                      ? 'bg-[var(--green)] text-white'
                      : 'bg-[#262626] text-[#737373] hover:text-white hover:bg-[#2a2a2a]'
                  }`}
                >
                  Fase de Grupos
                </button>
                <button
                  onClick={() => setActiveTab('playoff')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                    activeTab === 'playoff'
                      ? 'bg-[var(--green)] text-white'
                      : 'bg-[#262626] text-[#737373] hover:text-white hover:bg-[#2a2a2a]'
                  }`}
                >
                  Playoffs
                </button>
              </div>
            </div>

            {/* Selector de zonas (cuando hay múltiples zonas de todos contra todos) */}
            {mostrarSelectorZonas && (
              <div className="mt-4">
                <select
                  value={zonaSeleccionada}
                  onChange={(e) => setZonaSeleccionada(Number(e.target.value))}
                  className="w-full px-4 py-2 bg-[#262626] text-white rounded-lg border border-[#2a2a2a] focus:outline-none focus:border-[var(--green)] transition-colors"
                >
                  {zonasTodosContraTodos.map((zona) => (
                    <option key={zona.id_zona} value={zona.id_zona}>
                      {zona.nombre || `Zona ${zona.id_zona}`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Selector de etapas (solo cuando es playoff y hay múltiples etapas) */}
            {mostrarSelectorEtapas && (
              <div className="mt-4 flex gap-2">
                {etapasPlayoff.map((etapa) => (
                  <button
                    key={etapa.id_etapa}
                    onClick={() => setEtapaPlayoffActiva(etapa.id_etapa)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                      etapaPlayoffActiva === etapa.id_etapa
                        ? 'bg-[var(--green)] text-white'
                        : 'bg-[#262626] text-[#737373] hover:text-white hover:bg-[#2a2a2a]'
                    }`}
                  >
                    {etapa.nombre}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Contenido */}
      <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl overflow-hidden">
        {activeTab === 'posiciones' ? (
          // Vista de Posiciones (Todos contra todos)
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
                    <th className="px-4 py-3 text-center text-xs font-medium text-[#737373] uppercase tracking-wider">
                      Aperc.
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#262626]">
                  {posicionesAMostrar.map((equipo, index) => {
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
                            <div className="flex items-center">
                              <FormatoPosicionBadge
                                posicion={index + 1}
                                formatosPosicion={formatosPosicion}
                              />
                              <span className={`text-sm font-semibold ${
                                isUserTeam ? 'text-[var(--green)]' : 'text-white'
                              }`}>
                                {index + 1}
                              </span>
                            </div>
                          </Link>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <Link 
                            href={`/equipos/${equipo.id_equipo}`}
                            className="block"
                          >
                            <div className="flex items-center gap-2">
                              <EscudoEquipo
                                src={equipo.img_equipo}
                                alt={equipo.nombre_equipo}
                                size={24}
                                className="flex-shrink-0"
                              />
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
                            <span className="text-sm font-bold text-white">
                              {equipo.puntos_finales !== undefined ? equipo.puntos_finales : equipo.puntos}
                            </span>
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Link 
                            href={`/equipos/${equipo.id_equipo}`}
                            className="block"
                          >
                            <span className={`text-sm font-medium ${
                              (equipo.apercibimientos || 0) > 0 
                                ? 'text-[var(--yellow)]' 
                                : 'text-[#737373]'
                            }`}>
                              {equipo.apercibimientos || 0}
                            </span>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <FormatoPosicionLeyenda formatosPosicion={formatosPosicion} />
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-[#737373] text-sm">No hay posiciones disponibles</p>
            </div>
          )
        ) : (
          // Vista de Playoffs
          zonasPlayoffFiltradas.length > 0 ? (
            <div className="p-4">
              <PlayoffBracket zonas={zonasPlayoffEtapaActiva} />
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

