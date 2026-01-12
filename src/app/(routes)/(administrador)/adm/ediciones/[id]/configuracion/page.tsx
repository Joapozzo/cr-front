import { edicionesService } from '@/app/services/ediciones.services';
import { EdicionConfigClient } from '@/app/components/admin/EdicionConfigClient';

// Forzar renderizado dinámico para rutas dinámicas
export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ConfiguracionPage({ params }: PageProps) {
    const resolvedParams = await params;
    const edicionId = parseInt(resolvedParams.id);

    // SSR opcional: Intentamos obtener la edición en el servidor para mejorar UX
    // Si falla, el Client Component manejará el fetch con React Query
    // Esto permite degradación elegante: SSR cuando es posible, CSR como fallback
    let edicion = null;
    try {
        const ediciones = await edicionesService.obtenerTodasLasEdiciones();
        edicion = ediciones.find(e => e.id_edicion === edicionId) || null;
    } catch (error) {
        // El error no es crítico aquí: el Client Component tiene React Query
        // que manejará el fetch en el cliente si el SSR falla
        // api.ts detecta automáticamente si está en servidor y usa cookies
        console.warn('SSR falló para edición, el cliente hará el fetch:', error);
    }

    return (
        <EdicionConfigClient 
            initialEdicion={edicion}
        />
    );
}