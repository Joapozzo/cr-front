'use client';

import React from 'react';
import { StatsResumen } from '@/app/types/equipoResumen';
import { ImagenPublica } from '@/app/components/common/ImagenPublica';
import { Volleyball, Target, AlertTriangle, XCircle, Award, ChevronRight, User } from 'lucide-react';
import { TipoEstadistica } from '@/app/types/estadisticas';

interface StatsResumenCardProps {
  stats: StatsResumen;
  onVerTodos?: () => void;
}

const getConfigByType = (tipo: TipoEstadistica) => {
  switch (tipo) {
    case 'goleadores':
      return {
        icon: Volleyball,
        label: 'Goles',
        color: 'text-[var(--green)]'
      };
    case 'asistencias':
      return {
        icon: Target,
        label: 'Asistencias',
        color: 'text-blue-500'
      };
    case 'amarillas':
      return {
        icon: AlertTriangle,
        label: 'Amarillas',
        color: 'text-yellow-500'
      };
    case 'rojas':
      return {
        icon: XCircle,
        label: 'Rojas',
        color: 'text-red-600'
      };
    case 'mvps':
      return {
        icon: Award,
        label: 'MVPs',
        color: 'text-yellow-400'
      };
  }
};

export const StatsResumenCard: React.FC<StatsResumenCardProps> = ({
  stats,
  onVerTodos
}) => {
  const config = getConfigByType(stats.tipo);
  const Icon = config.icon;
  const jugadorDestacado = stats.jugadores[0];
  const otrosJugadores = stats.jugadores.slice(1, 4); // Máximo 3 más

  return (
    <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-3 sm:p-4 w-full min-w-[240px] sm:min-w-[280px] flex-shrink-0  min-h-[270px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className={`${config.color} w-4 h-4 sm:w-5 sm:h-5`} />
          <h4 className="text-white font-semibold text-xs sm:text-sm truncate">{stats.titulo}</h4>
        </div>
      </div>

      {/* Jugador destacado (primero) */}
      {jugadorDestacado && (
        <div className="bg-[var(--black-800)] rounded-lg p-3 sm:p-4 mb-3">
          <div className="flex items-center justify-between gap-3">
            {/* Nombre, apellido y stats a la izquierda */}
            <div className="flex-1 min-w-0">
              <h5 className="text-white font-bold text-base sm:text-lg mb-1 truncate">
                {jugadorDestacado.nombre} {jugadorDestacado.apellido}
              </h5>
              <p className="text-[#737373] text-xs sm:text-sm mb-2 truncate">
                {jugadorDestacado.equipo.nombre}
              </p>
              {/* Stats abajo */}
              <div className="flex items-center gap-2">
                <span className={`${config.color} font-bold text-lg sm:text-xl`}>
                  {jugadorDestacado.valor}
                </span>
                <span className="text-[#737373] text-xs sm:text-sm">
                  {config.label}
                </span>
              </div>
            </div>

            {/* Foto a la derecha */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-[var(--black-800)] flex-shrink-0 flex items-center justify-center">
              <ImagenPublica
                src={jugadorDestacado.img || '/img/default-avatar.png'}
                alt={`${jugadorDestacado.nombre} ${jugadorDestacado.apellido}`}
                width={50}
                height={50}
                className="w-full h-full object-cover object-center"
                fallbackIcon={<User className="w-8 h-8 sm:w-10 sm:h-10 text-[#737373]" />}
              />
            </div>
          </div>
        </div>
      )}

      {/* Otros jugadores (máximo 3) */}
      {otrosJugadores.length > 0 && (
        <div className="space-y-2 sm:space-y-2.5 mb-3">
          {otrosJugadores.map((jugador) => (
            <div key={jugador.id_jugador} className="flex items-center gap-2 sm:gap-2.5">
              {/* Foto del jugador */}
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden flex-shrink-0">
                <ImagenPublica
                  src={jugador.img || '/img/default-avatar.png'}
                  alt={`${jugador.nombre} ${jugador.apellido}`}
                  width={30}
                  height={30}
                  className="w-full h-full object-cover"
                  fallbackIcon={<User className="w-10 h-10 sm:w-15 sm:h-15 text-[#737373]" />}
                />
              </div>

              {/* Nombre y valor */}
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-medium truncate">
                  {jugador.nombre} {jugador.apellido}
                </p>
                <p className="text-[#737373] text-[10px] sm:text-xs truncate">
                  {jugador.equipo.nombre}
                </p>
              </div>

              {/* Valor */}
              <div className="flex-shrink-0">
                <span className="text-white font-bold text-sm sm:text-base">
                  {jugador.valor}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mensaje si no hay datos */}
      {!jugadorDestacado && otrosJugadores.length === 0 && (
        <p className="text-[#737373] text-xs text-center py-2">
          No hay datos disponibles
        </p>
      )}

      {/* Ver todos */}
      {/* {stats.jugadores.length > 2 && (
        <button
          onClick={onVerTodos}
          className="flex items-center justify-center gap-1.5 py-1 transition-colors text-[var(--green)] text-xs font-medium border-b border-[var(--green)] mx-auto"
        >
          <span>Ver todos</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      )} */}
    </div>
  );
};

