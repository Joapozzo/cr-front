import { FormField } from '@/app/components/modals/ModalAdmin';
import { SelectOption } from '../hooks/usePartidoFormOptions';

/**
 * Parámetros para construir campos base del partido
 */
export interface GetBasePartidoFieldsParams {
    // Opciones de selects
    zonasOptions: SelectOption[];
    equiposLocalOptions: SelectOption[];
    equiposVisitanteOptions: SelectOption[];
    prediosOptions: SelectOption[];
    canchasOptions: SelectOption[];
    planillerosOptions: SelectOption[];
    
    // Estados de carga
    loadingZonas: boolean;
    loadingEquipos: boolean;
    loadingPredios: boolean;
    loadingCanchas: boolean;
    loadingUsuarios: boolean;
    
    // Estados de selección
    selectedZona: number | null;
    selectedPredio: number | null;
    
    // Información de zona
    esZonaTipo1: boolean;
    
    /** Si es true, muestra el campo de zona primero (para crear) */
    zonaFirst?: boolean;
}

/**
 * Construye los campos base comunes del formulario de partido
 */
export function getBasePartidoFields({
    zonasOptions,
    equiposLocalOptions,
    equiposVisitanteOptions,
    prediosOptions,
    canchasOptions,
    planillerosOptions,
    loadingZonas,
    loadingEquipos,
    loadingPredios,
    loadingCanchas,
    loadingUsuarios,
    selectedZona,
    selectedPredio,
    esZonaTipo1,
    zonaFirst = false,
}: GetBasePartidoFieldsParams): FormField[] {
    const zonaField: FormField = {
        name: 'id_zona',
        label: 'Zona',
        type: 'select',
        required: true,
        options: zonasOptions,
        placeholder: loadingZonas ? 'Cargando zonas...' : 'Seleccionar zona'
    };

    const equipoLocalField: FormField = {
        name: 'id_equipolocal',
        label: 'Equipo Local',
        type: 'select',
        required: true,
        options: equiposLocalOptions,
        placeholder: loadingEquipos 
            ? 'Cargando equipos...' 
            : esZonaTipo1 
                ? 'No disponible para eliminación directa'
                : !selectedZona 
                    ? 'Primero seleccione una zona'
                    : equiposLocalOptions.length === 0 
                        ? 'No hay equipos disponibles en esta zona'
                        : 'Seleccionar equipo local',
        disabled: !selectedZona || esZonaTipo1 || equiposLocalOptions.length === 0
    };

    const equipoVisitanteField: FormField = {
        name: 'id_equipovisita',
        label: 'Equipo Visitante',
        type: 'select',
        required: true,
        options: equiposVisitanteOptions,
        placeholder: loadingEquipos 
            ? 'Cargando equipos...' 
            : esZonaTipo1 
                ? 'No disponible para eliminación directa'
                : !selectedZona 
                    ? 'Primero seleccione una zona'
                    : equiposVisitanteOptions.length === 0 
                        ? 'No hay equipos disponibles en esta zona'
                        : 'Seleccionar equipo visitante',
        disabled: !selectedZona || esZonaTipo1 || equiposVisitanteOptions.length === 0
    };

    const jornadaField: FormField = {
        name: 'jornada',
        label: 'Jornada',
        type: 'number',
        required: true,
        placeholder: 'Número de jornada'
    };

    const fechaField: FormField = {
        name: 'dia',
        label: 'Fecha',
        type: 'date',
        required: true
    };

    const horaField: FormField = {
        name: 'hora',
        label: 'Hora',
        type: 'time',
        required: true
    };

    const predioField: FormField = {
        name: 'id_predio',
        label: 'Predio',
        type: 'select',
        required: true,
        options: prediosOptions,
        placeholder: loadingPredios 
            ? 'Cargando predios...' 
            : prediosOptions.length === 0 
                ? 'No hay predios disponibles'
                : 'Seleccionar predio',
        disabled: loadingPredios || prediosOptions.length === 0
    };

    const canchaField: FormField = {
        name: 'id_cancha',
        label: 'Cancha',
        type: 'select',
        required: true,
        options: canchasOptions,
        placeholder: !selectedPredio 
            ? 'Primero seleccione un predio'
            : loadingCanchas 
                ? 'Cargando canchas...'
                : canchasOptions.length === 0 
                    ? 'No hay canchas disponibles en este predio'
                    : 'Seleccionar cancha',
        disabled: !selectedPredio || loadingCanchas || canchasOptions.length === 0
    };

    const arbitroField: FormField = {
        name: 'arbitro',
        label: 'Árbitro',
        type: 'text',
        placeholder: 'Nombre del árbitro (opcional)'
    };

    const planilleroField: FormField = {
        name: 'id_planillero',
        label: 'Planillero',
        type: 'select',
        options: planillerosOptions,
        placeholder: loadingUsuarios 
            ? 'Cargando planilleros...' 
            : 'Seleccionar planillero (opcional)'
    };

    const destacadoField: FormField = {
        name: 'destacado',
        label: 'Partido Destacado',
        type: 'switch'
    };

    // Orden diferente según el contexto
    if (zonaFirst) {
        // Para crear: zona primero, luego equipos
        return [
            zonaField,
            equipoLocalField,
            equipoVisitanteField,
            jornadaField,
            fechaField,
            horaField,
            predioField,
            canchaField,
            arbitroField,
            planilleroField,
            destacadoField,
        ];
    }

    // Para actualizar: equipos primero, zona después
    return [
        equipoLocalField,
        equipoVisitanteField,
        jornadaField,
        fechaField,
        horaField,
        predioField,
        canchaField,
        arbitroField,
        planilleroField,
        zonaField,
        destacadoField,
    ];
}

