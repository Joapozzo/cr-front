'use client';

import Link from 'next/link';
import { EquipoPosicion, IEquipoPosicion } from '@/app/types/posiciones';
import { FormatoPosicion } from '@/app/types/zonas';
import { EscudoEquipo } from '../common/EscudoEquipo';
import { FormatoPosicionBadge } from './FormatoPosicionBadge';
import { useEquipoStats } from '@/app/hooks/useEquipoStats';
import { TablaPosicionesVariant, TablaPosicionesColumnMode } from './TablaPosiciones';

interface TablaPosicionesRowProps {
  equipo: EquipoPosicion | IEquipoPosicion;
  index: number;
  variant: TablaPosicionesVariant;
  columnMode: TablaPosicionesColumnMode;
  formatosPosicion: FormatoPosicion[];
  userTeamIds: number[];
  esMiEquipo?: boolean;
}

/**
 * Componente puro para renderizar una fila de la tabla de posiciones
 * Recibe stats normalizados por props (a través del hook useEquipoStats)
 */
export const TablaPosicionesRow: React.FC<TablaPosicionesRowProps> = ({
  equipo,
  index,
  variant,
  columnMode,
  formatosPosicion,
  userTeamIds,
  esMiEquipo = false,
}) => {
  const stats = useEquipoStats(equipo as any);
  const isUserTeam = userTeamIds.includes(equipo.id_equipo);
  const posicion = 'posicion' in equipo ? equipo.posicion : index + 1;

  const equipoConLive = equipo as (IEquipoPosicion | EquipoPosicion) & {
    en_vivo?: boolean;
  };

  return (
    <tr
      className={`transition-colors ${
        variant === 'home'
          ? esMiEquipo ? 'bg-[var(--green)]/5' : 'hover:bg-[#0a0a0a]'
          : isUserTeam ? 'bg-[var(--green)]/5 hover:bg-[var(--black-800)]' : 'hover:bg-[var(--black-800)]'
      }`}
    >
      <td className={variant === 'home' ? "py-3 px-3" : "px-4 py-3 whitespace-nowrap"}>
        <Link href={`/equipos/${equipo.id_equipo}`} className="block">
          <div className="flex items-center">
            <FormatoPosicionBadge
              posicion={posicion}
              formatosPosicion={formatosPosicion}
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
        <Link href={`/equipos/${equipo.id_equipo}`} className="block">
          <div className="flex items-center gap-2">
            <EscudoEquipo
              src={equipo.img_equipo}
              alt={equipo.nombre_equipo}
              size={variant === 'home' ? 20 : 24}
              className="flex-shrink-0"
            />
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium truncate ${
                (variant === 'home' && esMiEquipo) || isUserTeam
                  ? 'text-[var(--green)]'
                  : 'text-white'
              }`}>
                {equipo.nombre_equipo}
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
            <Link href={`/equipos/${equipo.id_equipo}`} className="block">
              {stats.partidosJugados}
            </Link>
          </td>
          <td className={`${variant === 'home' ? 'text-center py-3 px-2' : 'px-4 py-3 text-center'} text-sm text-[#737373]`}>
            <Link href={`/equipos/${equipo.id_equipo}`} className="block">
              {stats.ganados}
            </Link>
          </td>
          <td className={`${variant === 'home' ? 'text-center py-3 px-2' : 'px-4 py-3 text-center'} text-sm text-[#737373]`}>
            <Link href={`/equipos/${equipo.id_equipo}`} className="block">
              {stats.empatados}
            </Link>
          </td>
          <td className={`${variant === 'home' ? 'text-center py-3 px-2' : 'px-4 py-3 text-center'} text-sm text-[#737373]`}>
            <Link href={`/equipos/${equipo.id_equipo}`} className="block">
              {stats.perdidos}
            </Link>
          </td>
          <td className={`${variant === 'home' ? 'text-center py-3 px-2' : 'px-4 py-3 text-center'} text-sm text-[#737373]`}>
            <Link href={`/equipos/${equipo.id_equipo}`} className="block">
              {stats.golesFavor}
            </Link>
          </td>
          <td className={`${variant === 'home' ? 'text-center py-3 px-2' : 'px-4 py-3 text-center'} text-sm text-[#737373]`}>
            <Link href={`/equipos/${equipo.id_equipo}`} className="block">
              {stats.golesContra}
            </Link>
          </td>
        </>
      )}
      <td className={`${variant === 'home' ? 'text-center py-3 px-2' : 'px-4 py-3 text-center'}`}>
        <Link href={`/equipos/${equipo.id_equipo}`} className="block">
          {columnMode === 'compact' ? (
            <span className={`text-sm ${variant === 'home' && esMiEquipo ? 'text-[var(--green)]' : 'text-white'}`}>
              {stats.partidosJugados}
            </span>
          ) : (
            <span className={`text-sm font-medium ${
              stats.diferenciaGoles > 0
                ? 'text-[var(--green)]'
                : stats.diferenciaGoles < 0
                  ? 'text-red-400'
                  : 'text-[#737373]'
            }`}>
              {stats.diferenciaGoles > 0 ? '+' : ''}{stats.diferenciaGoles}
            </span>
          )}
        </Link>
      </td>
      {columnMode === 'compact' && (
        <td className="text-center py-3 px-2">
          <Link href={`/equipos/${equipo.id_equipo}`} className="block">
            <span className={`text-sm font-medium ${
              stats.diferenciaGoles > 0
                ? variant === 'home' && esMiEquipo ? 'text-[var(--green)]' : 'text-green-400'
                : stats.diferenciaGoles < 0
                  ? 'text-red-400'
                  : variant === 'home' && esMiEquipo ? 'text-[var(--green)]' : 'text-gray-400'
            }`}>
              {stats.diferenciaGoles > 0 ? '+' : ''}{stats.diferenciaGoles}
            </span>
          </Link>
        </td>
      )}
      <td className={`${variant === 'home' ? 'text-center py-3 px-2' : 'px-4 py-3 text-center'}`}>
        <Link href={`/equipos/${equipo.id_equipo}`} className="block">
          <div className="flex flex-col items-center">
            <span className={`text-sm ${variant === 'home' ? 'font-bold' : 'font-bold'} ${
              (variant === 'home' && esMiEquipo) || isUserTeam
                ? 'text-[var(--green)]'
                : 'text-white'
            }`}>
              {stats.puntosFinales}
            </span>
            {stats.puntosDescontados > 0 && stats.apercibimientos > 0 && (
              <span className="text-[10px] text-[var(--yellow)] mt-0.5">
                -{stats.puntosDescontados}
              </span>
            )}
          </div>
        </Link>
      </td>
      {columnMode === 'full' && (
        <td className="px-4 py-3 text-center">
          <Link href={`/equipos/${equipo.id_equipo}`} className="block">
            <span className={`text-sm font-medium ${
              stats.apercibimientos > 0
                ? 'text-[var(--yellow)]'
                : 'text-[#737373]'
            }`}>
              {stats.apercibimientos}
            </span>
          </Link>
        </td>
      )}
    </tr>
  );
};

