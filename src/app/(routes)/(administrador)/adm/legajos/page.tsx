/**
 * Página principal de Legajos con tabs de navegación
 */
'use client';

import { TabNavigation } from '@/app/components/legajos/shared/TabNavigation';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const LegajosPage = () => {
    const pathname = usePathname();
    const router = useRouter();

    // Redirigir a jugadores por defecto
    useEffect(() => {
        if (pathname === '/admin/legajos') {
            router.push('/admin/legajos/jugadores');
        }
    }, [pathname, router]);

    const tabs = [
        { label: 'Jugadores', href: '/admin/legajos/jugadores' },
        { label: 'Equipos', href: '/admin/legajos/equipos' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        Legajos
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Consulta la información histórica y estadísticas de jugadores y equipos
                    </p>
                </div>

                <TabNavigation tabs={tabs} />
            </div>
        </div>
    );
};

export default LegajosPage;

