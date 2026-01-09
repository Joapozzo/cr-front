import { useEffect, useRef } from 'react';
import usePartidoStore from '@/app/stores/partidoStore';
import { EstadoPartido } from '@/app/types/partido';
import { DatosCompletosPlanillero } from '@/app/types/partido';

interface UsePartidoPlanilleroSyncProps {
    datosPartido?: DatosCompletosPlanillero;
    estadoPartido: EstadoPartido;
    isLoadingMutation: boolean;
}

/**
 * Hook para sincronizar el estado del partido desde el backend al store
 * Evita sobrescribir actualizaciones optimistas durante mutaciones
 */
export const usePartidoPlanilleroSync = ({
    datosPartido,
    estadoPartido,
    isLoadingMutation
}: UsePartidoPlanilleroSyncProps) => {
    const {
        setEstadoPartido,
        setHoraInicio,
        setHoraInicioSegundoTiempo,
        setMinutosPorTiempo,
        setMinutosEntretiempo
    } = usePartidoStore();

    // Usar una referencia para rastrear el último estado sincronizado desde el backend
    // Esto previene bucles infinitos al evitar comparar con estadoPartido del store
    const ultimoEstadoBackendRef = useRef<EstadoPartido | null>(null);
    const ultimoPartidoIdRef = useRef<number | null>(null);

    useEffect(() => {
        if (datosPartido?.partido && !isLoadingMutation) {
            const partidoBackend = datosPartido.partido;
            const estadoBackend = partidoBackend.estado as EstadoPartido;
            const partidoId = partidoBackend.id_partido;
            
            // Si es un partido diferente, resetear la referencia
            if (partidoId !== ultimoPartidoIdRef.current) {
                ultimoPartidoIdRef.current = partidoId;
                ultimoEstadoBackendRef.current = null;
            }
            
            // Solo actualizar si el estado del backend es diferente al último que sincronizamos
            // Esto evita que el backend sobrescriba actualizaciones optimistas y previene bucles infinitos
            if (estadoBackend && estadoBackend !== ultimoEstadoBackendRef.current) {
                // Obtener el estado actual del store directamente para comparar
                // Esto previene incluir estadoPartido en las dependencias y evitar bucles infinitos
                const estadoActualStore = usePartidoStore.getState().estadoPartido;
                
                // Solo actualizar el store si el estado del backend es diferente al del store
                // Esto permite que las actualizaciones optimistas tengan prioridad
                // IMPORTANTE: No comparar con estadoPartido de las props para evitar bucles
                if (estadoBackend !== estadoActualStore) {
                    setEstadoPartido(estadoBackend);
                }
                ultimoEstadoBackendRef.current = estadoBackend;
            }
            
            // Actualizar configuraciones de tiempo (estas no deberían cambiar frecuentemente)
            if (partidoBackend.categoriaEdicion?.duracion_tiempo) {
                setMinutosPorTiempo(partidoBackend.categoriaEdicion.duracion_tiempo);
            }
            
            if (partidoBackend.categoriaEdicion?.duracion_entretiempo) {
                setMinutosEntretiempo(partidoBackend.categoriaEdicion.duracion_entretiempo);
            }
            
            if (['C1', 'C2', 'T'].includes(partidoBackend.estado) && partidoBackend.hora_inicio) {
                setHoraInicio(new Date(partidoBackend.hora_inicio));
            }
            
            if (['C2', 'T'].includes(partidoBackend.estado) && partidoBackend.hora_inicio_segundo_tiempo) {
                setHoraInicioSegundoTiempo(new Date(partidoBackend.hora_inicio_segundo_tiempo));
            }
        }
    }, [
        datosPartido, 
        isLoadingMutation,
        setEstadoPartido, 
        setHoraInicio, 
        setHoraInicioSegundoTiempo, 
        setMinutosPorTiempo, 
        setMinutosEntretiempo
    ]);
};

