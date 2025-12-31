'use client';

import { Shield, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { BaseCard, CardHeader } from '../BaseCard';
import { BaseCardTableSkeleton } from '../skeletons/BaseCardTableSkeleton';
import Link from 'next/link';
import { useTablasPosicionesHome } from '@/app/hooks/useTablasPosicionesHome';
import { ITablaPosicion } from '@/app/types/posiciones';
import { EscudoEquipo } from '../common/EscudoEquipo';
import { FormatoPosicionBadge } from '../posiciones/FormatoPosicionBadge';
import { FormatoPosicion } from '@/app/types/zonas';

interface TablaPosicionesHomeProps {
  tablas?: ITablaPosicion[]; // Array de tablas (una por cada equipo del usuario)
  loading?: boolean;
  linkTablaCompleta?: string; // Link para ver tabla completa
}

export const TablaPosicionesHome = ({
  tablas,
  loading = false,
  linkTablaCompleta = '/estadisticas'
}: TablaPosicionesHomeProps) => {
  const {
    tablas: tablasData,
    loading: isLoading,
    error,
    currentTablaIndex,
    slideDirection,
    handleTablaChange,
  } = useTablasPosicionesHome({ tablas, loading, limitPosiciones: 6 });

  const totalTablas = tablasData?.length || 0;
  const tablaActual = tablasData?.[currentTablaIndex];

  // Manejar error
  if (error && !tablas) {
    return (
      <BaseCard>
        <CardHeader
          icon={<Shield size={18} className="text-[var(--green)]" />}
          title="Tabla de posiciones"
          subtitle="Error al cargar"
        />
        <div className="flex flex-col items-center justify-center py-12 px-6">
          <p className="text-[#737373] text-sm text-center">{error.message}</p>
        </div>
      </BaseCard>
    );
  }

  // Casos vacíos
  if (!isLoading && (!tablasData || tablasData.length === 0)) {
    return (
      <BaseCard>
        <CardHeader
          icon={<Shield size={18} className="text-[var(--green)]" />}
          title="Tabla de posiciones"
        />
        <div className="flex flex-col items-center justify-center py-12 px-6">
          <div className="w-16 h-16 bg-[#262626] rounded-full flex items-center justify-center mb-4">
            <Shield size={32} className="text-[#737373]" />
          </div>
          <p className="text-[#737373] text-sm text-center">
            No hay posiciones disponibles
          </p>
        </div>
      </BaseCard>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <BaseCard>
        <CardHeader
          icon={<Shield size={18} className="text-[var(--green)]" />}
          title="Tabla de posiciones"
          subtitle="Cargando..."
        />
        <div className="p-4">
          <BaseCardTableSkeleton
            columns={5}
            rows={6}
            hasAvatar={false}
          />
        </div>
      </BaseCard>
    );
  }

  return (
    <BaseCard>
      <div className="rounded-t-2xl overflow-hidden">
        <CardHeader
          icon={<Shield size={18} className="text-[var(--green)]" />}
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

      {/* Tabla con animación */}
      <div className="w-full overflow-hidden">
        <div
          key={currentTablaIndex}
          className={`w-full overflow-x-auto ${slideDirection === 'left' ? 'animate-slide-in-left' : 'animate-slide-in-right'
            }`}
        >
          <table className="w-full">
            <thead className="border-b border-[#262626]">
              <tr>
                <th className="text-left py-2.5 px-3 text-[10px] font-medium text-[#737373] uppercase tracking-wider">
                  #
                </th>
                <th className="text-left py-2.5 px-3 text-[10px] font-medium text-[#737373] uppercase tracking-wider">
                  Equipo
                </th>
                <th className="text-center py-2.5 px-2 text-[10px] font-medium text-[#737373] uppercase tracking-wider">
                  Pts
                </th>
                <th className="text-center py-2.5 px-2 text-[10px] font-medium text-[#737373] uppercase tracking-wider">
                  PJ
                </th>
                <th className="text-center py-2.5 px-2 text-[10px] font-medium text-[#737373] uppercase tracking-wider">
                  DG
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262626]">
              {tablaActual?.posiciones.map((equipo: { posicion: number; id_equipo: number; nombre_equipo: string; img_equipo?: string | null; puntos: number; puntos_descontados?: number; puntos_finales?: number; partidos_jugados: number; diferencia_goles: number; apercibimientos?: number }) => {
                const esMiEquipo = equipo.id_equipo === tablaActual.id_equipo;

                return (
                  <tr
                    key={equipo.id_equipo}
                    className={`transition-colors ${esMiEquipo ? 'bg-[var(--green)]/5' : 'hover:bg-[#0a0a0a]'
                      }`}
                  >
                    <td className="py-3 px-3">
                      <Link href={`/equipos/${equipo.id_equipo}`} className="block">
                        <div className="flex items-center">
                          <FormatoPosicionBadge
                            posicion={equipo.posicion}
                            formatosPosicion={tablaActual?.formatosPosicion}
                          />
                          <span className={`text-sm font-bold ${esMiEquipo ? 'text-[var(--green)]' : 'text-white'
                            }`}>
                            {equipo.posicion}
                          </span>
                        </div>
                      </Link>
                    </td>
                    <td className="py-3 px-3">
                      <Link href={`/equipos/${equipo.id_equipo}`} className="block">
                        <div className="flex items-center gap-2">
                          <EscudoEquipo
                            src={equipo.img_equipo}
                            alt={equipo.nombre_equipo}
                            size={20}
                            className="flex-shrink-0"
                          />
                          <span className={`text-sm font-medium truncate ${esMiEquipo ? 'text-[var(--green)]' : 'text-white'
                            }`}>
                            {equipo.nombre_equipo}
                          </span>
                        </div>
                      </Link>
                    </td>
                    <td className="text-center py-3 px-2">
                      <Link href={`/equipos/${equipo.id_equipo}`} className="block">
                        <div className="flex flex-col items-center">
                          <span className={`text-sm font-bold ${esMiEquipo ? 'text-[var(--green)]' : 'text-white'
                            }`}>
                            {equipo.puntos || 0}
                          </span>
                          {(equipo.puntos_descontados ?? 0) > 0 && (equipo.apercibimientos ?? 0) > 0 && (
                            <span className="text-[10px] text-[var(--yellow)] mt-0.5">
                              -{equipo.puntos_descontados}
                            </span>
                          )}
                        </div>
                      </Link>
                    </td>
                    <td className={`text-center py-3 px-2 text-sm ${esMiEquipo ? 'text-[var(--green)]' : 'text-white'
                      }`}>
                      <Link href={`/equipos/${equipo.id_equipo}`} className="block">
                        {equipo.partidos_jugados}
                      </Link>
                    </td>
                    <td className="text-center py-3 px-2">
                      <Link href={`/equipos/${equipo.id_equipo}`} className="block">
                        <span className={`text-sm font-medium ${equipo.diferencia_goles > 0
                            ? esMiEquipo ? 'text-[var(--green)]' : 'text-green-400'
                            : equipo.diferencia_goles < 0
                              ? 'text-red-400'
                              : esMiEquipo ? 'text-[var(--green)]' : 'text-gray-400'
                          }`}>
                          {equipo.diferencia_goles > 0 ? '+' : ''}
                          {equipo.diferencia_goles}
                        </span>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Leyenda de formatos de posición */}
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

      {/* Link para ver tabla completa */}
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

      {/* CSS para la animación slide */}
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
};
