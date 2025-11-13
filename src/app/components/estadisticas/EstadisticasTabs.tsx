'use client';

import { useRef } from 'react';
import { 
  Trophy, 
  Users, 
  AlertTriangle, 
  XCircle, 
  Award,
  Volleyball
} from 'lucide-react';

export type EstadisticaTab = 
  | 'posiciones' 
  | 'goleadores' 
  | 'asistencias' 
  | 'amarillas' 
  | 'rojas' 
  | 'mvps';

interface TabOption {
  id: EstadisticaTab;
  label: string;
  icon: React.ReactNode;
}

interface EstadisticasTabsProps {
  activeTab: EstadisticaTab;
  onTabChange: (tab: EstadisticaTab) => void;
}

const tabOptions: TabOption[] = [
  {
    id: 'posiciones',
    label: 'Posiciones',
    icon: <Trophy size={18} />
  },
  {
    id: 'goleadores',
    label: 'Goleadores',
    icon: <Volleyball size={18} />
  },
  {
    id: 'asistencias',
    label: 'Asistencias',
    icon: <Users size={18} />
  },
  {
    id: 'amarillas',
    label: 'Amarillas',
    icon: <AlertTriangle size={18} />
  },
  {
    id: 'rojas',
    label: 'Rojas',
    icon: <XCircle size={18} />
  },
  {
    id: 'mvps',
    label: 'MVPs',
    icon: <Award size={18} />
  }
];


export const EstadisticasTabs: React.FC<EstadisticasTabsProps> = ({
  activeTab,
  onTabChange
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  return (
    <div className="w-full space-y-3">
      {/* Tabs con scroll */}
      <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl">
        <div 
          ref={scrollContainerRef}
          className="overflow-x-auto scroll-smooth scrollbar-thin scrollbar-thumb-[#262626] scrollbar-track-transparent hover:scrollbar-thumb-[#525252]"
        >
          <div className="flex items-center gap-2 p-2 min-w-max">
            {tabOptions.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-[var(--green)] text-white'
                    : 'text-[#737373] hover:text-white hover:bg-[var(--black-800)]'
                }`}
              >
                {tab.icon}
                <span className="font-medium text-sm">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Barra indicadora minimalista */}
      <div className="flex items-center justify-center gap-1 px-4">
        {tabOptions.map((tab) => (
          <div
            key={tab.id}
            className={`h-1 rounded-full transition-all duration-300 ${
              activeTab === tab.id 
                ? 'w-8 bg-[var(--green)]' 
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

