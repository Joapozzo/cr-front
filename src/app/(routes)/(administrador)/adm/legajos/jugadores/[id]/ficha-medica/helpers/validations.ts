import { FormDataValue } from '@/app/components/modals/ModalAdmin';

export interface SubirFichaData {
    archivo: File;
    // Las fechas se calculan automáticamente en el backend
    // fecha_emision: string; // Se calcula como fecha actual
    // fecha_vencimiento: string; // Se calcula como fecha actual + 365 días
    // observaciones?: string; // Eliminado
}

export interface CambiarEstadoData {
    estado: 'A' | 'V' | 'R' | 'I';
    motivo_rechazo?: string;
}

/**
 * Valida los datos para subir una ficha médica
 * Las fechas se calculan automáticamente en el backend
 */
export const validarSubirFicha = (data: Record<string, FormDataValue>): SubirFichaData => {
    const archivo = data.archivo as File;

    if (!archivo) {
        throw new Error('Debe seleccionar un archivo PDF');
    }

    if (archivo.type !== 'application/pdf') {
        throw new Error('Solo se permiten archivos PDF');
    }

    if (archivo.size > 10 * 1024 * 1024) {
        throw new Error('El archivo no puede exceder 10MB');
    }

    return {
        archivo,
    };
};

/**
 * Valida los datos para cambiar el estado de una ficha médica
 */
export const validarCambiarEstado = (data: Record<string, FormDataValue>): CambiarEstadoData => {
    const estado = data.estado as 'A' | 'V' | 'R' | 'I';
    const motivo_rechazo = data.motivo_rechazo as string | undefined;

    if (!estado) {
        throw new Error('El estado es requerido');
    }

    if (estado === 'R' && !motivo_rechazo?.trim()) {
        throw new Error('El motivo de rechazo es requerido cuando el estado es "Rechazada"');
    }

    return {
        estado,
        motivo_rechazo: estado === 'R' ? motivo_rechazo : undefined,
    };
};

