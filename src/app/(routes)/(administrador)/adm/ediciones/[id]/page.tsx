import { categoriasService } from '@/app/services/categorias.services';
import { CategoriasClient } from '../../../../../components/admin/CategoriasClient';

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function CategoriasPage({ params }: PageProps) {
    const resolvedParams = await params;
    const edicionId = parseInt(resolvedParams.id);

    // SSR opcional: Intentamos obtener categorías en el servidor para mejorar UX
    // Si falla, el Client Component manejará el fetch con React Query
    // Esto permite degradación elegante: SSR cuando es posible, CSR como fallback
    let categorias = null;
    try {
        categorias = await categoriasService.obtenerCategoriasPorEdicion(edicionId);
    } catch (error) {
        // El error no es crítico aquí: el Client Component tiene React Query
        // que manejará el fetch en el cliente si el SSR falla
        // api.ts detecta automáticamente si está en servidor y usa cookies
        console.warn('SSR falló para categorías, el cliente hará el fetch:', error);
    }

    return (
        <CategoriasClient 
            initialCategorias={categorias}
            edicionId={edicionId}
        />
    );
}
