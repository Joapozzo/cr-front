import { FormField } from '@/app/components/modals/ModalAdmin';
import { SelectOption } from '../hooks/usePartidoFormOptions';

/**
 * Parámetros para campos de ventaja deportiva
 */
export interface GetVentajaDeportivaFieldsParams {
    /** Si la zona permite ventaja deportiva */
    permiteVentajaDeportiva: boolean;
    /** Si la ventaja deportiva está activada */
    ventajaDeportiva: boolean;
    /** Opciones de equipos para ventaja deportiva (local y visitante) */
    equiposVentajaDeportivaOptions: SelectOption[];
    /** ID del equipo local seleccionado */
    selectedLocal: number | null;
    /** ID del equipo visitante seleccionado */
    selectedVisitante: number | null;
}

/**
 * Construye campos de ventaja deportiva
 * - Solo para zonas de eliminación directa (tipo 2) o ida y vuelta (tipo 4)
 * - El select de equipo solo aparece si ventaja_deportiva está activada
 */
export function getVentajaDeportivaFields({
    permiteVentajaDeportiva,
    ventajaDeportiva,
    equiposVentajaDeportivaOptions,
    selectedLocal,
    selectedVisitante,
}: GetVentajaDeportivaFieldsParams): FormField[] {
    const fields: FormField[] = [];

    if (!permiteVentajaDeportiva) {
        return fields;
    }

    // Campo switch de ventaja deportiva
    fields.push({
        name: 'ventaja_deportiva',
        label: 'Ventaja Deportiva',
        type: 'switch'
    });

    // Campo select de equipo con ventaja (solo si está activada)
    if (ventajaDeportiva) {
        fields.push({
            name: 'id_equipo_ventaja_deportiva',
            label: 'Equipo con Ventaja Deportiva',
            type: 'select',
            required: true,
            options: equiposVentajaDeportivaOptions,
            placeholder: !selectedLocal || !selectedVisitante
                ? 'Primero seleccione los equipos local y visitante'
                : equiposVentajaDeportivaOptions.length === 0
                    ? 'No hay equipos disponibles'
                    : 'Seleccionar equipo',
            disabled: !selectedLocal || !selectedVisitante || equiposVentajaDeportivaOptions.length === 0
        });
    }

    return fields;
}

