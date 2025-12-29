import { useMutation, useQueryClient } from '@tanstack/react-query';
import { perfilService, ActualizarDatosPerfilParams } from '@/app/services/perfil.service';
import { useAuthStore } from '@/app/stores/authStore';
import { toast } from 'react-hot-toast';

export const useActualizarDatosPerfil = () => {
  const queryClient = useQueryClient();
  const { setUsuario, usuario } = useAuthStore();

  return useMutation({
    mutationFn: (datos: ActualizarDatosPerfilParams) => perfilService.actualizarDatosPerfil(datos),
    onSuccess: (data) => {
      // Actualizar los datos en el authStore (Zustand)
      if (usuario) {
        setUsuario({
          ...usuario,
          nombre: data.usuario.nombre,
          apellido: data.usuario.apellido,
          telefono: data.usuario.telefono?.toString() ?? null,
          nacimiento: data.usuario.nacimiento,
        });
      }

      // Actualizar en localStorage también (compatibilidad)
      const usuarioLocal = localStorage.getItem('usuario');
      if (usuarioLocal) {
        const usuarioParsed = JSON.parse(usuarioLocal);
        usuarioParsed.nombre = data.usuario.nombre;
        usuarioParsed.apellido = data.usuario.apellido;
        usuarioParsed.telefono = data.usuario.telefono;
        usuarioParsed.nacimiento = data.usuario.nacimiento;
        localStorage.setItem('usuario', JSON.stringify(usuarioParsed));
      }

      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['perfil'] });
      queryClient.invalidateQueries({ queryKey: ['usuario'] });

      toast.success('Datos del perfil actualizados correctamente');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al actualizar los datos del perfil');
    },
  });
};

