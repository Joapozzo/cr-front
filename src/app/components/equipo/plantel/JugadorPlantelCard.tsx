'use client';

import React from 'react';
import { JugadorPlantel } from '@/app/types/plantelEquipo';
import { ImagenPublica } from '@/app/components/common/ImagenPublica';
import { User, Crown } from 'lucide-react';

interface JugadorPlantelCardProps {
  jugador: JugadorPlantel;
}

export const JugadorPlantelCard: React.FC<JugadorPlantelCardProps> = ({
  jugador
}) => {
  const estaSancionado = jugador.sancionado === 'S';
  const esEventual = jugador.eventual === 'S';
  const esCapitan = jugador.es_capitan === true;

  // Determinar clases de borde según el estado
  const borderClasses = estaSancionado
    ? 'border-red-500/50'
    : esEventual
    ? 'border-yellow-500/50'
    : 'border-[#262626]';

  return (
    <div
      className={`
        bg-[var(--black-900)] border rounded-lg p-3 sm:p-4
        flex items-center gap-3 sm:gap-4
        transition-colors hover:bg-[var(--black-800)]
        ${borderClasses}
      `}
    >
      {/* Foto del jugador */}
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden bg-[var(--black-800)] flex-shrink-0 border border-[#262626]">
        <ImagenPublica
          src={jugador.img || '/img/default-avatar.png'}
          alt={`${jugador.nombre} ${jugador.apellido}`}
          width={56}
          height={56}
          className="w-full h-full object-cover"
          fallbackIcon={<User className="w-6 h-6 sm:w-7 sm:h-7 text-[#737373]" />}
        />
      </div>

      {/* Información del jugador */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="text-white font-semibold text-sm sm:text-base truncate">
            {jugador.nombre} {jugador.apellido}
          </h4>
          {esCapitan && (
            <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 flex-shrink-0" />
          )}
        </div>
        <p className="text-[#737373] text-xs sm:text-sm truncate">
          {jugador.posicion?.nombre || 'Sin posición'}
        </p>
      </div>
    </div>
  );
};

