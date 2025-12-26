// src/lib/validations/auth.validations.ts
import { z } from 'zod';

// TEMPORALMENTE DESACTIVADO PARA TESTING
// const DOMINIOS_PERMITIDOS = ['gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com'];

export const registroEmailSchema = z.object({
    email: z
        .string()
        .min(1, 'El email es requerido')
        .email('Email inválido'),
        // TEMPORALMENTE DESACTIVADO PARA TESTING
        // .refine(
        //     (email) => {
        //         const dominio = email.split('@')[1];
        //         return DOMINIOS_PERMITIDOS.includes(dominio);
        //     },
        //     {
        //         message: `Solo se permiten emails de: ${DOMINIOS_PERMITIDOS.join(', ')}`,
        //     }
        // ),
    password: z
        .string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .regex(/[a-z]/, 'Debe contener al menos una minúscula')
        .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
        .regex(/[0-9]/, 'Debe contener al menos un número')
        .regex(/[^a-zA-Z0-9]/, 'Debe contener al menos un carácter especial'),
    confirmPassword: z.string().min(1, 'Confirme su contraseña'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
});

export type RegistroEmailFormData = z.infer<typeof registroEmailSchema>;

// src/lib/validations/auth.validations.ts (actualizar)
export const validarDniYDatosSchema = z.object({
  // Datos del DNI escaneado
  dni: z.string().min(7, 'DNI inválido').max(8, 'DNI inválido'),
  nombre: z.string().min(2, 'Nombre inválido'),
  apellido: z.string().min(2, 'Apellido inválido'),
  fechaNacimiento: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Formato de fecha inválido (DD/MM/YYYY)'),

  // Datos ingresados por el usuario
  username: z
    .string()
    .min(3, 'El username debe tener al menos 3 caracteres')
    .max(20, 'El username no puede tener más de 20 caracteres')
    .regex(/^[a-zA-Z0-9_]+$/, 'Solo letras, números y guión bajo'),
  telefono: z
    .string()
    .regex(/^[0-9]{10}$/, 'El teléfono debe tener 10 dígitos'),
  // Posición del jugador (opcional)
  id_posicion: z.number().optional(),
});

export type ValidarDniYDatosFormData = z.infer<typeof validarDniYDatosSchema>;