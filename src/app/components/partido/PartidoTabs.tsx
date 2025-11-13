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
      <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-2 animate-pulse">
        <div className="flex gap-2">
          <div className="h-10 bg-[#262626] rounded-lg flex-1" />
          <div className="h-10 bg-[#262626] rounded-lg flex-1" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-2">
      <div className="flex gap-2">
        <button
          onClick={() => onTabChange('previa')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            tabActiva === 'previa'
              ? 'bg-[var(--green)] text-white'
              : 'text-[#737373] hover:text-white hover:bg-[var(--black-800)]'
          }`}
        >
          Previa
        </button>
        <button
          onClick={() => onTabChange('cara-a-cara')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            tabActiva === 'cara-a-cara'
              ? 'bg-[var(--green)] text-white'
              : 'text-[#737373] hover:text-white hover:bg-[var(--black-800)]'
          }`}
        >
          Cara a Cara
        </button>
      </div>
    </div>
  );
};

