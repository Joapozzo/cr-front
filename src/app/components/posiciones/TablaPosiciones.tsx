'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ExternalLink, Trophy } from 'lucide-react';
import { BaseCard, CardHeader } from '../BaseCard';
import { EquipoPosicion, IEquipoPosicion, ITablaPosicion } from '@/app/types/posiciones';
import { Zona, FormatoPosicion } from '@/app/types/zonas';
import { EscudoEquipo } from '../common/EscudoEquipo';
import { FormatoPosicionBadge, FormatoPosicionLeyenda } from './FormatoPosicionBadge';
import PlayoffBracket from '../playoff/PlayoffBracket';
import { useZonaStore } from '@/app/stores/zonaStore';
import { useTablasPosicionesHome } from '@/app/hooks/useTablasPosicionesHome';
import { TablaPosicionesHomeFallback } from '../home/homeFallbacks';
import { BaseCardTableSkeleton } from '../skeletons/BaseCardTableSkeleton';

export type TablaPosicionesVariant = 'home' | 'completa' | 'simple';
export type TablaPosicionesColumnMode = 'compact' | 'full';

interface TablaPosicionesProps {
  // Variante del componente
  variant?: TablaPosicionesVariant;
  
  // Datos
  posiciones?: EquipoPosicion[] | IEquipoPosicion[];
  tablas?: ITablaPosicion[];
  
  // Para modo completa
  zonasPlayoff?: Zona[];
  userTeamIds?: number[];
  formatosPosicion?: FormatoPosicion[];
  
  // Estados
  isLoading?: boolean;
  loading?: boolean;
  error?: Error | null;
  
  // Navegación y links
  linkTablaCompleta?: string;
  
  // Configuración
  limitPosiciones?: number;
  showPlayoffTabs?: boolean;
  showZonaSelector?: boolean;
  
  // Estilos
  className?: string;
}

