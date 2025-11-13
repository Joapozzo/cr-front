import { z } from 'zod';

export const crearCategoriaEdicionSchema = z.object({
    id_categoria: z.number()
        .int('Debe ser un número entero')
        .positive('Debe seleccionar una categoría'),

    tipo_futbol: z.number()
        .int('Debe ser un número entero')
        .min(5, 'Mínimo 5 jugadores')
        .max(11, 'Máximo 11 jugadores'),

    duracion_tiempo: z.number()
        .int('Debe ser un número entero')
        .min(10, 'Mínimo 10 minutos')
        .max(90, 'Máximo 90 minutos'),

    duracion_entretiempo: z.number()
        .int('Debe ser un número entero')
        .min(5, 'Mínimo 5 minutos')
        .max(30, 'Máximo 30 minutos'),

    puntos_victoria: z.number()
        .int('Debe ser un número entero')
        .min(0, 'No puede ser negativo')
        .max(10, 'Máximo 10 puntos'),

    puntos_empate: z.number()
        .int('Debe ser un número entero')
        .min(0, 'No puede ser negativo')
        .max(10, 'Máximo 10 puntos'),

    puntos_derrota: z.number()
        .int('Debe ser un número entero')
        .min(0, 'No puede ser negativo')
        .max(5, 'Máximo 5 puntos'),
}).strict();

export type CrearCategoriaEdicionInput = z.infer<typeof crearCategoriaEdicionSchema>;
