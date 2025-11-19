import { useMemo, useState, useEffect } from 'react';
import { useSancionesActivasUsuario, ISancion } from './useSanciones';
import { useAuthStore } from '../stores/authStore';

interface UseSancionesHomeProps {
    sanciones?: ISancion[];
    loading?: boolean;
    limit?: number;
}

interface UseSancionesHomeReturn {
    sanciones: ISancion[];
    sancionesPorPagina: ISancion[];
    loading: boolean;
    error: Error | null;
    currentPage: number;
    totalPaginas: number;
    slideDirection: 'left' | 'right';
    handlePageChange: (newPage: number) => void;
    esMiSancion: (sancion: ISancion) => boolean;
}

/**
 * Hook que maneja toda la lógica del componente SancionesHome
 * - Obtiene sanciones activas
 * - Maneja paginación y animaciones
 * - Identifica si una sanción es del usuario actual
 */
export const useSancionesHome = ({
    sanciones: sancionesProp,
    loading: loadingProp,
    limit = 5, // Por defecto 5 sanciones por página en el home
}: UseSancionesHomeProps): UseSancionesHomeReturn => {
    // Obtener usuario del store para identificar sus sanciones
    const usuario = useAuthStore((state) => state.usuario);
    const uidUsuario = usuario?.uid || null;

    // Hook para obtener sanciones activas (solo si no se pasan como prop)
    const {
        data: sancionesData,
        isLoading: isLoadingSanciones,
        error: errorSanciones,
    } = useSancionesActivasUsuario(
        undefined, // Sin filtro de categoría en el home
        undefined, // Sin límite (traer todas y paginar en el frontend)
        undefined, // Sin paginación del backend
        {
            enabled: !sancionesProp, // Solo hacer fetch si no se pasan sanciones como prop
        }
    );

    // Procesar sanciones: usar prop o datos del hook
    const sanciones = useMemo(() => {
        if (sancionesProp) return sancionesProp;
        if (!sancionesData || !sancionesData.sanciones) return [];
        return sancionesData.sanciones;
    }, [sancionesProp, sancionesData]);

    // Estado de loading: usar prop o estado del hook
    const loading = loadingProp ?? isLoadingSanciones;

    // Estado de paginación
    const [currentPage, setCurrentPage] = useState(0);
    const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');

    // Calcular paginación
    const totalPaginas = Math.ceil(sanciones.length / limit);
    const inicio = currentPage * limit;
    const fin = inicio + limit;
    const sancionesPorPagina = useMemo(
        () => sanciones.slice(inicio, fin),
        [sanciones, inicio, fin]
    );

    // Resetear página cuando cambien las sanciones
    useEffect(() => {
        if (sanciones.length > 0 && currentPage >= totalPaginas) {
            setCurrentPage(0);
        }
    }, [sanciones, currentPage, totalPaginas]);

    // Manejar cambio de página con dirección de animación
    const handlePageChange = (newPage: number) => {
        if (newPage < 0 || newPage >= totalPaginas || newPage === currentPage) return;

        setSlideDirection(newPage > currentPage ? 'left' : 'right');
        setCurrentPage(newPage);
    };

    // Función para identificar si una sanción es del usuario actual
    const esMiSancion = (sancion: ISancion): boolean => {
        return !!uidUsuario && sancion.uid_jugador === uidUsuario;
    };

    return {
        sanciones,
        sancionesPorPagina,
        loading,
        error: errorSanciones,
        currentPage,
        totalPaginas,
        slideDirection,
        handlePageChange,
        esMiSancion,
    };
};

