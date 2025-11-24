'use client';

import { TabNavigation } from '@/app/components/legajos/shared/TabNavigation';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const LegajosPage = () => {
    const pathname = usePathname();
    const router = useRouter();

    // Redirigir a jugadores por defecto
    useEffect(() => {
        if (pathname === '/adm/legajos') {
            router.push('/adm/legajos/jugadores');
        }
    }, [pathname, router]);

    const tabs = [
        { label: 'Jugadores', href: '/adm/legajos/jugadores' },
        { label: 'Equipos', href: '/adm/legajos/equipos' },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-[var(--white)]">Legajos</h1>
                <p className="text-[var(--gray-100)] mt-1">Consulta la información histórica y estadísticas de jugadores y equipos</p>
            </div>

            <TabNavigation tabs={tabs} />
        </div>
    );
};

export default LegajosPage;

