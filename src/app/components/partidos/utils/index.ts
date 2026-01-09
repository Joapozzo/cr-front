export { 
    formatearFechaParaInput, 
    parseFechaFromInput,
    normalizeFechaValue 
} from './formatFecha';

export { 
    formatearHoraParaInput,
    normalizeHoraValue 
} from './formatHora';

export { 
    mapPartidoToFormData, 
    getCrearPartidoInitialData,
    encontrarPlanilleroPorNombre,
    type CrearPartidoInitialData
} from './mapPartidoToForm';

import { FormDataValue } from '@/app/components/modals/ModalAdmin';

// Tipo para datos iniciales del formulario (compatible con Record<string, FormDataValue>)
export type PartidoFormInitialData = Record<string, FormDataValue>;

