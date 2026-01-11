import { redirect } from 'next/navigation';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EquipoDetallePage({ params }: PageProps) {
    const resolvedParams = await params;
    // Redirigir a la ruta de info por defecto
    redirect(`/adm/legajos/equipos/${resolvedParams.id}/info`);
}