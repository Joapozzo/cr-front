import { categoriasService } from '@/app/services/categorias.services';
import { CategoriasClient } from './CategoriasClient';

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function CategoriasPage({ params }: PageProps) {
    const resolvedParams = await params;
    const edicionId = parseInt(resolvedParams.id);

    // Fetch categorías en el servidor usando el servicio existente
    // api.ts ahora detecta automáticamente si está en servidor y usa cookies
    let categorias = null;
    try {
        categorias = await categoriasService.obtenerCategoriasPorEdicion(edicionId);
    } catch (error) {
        // Si falla en servidor, el cliente manejará el fetching con React Query
        console.error('Error al obtener categorías en servidor:', error);
    }

    return (
        <CategoriasClient 
            initialCategorias={categorias}
            edicionId={edicionId}
        />
    );
}
