import { useState, useEffect } from 'react';
import usePartidoStore from '../stores/partidoStore';

interface CronometroData {
    tiempoFormateado: string;
    tiempoAdicional: number;
    fase: 'PT' | 'HT' | 'ST' | 'ET';
    shouldShowAdicional: boolean;
    minuto: number; // Minuto actual del partido
}

export const useCronometroPartido = () => {
    const {
        estadoPartido,
        minutosPorTiempo,
        getTiempoTranscurridoPrimerTiempo,
        getTiempoTranscurridoSegundoTiempo,
        restaurarEstado
    } = usePartidoStore();

    const [cronometro, setCronometro] = useState<CronometroData>({
        tiempoFormateado: '00:00',
        tiempoAdicional: 0,
        fase: 'PT',
        shouldShowAdicional: false,
        minuto: 0
    });

    // Formatear tiempo en MM:SS
    const formatearTiempo = (totalSegundos: number): string => {
        const minutos = Math.floor(totalSegundos / 60);
        const segundos = totalSegundos % 60;
        return `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
    };

    // Restaurar estado al montar el componente
    useEffect(() => {
        restaurarEstado();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        // Cambiar esta función para que calcule segundos correctamente
        const actualizarCronometro = () => {
            let minutosTranscurridos = 0;
            let fase: 'PT' | 'HT' | 'ST' | 'ET' = 'PT';

            // Determinar qué tiempo mostrar según el estado
            switch (estadoPartido) {
                case 'C1':
                    minutosTranscurridos = getTiempoTranscurridoPrimerTiempo();
                    fase = 'PT';
                    break;
                case 'E':
                    minutosTranscurridos = getTiempoTranscurridoPrimerTiempo();
                    fase = 'HT';
                    break;
                case 'C2':
                    minutosTranscurridos = getTiempoTranscurridoSegundoTiempo();
                    fase = 'ST';
                    break;
                case 'T':
                    // Tiempo extra: usar el tiempo transcurrido del segundo tiempo
                    minutosTranscurridos = getTiempoTranscurridoSegundoTiempo();
                    fase = 'ET';
                    break;
                case 'F':
                    minutosTranscurridos = getTiempoTranscurridoSegundoTiempo();
                    fase = 'ST';
                    break;
                default:
                    minutosTranscurridos = 0;
                    fase = 'PT';
            }

            // CAMBIO: Calcular segundos totales correctamente
            const segundosTranscurridos = Math.floor(minutosTranscurridos * 60);
            const segundosPermitidos = minutosPorTiempo * 60;

            const minutoActual = Math.floor(minutosTranscurridos);
            
            if (segundosTranscurridos <= segundosPermitidos) {
                setCronometro({
                    tiempoFormateado: formatearTiempo(segundosTranscurridos),
                    tiempoAdicional: 0,
                    fase: fase,
                    shouldShowAdicional: false,
                    minuto: minutoActual
                });
            } else {
                const minutosAdicionales = Math.floor((segundosTranscurridos - segundosPermitidos) / 60);
                setCronometro({
                    tiempoFormateado: formatearTiempo(segundosPermitidos),
                    tiempoAdicional: minutosAdicionales,
                    fase: fase,
                    shouldShowAdicional: true,
                    minuto: minutosPorTiempo + minutosAdicionales
                });
            }
        };

        // Actualizar inmediatamente
        actualizarCronometro();

        // Solo crear intervalo si el partido está corriendo (incluyendo tiempo extra)
        if (estadoPartido === 'C1' || estadoPartido === 'C2' || estadoPartido === 'T') {
            interval = setInterval(actualizarCronometro, 1000);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [
        estadoPartido,
        minutosPorTiempo,
        getTiempoTranscurridoPrimerTiempo,
        getTiempoTranscurridoSegundoTiempo
    ]);

    return cronometro;
};