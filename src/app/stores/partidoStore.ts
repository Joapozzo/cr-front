import { create } from 'zustand';
import { EstadoPartido } from '../types/partido';

interface PartidoState {
    // Estados existentes
    estadoPartido: EstadoPartido;
    horaInicio: Date | null;
    horaInicioSegundoTiempo: Date | null;
    minutosPorTiempo: number;
    minutosEntretiempo: number;

    // Nuevos campos para persistir tiempo transcurrido
    minutosAcumuladosPT: number;  // Tiempo ya jugado del PT (cuando se pausa)
    minutosAcumuladosST: number;  // Tiempo ya jugado del ST (cuando se pausa)

    // Observaciones del partido (solo local, se guarda al finalizar)
    observaciones: string;

    // Setters existentes
    setEstadoPartido: (estado: EstadoPartido) => void;
    setHoraInicio: (hora: Date) => void;
    setHoraInicioSegundoTiempo: (hora: Date) => void;
    setMinutosPorTiempo: (minutos: number) => void;
    setMinutosEntretiempo: (minutos: number) => void;
    setObservaciones: (observaciones: string, idPartido?: number) => void;

    // Getters/computed existentes - ahora mejorados
    getTiempoTranscurridoPrimerTiempo: () => number;
    getTiempoRestantePrimerTiempo: () => number;
    getTiempoTranscurridoSegundoTiempo: () => number;
    getTiempoRestanteSegundoTiempo: () => number;
    getEstadoPartido: () => EstadoPartido;

    // Nuevas funciones internas
    pausarTiempoPT: () => void;
    pausarTiempoST: () => void;

    // Funciones de persistencia
    persistirEstado: () => void;
    persistirObservaciones: (idPartido?: number) => void;
    restaurarEstado: () => void;
    limpiarEstadoPersistido: (idPartido?: number) => void;

    // Reset existente
    resetPartido: () => void;
}

