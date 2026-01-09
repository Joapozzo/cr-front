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

export default async function EdicionLayout({ children, params }: LayoutProps) {
    const resolvedParams = await params;
    const edicionId = parseInt(resolvedParams.id);
    const idCategoria = resolvedParams.id_categoria ? parseInt(resolvedParams.id_categoria) : undefined;

    // La edición es obligatoria para el layout (dato estructural)
    // Si no existe, debemos mostrar 404 en lugar de renderizar con datos faltantes
    let edicion;
    try {
        const ediciones = await edicionesService.obtenerTodasLasEdiciones();
        edicion = ediciones.find(e => e.id_edicion === edicionId);
        
        // Si la edición no existe, usar notFound() para mostrar página 404
        if (!edicion) {
            notFound();
        }
    } catch (error) {
        // Solo capturamos errores de red/fetch inesperados
        // Errores críticos deben propagarse para que Next.js los maneje correctamente
        console.error('Error al obtener edición en servidor:', error);
        // Re-lanzar el error para que Next.js lo maneje con error boundaries
        throw error;
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
