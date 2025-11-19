'use client';

import { Shield, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { BaseCard, CardHeader } from '../BaseCard';
import { BaseCardTableSkeleton } from '../skeletons/BaseCardTableSkeleton';
import Link from 'next/link';
import { useTablasPosicionesHome } from '@/app/hooks/useTablasPosicionesHome';
import { ITablaPosicion } from '@/app/types/posiciones';

interface TablaPosicionesHomeProps {
  tablas?: ITablaPosicion[]; // Array de tablas (una por cada equipo del usuario)
  loading?: boolean;
  linkTablaCompleta?: string; // Link para ver tabla completa
}

/**
 * Componente de tabla de posiciones para el home
 * Muestra 6 posiciones de cada equipo del usuario
 * Si tiene múltiples equipos, puede deslizar entre sus tablas
 */
export const TablaPosicionesHome = ({ 
  tablas, 
  loading = false,
  linkTablaCompleta = '/posiciones'
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
          title="Tabla de Posiciones"
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
          title="Tabla de Posiciones"
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
          title="Tabla de Posiciones"
          subtitle="Cargando..."
        />
        <BaseCardTableSkeleton 
          columns={5} 
          rows={6}
          hasAvatar={false}
        />
      </BaseCard>
    );
  }

  return (
    <BaseCard>
      <div className="rounded-t-2xl overflow-hidden">
        <CardHeader 
          icon={<Shield size={18} className="text-[var(--green)]" />}
          title="Tabla de Posiciones"
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
          className={`w-full overflow-x-auto ${
            slideDirection === 'left' ? 'animate-slide-in-left' : 'animate-slide-in-right'
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
            {tablaActual?.posiciones.map((equipo) => {
              const esMiEquipo = equipo.id_equipo === tablaActual.id_equipo;
              
              return (
                <tr
                  key={equipo.id_equipo}
                  className={`transition-colors ${
                    esMiEquipo ? 'bg-[var(--green)]/5' : 'hover:bg-[#0a0a0a]'
                  }`}
                >
                  <td className={`py-3 px-3 text-sm font-bold ${
                    esMiEquipo ? 'text-[var(--green)]' : 'text-white'
                  }`}>
                    {equipo.posicion}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-[#262626] rounded-full flex items-center justify-center flex-shrink-0">
                        <Shield className="text-[#737373]" size={14} />
                      </div>
                      <span className={`text-sm font-medium truncate ${
                        esMiEquipo ? 'text-[var(--green)]' : 'text-white'
                      }`}>
                        {equipo.nombre_equipo}
                      </span>
                    </div>
                  </td>
                  <td className="text-center py-3 px-2">
                    <span className={`text-sm font-bold ${
                      esMiEquipo ? 'text-[var(--green)]' : 'text-white'
                    }`}>
                      {equipo.puntos}
                    </span>
                  </td>
                  <td className={`text-center py-3 px-2 text-sm ${
                    esMiEquipo ? 'text-[var(--green)]' : 'text-white'
                  }`}>
                    {equipo.partidos_jugados}
                  </td>
                  <td className="text-center py-3 px-2">
                    <span className={`text-sm font-medium ${
                      equipo.diferencia_goles > 0
                        ? esMiEquipo ? 'text-[var(--green)]' : 'text-green-400'
                        : equipo.diferencia_goles < 0
                        ? 'text-red-400'
                        : esMiEquipo ? 'text-[var(--green)]' : 'text-gray-400'
                    }`}>
                      {equipo.diferencia_goles > 0 ? '+' : ''}
                      {equipo.diferencia_goles}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      </div>

      {/* Link para ver tabla completa */}
      <div className="border-t border-[#262626] p-4">
        <Link 
          href={linkTablaCompleta}
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
