'use client';
import { useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/app/stores/authStore';
import { determinarRutaRedireccion } from '@/app/utils/authRedirect';

type UserRole = 'ADMIN' | 'PLANILLERO' | 'USER' | 'CAJERO';

interface UseAuthOptions {
  requireAuth?: boolean;
  requireRole?: UserRole | UserRole[];
  redirectIfAuthenticated?: boolean;
}

export const useAuth = (options: UseAuthOptions | boolean = {}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { token, usuario, isAuthenticated, logout, isHydrated } = useAuthStore();

  // Compatibilidad con la API anterior: useAuth(true)
  const opts: UseAuthOptions = typeof options === 'boolean' 
    ? { requireAuth: options } 
    : options;

  const { requireAuth = false, requireRole, redirectIfAuthenticated = false } = opts;

  // 🏠 Obtener ruta home según rol del usuario
  const getHomeRoute = (userRole?: UserRole): string => {
    if (!userRole) return '/';
    
    switch (userRole) {
      case 'ADMIN':
        return '/adm/dashboard';
      case 'CAJERO':
        return '/cajero/dashboard';
      case 'PLANILLERO':
        return '/planillero';
      case 'USER':
      default:
        return '/home';
    }
  };

  // 🔐 Verificar si el usuario tiene el rol requerido
  const hasRequiredRole = useCallback((): boolean => {
    if (!requireRole || !usuario) return true;
    
    if (Array.isArray(requireRole)) {
      return requireRole.includes(usuario.rol);
    }
    
    return usuario.rol === requireRole;
  }, [requireRole, usuario]);

  // 🔒 Protección de rutas
  useEffect(() => {
    // Esperar a que el store termine de hidratarse desde localStorage
    // Esto evita redirecciones innecesarias durante la carga inicial
    if (!isHydrated) {
      return; // Esperar a que termine la hidratación
    }

    // Si requiere autenticación y no está autenticado → login
    if (requireAuth && !isAuthenticated) {
      router.replace('/login');
      return;
    }

    // Si requiere autenticación pero el usuario aún no está cargado, esperar
    // Esto evita redirecciones innecesarias durante la carga inicial desde localStorage
    if (requireAuth && isAuthenticated && !usuario) {
      return; // Esperar a que el usuario se cargue desde localStorage
    }

    // Si está autenticado pero no tiene el rol requerido → redirigir a su home
    // PERO solo si no estamos ya en una ruta válida del rol requerido
    if (requireAuth && isAuthenticated && usuario && requireRole && !hasRequiredRole()) {
      const homeRoute = getHomeRoute(usuario?.rol);
      
      // Verificar si estamos en una ruta válida para el rol del usuario antes de redirigir
      // Si el usuario es USER y está en rutas de USER, no redirigir
      const rutasValidasPorRol: Record<string, string[]> = {
        'USER': ['/home', '/planillero'], // /planillero cubre todas las subrutas como /planillero/estadisticas
        'PLANILLERO': ['/planillero'],
        'ADMIN': ['/adm'],
        'CAJERO': ['/cajero'],
      };
      
      const rutasValidas = rutasValidasPorRol[usuario.rol] || [];
      const estaEnRutaValida = rutasValidas.some(ruta => pathname.startsWith(ruta));
      
      // Solo redirigir si no estamos ya en una ruta válida para el rol del usuario
      if (!estaEnRutaValida && pathname !== homeRoute) {
        router.replace(homeRoute);
      }
      return;
    }

    // Si el usuario tiene el rol requerido y está en una ruta válida, no hacer nada
    // Esto previene redirecciones innecesarias al recargar la página
    if (requireAuth && isAuthenticated && usuario && requireRole && hasRequiredRole()) {
      // El usuario tiene el rol correcto, no redirigir
      return;
    }

    // Si está autenticado y estamos en rutas públicas de auth → redirigir
    // PERO solo si la cuenta está activada (no durante proceso de registro)
    if (redirectIfAuthenticated && isAuthenticated && usuario && usuario.cuenta_activada) {
      const authRoutes = ['/login', '/registro', '/recuperar-password', '/reset-password'];
      
      // Solo redirigir si estamos en una ruta de auth
      if (authRoutes.includes(pathname)) {
        // Usar función centralizada para determinar ruta según estado
        const { ruta, paso } = determinarRutaRedireccion(usuario);
        
        // Si el paso es VERIFICAR_EMAIL y estamos en /registro, NO redirigir (ya está en la ruta correcta)
        if (paso === 'VERIFICAR_EMAIL' && pathname === '/registro') {
          return; // No redirigir, el usuario necesita estar en /registro para verificar email
        }
        
        // Solo redirigir si la ruta es diferente a la actual
        if (ruta !== pathname) {
          router.replace(ruta);
        }
      }
    }
  }, [requireAuth, requireRole, redirectIfAuthenticated, isAuthenticated, usuario, router, pathname, hasRequiredRole, isHydrated]);

  // ✅ Helper para agregar el token al fetch
  const getAuthHeaders = () => ({
    Authorization: token ? `Bearer ${token}` : '',
  });

  // 🚪 Cerrar sesión y limpiar estado
  // Nota: Para un logout completo que limpie todos los stores y localStorage,
  // se debe usar useLogout() en lugar de este método
  const handleLogout = async () => {
    try {
      // Cerrar sesión en Firebase si es necesario
      const { authService } = await import('@/app/services/auth.services');
      await authService.cerrarSesion();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      // Limpiar estado local (solo authStore)
      // Para limpieza completa, usar useLogout() que limpia todos los stores
      logout();
      router.push('/login');
    }
  };

  // 🛡️ Helper para verificar roles
  const hasRole = (role: UserRole | UserRole[]): boolean => {
    if (!usuario) return false;
    
    if (Array.isArray(role)) {
      return role.includes(usuario.rol);
    }
    
    return usuario.rol === role;
  };

  // 🏠 Helper para navegar al home según rol
  const navigateToHome = () => {
    const homeRoute = getHomeRoute(usuario?.rol);
    router.push(homeRoute);
  };

  return {
    token,
    usuario,
    isAuthenticated,
    getAuthHeaders,
    logout: handleLogout,
    hasRole,
    navigateToHome,
    getHomeRoute,
  };
};
