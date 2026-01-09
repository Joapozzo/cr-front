import { useState, useMemo, useEffect } from 'react';

interface UseJornadaNavigationProps {
    totalJornadas: number;
    initialJornada?: number;
}

interface UseJornadaNavigationReturn {
    jornadaActual: number;
    totalJornadas: number;
    jornadasDisponibles: number[];
    indexActual: number;
    cambiarJornada: (direccion: 'anterior' | 'siguiente') => void;
    setJornadaActual: (jornada: number) => void;
}

/**
 * Hook para manejar la navegación entre jornadas
 */
export const useJornadaNavigation = ({
    totalJornadas,
    initialJornada = 1,
}: UseJornadaNavigationProps): UseJornadaNavigationReturn => {
    const [jornadaActual, setJornadaActual] = useState(initialJornada);

    const jornadasDisponibles = useMemo(
        () => Array.from({ length: totalJornadas }, (_, i) => i + 1),
        [totalJornadas]
    );

    // Asegurar que jornadaActual esté dentro del rango válido cuando cambia totalJornadas
    useEffect(() => {
        if (jornadaActual > totalJornadas && totalJornadas > 0) {
            setJornadaActual(1);
        }
    }, [totalJornadas, jornadaActual]);

    const indexActual = useMemo(
        () => jornadasDisponibles.indexOf(jornadaActual),
        [jornadasDisponibles, jornadaActual]
    );

    const cambiarJornada = (direccion: 'anterior' | 'siguiente') => {
        if (direccion === 'anterior' && indexActual > 0) {
            setJornadaActual(jornadasDisponibles[indexActual - 1]);
        } else if (direccion === 'siguiente' && indexActual < jornadasDisponibles.length - 1) {
            setJornadaActual(jornadasDisponibles[indexActual + 1]);
        }
    };

    return {
        jornadaActual,
        totalJornadas,
        jornadasDisponibles,
        indexActual,
        cambiarJornada,
        setJornadaActual,
    };
};

