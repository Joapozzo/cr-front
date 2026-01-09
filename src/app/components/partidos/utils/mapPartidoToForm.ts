import { PartidoResponse } from '@/app/schemas/partidos.schema';
import { Usuario } from '@/app/types/user';
import { FormDataValue } from '@/app/components/modals/ModalAdmin';
import { formatearFechaParaInput } from './formatFecha';
import { formatearHoraParaInput } from './formatHora';

/**
 * Datos iniciales por defecto para crear partido
 */
export interface CrearPartidoInitialData {
    jornada: number;
    destacado: boolean;
    interzonal: boolean;
}


/**
 * Busca el UID de un planillero por su nombre y apellido
 */
export function encontrarPlanilleroPorNombre(
    usuarios: Usuario[] | undefined,
    nombre?: string,
    apellido?: string
): string {
    if (!nombre || !apellido || !usuarios) return '';
    const planilleroEncontrado = usuarios.find(
        (usuario: Usuario) =>
            usuario.nombre.toLowerCase() === nombre.toLowerCase() &&
            usuario.apellido.toLowerCase() === apellido.toLowerCase()
    );
    return planilleroEncontrado?.uid || '';
}

/**
 * Mapea un partido existente a datos iniciales del formulario
 * Retorna Record<string, FormDataValue> compatible con FormModal
 */
export function mapPartidoToFormData(
    partido: PartidoResponse | null,
    usuarios?: Usuario[]
): Record<string, FormDataValue> {
    if (!partido) {
        return {
            id_equipolocal: '',
            id_equipovisita: '',
            jornada: 1,
            dia: '',
            hora: '',
            id_predio: '',
            id_cancha: '',
            arbitro: '',
            id_planillero: '',
            id_zona: '',
            destacado: false,
            interzonal: false,
            ventaja_deportiva: false,
            id_equipo_ventaja_deportiva: '',
            estado: 'P',
        } as Record<string, FormDataValue>;
    }

    // Extraer id_equipo_ventaja_deportiva de forma segura
    const partidoExtendido = partido as PartidoResponse & {
        equipoVentajaDeportiva?: { id_equipo: number };
        id_equipo_ventaja_deportiva?: number;
    };

    return {
        id_equipolocal: partido.equipoLocal?.id_equipo || '',
        id_equipovisita: partido.equipoVisita?.id_equipo || '',
        jornada: partido.jornada || 1,
        dia: partido.dia ? formatearFechaParaInput(partido.dia) : '',
        hora: partido.hora ? formatearHoraParaInput(partido.hora) : '',
        id_predio: partido.cancha?.id_predio || partido.cancha?.predio?.id_predio || '',
        id_cancha: partido.cancha?.id_cancha || '',
        arbitro: partido.arbitro || '',
        id_planillero: partido.planillero
            ? encontrarPlanilleroPorNombre(usuarios, partido.planillero.nombre, partido.planillero.apellido)
            : '',
        id_zona: partido.id_zona || '',
        destacado: partido.destacado || false,
        interzonal: typeof partido.interzonal === 'boolean' ? partido.interzonal : false,
        ventaja_deportiva: partido.ventaja_deportiva || false,
        id_equipo_ventaja_deportiva: partidoExtendido?.equipoVentajaDeportiva?.id_equipo ||
            partidoExtendido?.id_equipo_ventaja_deportiva || '',
        estado: partido.estado || 'P',
    } as Record<string, FormDataValue>;
}

/**
 * Crea datos iniciales para el formulario de crear partido
 * Retorna Record<string, FormDataValue> compatible con FormModal
 */
export function getCrearPartidoInitialData(jornada: number): Record<string, FormDataValue> {
    return {
        jornada,
        destacado: false,
        interzonal: false,
    } as Record<string, FormDataValue>;
}

