import { useMutation } from '@tanstack/react-query';
import { authService } from '@/app/services/auth.services';
import { useAuthStore } from '@/app/stores/authStore';
import { obtenerToken } from '@/app/services/auth.services';
import { api } from '@/app/lib/api';
import { toast } from 'react-hot-toast';
import { jugadorService } from '@/app/services/jugador.services';

export const useLogin = () => {
  const { login, setEquipos } = useAuthStore();

  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      // 1️⃣ Login con Firebase
      const firebaseResult = await authService.loginConEmail(email, password);
      if (!firebaseResult.success) {
        throw new Error(firebaseResult.error);
      }

      const user = firebaseResult.user!;

      // 2️⃣ Verificar email verificado
      if (!user.emailVerified) {
        throw new Error('Debe verificar su correo electrónico antes de iniciar sesión.');
      }

      // 3️⃣ Obtener token JWT de Firebase
      const token = await obtenerToken();
      if (!token) {
        throw new Error('No se pudo obtener el token de autenticación.');
      }

      // 4️⃣ Llamar al backend con el UID y el token
      const response = await api.post('/auth/login', null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });


      const data = response as {
        success: boolean;
        usuario: any;
        proximoPaso: 'VALIDAR_DNI' | 'SELFIE' | 'COMPLETO';
      };

      // 5️⃣ Guardar datos en Zustand (persist maneja localStorage automáticamente)
      login(token, data.usuario);

      // 6️⃣ Obtener y guardar equipos del usuario (si es jugador)
      try {
        const equipos = await jugadorService.obtenerEquiposUsuario();
        // Solo guardar si tiene equipos
        if (equipos && equipos.length > 0) {
          setEquipos(equipos);
        } else {
          setEquipos([]);
        }
      } catch (error) {
        // Si falla (usuario no es jugador o no tiene equipos), guardar array vacío
        console.log('Usuario no tiene equipos o no es jugador');
        setEquipos([]);
      }

      return data;
    },

    onSuccess: (data) => {
      toast.success('Inicio de sesión exitoso ✅');
      console.log('Login exitoso →', data);
    },

    onError: (error: any) => {
      toast.error(error.message || 'Error al iniciar sesión');
      console.error('Error en login:', error);
    },
  });
};
