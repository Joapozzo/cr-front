'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/app/stores/authStore';
import { determinarRutaRedireccion } from '@/app/utils/authRedirect';

/**
 * Hook que valida el estado del usuario y redirige si no puede acceder
 * Usa la función centralizada determinarRutaRedireccion para mantener consistencia
 * Ahora todo el flujo de registro está unificado en /registro
 * Estados:
 * - Sin completar registro → /registro (el stepper maneja el step correcto)
 * - Estado 'A' completo → puede acceder
 */
export const useValidateUserState = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { usuario, isAuthenticated, isHydrated } = useAuthStore();

  useEffect(() => {
    // Esperar a que el store termine de hidratarse desde localStorage
    // Esto evita redirecciones innecesarias durante la carga inicial
    if (!isHydrated) {
      return;
    }

    // Solo validar si está autenticado y tiene usuario
    if (!isAuthenticated || !usuario) {
      return;
    }

    // Rutas que NO deben ser bloqueadas (públicas o de autenticación)
    const rutasPermitidas = [
      '/registro',
      '/login',
      '/recuperar-password',
      '/reset-password'
    ];
    
    // Si está en una ruta permitida, no validar
    if (rutasPermitidas.some(ruta => pathname.startsWith(ruta))) {
      return;
    }
    
    // Si el usuario necesita verificar email y está en /registro, no redirigir
    if (!usuario.email_verificado && pathname === '/registro') {
      return;
    }

    // Rutas de admin/cajero/planillero que NO deben ser redirigidas si el usuario está completo
    // Estas rutas son válidas para usuarios completos con los roles correspondientes
    const rutasProtegidasPorRol = [
      '/adm/',      // Rutas de admin
      '/cajero/',   // Rutas de cajero
      '/planillero/', // Rutas de planillero
      '/home',      // Home de usuario
    ];
    
    // Si el usuario está completo (estado 'A') y está en una ruta protegida por rol, no redirigir
    if (usuario.estado === 'A' && usuario.cuenta_activada) {
      const estaEnRutaProtegida = rutasProtegidasPorRol.some(ruta => pathname.startsWith(ruta));
      if (estaEnRutaProtegida) {
        return; // No redirigir, el usuario está en una ruta válida para su rol
      }
      
      // Si el usuario está completo, también verificar rutas específicas por rol
      const rutasValidasPorRol: Record<string, string[]> = {
        'USER': ['/home', '/planillero'], // /planillero cubre todas las subrutas como /planillero/estadisticas
        'PLANILLERO': ['/planillero'],
        'ADMIN': ['/adm'],
        'CAJERO': ['/cajero'],
      };
      
      const rutasValidas = rutasValidasPorRol[usuario.rol] || [];
      const estaEnRutaValida = rutasValidas.some(ruta => pathname.startsWith(ruta));
      
      if (estaEnRutaValida) {
        return; // No redirigir, el usuario está en una ruta válida para su rol
      }
    }

    // Usar función centralizada para determinar ruta según estado
    const { ruta, paso } = determinarRutaRedireccion(usuario);

    // Si el paso no es COMPLETO, redirigir a la ruta correspondiente
    if (paso !== 'COMPLETO') {
      // Solo redirigir si no estamos ya en esa ruta (evitar loops)
      if (pathname !== ruta) {
        router.replace(ruta);
      }
      return;
    }

    // Si llegamos aquí, el usuario está completo (estado 'A') y puede acceder
  }, [usuario, isAuthenticated, pathname, router, isHydrated]);
};

