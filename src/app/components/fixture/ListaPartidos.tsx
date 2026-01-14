'use client';

import { Partido } from '@/app/types/partido';
import PartidoListFixture from '../partidos/PartidoListFixture';

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
        {partidos.map((partido) => (
          <PartidoListFixture key={partido.id_partido} partido={partido} />
        ))}
      </div>
    </div>
  );
};

