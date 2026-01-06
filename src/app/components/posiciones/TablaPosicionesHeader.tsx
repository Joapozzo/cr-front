'use client';

import { Trophy } from 'lucide-react';
import { Zona } from '@/app/types/zonas';
import { useZonaStore } from '@/app/stores/zonaStore';

interface TablaPosicionesHeaderProps {
  activeTab: 'posiciones' | 'playoff';
  setActiveTab: (tab: 'posiciones' | 'playoff') => void;
  zonasTodosContraTodos: Zona[];
  etapasPlayoff: Array<{ id_etapa: number; nombre: string }>;
  etapaPlayoffActiva: number;
  setEtapaPlayoffActiva: (etapa: number) => void;
  mostrarSelectorZonas: boolean;
  mostrarSelectorEtapas: boolean;
}

/**
 * Componente puro para renderizar el header con tabs y selectores
 * Solo se encarga del render, sin lógica de negocio
 */
export const TablaPosicionesHeader: React.FC<TablaPosicionesHeaderProps> = ({
  activeTab,
  setActiveTab,
  zonasTodosContraTodos,
  etapasPlayoff,
  etapaPlayoffActiva,
  setEtapaPlayoffActiva,
  mostrarSelectorZonas,
  mostrarSelectorEtapas,
}) => {
  const { zonaSeleccionada, setZonaSeleccionada } = useZonaStore();

  return (
    <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl overflow-hidden">
      <div className="p-4 border-b border-[#262626]">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h3 className="text-white font-semibold text-lg flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[var(--green)]" />
            {activeTab === 'posiciones' ? 'Tabla de posiciones' : 'Playoffs'}
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('posiciones')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                activeTab === 'posiciones'
                  ? 'bg-[var(--green)] text-white'
                  : 'bg-[#262626] text-[#737373] hover:text-white hover:bg-[#2a2a2a]'
              }`}
            >
              Fase de Grupos
            </button>
            <button
              onClick={() => setActiveTab('playoff')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                activeTab === 'playoff'
                  ? 'bg-[var(--green)] text-white'
                  : 'bg-[#262626] text-[#737373] hover:text-white hover:bg-[#2a2a2a]'
              }`}
            >
              Playoffs
            </button>
          </div>
        </div>

        {mostrarSelectorZonas && (
          <div className="mt-4">
            <select
              value={zonaSeleccionada}
              onChange={(e) => setZonaSeleccionada(Number(e.target.value))}
              className="w-full px-4 py-2 bg-[#262626] text-white rounded-lg border border-[#2a2a2a] focus:outline-none focus:border-[var(--green)] transition-colors"
            >
              {zonasTodosContraTodos.map((zona) => (
                <option key={zona.id_zona} value={zona.id_zona}>
                  {zona.nombre || `Zona ${zona.id_zona}`}
                </option>
              ))}
            </select>
          </div>
        )}

        {mostrarSelectorEtapas && (
          <div className="mt-4 flex gap-2">
            {etapasPlayoff.map((etapa) => (
              <button
                key={etapa.id_etapa}
                onClick={() => setEtapaPlayoffActiva(etapa.id_etapa)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  etapaPlayoffActiva === etapa.id_etapa
                    ? 'bg-[var(--green)] text-white'
                    : 'bg-[#262626] text-[#737373] hover:text-white hover:bg-[#2a2a2a]'
                }`}
              >
                {etapa.nombre}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

