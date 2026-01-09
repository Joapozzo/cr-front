import { TabNavigation } from '@/app/components/legajos/shared/TabNavigation';
import { PageHeader } from '@/app/components/ui/PageHeader';
import { ReactNode } from 'react';

interface LegajosLayoutProps {
    children: ReactNode;
}

export default function LegajosLayout({ children }: LegajosLayoutProps) {
    const tabs = [
        { label: 'Jugadores', href: '/adm/legajos' },
        { label: 'Equipos', href: '/adm/legajos/equipos' },
    ];

    return (
        <div className="space-y-6">
            <PageHeader
                title="Legajos"
                description="Consulta la información histórica y estadísticas de jugadores y equipos"
            />

            <TabNavigation tabs={tabs} />

            {children}
        </div>
    );
}

