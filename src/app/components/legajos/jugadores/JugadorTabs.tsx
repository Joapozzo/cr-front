'use client';

import { FileText, Users, Calendar, BarChart3, Shield, Mail } from 'lucide-react';

type TabType = 'info' | 'equipos' | 'partidos' | 'estadisticas' | 'disciplina' | 'solicitudes';

interface JugadorTabsProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

const tabs: Array<{ id: TabType; label: string; icon: React.ReactNode }> = [
    { id: 'info', label: 'Información', icon: <FileText className="w-4 h-4" /> },
    { id: 'equipos', label: 'Equipos', icon: <Users className="w-4 h-4" /> },
    { id: 'partidos', label: 'Partidos', icon: <Calendar className="w-4 h-4" /> },
    { id: 'estadisticas', label: 'Estadísticas', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'disciplina', label: 'Disciplina', icon: <Shield className="w-4 h-4" /> },
    { id: 'solicitudes', label: 'Solicitudes', icon: <Mail className="w-4 h-4" /> },
];

export const JugadorTabs = ({ activeTab, onTabChange }: JugadorTabsProps) => {
    return (
        <div className="border-b border-[var(--gray-300)]">
            <nav className="flex -mb-px space-x-8 overflow-x-auto" aria-label="Tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`
                            whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2
                            ${activeTab === tab.id
                                ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                                : 'border-transparent text-[var(--gray-100)] hover:text-[var(--white)] hover:border-[var(--gray-200)]'
                            }
                        `}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </nav>
        </div>
    );
};

