import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rutas públicas: todas las que están en (auth) y la raíz /
  const publicRoutes = [
    '/',
    '/login',
    '/registro',
    '/recuperar-password',
    '/reset-password',
    '/validar-dni',
    '/selfie',
  ];

  // Verificar si la ruta actual es pública
  const isPublicRoute = publicRoutes.some(route => {
    if (route === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(route);
  });

  // Si es ruta pública, permitir acceso
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Si no es ruta pública, verificar cookie de autenticación
  const authCookie = request.cookies.get('auth-token');
  
  // Si no hay cookie de auth, redirigir a login
  if (!authCookie) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Si hay cookie, permitir acceso (el cliente verificará el token real)
  return NextResponse.next();
}

// Configurar qué rutas deben ejecutar el middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

