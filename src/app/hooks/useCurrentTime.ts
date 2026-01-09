import { useState, useEffect } from 'react';

/**
 * Hook personalizado que actualiza el tiempo actual cada minuto.
 * Útil para recalcular valores basados en el tiempo transcurrido.
 * 
 * @param interval - Intervalo en milisegundos para actualizar el tiempo (default: 60000 = 1 minuto)
 * @returns El timestamp actual que se actualiza cada intervalo especificado
 */
export const useCurrentTime = (interval: number = 60000): number => {
    const [currentTime, setCurrentTime] = useState(Date.now());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(Date.now());
        }, interval);

        return () => clearInterval(timer);
    }, [interval]);

    return currentTime;
};

