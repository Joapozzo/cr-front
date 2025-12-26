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
    const { setEstadoPartido, setHoraInicio, setHoraInicioSegundoTiempo, observaciones } = usePartidoStore();
    
    const { mutateAsync: comenzarPartido, isPending: isComenzando } = useComenzarPartido();
    const { mutateAsync: terminarPrimerTiempo, isPending: isTerminandoPT } = useTerminarPrimerTiempo();
    const { mutateAsync: comenzarSegundoTiempo, isPending: isComenzandoST } = useComenzarSegundoTiempo();
    const { mutateAsync: terminarPartido, isPending: isTerminando } = useTerminarPartido();
    const { mutateAsync: finalizarPartido, isPending: isFinalizando } = useFinalizarPartido();
    const { mutateAsync: suspenderPartido, isPending: isSuspendiendo } = useSuspenderPartido();

    const handleEmpezarPartido = async () => {
        try {
            const response = await comenzarPartido(idPartido);
            if (response.hora_inicio) {
                setHoraInicio(new Date(response.hora_inicio));
            }
            setEstadoPartido('C1');
            toast.success('Primer tiempo comenzado correctamente');
        } catch (error: any) {
            const errorMessage = error?.response?.data?.error || error?.message || 'Error al empezar el partido';
            toast.error(errorMessage);
        }
    };

    const handleTerminarPrimerTiempo = async () => {
        try {
            await terminarPrimerTiempo(idPartido);
            toast.success('Primer tiempo terminado correctamente');
        } catch (error: any) {
            const errorMessage = error?.response?.data?.error || error?.message || 'Error al terminar primer tiempo';
            toast.error(errorMessage);
        }
    };

    const handleComenzarSegundoTiempo = async () => {
        try {
            const response = await comenzarSegundoTiempo(idPartido);
            if (response.hora_inicio_segundo_tiempo) {
                setHoraInicioSegundoTiempo(new Date(response.hora_inicio_segundo_tiempo));
            }
            toast.success('Segundo tiempo comenzado correctamente');
        } catch (error: any) {
            const errorMessage = error?.response?.data?.error || error?.message || 'Error al comenzar segundo tiempo';
            toast.error(errorMessage);
        }
    };

    const handleTerminarPartido = async () => {
        try {
            // Siempre enviar observaciones, incluso si están vacías
            await terminarPartido({ idPartido, observaciones: observaciones || '' });
            toast.success('Partido terminado correctamente');
        } catch (error: any) {
            const errorMessage = error?.response?.data?.error || error?.message || 'Error al terminar partido';
            toast.error(errorMessage);
        }
    };

    const handleFinalizarPartido = async () => {
        try {
            await finalizarPartido(idPartido);
            toast.success('Partido finalizado correctamente');
        } catch (error: any) {
            const errorMessage = error?.response?.data?.error || error?.message || 'Error al finalizar partido';
            toast.error(errorMessage);
        }
    };

    const handleSuspenderPartido = async () => {
        try {
            await suspenderPartido({ idPartido });
            toast.success('Partido suspendido correctamente');
        } catch (error: any) {
            const errorMessage = error?.response?.data?.error || error?.message || 'Error al suspender partido';
            toast.error(errorMessage);
        }
    };

    const isLoadingAny = isComenzando || isTerminandoPT || isComenzandoST || isTerminando || isFinalizando || isSuspendiendo;

    return {
        handlers: {
            handleEmpezarPartido,
            handleTerminarPrimerTiempo,
            handleComenzarSegundoTiempo,
            handleTerminarPartido,
            handleFinalizarPartido,
            handleSuspenderPartido
        },
        isLoading: isLoadingAny
    };
};