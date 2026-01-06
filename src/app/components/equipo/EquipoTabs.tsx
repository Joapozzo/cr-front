'use client';

import { useRef, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export type TabEquipo = 'resumen' | 'plantel' | 'stats' | 'partidos' | 'participaciones';

interface TabOption {
  id: TabEquipo;
  label: string;
}

interface EquipoTabsProps {
  activeTab: TabEquipo;
  idEquipo?: number | null;
  baseUrl?: string; // URL base para construir los links (default: '/miequipo')
}

const tabOptions: TabOption[] = [
  { id: 'resumen', label: 'Resumen' },
  { id: 'plantel', label: 'Plantel' },
  { id: 'stats', label: 'Stats' },
  { id: 'partidos', label: 'Partidos' },
  { id: 'participaciones', label: 'Participaciones' }
];

export const EquipoTabs: React.FC<EquipoTabsProps> = ({
  activeTab,
  idEquipo,
  baseUrl: baseUrlProp
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

  // Construir URL base - usar prop si se proporciona, sino usar '/miequipo' por defecto
  const baseUrl = useMemo(() => {
    return baseUrlProp || '/miequipo';
  }, [baseUrlProp]);

  // Filtrar tabs: no mostrar 'stats' cuando baseUrl no es '/miequipo'
  const availableTabs = useMemo(() => {
    if (baseUrl === '/miequipo') {
      return tabOptions;
    }
    return tabOptions.filter(tab => tab.id !== 'stats');
  }, [baseUrl]);

  // Función helper para construir la URL de cada tab
  const getTabUrl = (tabId: TabEquipo) => {
    const params = new URLSearchParams();
    
    // Si la baseUrl es '/miequipo', mantener el comportamiento original
    if (baseUrl === '/miequipo') {
      // Copiar todos los params existentes (incluyendo equipo)
      searchParams.forEach((value, key) => {
        params.set(key, value);
      });
      // Luego establecer el nuevo tab (esto sobrescribirá el tab anterior si existe)
      params.set('tab', tabId);
      if (idEquipo) {
        params.set('equipo', idEquipo.toString());
      }
    } else {
      // Para otras URLs (como /equipos/[id]), solo agregar el tab
      params.set('tab', tabId);
    }
    
    return `${baseUrl}?${params.toString()}`;
  };
  
  return (
    <div className="w-full space-y-3">
      {/* Tabs con scroll */}
      <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl">
        <div 
          ref={scrollContainerRef}
          className="overflow-x-auto scroll-smooth scrollbar-thin scrollbar-thumb-[#262626] scrollbar-track-transparent hover:scrollbar-thumb-[#525252]"
        >
          <div className="flex items-center gap-2 p-2 min-w-max">
            {availableTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <Link
                  key={tab.id}
                  href={getTabUrl(tab.id)}
                  className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'text-[#737373] hover:text-white hover:bg-[var(--black-800)]'
                  }`}
                >
                  <span className="font-medium text-sm">{tab.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Barra indicadora minimalista */}
      <div className="flex items-center justify-center gap-1 px-4">
        {availableTabs.map((tab) => (
          <div
            key={tab.id}
            className={`h-1 rounded-full transition-all duration-300 ${
              activeTab === tab.id 
                ? 'w-8 bg-[var(--color-primary)]' 
                : 'w-1 bg-[#262626]'
            }`}
          />
        ))}
      </div>

      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          height: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #262626;
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #525252;
        }
      `}</style>
    </div>
  );
};

