'use client';

import { EquipoPosicion, IEquipoPosicion, ITablaPosicion } from '@/app/types/posiciones';
import { FormatoPosicion } from '@/app/types/zonas';
import { TablaPosicionesRow } from './TablaPosicionesRow';
import { FormatoPosicionLeyenda } from './FormatoPosicionBadge';
import { BaseCardTableSkeleton } from '../skeletons/BaseCardTableSkeleton';
import { TablaPosicionesVariant, TablaPosicionesColumnMode } from './TablaPosiciones';

interface TablaPosicionesTableProps {
  variant: TablaPosicionesVariant;
  columnMode: TablaPosicionesColumnMode;
  posiciones: (EquipoPosicion | IEquipoPosicion)[];
  formatosPosicion: FormatoPosicion[];
  userTeamIds: number[];
  tablaActual?: ITablaPosicion;
  isLoading: boolean;
  isEmpty: boolean;
}

/**
 * Componente puro para renderizar la tabla de posiciones
 * Recibe datos ya procesados y solo se encarga del render
 */
export const TablaPosicionesTable: React.FC<TablaPosicionesTableProps> = ({
  variant,
  columnMode,
  posiciones,
  formatosPosicion,
  userTeamIds,
  tablaActual,
  isLoading,
  isEmpty,
}) => {
  if (isLoading) {
    return <BaseCardTableSkeleton columns={columnMode === 'compact' ? 5 : 11} rows={6} hasAvatar={false} />;
  }

  if (isEmpty) {
    return (
      <div className="p-8 text-center">
        <p className="text-[#737373] text-sm">No hay posiciones disponibles</p>
      </div>
    );
  }

  return (
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
          {posiciones.map((equipo, index) => {
            const esMiEquipo = variant === 'home' && tablaActual && equipo.id_equipo === tablaActual.id_equipo;
            return (
              <TablaPosicionesRow
                key={equipo.id_equipo}
                equipo={equipo}
                index={index}
                variant={variant}
                columnMode={columnMode}
                formatosPosicion={formatosPosicion}
                userTeamIds={userTeamIds}
                esMiEquipo={esMiEquipo}
              />
            );
          })}
        </tbody>
      </table>
      {variant !== 'home' && formatosPosicion && formatosPosicion.length > 0 && (
        <FormatoPosicionLeyenda formatosPosicion={formatosPosicion} />
      )}
    </div>
  );
};

