import { useMemo, useState, useEffect } from 'react';
import { useTablasPosicionesPorEquipos } from './useTablasPosiciones';
import { useAuthStore } from '../stores/authStore';
import { ITablaPosicion } from '../components/home/TablaPosicionesHome';

interface UseTablasPosicionesHomeProps {
    tablas?: ITablaPosicion[];
    loading?: boolean;
    limitPosiciones?: number;
}

interface UseTablasPosicionesHomeReturn {
    tablas: ITablaPosicion[];
    loading: boolean;
    error: Error | null;
    currentTablaIndex: number;
    slideDirection: 'left' | 'right';
    handleTablaChange: (newIndex: number) => void;
}

/**
 * Hook que maneja toda la lógica del componente TablaPosicionesHome
 * - Obtiene tablas de posiciones de los equipos del usuario
 * - Maneja el estado de tabs y animaciones
 * - Procesa y formatea los datos
 */
export const useTablasPosicionesHome = ({
    tablas: tablasProp,
    loading: loadingProp,
    limitPosiciones = 6, // Por defecto 6 posiciones para el home
}: UseTablasPosicionesHomeProps): UseTablasPosicionesHomeReturn => {
    // Obtener equipos del store
    const equipos = useAuthStore((state) => state.equipos);

    // Extraer IDs de equipos
    const equiposIds = useMemo(() => {
        if (equipos && equipos.length > 0) {
            return equipos.map((e) => e.id);
        }
        return [];
    }, [equipos]);

    // Hook para obtener tablas de posiciones
    // Si tiene equipos: muestra tablas de sus equipos
    // Si no tiene equipos: muestra algunas tablas generales (limitTablas=1 para mostrar al menos una)
    const {
        data: tablasData,
        isLoading: isLoadingTablas,
        error: errorTablas,
    } = useTablasPosicionesPorEquipos(
        limitPosiciones, // 6 posiciones para el home
        equiposIds.length > 0 ? undefined : 1, // Si no tiene equipos, mostrar solo 1 tabla general
        undefined, // Sin paginación
        equiposIds.length > 0 ? equiposIds : undefined, // Si no tiene equipos, no filtrar por equipos (mostrar generales)
        {
            enabled: !tablasProp, // Hacer fetch siempre (excepto si se pasan tablas como prop)
        }
    );

    // Procesar tablas: usar prop o datos del hook
    const tablas = useMemo(() => {
        if (tablasProp) return tablasProp;

        if (!tablasData || !tablasData.tablas) return [];

        // Mapear los datos del backend al formato esperado por el componente
        return tablasData.tablas.map((tabla) => ({
            id_equipo: tabla.id_equipo,
            nombre_equipo: tabla.nombre_equipo,
            categoria_edicion: tabla.categoria_edicion,
            posiciones: tabla.posiciones,
            formatosPosicion: tabla.formatosPosicion,
        }));
    }, [tablasProp, tablasData]);

    // Estado de loading: usar prop o estado del hook
    const loading = loadingProp ?? isLoadingTablas;

    // Estado del tab activo y dirección de slide
    const [currentTablaIndex, setCurrentTablaIndex] = useState(0);
    const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');

    // Resetear índice cuando cambien las tablas
    useEffect(() => {
        if (tablas.length > 0 && currentTablaIndex >= tablas.length) {
            setCurrentTablaIndex(0);
        }
    }, [tablas, currentTablaIndex]);

    // Manejar cambio de tabla con dirección de animación
    const handleTablaChange = (newIndex: number) => {
        if (newIndex < 0 || newIndex >= tablas.length || newIndex === currentTablaIndex) return;

        // Determinar dirección del slide
        setSlideDirection(newIndex > currentTablaIndex ? 'left' : 'right');
        setCurrentTablaIndex(newIndex);
    };

    return {
        tablas,
        loading,
        error: errorTablas,
        currentTablaIndex,
        slideDirection,
        handleTablaChange,
    };
};

