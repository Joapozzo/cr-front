import { useQuery } from '@tanstack/react-query';
import { authService } from '../../services/auth.services';

export const usePerfil = () => {
  return useQuery({
    queryKey: ['perfil'],
    queryFn: async () => {
      const result = await authService.obtenerPerfil();
      return result.usuario;
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};