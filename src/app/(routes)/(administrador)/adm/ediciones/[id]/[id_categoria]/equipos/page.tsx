import EquiposClient from '@/app/components/equipos/EquiposClient';

// Forzar renderizado dinámico para rutas dinámicas
export const dynamic = 'force-dynamic';

export default function EquiposPage() {
    return <EquiposClient />;
}