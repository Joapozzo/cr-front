import { useState, useEffect } from 'react';
import usePartidoStore from '../stores/partidoStore';

interface CronometroSimple {
    tiempoFormateado: string;
    fase: 'PT' | 'HT' | 'ST';
    enVivo: boolean;
}

export const useCronometroSimple = (partidoId: number, estadoPartido: string) => {
    const {
        getTiempoTranscurridoPrimerTiempo,
        getTiempoTranscurridoSegundoTiempo,
        minutosPorTiempo,
        estadoPartido: estadoStorePartido
    } = usePartidoStore();

    const [cronometro, setCronometro] = useState<CronometroSimple>({
        tiempoFormateado: '00:00',
        fase: 'PT',
        enVivo: false
    });

    // Solo mostrar cronómetro si es el partido activo en el store
    const esPartidoActivo = true; // Aquí podrías comparar con un partidoId en el store

    const formatearTiempo = (totalSegundos: number): string => {
        const minutos = Math.floor(totalSegundos / 60);
        const segundos = totalSegundos % 60;
        return `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        // Debug: ver qué valores estamos recibiendo
        ('Estado partido:', estadoPartido);
        ('Es partido activo:', esPartidoActivo);
        ('Minutos por tiempo:', minutosPorTiempo);

        if (!esPartidoActivo || !['C1', 'E', 'C2'].includes(estadoPartido)) {
            setCronometro(prev => ({ ...prev, enVivo: false }));
            return;
        }

        let interval: NodeJS.Timeout;

        const actualizarCronometro = () => {
            let minutosTranscurridos = 0;
            let fase: 'PT' | 'HT' | 'ST' = 'PT';

            switch (estadoPartido) {
                case 'C1':
                    minutosTranscurridos = getTiempoTranscurridoPrimerTiempo();
                    fase = 'PT';
                    ('C1 - Minutos PT:', minutosTranscurridos);
                    break;
                case 'E':
                    // Durante el entretiempo, mantener el tiempo del primer tiempo
                    minutosTranscurridos = minutosPorTiempo || 45; // Usar valor por defecto
                    fase = 'HT';
                    ('E - Entretiempo, mostrando:', minutosTranscurridos);
                    break;
                case 'C2':
                    minutosTranscurridos = getTiempoTranscurridoSegundoTiempo();
                    fase = 'ST';
                    ('C2 - Minutos ST:', minutosTranscurridos);
                    break;
            }

            // Validar que tenemos valores válidos
            if (typeof minutosTranscurridos !== 'number' || isNaN(minutosTranscurridos)) {
                console.warn('Minutos transcurridos no es un número válido:', minutosTranscurridos);
                minutosTranscurridos = 0;
            }

            if (typeof minutosPorTiempo !== 'number' || isNaN(minutosPorTiempo) || minutosPorTiempo <= 0) {
                console.warn('MinutosPorTiempo no es válido:', minutosPorTiempo, 'usando 45 por defecto');
                // Usar 45 minutos por defecto si no hay valor válido
                const minutosDefault = 45;
                const segundosTranscurridos = Math.floor(minutosTranscurridos * 60);
                const segundosPermitidos = minutosDefault * 60;
                
                setCronometro({
                    tiempoFormateado: formatearTiempo(Math.min(segundosTranscurridos, segundosPermitidos)),
                    fase,
                    enVivo: true
                });
                return;
            }

            const segundosTranscurridos = Math.floor(minutosTranscurridos * 60);
            const segundosPermitidos = minutosPorTiempo * 60;

            ('Segundos transcurridos:', segundosTranscurridos);
            ('Segundos permitidos:', segundosPermitidos);

            setCronometro({
                tiempoFormateado: formatearTiempo(Math.min(segundosTranscurridos, segundosPermitidos)),
                fase,
                enVivo: true
            });
        };

        actualizarCronometro();
        interval = setInterval(actualizarCronometro, 1000);

        return () => clearInterval(interval);
    }, [
        estadoPartido, 
        esPartidoActivo, 
        getTiempoTranscurridoPrimerTiempo, 
        getTiempoTranscurridoSegundoTiempo, 
        minutosPorTiempo
    ]);

    return cronometro;
};