import { useMutation, useQueryClient } from '@tanstack/react-query';
import { perfilService } from '@/app/services/perfil.service';
import { useAuthStore } from '@/app/stores/authStore';
import { toast } from 'react-hot-toast';

export const useActualizarFotoPerfil = () => {
  const queryClient = useQueryClient();
  const { setUsuario, usuario } = useAuthStore();

  return useMutation({
    mutationFn: (fotoBase64: string) => perfilService.actualizarFotoPerfil(fotoBase64),
    onSuccess: (data) => {
      // Actualizar la foto en el authStore (Zustand)
      if (usuario) {
        setUsuario({
          ...usuario,
          img: data.img,
        });
      }

      // Actualizar en localStorage también (compatibilidad)
      const usuarioLocal = localStorage.getItem('usuario');
      if (usuarioLocal) {
        const usuarioParsed = JSON.parse(usuarioLocal);
        usuarioParsed.img = data.img;
        localStorage.setItem('usuario', JSON.stringify(usuarioParsed));
      }

      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['perfil'] });
      queryClient.invalidateQueries({ queryKey: ['usuario'] });

      toast.success('Foto de perfil actualizada correctamente');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al actualizar la foto de perfil');
    },
  });
};

