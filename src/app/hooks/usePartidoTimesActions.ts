import toast from 'react-hot-toast';
import usePartidoStore from '@/app/stores/partidoStore';
import {
    useComenzarPartido,
    useTerminarPrimerTiempo,
    useComenzarSegundoTiempo,
    useTerminarPartido,
    useFinalizarPartido,
    useSuspenderPartido
} from '@/app/hooks/usePartidoTimes';

export const usePartidoTimesActions = (idPartido: number) => {
    const { setEstadoPartido, setHoraInicio, setHoraInicioSegundoTiempo, observaciones, estadoPartido } = usePartidoStore();
    
    const { mutateAsync: comenzarPartido, isPending: isComenzando } = useComenzarPartido();
    const { mutateAsync: terminarPrimerTiempo, isPending: isTerminandoPT } = useTerminarPrimerTiempo();
    const { mutateAsync: comenzarSegundoTiempo, isPending: isComenzandoST } = useComenzarSegundoTiempo();
    const { mutateAsync: terminarPartido, isPending: isTerminando } = useTerminarPartido();
    const { mutateAsync: finalizarPartido, isPending: isFinalizando } = useFinalizarPartido();
    const { mutateAsync: suspenderPartido, isPending: isSuspendiendo } = useSuspenderPartido();

    const handleEmpezarPartido = async () => {
        // ACTUALIZACIÓN OPTIMISTA: Actualizar estado ANTES de la llamada
        const estadoAnterior = estadoPartido;
        setEstadoPartido('C1');
        
        try {
            const response = await comenzarPartido(idPartido) as { hora_inicio?: string };
            if (response.hora_inicio) {
                setHoraInicio(new Date(response.hora_inicio));
            }
            // El estado ya está actualizado, solo confirmamos
            toast.success('Primer tiempo comenzado correctamente');
        } catch (error: any) {
            // REVERTIR en caso de error
            setEstadoPartido(estadoAnterior);
            const errorMessage = error?.response?.data?.error || error?.message || 'Error al empezar el partido';
            toast.error(errorMessage);
            throw error; // Re-lanzar para que React Query maneje el error
        }
    };

    const handleTerminarPrimerTiempo = async () => {
        // ACTUALIZACIÓN OPTIMISTA: Actualizar estado ANTES de la llamada
        const estadoAnterior = estadoPartido;
        setEstadoPartido('E');
        
        try {
            await terminarPrimerTiempo(idPartido);
            toast.success('Primer tiempo terminado correctamente');
        } catch (error: any) {
            // REVERTIR en caso de error
            setEstadoPartido(estadoAnterior);
            const errorMessage = error?.response?.data?.error || error?.message || 'Error al terminar primer tiempo';
            toast.error(errorMessage);
            throw error;
        }
    };

    const handleComenzarSegundoTiempo = async () => {
        // ACTUALIZACIÓN OPTIMISTA: Actualizar estado ANTES de la llamada
        const estadoAnterior = estadoPartido;
        setEstadoPartido('C2');
        
        try {
            const response = await comenzarSegundoTiempo(idPartido) as { hora_inicio_segundo_tiempo?: string };
            if (response.hora_inicio_segundo_tiempo) {
                setHoraInicioSegundoTiempo(new Date(response.hora_inicio_segundo_tiempo));
            }
            toast.success('Segundo tiempo comenzado correctamente');
        } catch (error: any) {
            // REVERTIR en caso de error
            setEstadoPartido(estadoAnterior);
            const errorMessage = error?.response?.data?.error || error?.message || 'Error al comenzar segundo tiempo';
            toast.error(errorMessage);
            throw error;
        }
    };

    const handleTerminarPartido = async () => {
        // ACTUALIZACIÓN OPTIMISTA: Actualizar estado ANTES de la llamada
        const estadoAnterior = estadoPartido;
        setEstadoPartido('T');
        
        try {
            // Siempre enviar observaciones, incluso si están vacías
            await terminarPartido({ idPartido, observaciones: observaciones || '' });
            toast.success('Partido terminado correctamente');
        } catch (error: any) {
            // REVERTIR en caso de error
            setEstadoPartido(estadoAnterior);
            const errorMessage = error?.response?.data?.error || error?.message || 'Error al terminar partido';
            toast.error(errorMessage);
            throw error;
        }
    };

    const handleFinalizarPartido = async () => {
        // ACTUALIZACIÓN OPTIMISTA: Actualizar estado ANTES de la llamada
        const estadoAnterior = estadoPartido;
        setEstadoPartido('F');
        
        try {
            await finalizarPartido(idPartido);
            toast.success('Partido finalizado correctamente');
        } catch (error: any) {
            // REVERTIR en caso de error
            setEstadoPartido(estadoAnterior);
            const errorMessage = error?.response?.data?.error || error?.message || 'Error al finalizar partido';
            toast.error(errorMessage);
            throw error;
        }
    };

    const handleSuspenderPartido = async () => {
        // ACTUALIZACIÓN OPTIMISTA: Actualizar estado ANTES de la llamada
        const estadoAnterior = estadoPartido;
        setEstadoPartido('S');
        
        try {
            await suspenderPartido({ idPartido });
            toast.success('Partido suspendido correctamente');
        } catch (error: any) {
            // REVERTIR en caso de error
            setEstadoPartido(estadoAnterior);
            const errorMessage = error?.response?.data?.error || error?.message || 'Error al suspender partido';
            toast.error(errorMessage);
            throw error;
        }
    };

    const isLoadingAny = isComenzando || isTerminandoPT || isComenzandoST || isTerminando || isFinalizando || isSuspendiendo;

    // Determinar qué acción está en proceso
    const actionInProgress = isComenzando ? 'empezarPartido' :
                             isTerminandoPT ? 'terminarPrimerTiempo' :
                             isComenzandoST ? 'empezarSegundoTiempo' :
                             isTerminando ? 'terminarPartido' :
                             isFinalizando ? 'finalizarPartido' :
                             isSuspendiendo ? 'suspenderPartido' :
                             null;

    return {
        handlers: {
            handleEmpezarPartido,
            handleTerminarPrimerTiempo,
            handleComenzarSegundoTiempo,
            handleTerminarPartido,
            handleFinalizarPartido,
            handleSuspenderPartido
        },
        isLoading: isLoadingAny,
        actionInProgress: actionInProgress as 'empezarPartido' | 'terminarPrimerTiempo' | 'empezarSegundoTiempo' | 'terminarPartido' | 'finalizarPartido' | 'suspenderPartido' | null
    };
};