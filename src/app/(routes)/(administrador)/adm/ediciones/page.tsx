import { edicionesService } from '@/app/services/ediciones.services';
import { EdicionesClient } from '../../../../components/admin/EdicionesClient';

// Forzar renderizado dinámico porque usa cookies y no-store fetch
export const dynamic = 'force-dynamic';

export default async function EdicionesPage() {
    // Fetch ediciones en el servidor usando el servicio existente
    // api.ts ahora detecta automáticamente si está en servidor y usa cookies
    let ediciones = null;
    try {
        ediciones = await edicionesService.obtenerTodasLasEdiciones();
    } catch (error) {
        // Si falla en servidor, el cliente manejará el fetching con React Query
        console.error('Error al obtener ediciones en servidor:', error);
    }

    return (
        <EdicionesClient 
            initialEdiciones={ediciones}
        />
    );
}
