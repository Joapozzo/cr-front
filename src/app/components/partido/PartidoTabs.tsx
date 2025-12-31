'use client';

import React from 'react';

export type TabPartido = 'previa' | 'cara-a-cara';

interface PartidoTabsProps {
  tabActiva: TabPartido;
  onTabChange: (tab: TabPartido) => void;
  loading?: boolean;
}

export const PartidoTabs: React.FC<PartidoTabsProps> = ({
  tabActiva,
  onTabChange,
  loading = false
}) => {

  if (loading) {
    return (
      <div className="flex items-center gap-6">
        <div className="h-5 w-16 bg-[#262626] rounded animate-pulse" />
        <div className="h-5 w-24 bg-[#262626] rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 sm:gap-6 w-full justify-center mt-2 px-2 sm:px-0">
      <div
        onClick={() => onTabChange('previa')}
        className="cursor-pointer relative pb-1 transition-colors duration-200"
      >
        <span
          className={`text-xs sm:text-sm font-medium transition-colors duration-200 ${
            tabActiva === 'previa'
              ? 'text-[var(--green)]'
              : 'text-white'
          }`}
        >
          Previa
        </span>
        <div
          className={`absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--green)] transition-all duration-300 ease-in-out ${
            tabActiva === 'previa'
              ? 'opacity-100 scale-x-100'
              : 'opacity-0 scale-x-0'
          }`}
        />
      </div>
      <div
        onClick={() => onTabChange('cara-a-cara')}
        className="cursor-pointer relative pb-1 transition-colors duration-200"
      >
        <span
          className={`text-xs sm:text-sm font-medium transition-colors duration-200 ${
            tabActiva === 'cara-a-cara'
              ? 'text-[var(--green)]'
              : 'text-white'
          }`}
        >
          Cara a Cara
        </span>
        <div
          className={`absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--green)] transition-all duration-300 ease-in-out ${
            tabActiva === 'cara-a-cara'
              ? 'opacity-100 scale-x-100'
              : 'opacity-0 scale-x-0'
          }`}
        />
      </div>
    </div>
  );
};

