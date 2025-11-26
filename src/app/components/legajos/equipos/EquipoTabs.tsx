'use client';

import { FileText, Users, Trophy, Calendar, Award, Shield } from 'lucide-react';

type TabType = 'info' | 'plantel' | 'partidos' | 'tabla' | 'goleadores' | 'capitanes' | 'solicitudes';

interface EquipoTabsProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

export const EquipoTabs = ({ activeTab, onTabChange }: EquipoTabsProps) => {
    const tabs: Array<{ id: TabType; label: string; icon: React.ReactNode }> = [
        { id: 'info', label: 'Información', icon: <FileText className="w-4 h-4" /> },
        { id: 'plantel', label: 'Plantel', icon: <Users className="w-4 h-4" /> },
        { id: 'partidos', label: 'Partidos', icon: <Calendar className="w-4 h-4" /> },
        { id: 'tabla', label: 'Tabla', icon: <Award className="w-4 h-4" /> },
        { id: 'goleadores', label: 'Goleadores', icon: <Trophy className="w-4 h-4" /> },
        { id: 'capitanes', label: 'Capitanes', icon: <Shield className="w-4 h-4" /> },
        { id: 'solicitudes', label: 'Solicitudes', icon: <FileText className="w-4 h-4" /> },
    ];

    return (
        <div className="border-b border-[var(--gray-300)]">
            <nav className="flex -mb-px space-x-8 overflow-x-auto" aria-label="Tabs">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`
                                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2
                                ${isActive
                                    ? 'border-[var(--green)] text-[var(--green)]'
                                    : 'border-transparent text-[var(--gray-100)] hover:text-[var(--white)] hover:border-[var(--gray-200)]'
                                }
                            `}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};

