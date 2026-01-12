import { redirect } from 'next/navigation';

// Forzar renderizado dinámico para rutas dinámicas
export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EquipoDetallePage({ params }: PageProps) {
    const resolvedParams = await params;
    // Redirigir a la ruta de info por defecto
    redirect(`/adm/legajos/equipos/${resolvedParams.id}/info`);
}