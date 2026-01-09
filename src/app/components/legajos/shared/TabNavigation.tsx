'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Tab {
    label: string;
    href: string;
}

interface TabNavigationProps {
    tabs: Tab[];
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ tabs }) => {
    const pathname = usePathname();

    const getIsActive = (tabHref: string): boolean => {
        if (!pathname) return false;
        
        // Coincidencia exacta
        if (pathname === tabHref) {
            return true;
        }
        
        // Para la tab de equipos, verificar subrutas (incluyendo rutas dinámicas)
        if (tabHref === '/adm/legajos/equipos') {
            return pathname.startsWith('/adm/legajos/equipos');
        }
        
        // Para la tab de jugadores (raíz), verificar que no sea equipos
        // Incluye rutas dinámicas como /adm/legajos/jugadores/[id]
        if (tabHref === '/adm/legajos') {
            return pathname.startsWith('/adm/legajos') && !pathname.startsWith('/adm/legajos/equipos');
        }
        
        return false;
    };

    return (
        <div className="border-b border-[var(--gray-300)]">
            <nav className="flex -mb-px space-x-8 overflow-x-auto" aria-label="Tabs">
                {tabs.map((tab) => {
                    const isActive = getIsActive(tab.href);
                    
                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className={`
                                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                                ${
                                    isActive
                                        ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                                        : 'border-transparent text-[var(--gray-100)] hover:text-[var(--white)] hover:border-[var(--gray-200)]'
                                }
                            `}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            {tab.label}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
};

