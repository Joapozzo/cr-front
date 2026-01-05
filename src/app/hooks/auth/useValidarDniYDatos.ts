import { useMutation } from '@tanstack/react-query';
import { authService } from '@/app/services/auth.services';
import { api } from '@/app/lib/api';

export interface ValidarDniYDatosInput {
  uid: string;
  dni: string;
  nombre: string;
  apellido: string;
  fechaNacimiento: string; // DD/MM/YYYY
  telefono: string;
  id_posicion?: number; // Posición del jugador (opcional)
}

export const useValidarDniYDatos = () => {
  return useMutation({
    mutationFn: async (datos: ValidarDniYDatosInput) => {
      // Verificar que el email esté verificado antes de continuar
      const emailVerificado = await authService.verificarEmailVerificado();
      
      if (!emailVerificado) {
        throw new Error('Debe verificar su correo electrónico antes de continuar');
      }

      // Validar DNI y registrar datos
      const result = await api.post('/auth/register/validar-dni-y-datos', datos);
      return result;
    },
  });
};