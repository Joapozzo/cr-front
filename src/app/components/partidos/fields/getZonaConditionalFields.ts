import { FormField } from '@/app/components/modals/ModalAdmin';

/**
 * Parámetros para campos condicionales de zona
 */
export interface GetZonaConditionalFieldsParams {
    /** Si la zona es tipo 2 (todos contra todos) */
    esZonaTipo2: boolean;
}

/**
 * Construye campos condicionales basados en el tipo de zona
 * - Interzonal: solo para zonas tipo 2 (todos contra todos)
 */
export function getZonaConditionalFields({
    esZonaTipo2,
}: GetZonaConditionalFieldsParams): FormField[] {
    const fields: FormField[] = [];

    if (esZonaTipo2) {
        fields.push({
            name: 'interzonal',
            label: 'Partido Interzonal',
            type: 'switch'
        });
    }

    return fields;
}

