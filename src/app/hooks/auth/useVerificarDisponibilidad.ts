import { useQuery } from '@tanstack/react-query';
import { authService } from '../../services/auth.services';

/**
 * Hook para verificar disponibilidad de username
 */
export const useVerificarUsername = (username: string) => {
  return useQuery({
    queryKey: ['verificar-username', username],
    queryFn: () => authService.verificarDisponibilidad('username', username),
    enabled: username.length >= 3, // Solo verificar si tiene al menos 3 caracteres
    staleTime: 0, // Siempre verificar
    retry: false,
  });
};

/**
 * Hook para verificar disponibilidad de DNI
 */
export const useVerificarDni = (dni: string) => {
  return useQuery({
    queryKey: ['verificar-dni', dni],
    queryFn: () => authService.verificarDisponibilidad('dni', dni),
    enabled: dni.length >= 7, // Solo verificar si tiene al menos 7 dígitos
    staleTime: 0,
    retry: false,
  });
};