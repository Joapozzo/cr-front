'use client';

import { useState, useRef, useEffect } from 'react';

export type TabEquipo = 'resumen' | 'plantel' | 'stats' | 'partidos' | 'participaciones';

interface EquipoTabsProps {
  tabActiva: TabEquipo;
  onTabChange: (tab: TabEquipo) => void;
  loading?: boolean;
}

const tabs: { value: TabEquipo; label: string }[] = [
  { value: 'resumen', label: 'Resumen' },
  { value: 'plantel', label: 'Plantel' },
  { value: 'stats', label: 'Stats' },
  { value: 'partidos', label: 'Partidos' },
  { value: 'participaciones', label: 'Participaciones' }
];

export const EquipoTabs: React.FC<EquipoTabsProps> = ({
  tabActiva,
  onTabChange,
  loading = false
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  // Calcular total de páginas
  const totalPages = tabs.length;

  // Scroll al tab activo
  useEffect(() => {
    const activeIndex = tabs.findIndex(tab => tab.value === tabActiva);
    if (activeIndex !== -1 && tabsRef.current[activeIndex]) {
      tabsRef.current[activeIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
      setCurrentPage(activeIndex);
    }
  }, [tabActiva]);

  if (loading) {
    return (
      <div className="border-b border-[#262626]">
        <div className="flex gap-2 p-4 overflow-x-auto scrollbar-hide">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-8 w-24 bg-[var(--black-800)] rounded animate-pulse flex-shrink-0"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--black-900)] rounded-xl border border-[#262626]">
      {/* Tabs scrollables */}
      <div
        ref={scrollContainerRef}
        className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide scroll-smooth"
        style={{
          scrollSnapType: 'x mandatory'
        }}
      >
        {tabs.map((tab, index) => (
          <button
            key={tab.value}
            ref={el => tabsRef.current[index] = el}
            onClick={() => onTabChange(tab.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 scroll-snap-align-center ${
              tabActiva === tab.value
                ? 'bg-[var(--green)] text-white'
                : 'text-[#737373] hover:text-white hover:bg-[var(--black-700)]'
            }`}
            style={{
              scrollSnapAlign: 'center'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Indicadores de página (dots) */}
      {totalPages > 3 && (
        <div className="flex items-center justify-center gap-1 py-2">
          {[...Array(totalPages)].map((_, index) => (
            <div
              key={index}
              className={`h-1 rounded-full transition-all duration-300 ${
                index === currentPage
                  ? 'w-4 bg-[var(--green)]'
                  : 'w-1 bg-[#262626]'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