const usePartidoStore = create<PartidoState>((set, get) => ({
    // Estados iniciales
    estadoPartido: 'P',
    horaInicio: null,
    horaInicioSegundoTiempo: null,
    minutosPorTiempo: 25,
    minutosEntretiempo: 5,
    minutosAcumuladosPT: 0,
    minutosAcumuladosST: 0,
    observaciones: '',

    // Setters con persistencia
    setHoraInicio: (hora: Date) => {
        set({ horaInicio: hora });
        get().persistirEstado();
    },

    setHoraInicioSegundoTiempo: (hora: Date) => {
        set({ horaInicioSegundoTiempo: hora });
        get().persistirEstado();
    },

    setMinutosPorTiempo: (minutos: number) => {
        set({ minutosPorTiempo: minutos });
        get().persistirEstado();
    },

    setMinutosEntretiempo: (minutos: number) => {
        set({ minutosEntretiempo: minutos });
        get().persistirEstado();
    },

    setObservaciones: (observaciones: string, idPartido?: number) => {
        set({ observaciones });
        get().persistirObservaciones(idPartido);
    },

    setEstadoPartido: (estado: EstadoPartido) => {
        const estadoActual = get().estadoPartido;

        // Si cambia de C1 a otro estado, pausar y guardar tiempo PT
        if (estadoActual === 'C1' && estado !== 'C1') {
            get().pausarTiempoPT();
        }

        // Si cambia de C2 a otro estado, pausar y guardar tiempo ST
        if (estadoActual === 'C2' && estado !== 'C2') {
            get().pausarTiempoST();
        }

        // Si reanuda C1 desde otro estado, actualizar hora inicio para que empiece desde ahora
        if (estadoActual !== 'C1' && estado === 'C1') {
            set({ horaInicio: new Date() });
        }

        // Si reanuda C2 desde otro estado, actualizar hora inicio ST para que empiece desde ahora
        if (estadoActual !== 'C2' && estado === 'C2') {
            set({ horaInicioSegundoTiempo: new Date() });
        }

        set({ estadoPartido: estado });
        get().persistirEstado();
    },

    // Función para pausar y acumular tiempo del PT
    pausarTiempoPT: () => {
        const { horaInicio, minutosAcumuladosPT } = get();
        if (horaInicio) {
            const ahora = new Date();
            const diferencia = ahora.getTime() - horaInicio.getTime();
            const minutosTranscurridos = Math.floor(diferencia / (1000 * 60));
            set({
                minutosAcumuladosPT: minutosAcumuladosPT + minutosTranscurridos
                // NO resetear horaInicio - la necesitamos para mostrar el tiempo
            });
        }
    },

    // Función para pausar y acumular tiempo del ST
    pausarTiempoST: () => {
        const { horaInicioSegundoTiempo, minutosAcumuladosST } = get();
        if (horaInicioSegundoTiempo) {
            const ahora = new Date();
            const diferencia = ahora.getTime() - horaInicioSegundoTiempo.getTime();
            const minutosTranscurridos = Math.floor(diferencia / (1000 * 60));
            set({
                minutosAcumuladosST: minutosAcumuladosST + minutosTranscurridos
                // NO resetear horaInicioSegundoTiempo - la necesitamos para mostrar el tiempo
            });
        }
    },

    getTiempoTranscurridoPrimerTiempo: () => {
        const { horaInicio, minutosAcumuladosPT } = get();

        if (!horaInicio) {
            return minutosAcumuladosPT;
        }

        const ahora = new Date();
        const diferencia = ahora.getTime() - horaInicio.getTime();
        // CAMBIO: Devolver minutos con decimales (segundos)
        const minutosActuales = diferencia / (1000 * 60);

        return minutosAcumuladosPT + minutosActuales;
    },

    getTiempoRestantePrimerTiempo: () => {
        const { minutosPorTiempo, getTiempoTranscurridoPrimerTiempo } = get();
        const transcurrido = getTiempoTranscurridoPrimerTiempo();
        const restante = minutosPorTiempo - transcurrido;
        return Math.max(0, restante);
    },

    getTiempoTranscurridoSegundoTiempo: () => {
        const { horaInicioSegundoTiempo, minutosAcumuladosST } = get();

        if (!horaInicioSegundoTiempo) {
            return minutosAcumuladosST;
        }

        const ahora = new Date();
        const diferencia = ahora.getTime() - horaInicioSegundoTiempo.getTime();
        // CAMBIO: Devolver minutos con decimales (segundos)
        const minutosActuales = diferencia / (1000 * 60);

        return minutosAcumuladosST + minutosActuales;
    },

    getTiempoRestanteSegundoTiempo: () => {
        const { minutosPorTiempo, getTiempoTranscurridoSegundoTiempo } = get();
        const transcurrido = getTiempoTranscurridoSegundoTiempo();
        const restante = minutosPorTiempo - transcurrido;
        return Math.max(0, restante);
    },

    getEstadoPartido: () => get().estadoPartido,

    // Funciones de persistencia
    persistirEstado: () => {
        const estado = get();
        const estadoParaGuardar = {
            estadoPartido: estado.estadoPartido,
            horaInicio: estado.horaInicio?.toISOString(),
            horaInicioSegundoTiempo: estado.horaInicioSegundoTiempo?.toISOString(),
            minutosPorTiempo: estado.minutosPorTiempo,
            minutosEntretiempo: estado.minutosEntretiempo,
            minutosAcumuladosPT: estado.minutosAcumuladosPT,
            minutosAcumuladosST: estado.minutosAcumuladosST,
            timestamp: new Date().toISOString()
        };

        try {
            localStorage.setItem('partidoEstado', JSON.stringify(estadoParaGuardar));
        } catch (error) {
            console.warn('No se pudo guardar el estado del partido:', error);
        }
    },

    persistirObservaciones: (idPartido?: number) => {
        const estado = get();
        try {
            if (typeof window !== 'undefined' && idPartido) {
                localStorage.setItem(`partidoObservaciones_${idPartido}`, estado.observaciones);
            }
        } catch (error) {
            console.warn('No se pudo guardar las observaciones:', error);
        }
    },

    restaurarEstado: () => {
        try {
            const estadoGuardado = localStorage.getItem('partidoEstado');
            if (!estadoGuardado) return;

            const estado = JSON.parse(estadoGuardado);

            // Validar que no sea muy viejo (más de 4 horas)
            if (estado.timestamp) {
                const timestampGuardado = new Date(estado.timestamp);
                const ahora = new Date();
                const diferencia = ahora.getTime() - timestampGuardado.getTime();
                const horasTranscurridas = diferencia / (1000 * 60 * 60);

                if (horasTranscurridas > 4) {
                    get().limpiarEstadoPersistido();
                    return;
                }
            }

            // Restaurar observaciones desde localStorage (se restaurará desde el componente con idPartido)
            const observacionesGuardadas = '';

            // Restaurar estado
            set({
                estadoPartido: estado.estadoPartido || 'P',
                horaInicio: estado.horaInicio ? new Date(estado.horaInicio) : null,
                horaInicioSegundoTiempo: estado.horaInicioSegundoTiempo ? new Date(estado.horaInicioSegundoTiempo) : null,
                minutosPorTiempo: estado.minutosPorTiempo || 25,
                minutosEntretiempo: estado.minutosEntretiempo || 5,
                minutosAcumuladosPT: estado.minutosAcumuladosPT || 0,
                minutosAcumuladosST: estado.minutosAcumuladosST || 0,
                observaciones: observacionesGuardadas
            });

        } catch (error) {
            console.warn('Error al restaurar estado del partido:', error);
            get().limpiarEstadoPersistido();
        }
    },

    limpiarEstadoPersistido: (idPartido?: number) => {
        try {
            localStorage.removeItem('partidoEstado');
            if (idPartido && typeof window !== 'undefined') {
                localStorage.removeItem(`partidoObservaciones_${idPartido}`);
            }
        } catch (error) {
            console.warn('No se pudo limpiar el estado persistido:', error);
        }
    },

    // Reset mejorado
    resetPartido: () => {
        set({
            estadoPartido: 'P',
            horaInicio: null,
            horaInicioSegundoTiempo: null,
            minutosPorTiempo: 25,
            minutosEntretiempo: 5,
            minutosAcumuladosPT: 0,
            minutosAcumuladosST: 0,
            observaciones: ''
        });
        get().limpiarEstadoPersistido();
    }
}));

export default usePartidoStore;