import { useMemo, useState, useRef } from 'react';
import { useNoticiasPublicadas } from './useNoticias';
import { Noticia } from '../types/noticia';

interface UseNoticiasHomeProps {
    noticias?: Noticia[];
    loading?: boolean; // Mantener por compatibilidad pero no se usa
    limit?: number;
}

interface UseNoticiasHomeReturn {
    noticias: Noticia[] | undefined; // undefined cuando está cargando, [] cuando no hay datos, array con datos cuando hay datos
    error: Error | null;
    activeDot: number;
    scrollContainerRef: React.RefObject<HTMLDivElement | null>;
    noticiasRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
    handleScroll: () => void;
    scrollToPage: (pageIndex: number) => void;
    totalPaginas: number;
}

/**
 * Hook que maneja toda la lógica del componente NoticiasHome
 * - Obtiene noticias publicadas
 * - Maneja scroll y paginación visual
 */
export const useNoticiasHome = ({
    noticias: noticiasProp,
    loading: loadingProp,
    limit = 5, // Por defecto 5 noticias para el home
}: UseNoticiasHomeProps): UseNoticiasHomeReturn => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const noticiasRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [activeDot, setActiveDot] = useState(0);

    // Hook para obtener noticias publicadas (solo si no se pasan como prop)
    const {
        data: noticiasData,
        isLoading: isLoadingNoticias,
        isFetching: isFetchingNoticias,
        error: errorNoticias,
    } = useNoticiasPublicadas(
        undefined, // Sin límite (traer todas y paginar en el frontend)
        undefined, // Sin paginación del backend
        undefined, // Sin búsqueda
        undefined, // Sin filtro de destacadas
        undefined, // Sin filtro de tipo
        undefined, // Sin filtro de categoría
        {
            enabled: !noticiasProp, // Solo hacer fetch si no se pasan noticias como prop
        }
    );

    // Procesar noticias: usar prop o datos del hook
    // Si está cargando (noticiasData es undefined), retornar undefined para que el componente retorne el fallback
    // Si hay datos vacíos, retornar array vacío para que el componente muestre "no hay noticias"
    const noticias = useMemo(() => {
        if (noticiasProp) return noticiasProp;
        
        // Si aún no hay datos (está cargando), retornar undefined
        if (!noticiasData) return undefined;
        
        // Si hay datos pero el array está vacío, retornar array vacío
        if (!noticiasData.noticias || noticiasData.noticias.length === 0) return [];
        
        return noticiasData.noticias;
    }, [noticiasProp, noticiasData]);

    // Calcular paginación visual (2 noticias por página)
    const noticiasPorPagina = 2;
    const totalPaginas = noticias ? Math.ceil(noticias.length / noticiasPorPagina) : 0;

    // Detectar scroll para actualizar dot activo
    const handleScroll = () => {
        if (!scrollContainerRef.current) return;
        
        const container = scrollContainerRef.current;
        const scrollLeft = container.scrollLeft;
        
        // Calcular qué página estamos viendo basándonos en el scroll
        const cardWidth = window.innerWidth >= 640 ? 380 : 250;
        const gap = 16;
        const pageWidth = (cardWidth * 2) + gap;
        const currentPage = Math.round(scrollLeft / pageWidth);
        
        setActiveDot(Math.min(currentPage, totalPaginas - 1));
    };

    // Navegar a una página específica (al clickear un dot)
    const scrollToPage = (pageIndex: number) => {
        if (!scrollContainerRef.current || !noticias) return;
        
        const firstNoticiaIndex = pageIndex * noticiasPorPagina;
        const noticiaElement = noticiasRefs.current[firstNoticiaIndex];
        
        if (noticiaElement) {
            noticiaElement.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'start'
            });
        }
    };

    return {
        noticias,
        error: errorNoticias,
        activeDot,
        scrollContainerRef,
        noticiasRefs,
        handleScroll,
        scrollToPage,
        totalPaginas,
    };
};

