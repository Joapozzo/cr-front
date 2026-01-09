import { z } from 'zod';
import { 
    partidoBaseSchema, 
    equiposDiferentesRefinement 
} from './partidoBase.schema';

/**
 * Schema para crear partido
 * Extiende el schema base sin campos adicionales
 * (ventaja deportiva no aplica en creación para zonas tipo 1)
 */
export const crearPartidoSchema = partidoBaseSchema
    .refine(
        equiposDiferentesRefinement.refinement,
        equiposDiferentesRefinement.options
    );

export type CrearPartidoFormData = z.infer<typeof crearPartidoSchema>;