export const TablaPosiciones: React.FC<TablaPosicionesProps> = ({
  variant = 'simple',
  posiciones = [],
  tablas,
  zonasPlayoff = [],
  userTeamIds = [],
  formatosPosicion = [],
  isLoading = false,
  loading = false,
  error = null,
  linkTablaCompleta = '/estadisticas',
  limitPosiciones,
  showPlayoffTabs = true,
  showZonaSelector = true,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<'posiciones' | 'playoff'>('posiciones');
  const [etapaPlayoffActiva, setEtapaPlayoffActiva] = useState<number>(0);
  const { zonaSeleccionada, setZonaSeleccionada } = useZonaStore();

  // Para modo home: manejar múltiples tablas
  const {
    tablas: tablasData,
    error: tablasError,
    currentTablaIndex,
    slideDirection,
    handleTablaChange,
  } = useTablasPosicionesHome({ 
    tablas, 
    loading: loading || isLoading, 
    limitPosiciones: limitPosiciones || (variant === 'home' ? 6 : undefined)
  });

  const totalTablas = tablasData?.length || 0;
  const tablaActual = tablasData?.[currentTablaIndex];

  // Determinar modo de columnas
  const columnMode: TablaPosicionesColumnMode = variant === 'home' ? 'compact' : 'full';

  // Separar zonas de todos contra todos y playoff (solo para modo completa)
  const zonasTodosContraTodos = useMemo(() => {
    if (variant !== 'completa') return [];
    return zonasPlayoff.filter(z => 
      z.tipoZona?.nombre === 'todos-contra-todos' || 
      z.tipoZona?.nombre === 'todos-contra-todos-ida-vuelta'
    );
  }, [zonasPlayoff, variant]);

  const zonasPlayoffFiltradas = useMemo(() => {
    if (variant !== 'completa') return [];
    return zonasPlayoff.filter(z => 
      z.tipoZona?.nombre === 'eliminacion-directa' || 
      z.tipoZona?.nombre === 'eliminacion-directa-ida-vuelta'
    );
  }, [zonasPlayoff, variant]);

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
    if (variant === 'completa') {
      if (posiciones.length > 0 || zonasTodosContraTodos.length > 0) {
        setActiveTab('posiciones');
      } else if (zonasPlayoffFiltradas.length > 0) {
        setActiveTab('playoff');
      }
    }
  }, [variant, posiciones.length, zonasTodosContraTodos.length, zonasPlayoffFiltradas.length]);

  // Obtener posiciones a mostrar según el modo
  const posicionesAMostrar = useMemo(() => {
    if (variant === 'home' && tablaActual) {
      return tablaActual.posiciones;
    }
    return posiciones;
  }, [variant, tablaActual, posiciones]);

  // Determinar si mostrar tabs (solo modo completa)
  const showTabs = variant === 'completa' && showPlayoffTabs && 
    (zonasPlayoffFiltradas.length > 0) && 
    (posiciones.length > 0 || zonasTodosContraTodos.length > 0);

  // Determinar si mostrar selector de zonas
  const mostrarSelectorZonas = variant === 'completa' && 
    showZonaSelector && 
    activeTab === 'posiciones' && 
    zonasTodosContraTodos.length > 1;

  // Determinar si mostrar selector de etapas
  const mostrarSelectorEtapas = variant === 'completa' && 
    activeTab === 'playoff' && 
    etapasPlayoff.length > 1;

  // Obtener zona actual (removed - unused)

  // Obtener formatos de posición a usar
  const formatosPosicionFinal = useMemo(() => {
    if (variant === 'home' && tablaActual?.formatosPosicion) {
      return tablaActual.formatosPosicion;
    }
    return formatosPosicion;
  }, [variant, tablaActual, formatosPosicion]);

  // Renderizar tabla de posiciones
  const renderTabla = () => {
    if (isLoading || loading) {
      return <BaseCardTableSkeleton columns={columnMode === 'compact' ? 5 : 11} rows={6} hasAvatar={false} />;
    }

    if (posicionesAMostrar.length === 0) {
      return (
        <div className="p-8 text-center">
          <p className="text-[#737373] text-sm">No hay posiciones disponibles</p>
        </div>
      );
    }

    const tableContent = (
      <div className={variant === 'home' ? '' : 'overflow-x-auto'}>
        <table className="w-full">
          <thead className={variant === 'home' 
            ? "border-b border-[#262626]" 
            : "bg-[var(--black-800)] border-b border-[#262626]"
          }>
            <tr>
              <th className={`${variant === 'home' ? 'text-left py-2.5 px-3' : 'px-4 py-3 text-left'} text-xs font-medium text-[#737373] uppercase tracking-wider`}>
                #
              </th>
              <th className={`${variant === 'home' ? 'text-left py-2.5 px-3' : 'px-4 py-3 text-left'} text-xs font-medium text-[#737373] uppercase tracking-wider`}>
                Equipo
              </th>
              {columnMode === 'full' && (
                <>
                  <th className={`${variant === 'home' ? 'text-center py-2.5 px-2' : 'px-4 py-3 text-center'} text-xs font-medium text-[#737373] uppercase tracking-wider`}>
                    PJ
                  </th>
                  <th className={`${variant === 'home' ? 'text-center py-2.5 px-2' : 'px-4 py-3 text-center'} text-xs font-medium text-[#737373] uppercase tracking-wider`}>
                    G
                  </th>
                  <th className={`${variant === 'home' ? 'text-center py-2.5 px-2' : 'px-4 py-3 text-center'} text-xs font-medium text-[#737373] uppercase tracking-wider`}>
                    E
                  </th>
                  <th className={`${variant === 'home' ? 'text-center py-2.5 px-2' : 'px-4 py-3 text-center'} text-xs font-medium text-[#737373] uppercase tracking-wider`}>
                    P
                  </th>
                  <th className={`${variant === 'home' ? 'text-center py-2.5 px-2' : 'px-4 py-3 text-center'} text-xs font-medium text-[#737373] uppercase tracking-wider`}>
                    GF
                  </th>
                  <th className={`${variant === 'home' ? 'text-center py-2.5 px-2' : 'px-4 py-3 text-center'} text-xs font-medium text-[#737373] uppercase tracking-wider`}>
                    GC
                  </th>
                </>
              )}
              <th className={`${variant === 'home' ? 'text-center py-2.5 px-2' : 'px-4 py-3 text-center'} text-xs font-medium text-[#737373] uppercase tracking-wider`}>
                {columnMode === 'compact' ? 'PJ' : 'DIF'}
              </th>
              {columnMode === 'compact' && (
                <th className="text-center py-2.5 px-2 text-xs font-medium text-[#737373] uppercase tracking-wider">
                  DG
                </th>
              )}
              <th className={`${variant === 'home' ? 'text-center py-2.5 px-2' : 'px-4 py-3 text-center'} text-xs font-medium text-[#737373] uppercase tracking-wider`}>
                PTS
              </th>
              {columnMode === 'full' && (
                <th className="px-4 py-3 text-center text-xs font-medium text-[#737373] uppercase tracking-wider">
                  Aperc.
                </th>
              )}
            </tr>
          </thead>
          <tbody className={variant === 'home' ? "divide-y divide-[#262626]" : "divide-y divide-[#262626]"}>
            {posicionesAMostrar.map((equipo, index) => {
              const equipoConLive = equipo as (IEquipoPosicion | EquipoPosicion) & {
                en_vivo?: boolean;
                puntos_live?: number;
                goles_favor_live?: number;
                goles_contra_live?: number;
                diferencia_goles_live?: number;
                puntos_finales_live?: number;
                partidos_jugados_live?: number;
                partidos_ganados_live?: number;
                partidos_empatados_live?: number;
                partidos_perdidos_live?: number;
              };

              const isUserTeam = userTeamIds.includes(equipoConLive.id_equipo);
              const esMiEquipo = variant === 'home' && tablaActual && equipoConLive.id_equipo === tablaActual.id_equipo;
              const posicion = 'posicion' in equipoConLive ? equipoConLive.posicion : index + 1;
              
              // Helper para obtener ganados (compatible con ambos tipos)
              const ganados = equipoConLive.partidos_ganados_live ?? 
                (('partidos_ganados' in equipoConLive) ? equipoConLive.partidos_ganados : 
                 (('ganados' in equipoConLive) ? (equipoConLive as EquipoPosicion).ganados : 0));
              const empatados = equipoConLive.partidos_empatados_live ?? 
                (('partidos_empatados' in equipoConLive) ? equipoConLive.partidos_empatados : 
                 (('empatados' in equipoConLive) ? (equipoConLive as EquipoPosicion).empatados : 0));
              const perdidos = equipoConLive.partidos_perdidos_live ?? 
                (('partidos_perdidos' in equipoConLive) ? equipoConLive.partidos_perdidos : 
                 (('perdidos' in equipoConLive) ? (equipoConLive as EquipoPosicion).perdidos : 0));

              return (
                <tr
                  key={equipoConLive.id_equipo}
                  className={`transition-colors ${
                    variant === 'home'
                      ? esMiEquipo ? 'bg-[var(--green)]/5' : 'hover:bg-[#0a0a0a]'
                      : isUserTeam ? 'bg-[var(--green)]/5 hover:bg-[var(--black-800)]' : 'hover:bg-[var(--black-800)]'
                  }`}
                >
                  <td className={variant === 'home' ? "py-3 px-3" : "px-4 py-3 whitespace-nowrap"}>
                    <Link href={`/equipos/${equipoConLive.id_equipo}`} className="block">
                      <div className="flex items-center">
                        <FormatoPosicionBadge
                          posicion={posicion}
                          formatosPosicion={formatosPosicionFinal}
                        />
                        <span className={`text-sm ${variant === 'home' ? 'font-bold' : 'font-semibold'} ${
                          (variant === 'home' && esMiEquipo) || isUserTeam
                            ? 'text-[var(--green)]'
                            : 'text-white'
                        }`}>
                          {posicion}
                        </span>
                      </div>
                    </Link>
                  </td>
                  <td className={variant === 'home' ? "py-3 px-3" : "px-4 py-3 whitespace-nowrap"}>
                    <Link href={`/equipos/${equipoConLive.id_equipo}`} className="block">
                      <div className="flex items-center gap-2">
                        <EscudoEquipo
                          src={equipoConLive.img_equipo}
                          alt={equipoConLive.nombre_equipo}
                          size={variant === 'home' ? 20 : 24}
                          className="flex-shrink-0"
                        />
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium truncate ${
                            (variant === 'home' && esMiEquipo) || isUserTeam
                              ? 'text-[var(--green)]'
                              : 'text-white'
                          }`}>
                            {equipoConLive.nombre_equipo}
                          </span>
                          {equipoConLive.en_vivo && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-[var(--green)] text-white animate-pulse flex-shrink-0">
                              <span className="w-1 h-1 bg-white rounded-full"></span>
                              {variant === 'home' ? 'LIVE' : 'EN VIVO'}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </td>
                  {columnMode === 'full' && (
                    <>
                      <td className={`${variant === 'home' ? 'text-center py-3 px-2' : 'px-4 py-3 text-center'} text-sm ${variant === 'home' && esMiEquipo ? 'text-[var(--green)]' : 'text-[#737373]'}`}>
                        <Link href={`/equipos/${equipoConLive.id_equipo}`} className="block">
                          {equipoConLive.partidos_jugados_live ?? equipoConLive.partidos_jugados ?? 0}
                        </Link>
                      </td>
                      <td className={`${variant === 'home' ? 'text-center py-3 px-2' : 'px-4 py-3 text-center'} text-sm text-[#737373]`}>
                        <Link href={`/equipos/${equipoConLive.id_equipo}`} className="block">
                          {ganados}
                        </Link>
                      </td>
                      <td className={`${variant === 'home' ? 'text-center py-3 px-2' : 'px-4 py-3 text-center'} text-sm text-[#737373]`}>
                        <Link href={`/equipos/${equipoConLive.id_equipo}`} className="block">
                          {empatados}
                        </Link>
                      </td>
                      <td className={`${variant === 'home' ? 'text-center py-3 px-2' : 'px-4 py-3 text-center'} text-sm text-[#737373]`}>
                        <Link href={`/equipos/${equipoConLive.id_equipo}`} className="block">
                          {perdidos}
                        </Link>
                      </td>
                      <td className={`${variant === 'home' ? 'text-center py-3 px-2' : 'px-4 py-3 text-center'} text-sm text-[#737373]`}>
                        <Link href={`/equipos/${equipoConLive.id_equipo}`} className="block">
                          {equipoConLive.goles_favor_live ?? equipoConLive.goles_favor ?? 0}
                        </Link>
                      </td>
                      <td className={`${variant === 'home' ? 'text-center py-3 px-2' : 'px-4 py-3 text-center'} text-sm text-[#737373]`}>
                        <Link href={`/equipos/${equipoConLive.id_equipo}`} className="block">
                          {equipoConLive.goles_contra_live ?? equipoConLive.goles_contra ?? 0}
                        </Link>
                      </td>
                    </>
                  )}
                  <td className={`${variant === 'home' ? 'text-center py-3 px-2' : 'px-4 py-3 text-center'}`}>
                    <Link href={`/equipos/${equipoConLive.id_equipo}`} className="block">
                      {columnMode === 'compact' ? (
                        <span className={`text-sm ${variant === 'home' && esMiEquipo ? 'text-[var(--green)]' : 'text-white'}`}>
                          {equipoConLive.partidos_jugados_live ?? equipoConLive.partidos_jugados ?? 0}
                        </span>
                      ) : (
                        (() => {
                          const difGoles = equipoConLive.diferencia_goles_live ?? equipoConLive.diferencia_goles ?? 0;
                          return (
                            <span className={`text-sm font-medium ${
                              difGoles > 0
                                ? 'text-[var(--green)]'
                                : difGoles < 0
                                  ? 'text-red-400'
                                  : 'text-[#737373]'
                            }`}>
                              {difGoles > 0 ? '+' : ''}{difGoles}
                            </span>
                          );
                        })()
                      )}
                    </Link>
                  </td>
                  {columnMode === 'compact' && (
                    <td className="text-center py-3 px-2">
                      <Link href={`/equipos/${equipoConLive.id_equipo}`} className="block">
                        {(() => {
                          const difGoles = equipoConLive.diferencia_goles_live ?? equipoConLive.diferencia_goles ?? 0;
                          return (
                            <span className={`text-sm font-medium ${
                              difGoles > 0
                                ? variant === 'home' && esMiEquipo ? 'text-[var(--green)]' : 'text-green-400'
                                : difGoles < 0
                                  ? 'text-red-400'
                                  : variant === 'home' && esMiEquipo ? 'text-[var(--green)]' : 'text-gray-400'
                            }`}>
                              {difGoles > 0 ? '+' : ''}{difGoles}
                            </span>
                          );
                        })()}
                      </Link>
                    </td>
                  )}
                  <td className={`${variant === 'home' ? 'text-center py-3 px-2' : 'px-4 py-3 text-center'}`}>
                    <Link href={`/equipos/${equipoConLive.id_equipo}`} className="block">
                      <div className="flex flex-col items-center">
                        <span className={`text-sm ${variant === 'home' ? 'font-bold' : 'font-bold'} ${
                          (variant === 'home' && esMiEquipo) || isUserTeam
                            ? 'text-[var(--green)]'
                            : 'text-white'
                        }`}>
                          {equipoConLive.puntos_finales_live ?? equipoConLive.puntos_finales ?? equipoConLive.puntos ?? 0}
                        </span>
                        {(equipoConLive.puntos_descontados ?? 0) > 0 && (equipoConLive.apercibimientos ?? 0) > 0 && (
                          <span className="text-[10px] text-[var(--yellow)] mt-0.5">
                            -{equipoConLive.puntos_descontados}
                          </span>
                        )}
                      </div>
                    </Link>
                  </td>
                  {columnMode === 'full' && (
                    <td className="px-4 py-3 text-center">
                      <Link href={`/equipos/${equipoConLive.id_equipo}`} className="block">
                        <span className={`text-sm font-medium ${
                          (equipoConLive.apercibimientos || 0) > 0
                            ? 'text-[var(--yellow)]'
                            : 'text-[#737373]'
                        }`}>
                          {equipoConLive.apercibimientos || 0}
                        </span>
                      </Link>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
        {variant !== 'home' && formatosPosicionFinal && formatosPosicionFinal.length > 0 && (
          <FormatoPosicionLeyenda formatosPosicion={formatosPosicionFinal} />
        )}
      </div>
    );

    return tableContent;
  };

  // Renderizar contenido según variante
  if (variant === 'home') {
    // Modo Home
    if (tablasData === undefined) {
      return <TablaPosicionesHomeFallback />;
    }

    if ((tablasError || error) && !tablas) {
      return (
        <BaseCard>
          <CardHeader
            icon={<Trophy size={18} className="text-[var(--green)]" />}
            title="Tabla de posiciones"
            subtitle="Error al cargar"
          />
          <div className="flex flex-col items-center justify-center py-12 px-6">
            <p className="text-[#737373] text-sm text-center">{(tablasError || error)?.message || 'Error al cargar'}</p>
          </div>
        </BaseCard>
      );
    }

    if (!tablasData || tablasData.length === 0) {
      return (
        <BaseCard>
          <CardHeader
            icon={<Trophy size={18} className="text-[var(--green)]" />}
            title="Tabla de posiciones"
          />
          <div className="flex flex-col items-center justify-center py-12 px-6">
            <div className="w-16 h-16 bg-[#262626] rounded-full flex items-center justify-center mb-4">
              <Trophy size={32} className="text-[#737373]" />
            </div>
            <p className="text-[#737373] text-sm text-center">
              No hay posiciones disponibles
            </p>
          </div>
        </BaseCard>
      );
    }

    return (
      <BaseCard className={className}>
        <div className="rounded-t-2xl overflow-hidden">
          <CardHeader
            icon={<Trophy size={18} className="text-[var(--green)]" />}
            title="Tabla de posiciones"
            subtitle={tablaActual?.categoria_edicion}
            actions={
              totalTablas > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTablaChange(currentTablaIndex - 1)}
                    disabled={currentTablaIndex === 0}
                    className="p-1 rounded-full bg-[#262626] hover:bg-[var(--green)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Tabla anterior"
                  >
                    <ChevronLeft size={16} className="text-white" />
                  </button>
                  <span className="text-xs text-[#737373] min-w-[40px] text-center">
                    {currentTablaIndex + 1} / {totalTablas}
                  </span>
                  <button
                    onClick={() => handleTablaChange(currentTablaIndex + 1)}
                    disabled={currentTablaIndex === totalTablas - 1}
                    className="p-1 rounded-full bg-[#262626] hover:bg-[var(--green)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Tabla siguiente"
                  >
                    <ChevronRight size={16} className="text-white" />
                  </button>
                </div>
              )
            }
          />
        </div>

        <div className="w-full overflow-hidden">
          <div
            key={currentTablaIndex}
            className={`w-full overflow-x-auto ${slideDirection === 'left' ? 'animate-slide-in-left' : 'animate-slide-in-right'}`}
          >
            {renderTabla()}
          </div>
        </div>

        {tablaActual?.formatosPosicion && tablaActual.formatosPosicion.length > 0 && (
          <div className="border-t border-[#262626] px-4 py-3 bg-[#0a0a0a]">
            <div className="flex items-center gap-6 text-xs flex-wrap">
              {tablaActual.formatosPosicion
                .sort((a: FormatoPosicion, b: FormatoPosicion) => a.orden - b.orden)
                .map((formato: FormatoPosicion) => (
                  <div key={formato.id_formato_posicion} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: formato.color || '#000' }}
                    />
                    <span className="text-[#737373]">{formato.descripcion}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        <div className="border-t border-[#262626] p-4">
          <Link
            href={tablaActual?.id_categoria_edicion
              ? `${linkTablaCompleta}?categoria=${tablaActual.id_categoria_edicion}&tipo=posiciones`
              : `${linkTablaCompleta}?tipo=posiciones`
            }
            className="flex items-center justify-center gap-2 text-sm text-[var(--green)] hover:text-[var(--green)]/80 transition-colors font-medium"
          >
            Ver tabla completa
            <ExternalLink size={14} />
          </Link>
        </div>

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
  }

  if (variant === 'completa') {
    // Modo Completa
    return (
      <div className={`space-y-4 ${className}`}>
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

        <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl overflow-hidden">
          {activeTab === 'posiciones' ? renderTabla() : (
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
  }

  // Modo Simple
  return (
    <div className={`bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] overflow-hidden ${className}`}>
      {renderTabla()}
    </div>
  );
};


