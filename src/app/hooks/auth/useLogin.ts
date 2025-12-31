import { useMutation } from '@tanstack/react-query';
import { authService } from '@/app/services/auth.services';
import { useAuthStore } from '@/app/stores/authStore';
import { obtenerToken } from '@/app/services/auth.services';
import { api } from '@/app/lib/api';
import { toast } from 'react-hot-toast';
// Removido import de jugadorService - los equipos se cargarán cuando se necesiten
import { determinarRutaRedireccion } from '@/app/utils/authRedirect';

export const useLogin = () => {
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      // 1️⃣ Login con Firebase
      const firebaseResult = await authService.loginConEmail(email, password);
      if (!firebaseResult.success) {
        throw new Error(firebaseResult.error);
      }

      const user = firebaseResult.user!;

      // 2️⃣ Obtener token JWT de Firebase (antes de verificar email para poder consultar rol)
      const token = await obtenerToken();
      if (!token) {
        throw new Error('No se pudo obtener el token de autenticación.');
      }

      // 3️⃣ Llamar al backend con el UID y el token
      const response = await api.post('/auth/login', null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response as {
        success: boolean;
        usuario: any;
        proximoPaso: 'VERIFICAR_EMAIL' | 'VALIDAR_DNI' | 'SELFIE' | 'COMPLETO';
      };

      // 4️⃣ Verificar email si el proximoPaso requiere verificación
      // Nota: El backend puede tener SKIP_EMAIL_VERIFICATION=true para desactivar en test
      if (data.proximoPaso === 'VERIFICAR_EMAIL') {
        if (!user.emailVerified) {
          throw new Error('Debe verificar su correo electrónico antes de iniciar sesión.');
        }
      }

      // 5️⃣ Guardar datos en Zustand (persist maneja localStorage automáticamente)
      login(token, data.usuario);

      // Los equipos se cargarán cuando se necesiten (en home o páginas que los requieran)
      // No cargar aquí para evitar llamadas innecesarias

      return data;
    },

    onSuccess: (data) => {
      // Mostrar mensaje de bienvenida personalizado con el nombre del usuario
      const nombreUsuario = data.usuario?.nombre || data.usuario?.username || data.usuario?.email?.split('@')[0] || 'Usuario';
      toast.success(`¡Bienvenido${nombreUsuario !== 'Usuario' ? `, ${nombreUsuario}` : ''}! 👋`, {
        duration: 4000,
      });
    },

    onError: (error: any) => {
      console.error('Error en login:', error);
    },
  });
};
