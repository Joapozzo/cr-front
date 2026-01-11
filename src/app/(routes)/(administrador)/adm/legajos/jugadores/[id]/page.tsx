import { redirect } from 'next/navigation';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function JugadorDetallePage({ params }: PageProps) {
    const resolvedParams = await params;
    // Redirigir a la ruta de info por defecto
    redirect(`/adm/legajos/jugadores/${resolvedParams.id}/info`);
}