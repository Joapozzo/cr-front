import { FormField } from '@/app/components/modals/ModalAdmin';
import { SelectOption } from '../hooks/usePartidoFormOptions';

/**
 * Parámetros para el campo de estado
 */
export interface GetEstadoFieldParams {
    /** Opciones de estado */
    estadosOptions: SelectOption[];
}

/**
 * Construye el campo de estado del partido
 * Solo se usa en actualización, no en creación
 */
export function getEstadoField({
    estadosOptions,
}: GetEstadoFieldParams): FormField {
    return {
        name: 'estado',
        label: 'Estado del Partido',
        type: 'select',
        required: true,
        options: estadosOptions,
        placeholder: 'Seleccionar estado'
    };
}

