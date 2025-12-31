'use client';

import { useState, useMemo, useEffect } from 'react';
import { JugadorEstadistica, TipoEstadistica } from '@/app/types/estadisticas';
import { ImagenPublica } from '../common/ImagenPublica';
import {  Target, AlertTriangle, XCircle, Award, Volleyball } from 'lucide-react';
import { BaseCard } from '../BaseCard';
import { BaseCardTableSkeleton } from '../skeletons/BaseCardTableSkeleton';
import { Pagination } from '../legajos/shared/Pagination';

interface TablaJugadoresEstadisticasProps {
  jugadores: JugadorEstadistica[];
  tipo: TipoEstadistica;
  isLoading?: boolean;
  onRowClick?: (jugador: JugadorEstadistica) => void;
}

const getConfigByType = (tipo: TipoEstadistica) => {
  switch (tipo) {
    case 'goleadores':
      return {
        icon: Volleyball,
        label: 'Goles'
      };
    case 'asistencias':
      return {
        icon: Target,
        label: 'Asistencias'
      };
    case 'amarillas':
      return {
        icon: AlertTriangle,
        label: 'Amarillas'
      };
    case 'rojas':
      return {
        icon: XCircle,
        label: 'Rojas'
      };
    case 'mvps':
      return {
        icon: Award,
        label: 'MVPs'
      };
  }
};

export const TablaJugadoresEstadisticas: React.FC<TablaJugadoresEstadisticasProps> = ({
  jugadores,
  tipo,
  isLoading = false,
  onRowClick
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const config = getConfigByType(tipo);
  const Icon = config.icon;

  // Calcular paginación
  const totalPages = Math.ceil((jugadores?.length || 0) / itemsPerPage);
  
  // Obtener jugadores de la página actual
  const jugadoresPaginados = useMemo(() => {
    if (!jugadores || jugadores.length === 0) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return jugadores.slice(startIndex, endIndex);
  }, [jugadores, currentPage, itemsPerPage]);

  // Resetear a página 1 cuando cambian los jugadores
  useEffect(() => {
    setCurrentPage(1);
  }, [jugadores?.length]);

  if (isLoading) {
    return (
      <BaseCard>
        <BaseCardTableSkeleton 
          columns={3} 
          rows={4}
          hasAvatar={true}
        />
      </BaseCard>
    );
  }

  if (!jugadores || jugadores.length === 0) {
    return (
      <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-8">
        <p className="text-[#737373] text-center text-sm">
          No hay datos disponibles
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[var(--black-800)] border-b border-[#262626]">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-[#737373] uppercase tracking-wider w-8">
                #
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-[#737373] uppercase tracking-wider">
                Jugador
              </th>
              <th className="px-3 py-2 text-center text-xs font-medium text-[#737373] uppercase tracking-wider w-16">
                <div className="flex items-center justify-center gap-1">
                  <Icon size={12} className="text-[#737373]" />
                  <span className="hidden sm:inline">{config.label}</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#262626]">
            {jugadoresPaginados.map((jugador, index) => {
              const globalIndex = (currentPage - 1) * itemsPerPage + index;
              return (
              <tr
                key={`${jugador.id_jugador}-${globalIndex}`}
                onClick={() => onRowClick?.(jugador)}
                className={`hover:bg-[var(--black-800)] transition-colors ${
                  onRowClick ? 'cursor-pointer' : ''
                }`}
              >
                {/* Posición */}
                <td className="px-3 py-3 whitespace-nowrap">
                  <span className="text-xs font-semibold text-white">
                    {globalIndex + 1}
                  </span>
                </td>

                {/* Jugador con equipo debajo */}
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
                      <ImagenPublica
                        src={jugador.img}
                        alt={`${jugador.nombre} ${jugador.apellido}`}
                        width={36}
                        height={36}
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-medium text-white truncate">
                        {jugador.nombre} {jugador.apellido}
                      </span>
                      <span className="text-xs text-[#737373] truncate">
                        {jugador.equipo.nombre}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Valor (goles, asistencias, etc) */}
                <td className="px-3 py-3 text-center">
                  <span className="text-base font-bold text-white">
                    {jugador.valor}
                  </span>
                </td>
              </tr>
            );
            })}
          </tbody>
        </table>
      </div>
      {/* Paginación */}
      {totalPages > 1 && (
        <div className="px-4 py-4 border-t border-[#262626]">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

