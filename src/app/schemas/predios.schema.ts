import { z } from 'zod';

// Schema para crear predio
export const crearPredioSchema = z.object({
    nombre: z.string()
        .min(1, 'El nombre es requerido')
        .max(100, 'El nombre no puede exceder 100 caracteres')
        .trim(),
    direccion: z.string()
        .max(500, 'La dirección no puede exceder 500 caracteres')
        .trim()
        .optional()
        .nullable(),
    descripcion: z.string()
        .max(1000, 'La descripción no puede exceder 1000 caracteres')
        .trim()
        .optional()
        .nullable()
    // El estado siempre será 'A' (Activo) al crear, no se incluye en el schema
});

// Schema para actualizar predio
export const actualizarPredioSchema = z.object({
    nombre: z.string()
        .min(1, 'El nombre es requerido')
        .max(100, 'El nombre no puede exceder 100 caracteres')
        .trim()
        .optional(),
    direccion: z.string()
        .max(500, 'La dirección no puede exceder 500 caracteres')
        .trim()
        .optional()
        .nullable(),
    descripcion: z.string()
        .max(1000, 'La descripción no puede exceder 1000 caracteres')
        .trim()
        .optional()
        .nullable(),
    estado: z.enum(['A', 'I'], {
        message: 'El estado debe ser A (Activo) o I (Inactivo)'
    })
        .optional()
});

// Schema para crear cancha
export const crearCanchaSchema = z.object({
    id_predio: z.number()
        .int('El ID de predio debe ser un número entero')
        .positive('Debe seleccionar un predio'),
    nombre: z.string()
        .min(1, 'El nombre es requerido')
        .max(50, 'El nombre no puede exceder 50 caracteres')
        .trim(),
    tipo_futbol: z.number()
        .int('El tipo de fútbol debe ser un número entero')
        .refine((val) => [5, 7, 8, 11].includes(val), {
            message: 'El tipo de fútbol debe ser 5, 7, 8 o 11'
        })
        .default(11)
        .optional(),
    estado: z.enum(['A', 'I'], {
        message: 'El estado debe ser A (Activo) o I (Inactivo)'
    })
        .default('A')
        .optional()
});

// Schema para actualizar cancha
export const actualizarCanchaSchema = z.object({
    id_predio: z.number()
        .int('El ID de predio debe ser un número entero')
        .positive('Debe seleccionar un predio')
        .optional(),
    nombre: z.string()
        .min(1, 'El nombre es requerido')
        .max(50, 'El nombre no puede exceder 50 caracteres')
        .trim()
        .optional(),
    tipo_futbol: z.number()
        .int('El tipo de fútbol debe ser un número entero')
        .refine((val) => [5, 7, 8, 11].includes(val), {
            message: 'El tipo de fútbol debe ser 5, 7, 8 o 11'
        })
        .optional(),
    estado: z.enum(['A', 'I'], {
        message: 'El estado debe ser A (Activo) o I (Inactivo)'
    })
        .optional()
});

export type CrearPredioInput = z.infer<typeof crearPredioSchema>;
export type ActualizarPredioInput = z.infer<typeof actualizarPredioSchema>;
export type CrearCanchaInput = z.infer<typeof crearCanchaSchema>;
export type ActualizarCanchaInput = z.infer<typeof actualizarCanchaSchema>;

