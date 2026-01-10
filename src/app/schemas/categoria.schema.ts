import { z } from 'zod';

export const crearCategoriaEdicionSchema = z.object({
    id_categoria: z.union([
        z.number()
            .int('Debe ser un número entero')
            .positive('Debe seleccionar una categoría'),
        z.string()
            .min(1, 'Debe seleccionar una categoría')
            .refine(
                (val) => val.startsWith('nombre_') || !isNaN(Number(val)),
                'Debe ser un número o un nombre de categoría válido'
            )
    ]),

    tipo_futbol: z.coerce.number()
        .int('Debe ser un número entero')
        .min(5, 'Mínimo 5 jugadores')
        .max(11, 'Máximo 11 jugadores'),

    duracion_tiempo: z.coerce.number()
        .int('Debe ser un número entero')
        .min(10, 'Mínimo 10 minutos')
        .max(90, 'Máximo 90 minutos'),

    duracion_entretiempo: z.coerce.number()
        .int('Debe ser un número entero')
        .min(5, 'Mínimo 5 minutos')
        .max(30, 'Máximo 30 minutos'),

    puntos_victoria: z.coerce.number()
        .int('Debe ser un número entero')
        .min(0, 'No puede ser negativo')
        .max(10, 'Máximo 10 puntos'),

    puntos_empate: z.coerce.number()
        .int('Debe ser un número entero')
        .min(0, 'No puede ser negativo')
        .max(10, 'Máximo 10 puntos'),

    puntos_derrota: z.coerce.number()
        .int('Debe ser un número entero')
        .min(0, 'No puede ser negativo')
        .max(5, 'Máximo 5 puntos'),

    id_division: z.preprocess(
        (val) => {
            // Si es 0, undefined, null o string vacío, retornar undefined
            if (val === 0 || val === '0' || val === null || val === undefined || val === '') {
                return undefined;
            }
            // Convertir a número si es string numérico
            if (typeof val === 'string') {
                const trimmed = val.trim();
                if (trimmed === '' || trimmed === '0') {
                    return undefined;
                }
                const numVal = Number(trimmed);
                if (isNaN(numVal)) {
                    return val; // Dejar que zod valide
                }
                // Si es 0 después de convertir, retornar undefined
                if (numVal === 0) {
                    return undefined;
                }
                return numVal;
            }
            // Si ya es un número y es 0, retornar undefined
            if (typeof val === 'number' && val === 0) {
                return undefined;
            }
            return val;
        },
        z.union([
            z.number()
                .int('Debe ser un número entero')
                .positive('Debe ser un número positivo'),
            z.undefined(),
            z.null()
        ])
        .optional()
    ),

    color: z.string()
        .regex(/^#[0-9A-Fa-f]{6}$/, 'Debe ser un código hexadecimal válido (ej: #FF5733)')
        .optional()
        .or(z.null()),
});

export type CrearCategoriaEdicionInput = z.infer<typeof crearCategoriaEdicionSchema>;
