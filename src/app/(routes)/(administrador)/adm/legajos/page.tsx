'use client';

import { TabNavigation } from '@/app/components/legajos/shared/TabNavigation';
import { PageHeader } from '@/app/components/ui/PageHeader';
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
            <PageHeader
                title="Legajos"
                description="Consulta la información histórica y estadísticas de jugadores y equipos"
            />

            <TabNavigation tabs={tabs} />
        </div>
    );
};

export default LegajosPage;

