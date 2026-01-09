import { z } from 'zod';
import { 
    partidoBaseSchema, 
    equiposDiferentesRefinement,
    ventajaDeportivaRefinement 
} from './partidoBase.schema';

/**
 * Estados posibles de un partido
 */
export const estadoPartidoEnum = z.enum(['P', 'C1', 'E', 'C2', 'T', 'F', 'S', 'A', 'I'] as const);

export type EstadoPartido = z.infer<typeof estadoPartidoEnum>;

/**
 * Schema para actualizar partido
 * Extiende el schema base con el campo estado
 */
export const actualizarPartidoSchema = partidoBaseSchema
    .extend({
        estado: estadoPartidoEnum.default('P'),
    })
    .refine(
        equiposDiferentesRefinement.refinement,
        equiposDiferentesRefinement.options
    )
    .refine(
        ventajaDeportivaRefinement.refinement,
        ventajaDeportivaRefinement.options
    );

export type ActualizarPartidoFormData = z.infer<typeof actualizarPartidoSchema>;

/**
 * Opciones de estado para el select
 */
export const ESTADO_PARTIDO_OPTIONS = [
    { value: 'P', label: 'Programado' },
    { value: 'C1', label: 'Primer tiempo' },
    { value: 'E', label: 'Entretiempo' },
    { value: 'C2', label: 'Segundo tiempo' },
    { value: 'T', label: 'Terminado' },
    { value: 'F', label: 'Finalizado' },
    { value: 'S', label: 'Suspendido' },
    { value: 'A', label: 'Aplazado' },
    { value: 'I', label: 'Indefinido' }
] as const;

