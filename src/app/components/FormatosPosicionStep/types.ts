/**
 * Tipos y interfaces para FormatosPosicionStep
 */

import { FormatoPosicion } from '../../types/zonas';

export interface FormatosPosicionStepProps {
    cantidadEquipos: number;
    onFormatosChange: (formatos: FormatoPosicion[]) => void;
    formatosIniciales?: FormatoPosicion[];
    onActualizarFormato?: (id_formato: number, data: {
        posicion_desde?: number;
        posicion_hasta?: number;
        descripcion?: string;
        color?: string | null;
        orden?: number;
    }) => Promise<void>;
    onEliminarFormato?: (id_formato: number) => Promise<void>;
}

export interface FormatoTemporal {
    id: string;
    posicion_desde: number;
    posicion_hasta: number;
    descripcion: string;
    color: string;
    orden: number;
    errores?: {
        posicion_desde?: string;
        posicion_hasta?: string;
        descripcion?: string;
        color?: string;
        superposicion?: string;
    };
}

