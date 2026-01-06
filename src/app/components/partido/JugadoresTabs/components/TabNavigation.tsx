import React from 'react';
import { TabType } from '../types';

interface TabNavigationProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
    equipoLocalNombre: string;
    equipoVisitaNombre: string;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
    activeTab,
    onTabChange,
    equipoLocalNombre,
    equipoVisitaNombre
}) => {
    return (
        <div className="flex border-b border-[#262626] bg-[var(--black-800)] rounded-t-xl">
            <button
                onClick={() => onTabChange('local')}
                className={`
                    flex-1 py-4 text-sm font-semibold transition-all border-b-2
                    ${activeTab === 'local'
                        ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                        : 'border-transparent text-[#737373] hover:text-white'
                    }
                `}
            >
                {equipoLocalNombre}
            </button>

            <button
                onClick={() => onTabChange('incidencias')}
                className={`
                    flex-1 py-4 text-sm font-semibold transition-all border-b-2
                    ${activeTab === 'incidencias'
                        ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                        : 'border-transparent text-[#737373] hover:text-white'
                    }
                `}
            >
                Incidencias
            </button>

            <button
                onClick={() => onTabChange('visita')}
                className={`
                    flex-1 py-4 text-sm font-semibold transition-all border-b-2
                    ${activeTab === 'visita'
                        ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                        : 'border-transparent text-[#737373] hover:text-white'
                    }
                `}
            >
                {equipoVisitaNombre}
            </button>
        </div>
    );
};

