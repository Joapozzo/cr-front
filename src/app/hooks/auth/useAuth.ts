'use client';
import { useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/app/stores/authStore';

type UserRole = 'ADMIN' | 'PLANILLERO' | 'USER';

interface UseAuthOptions {
  requireAuth?: boolean;
  requireRole?: UserRole | UserRole[];
  redirectIfAuthenticated?: boolean;
}

export const useAuth = (options: UseAuthOptions | boolean = {}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { token, usuario, isAuthenticated, logout } = useAuthStore();

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
    // Si requiere autenticación y no está autenticado → login
    if (requireAuth && !isAuthenticated) {
      router.replace('/login');
      return;
    }

    // Si está autenticado pero no tiene el rol requerido → redirigir a su home
    if (requireAuth && isAuthenticated && requireRole && !hasRequiredRole()) {
      const homeRoute = getHomeRoute(usuario?.rol);
      router.replace(homeRoute);
      return;
    }

    // Si está autenticado y estamos en rutas públicas de auth → redirigir
    if (redirectIfAuthenticated && isAuthenticated && usuario) {
      const authRoutes = ['/login', '/registro', '/recuperar-password', '/reset-password'];
      
      // Solo redirigir si estamos en una ruta de auth
      if (authRoutes.includes(pathname)) {
        // Redirigir siempre que esté autenticado (estado 'A' o 'S')
        // Si el usuario está en proceso de registro, el LoginForm ya lo manejará antes
        // de que llegue a esta verificación porque el login completo requiere cuenta activada
        const homeRoute = getHomeRoute(usuario.rol);
        router.replace(homeRoute);
      }
    }
  }, [requireAuth, requireRole, redirectIfAuthenticated, isAuthenticated, usuario, router, pathname, hasRequiredRole]);

  // ✅ Helper para agregar el token al fetch
  const getAuthHeaders = () => ({
    Authorization: token ? `Bearer ${token}` : '',
  });

  // 🚪 Cerrar sesión y limpiar estado
  const handleLogout = async () => {
    try {
      // Cerrar sesión en Firebase si es necesario
      const { authService } = await import('@/app/services/auth.services');
      await authService.cerrarSesion();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      // Limpiar estado local
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
