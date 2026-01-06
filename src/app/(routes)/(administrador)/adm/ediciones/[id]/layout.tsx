import { edicionesService } from '@/app/services/ediciones.services';
import { categoriasService } from '@/app/services/categorias.services';
import { EdicionLayoutClient } from './EdicionLayoutClient';

interface LayoutProps {
    children: React.ReactNode;
    params: Promise<{
        id: string;
        id_categoria?: string;
        id_equipo?: string;
    }>;
}

export default async function EdicionLayout({ children, params }: LayoutProps) {
    const resolvedParams = await params;
    const edicionId = parseInt(resolvedParams.id);
    const idCategoria = resolvedParams.id_categoria ? parseInt(resolvedParams.id_categoria) : undefined;

    // Fetch edición en el servidor usando el servicio existente
    // api.ts ahora detecta automáticamente si está en servidor y usa cookies
    let edicion = null;
    try {
        const ediciones = await edicionesService.obtenerTodasLasEdiciones();
        edicion = ediciones.find(e => e.id_edicion === edicionId) || null;
    } catch (error) {
        console.error('Error al obtener edición en servidor:', error);
    }

    // Fetch categoría si existe id_categoria
    let categoria = null;
    if (idCategoria) {
        try {
            const categorias = await categoriasService.obtenerCategoriasPorEdicion(edicionId);
            categoria = categorias.find(cat => cat.categoria.id_categoria === idCategoria) || null;
        } catch (error) {
            console.error('Error al obtener categoría en servidor:', error);
        }
    }

    return (
        <EdicionLayoutClient
            edicion={edicion}
            categoria={categoria}
            params={resolvedParams}
        >
            {children}
        </EdicionLayoutClient>
    );
}
