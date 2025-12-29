import React from 'react';
import { Shield } from "lucide-react";
import { Equipo } from '../types/equipo';

interface TabNavigationProps {
    activeTab: 'local' | 'visitante';
    onTabChange: (tab: 'local' | 'visitante') => void;
    equipoLocal: Equipo;
    equipoVisitante: Equipo;
    countLocal: number;
    countVisitante: number;
}

const TabNavigationTeams: React.FC<TabNavigationProps> = ({
    activeTab,
    onTabChange,
    equipoLocal,
    equipoVisitante,
    countLocal,
    countVisitante
}) => {
    // const URLImages = "";

    return (
        <div className="flex items-center justify-center mb-6 w-full">
            <div className=" p-2 rounded-lg flex gap-2 justify-center w-full">
                <button
                    onClick={() => onTabChange('local')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${activeTab === 'local'
                        ? 'bg-[var(--green)] text-black'
                        : 'text-[#737373] hover:text-white'
                        }`}
                >
                    <Shield className="text-black" size={22} />
                    {equipoLocal.nombre}
                    <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === 'local'
                        ? 'bg-gray-200 text-[var(--gray-700)]'
                        : 'bg-[#171717] text-white'
                        }`}>
                        {countLocal}
                    </span>
                </button>
                <button
                    onClick={() => onTabChange('visitante')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${activeTab === 'visitante'
                        ? 'bg-[var(--green)]  text-black'
                        : 'text-[#737373] hover:text-white'
                        }`}
                >
                    <Shield className="text-white" size={22} />
                    {equipoVisitante.nombre}
                    <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === 'visitante'
                        ? 'bg-gray-200 text-[var(--gray-700)]'
                        : 'bg-[#171717] text-white'
                        }`}>
                        {countVisitante}
                    </span>
                </button>
            </div>
        </div>
    );
};

export default TabNavigationTeams;