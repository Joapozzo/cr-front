'use client';

import { Shield, Ban, LucideIcon } from 'lucide-react';

type TabType = 'activos' | 'inactivos';

interface Tab {
    id: TabType;
    label: string;
    count: number;
    icon: LucideIcon;
    color: string;
}

interface EquiposTabsProps {
    tabs: Tab[];
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
    children: React.ReactNode;
    error?: Error | null;
}

export default function EquiposTabs({
    tabs,
    activeTab,
    onTabChange,
    children,
    error
}: EquiposTabsProps) {
    return (
        <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)]">
            <div className="flex border-b border-[var(--gray-300)]">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors relative ${
                                isActive
                                    ? 'text-[var(--white)] border-b-2 border-[var(--color-primary)]'
                                    : 'text-[var(--gray-100)] hover:text-[var(--white)]'
                            }`}
                        >
                            <Icon className={`w-4 h-4 ${isActive ? 'text-[var(--color-primary)]' : tab.color}`} />
                            <span>{tab.label}</span>
                            <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                    isActive
                                        ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)]'
                                        : 'bg-[var(--gray-300)] text-[var(--gray-100)]'
                                }`}
                            >
                                {tab.count}
                            </span>
                        </button>
                    );
                })}
            </div>

            <div className="p-6">
                {error && (
                    <div className="bg-[var(--red)]/10 border border-[var(--red)]/30 rounded-lg p-4 mb-4">
                        <p className="text-[var(--red)] text-sm">
                            Error al cargar los datos: {error.message}
                        </p>
                    </div>
                )}

                {children}
            </div>
        </div>
    );
}

