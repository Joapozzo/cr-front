'use client';

import { ImagenPublica } from '../common/ImagenPublica';
import { Partido } from '@/app/types/partido';
import Link from 'next/link';
import { GiSoccerField } from "react-icons/gi";
import { Shield } from 'lucide-react';
import { getEstadoConfig } from '@/app/utils/partido.helper';

interface ListaPartidosProps {
  partidos: Partido[];
  titulo?: string; // "Jornada 5" o "Viernes, 15 nov"
  subtitulo?: string; // Fecha cuando es por jornada
}

export const ListaPartidos: React.FC<ListaPartidosProps> = ({
  partidos,
  titulo,
  subtitulo
}) => {
  if (!partidos || partidos.length === 0) {
    return null;
  }

  return (
    <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl overflow-hidden">
      {/* Header - Solo se muestra si hay título o subtítulo */}
      {(titulo || subtitulo) && (
        <div className="px-4 py-3 border-b border-[#262626]">
          {titulo && (
            <h3 className="text-white font-semibold text-sm">{titulo}</h3>
          )}
          {subtitulo && (
            <p className="text-[#737373] text-xs mt-0.5">{subtitulo}</p>
          )}
        </div>
      )}

      {/* Lista de partidos */}
      <div className="divide-y divide-[#262626]">
        {partidos.map((partido) => {
          const estadoConfig = getEstadoConfig(partido.estado);

          return (
            <Link 
              key={partido.id_partido}
              href={`/partidos/${partido.id_partido}`}
              className="block hover:bg-[var(--black-800)] transition-colors"
            >
              <div className="px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  {/* Equipo Local */}
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="w-6 h-6 rounded-full overflow-hidden bg-[var(--black-800)] flex-shrink-0">
                      <ImagenPublica
                        src={partido.equipoLocal.img || '/img/default-team.png'}
                        alt={partido.equipoLocal.nombre}
                        width={24}
                        height={24}
                        fallbackIcon={<Shield className="w-3 h-3 text-[#737373]" />}
                      />
                    </div>
                    <span className="text-white text-xs font-medium truncate">
                      {partido.equipoLocal.nombre}
                    </span>
                  </div>

                  {/* Centro: Marcador, Hora, Cancha o En Vivo */}
                  <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
                    {estadoConfig.showLive && (
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-[var(--green)] rounded-full animate-pulse" />
                        <span className="text-[var(--green)] text-[9px] font-medium">
                          En Vivo
                        </span>
                      </div>
                    )}

                    {estadoConfig.showScore ? (
                      <div className="flex items-center gap-2">
                        <span className="text-white text-sm font-bold">{partido.goles_local ?? 0}</span>
                        <span className="text-[#737373] text-xs">-</span>
                        <span className="text-white text-sm font-bold">{partido.goles_visita ?? 0}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 flex-col justify-center">
                        <span className="text-[#737373] text-xs font-medium">{partido.hora}</span>
                        {estadoConfig.showCancha && (
                          <div className="flex items-center gap-1">
                            <GiSoccerField />
                            <span className="text-[#737373] text-[10px]">{partido.cancha}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Equipo Visita */}
                  <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                    <span className="text-white text-xs font-medium truncate text-right">
                      {partido.equipoVisita.nombre}
                    </span>
                    <div className="w-6 h-6 rounded-full overflow-hidden bg-[var(--black-800)] flex-shrink-0">
                      <ImagenPublica
                        src={partido.equipoVisita.img || '/img/default-team.png'}
                        alt={partido.equipoVisita.nombre}
                        width={24}
                        height={24}
                        fallbackIcon={<Shield className="w-3 h-3 text-[#737373]" />}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

