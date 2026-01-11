'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, Users, Calendar, BarChart3, Shield, Mail, CreditCard } from 'lucide-react';

type TabType = 'info' | 'equipos' | 'partidos' | 'estadisticas' | 'disciplina' | 'solicitudes' | 'credenciales';

interface JugadorTabsProps {
    idJugador: number;
}

const tabs: Array<{ id: TabType; label: string; icon: React.ReactNode; path: string }> = [
    { id: 'info', label: 'Información', icon: <FileText className="w-4 h-4" />, path: 'info' },
    { id: 'equipos', label: 'Equipos', icon: <Users className="w-4 h-4" />, path: 'equipos' },
    { id: 'partidos', label: 'Partidos', icon: <Calendar className="w-4 h-4" />, path: 'partidos' },
    { id: 'estadisticas', label: 'Estadísticas', icon: <BarChart3 className="w-4 h-4" />, path: 'estadisticas' },
    { id: 'disciplina', label: 'Disciplina', icon: <Shield className="w-4 h-4" />, path: 'disciplina' },
    { id: 'solicitudes', label: 'Solicitudes', icon: <Mail className="w-4 h-4" />, path: 'solicitudes' },
    { id: 'credenciales', label: 'Credenciales', icon: <CreditCard className="w-4 h-4" />, path: 'credenciales' },
];

export const JugadorTabs = ({ idJugador }: JugadorTabsProps) => {
    const pathname = usePathname();
    const basePath = `/adm/legajos/jugadores/${idJugador}`;

    const getIsActive = (tabPath: string): boolean => {
        if (!pathname) return false;
        
        const fullPath = `${basePath}/${tabPath}`;
        
        // Coincidencia exacta
        if (pathname === fullPath) {
            return true;
        }
        
        // Para info, también considerar la ruta raíz del jugador
        if (tabPath === 'info' && pathname === basePath) {
            return true;
        }
        
        return false;
    };

    return (
        <div className="border-b border-[var(--gray-300)]">
            <nav className="flex -mb-px space-x-8 overflow-x-auto" aria-label="Tabs">
                {tabs.map((tab) => {
                    const isActive = getIsActive(tab.path);
                    const href = tab.path === 'info' ? basePath : `${basePath}/${tab.path}`;
                    
                    return (
                        <Link
                            key={tab.id}
                            href={href}
                            className={`
                                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2
                                ${isActive
                                    ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                                    : 'border-transparent text-[var(--gray-100)] hover:text-[var(--white)] hover:border-[var(--gray-200)]'
                                }
                            `}
                        >
                            {tab.icon}
                            {tab.label}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
};

