import { z } from 'zod';

export const crearEdicionSchema = z.object({
    nombre: z.string()
        .min(1, 'El nombre es requerido')
        .min(3, 'El nombre debe tener al menos 3 caracteres')
        .max(50, 'El nombre no puede exceder 50 caracteres'),

    temporada: z.number()
        .int('La temporada debe ser un número entero')
        .min(2020, 'La temporada debe ser mayor a 2020')
        .max(2030, 'La temporada no puede ser mayor a 2030'),

    cantidad_eventuales: z.number()
        .int('Debe ser un número entero')
        .min(0, 'No puede ser negativo')
        .max(20, 'No puede exceder 20 eventuales'),

    partidos_eventuales: z.number()
        .int('Debe ser un número entero')
        .min(0, 'No puede ser negativo')
        .max(10, 'No puede exceder 10 partidos'),

    apercibimientos: z.number()
        .int('Debe ser un número entero')
        .min(1, 'Debe tener al menos 1 apercibimiento')
        .max(10, 'No puede exceder 10 apercibimientos'),

    puntos_descuento: z.number()
        .int('Debe ser un número entero')
        .min(1, 'Debe tener al menos 1 punto de descuento')
        .max(5, 'No puede exceder 5 puntos de descuento')
});

export type CrearEdicionInput = z.infer<typeof crearEdicionSchema>;