import { useMemo } from 'react';
import { EstadoPartido, IncidenciaGol, PartidoCompleto } from '@/app/types/partido';
import usePartidoStore from '@/app/stores/partidoStore';

interface CanchaObject {
    nombre: string;
    id_cancha?: number;
    predio?: {
        nombre: string;
    };
}

interface UsePartidoHeaderDataParams {
    partido: PartidoCompleto | undefined | null;
    goles?: IncidenciaGol[];
    esPlanillero?: boolean;
}

export const usePartidoHeaderData = ({
    partido,
    goles = [],
    esPlanillero = false,
}: UsePartidoHeaderDataParams) => {
    // Obtener estado del store para actualización instantánea
    const estadoPartidoStore = usePartidoStore((state) => state.estadoPartido);
    
    // Usar estado del store si es planillero, sino usar el del partido
    const estadoActual = useMemo(() => {
        if (!partido) return 'P' as EstadoPartido;
        return esPlanillero ? estadoPartidoStore : (partido.estado as EstadoPartido);
    }, [esPlanillero, estadoPartidoStore, partido]);

    // Formatear fecha en formato DD/MM/AA
    const fechaFormateada = useMemo(() => {
        if (!partido?.dia) return '';
        const date = new Date(partido.dia);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);
        return `${day}/${month}/${year}`;
    }, [partido?.dia]);

    // Obtener nombre de cancha de forma segura
    const nombreCancha = useMemo(() => {
        if (!partido) return 'Por definir';
        // Verificar si cancha es un objeto (viene del backend con datos completos)
        if (typeof partido.cancha === 'object' && partido.cancha !== null) {
            // Verificar si tiene propiedad 'nombre'
            if ('nombre' in partido.cancha) {
                const canchaObj = partido.cancha as CanchaObject;
                return canchaObj.nombre || 'Por definir';
            }
            // Si es un objeto pero no tiene 'nombre', intentar acceder a otras propiedades
            const canchaObj = partido.cancha as Record<string, unknown>;
            if (canchaObj.nombre && typeof canchaObj.nombre === 'string') {
                return canchaObj.nombre;
            }
        }
        // Si es string, usarlo directamente
        if (typeof partido.cancha === 'string') {
            return partido.cancha;
        }
        // Si es number, formatearlo
        if (typeof partido.cancha === 'number') {
            return `Cancha ${partido.cancha}`;
        }
        // Verificar si hay datos de cancha en otras propiedades (para planillero)
        const partidoExt = partido as PartidoCompleto & { canchaData?: { nombre?: string; id_cancha?: number } };
        if (partidoExt.canchaData?.nombre) {
            return partidoExt.canchaData.nombre;
        }
        if (partidoExt.canchaData?.id_cancha) {
            return `Cancha ${partidoExt.canchaData.id_cancha}`;
        }
        return 'Por definir';
    }, [partido]);

    // Separar goles por equipo
    const golesLocal = useMemo(() => {
        if (!partido) return [];
        return goles.filter(g => g.id_equipo === partido.equipoLocal?.id_equipo);
    }, [goles, partido]);

    const golesVisita = useMemo(() => {
        if (!partido) return [];
        return goles.filter(g => g.id_equipo === partido.equipoVisita?.id_equipo);
    }, [goles, partido]);

    // Determinar si mostrar resultado o hora
    const mostrarResultado = useMemo(() => {
        return !['P', 'A'].includes(estadoActual);
    }, [estadoActual]);

    return {
        estadoActual,
        fechaFormateada,
        nombreCancha,
        golesLocal,
        golesVisita,
        mostrarResultado,
    };
};

