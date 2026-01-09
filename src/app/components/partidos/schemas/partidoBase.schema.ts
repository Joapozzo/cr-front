import { z } from 'zod';

/**
 * Schema base compartido entre crear y actualizar partido
 * Contiene los campos comunes con sus validaciones
 */
export const partidoBaseSchema = z.object({
    id_equipolocal: z.coerce.number().min(1, 'Debe seleccionar un equipo local'),
    id_equipovisita: z.coerce.number().min(1, 'Debe seleccionar un equipo visitante'),
    jornada: z.coerce.number().min(1, 'La jornada debe ser mayor a 0'),
    dia: z.string().min(1, 'Debe seleccionar una fecha'),
    hora: z.string().min(1, 'Debe seleccionar una hora'),
    id_predio: z.coerce.number().min(1, 'Debe seleccionar un predio'),
    id_cancha: z.coerce.number().min(1, 'Debe seleccionar una cancha'),
    arbitro: z.string().optional(),
    id_planillero: z.string().optional(),
    id_zona: z.coerce.number().min(1, 'Debe seleccionar una zona'),
    destacado: z.preprocess((val) => val === 'S' || val === true, z.boolean()).default(false),
    interzonal: z.preprocess((val) => val === 'S' || val === true, z.boolean()).default(false),
    ventaja_deportiva: z.preprocess((val) => val === 'S' || val === true, z.boolean()).default(false),
    id_equipo_ventaja_deportiva: z.preprocess((val) => {
        if (val === '' || val === null || val === undefined) return undefined;
        return Number(val);
    }, z.number().optional()),
});

/**
 * Refinamiento para validar que equipos local y visitante sean diferentes
 */
export const equiposDiferentesRefinement = {
    refinement: (data: { id_equipolocal: number; id_equipovisita: number }) => 
        data.id_equipolocal !== data.id_equipovisita,
    options: {
        message: "El equipo local y visitante no pueden ser el mismo",
        path: ["id_equipovisita"],
    }
};

/**
 * Refinamiento para validar selección de equipo con ventaja deportiva
 */
export const ventajaDeportivaRefinement = {
    refinement: (data: { ventaja_deportiva: boolean; id_equipo_ventaja_deportiva?: number }) => {
        if (data.ventaja_deportiva && !data.id_equipo_ventaja_deportiva) {
            return false;
        }
        return true;
    },
    options: {
        message: "Debe seleccionar un equipo con ventaja deportiva",
        path: ["id_equipo_ventaja_deportiva"],
    }
};

export type PartidoBaseFormData = z.infer<typeof partidoBaseSchema>;

