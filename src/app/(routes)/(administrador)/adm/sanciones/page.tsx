import { fetchCategoriasActivas, fetchSancionesPorCategoria } from './lib/server-fetch';
import SancionesClient from './SancionesClient';

// Forzar renderizado dinámico porque usa cookies y no-store fetch
export const dynamic = 'force-dynamic';

export default async function SancionesPage() {
    // Fetch initial data on the server
    const categorias = await fetchCategoriasActivas();
    const primeraCategoriaId = categorias && categorias.length > 0 ? categorias[0].id_categoria_edicion : null;
    
    // Fetch sanciones for the first category if available
    const sancionesResponse = primeraCategoriaId 
        ? await fetchSancionesPorCategoria(primeraCategoriaId)
        : null;
    
    const sanciones = sancionesResponse?.data || null;

    return (
        <SancionesClient
            initialCategorias={categorias || undefined}
            initialCategoriaId={primeraCategoriaId}
            initialSanciones={sanciones || undefined}
        />
    );
}
