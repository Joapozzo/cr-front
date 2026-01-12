import { FormField } from '@/app/components/modals/ModalAdmin';

export const getSubirFichaFields = (): FormField[] => [
    {
        name: 'archivo',
        label: 'Archivo PDF',
        type: 'file',
        accept: 'application/pdf',
        required: true,
    },
    // Las fechas se calculan automáticamente en el backend:
    // - fecha_emision: fecha actual
    // - fecha_vencimiento: fecha actual + 365 días
];

export const getCambiarEstadoFields = (estadoSeleccionado: string): FormField[] => [
    {
        name: 'estado',
        label: 'Estado',
        type: 'select',
        required: true,
        options: [
            { value: 'E', label: 'En revisión' },
            { value: 'A', label: 'Activa/Válida' },
            { value: 'V', label: 'Vencida' },
            { value: 'R', label: 'Rechazada' },
            { value: 'I', label: 'Inactiva' },
        ],
    },
    ...(estadoSeleccionado === 'R' ? [{
        name: 'motivo_rechazo',
        label: 'Motivo de Rechazo',
        type: 'textarea' as const,
        required: true,
        placeholder: 'Ingrese el motivo del rechazo...',
    }] : []),
];

