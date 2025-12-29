import { z } from 'zod';

export const crearZonaSchema = z.object({
    nombre: z.string()
        .refine(
            (val) => !val || (val.trim().length >= 2 && val.trim().length <= 50),
            { message: 'El nombre debe tener entre 2 y 50 caracteres' }
        ),

    id_tipo_zona: z.number()
        .int('El tipo de zona debe ser un número entero')
        .positive('Debe seleccionar un tipo de zona válido'),

    cantidad_equipos: z.number()
        .int('Debe ser un número entero')
        .min(2, 'La cantidad mínima de equipos es 2')
        .max(32, 'La cantidad máxima de equipos es 32'),

    jornada: z.number()
        .int('La jornada debe ser un número entero')
        .positive('La jornada debe ser un número positivo')
        .optional(),

    id_etapa: z.number()
        .int('La etapa debe ser un número entero')
        .positive('Debe seleccionar una etapa válida'),

    campeon: z.enum(['S', 'N'])
        .default('N')
}).refine((data) => {
    // Si es eliminación directa (id_tipo_zona = 1), la cantidad de equipos debe ser par
    if (data.id_tipo_zona === 1 && data.cantidad_equipos % 2 !== 0) {
        return false;
    }
    return true;
}, {
    message: "Para eliminación directa, la cantidad de equipos debe ser un número par",
    path: ["cantidad_equipos"]
}).refine((data) => {
    // Si el tipo de zona NO es 1 (todos contra todos) ni 3 (todos contra todos ida y vuelta),
    // entonces jornada es requerida
    if (data.id_tipo_zona !== 1 && data.id_tipo_zona !== 3) {
        return data.jornada !== undefined && data.jornada !== null;
    }
    return true;
}, {
    message: "El número de jornada es requerido para este tipo de zona",
    path: ["jornada"]
});

export const editarZonaSchema = z.object({
    nombre: z.string()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(255, 'El nombre no puede exceder 255 caracteres')
        .optional(),

    id_tipo_zona: z.number()
        .int('El ID de tipo zona debe ser un entero')
        .min(1, 'El ID de tipo zona debe ser mayor a 0')
        .optional(),

    cantidad_equipos: z.number()
        .int('La cantidad de equipos debe ser un número entero')
        .min(2, 'Debe haber al menos 2 equipos')
        .max(32, 'No puede haber más de 32 equipos')
        .optional(),

    id_equipo_campeon: z.number()
        .int('El ID del equipo campeón debe ser un número entero')
        .positive('El ID del equipo campeón debe ser mayor a 0')
        .optional(),

    campeon: z.enum(['S', 'N'], {
        message: 'El campo campeón debe ser "S" o "N"'
    }).optional(),

    terminada: z.enum(['S', 'N'], {
        message: 'El campo terminada debe ser "S" o "N"'
    }).optional(),

    id_categoria_edicion: z.number()
        .int('El ID de categoría edición debe ser un número entero')
        .positive('El ID de categoría edición debe ser mayor a 0')
        .optional()
}).refine((data) => {
    if (data.id_tipo_zona === 1 && data.cantidad_equipos !== undefined) {
        return data.cantidad_equipos % 2 === 0;
    }
    return true;
}, {
    message: "Para eliminación directa, la cantidad de equipos debe ser un número par",
    path: ["cantidad_equipos"]
});

export type EditarZonaInput = z.infer<typeof editarZonaSchema>;

export type CrearZonaInput = z.infer<typeof crearZonaSchema>;