import { notFound } from 'next/navigation';
import { edicionesService } from '@/app/services/ediciones.services';
import { categoriasService } from '@/app/services/categorias.services';
import { EdicionLayoutClient } from '../../../../../components/admin/EdicionLayoutClient';

interface LayoutProps {
    children: React.ReactNode;
    params: Promise<{
        id: string;
        id_categoria?: string;
        id_equipo?: string;
    }>;
}

// Forzar renderizado dinámico porque usa cookies y no-store fetch
export const dynamic = 'force-dynamic';

export default async function EdicionLayout({ children, params }: LayoutProps) {
    const resolvedParams = await params;
    const edicionId = parseInt(resolvedParams.id);
    const idCategoria = resolvedParams.id_categoria ? parseInt(resolvedParams.id_categoria) : undefined;

    // La edición es opcional para el layout - si falla SSR, el cliente la obtendrá
    // NO lanzar error - permitir degradación elegante
    let edicion = null;
    try {
        const ediciones = await edicionesService.obtenerTodasLasEdiciones();
        edicion = ediciones.find(e => e.id_edicion === edicionId) || null;
    } catch (error) {
        // NO lanzar el error - en producción esto causa el error genérico
        // En su lugar, permitir que el cliente maneje el fetching
        console.warn('SSR falló para edición, el cliente hará el fetch:', error);
        // Continuar con edicion = null
    }

    // La categoría es opcional (solo si existe id_categoria en params)
    // NOTA: El parámetro id_categoria en la ruta es en realidad id_categoria_edicion
    // Si falla el fetch, simplemente no la pasamos (el cliente puede manejarlo)
    let categoria = null;
    if (idCategoria) {
        try {
            const categorias = await categoriasService.obtenerCategoriasPorEdicion(edicionId);
            // Buscar por id_categoria_edicion ya que el parámetro de ruta es id_categoria_edicion
            categoria = categorias.find(cat => cat.id_categoria_edicion === idCategoria) || null;
            
            // Si no se encuentra por id_categoria_edicion, intentar por id_categoria (fallback)
            if (!categoria) {
                categoria = categorias.find(cat => cat.categoria.id_categoria === idCategoria) || null;
            }
        } catch (error) {
            // Categoría es opcional, no es crítico si falla
            // El cliente puede manejar la ausencia de categoría
            console.warn('No se pudo obtener categoría en servidor (opcional):', error);
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
