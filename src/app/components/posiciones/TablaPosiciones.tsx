'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight, ExternalLink, Trophy } from 'lucide-react';
import { BaseCard, CardHeader } from '../BaseCard';
import { EquipoPosicion, IEquipoPosicion, ITablaPosicion } from '@/app/types/posiciones';
import { Zona, FormatoPosicion } from '@/app/types/zonas';
import PlayoffBracket from '../playoff/PlayoffBracket';
import { useTablasPosicionesHome } from '@/app/hooks/useTablasPosicionesHome';
import { useTablaPosiciones } from '@/app/hooks/useTablaPosiciones';
import { usePlayoffs } from '@/app/hooks/usePlayoffs';
import { TablaPosicionesHomeFallback } from '../home/homeFallbacks';
import { TablaPosicionesTable } from './TablaPosicionesTable';
import { TablaPosicionesHeader } from './TablaPosicionesHeader';

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

  // Hook para lógica de tabla de posiciones
  const {
    columnMode,
    posicionesAMostrar,
    formatosPosicionFinal,
    isLoading: isLoadingState,
    isEmpty,
  } = useTablaPosiciones({
    variant,
    posiciones,
    tablaActual,
    formatosPosicion,
    isLoading,
    loading,
  });

  // Hook para lógica de playoffs
  const {
    zonasTodosContraTodos,
    zonasPlayoffFiltradas,
    etapasPlayoff,
    etapaPlayoffActiva,
    setEtapaPlayoffActiva,
    zonasPlayoffEtapaActiva,
    showTabs,
    mostrarSelectorZonas,
    mostrarSelectorEtapas,
    activeTab,
    setActiveTab,
  } = usePlayoffs({
    variant,
    zonasPlayoff,
    posicionesLength: posiciones.length,
    showPlayoffTabs,
    showZonaSelector,
  });

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
            icon={<Trophy size={18} className="text-[var(--color-primary)]" />}
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
            icon={<Trophy size={18} className="text-[var(--color-primary)]" />}
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
            icon={<Trophy size={18} className="text-[var(--color-primary)]" />}
            title="Tabla de posiciones"
            subtitle={tablaActual?.categoria_edicion}
            actions={
              totalTablas > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTablaChange(currentTablaIndex - 1)}
                    disabled={currentTablaIndex === 0}
                    className="p-1 rounded-full bg-[#262626] hover:bg-[var(--color-primary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                    className="p-1 rounded-full bg-[#262626] hover:bg-[var(--color-primary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
            <TablaPosicionesTable
              variant={variant}
              columnMode={columnMode}
              posiciones={posicionesAMostrar}
              formatosPosicion={formatosPosicionFinal}
              userTeamIds={userTeamIds}
              tablaActual={tablaActual}
              isLoading={isLoadingState}
              isEmpty={isEmpty}
            />
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
            className="flex items-center justify-center gap-2 text-sm text-[var(--color-primary)] hover:text-[var(--color-primary)]/80 transition-colors font-medium"
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
          <TablaPosicionesHeader
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            zonasTodosContraTodos={zonasTodosContraTodos}
            etapasPlayoff={etapasPlayoff}
            etapaPlayoffActiva={etapaPlayoffActiva}
            setEtapaPlayoffActiva={setEtapaPlayoffActiva}
            mostrarSelectorZonas={mostrarSelectorZonas}
            mostrarSelectorEtapas={mostrarSelectorEtapas}
          />
        )}

        <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl overflow-hidden">
          {activeTab === 'posiciones' ? (
            <TablaPosicionesTable
              variant={variant}
              columnMode={columnMode}
              posiciones={posicionesAMostrar}
              formatosPosicion={formatosPosicionFinal}
              userTeamIds={userTeamIds}
              tablaActual={tablaActual}
              isLoading={isLoadingState}
              isEmpty={isEmpty}
            />
          ) : (
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
      <TablaPosicionesTable
        variant={variant}
        columnMode={columnMode}
        posiciones={posicionesAMostrar}
        formatosPosicion={formatosPosicionFinal}
        userTeamIds={userTeamIds}
        tablaActual={tablaActual}
        isLoading={isLoadingState}
        isEmpty={isEmpty}
      />
    </div>
  );
};


