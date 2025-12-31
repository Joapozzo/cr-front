// src/components/auth/AuthLayout.tsx
'use client';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { HiArrowLeft } from 'react-icons/hi';
import { useLogout } from '@/app/hooks/auth/useLogout';
import { useAuthStore } from '@/app/stores/authStore';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  infoTitle?: string;
  infoDescription?: string;
  showBackButton?: boolean;
  infoPosition?: 'left' | 'right';
  hideTitle?: boolean;
}

export const AuthLayout = ({
  children,
  title,
  subtitle,
  infoTitle,
  infoDescription,
  showBackButton = true,
  infoPosition = 'left',
  hideTitle = false,
}: AuthLayoutProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();
  const { logout } = useLogout();

  // Determinar la ruta de retorno según la página actual
  const getBackRoute = () => {
    if (pathname === '/login' || pathname === '/registro') {
      return '/'; // En login/registro vuelve al home
    }
    return '/login'; // En cualquier otra página de auth vuelve al login
  };

  const getBackLabel = () => {
    if (pathname === '/login' || pathname === '/registro') {
      return 'Volver al Home';
    }
    return 'Volver al Login';
  };

  // Manejar el click del botón volver
  const handleBackClick = async () => {
    const backRoute = getBackRoute();
    
    // Si estamos en rutas de validación (validar-dni, selfie) y el usuario está autenticado,
    // hacer logout antes de navegar al login
    if (
      (pathname === '/validar-dni' || pathname === '/selfie') &&
      backRoute === '/login' &&
      isAuthenticated
    ) {
      // Hacer logout y redirigir al login
      await logout();
      router.push('/login');
    } else {
      // Navegación normal
      router.push(backRoute);
    }
  };
  
  const InfoSection = () => (
    <div
      className="hidden lg:flex relative w-1/2 flex-col items-center justify-center px-24 bg-cover bg-center"
      style={{ backgroundImage: "url('/imagen_log.jpg')" }}
    >
      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-black/80 z-0" />

      {/* Logo arriba */}
      <div className="absolute top-12 left-12 z-10">
        <Image
          src="/logos/logotipo.png"
          alt="Copa Relámpago"
          width={275}
          height={60}
        />
      </div>

      {/* Badge y título al medio, alineados a la izquierda */}
      <div className="z-10 flex flex-col gap-4 items-start justify-center w-full pl-12">
        {/* Badge */}
        <span className="text-xs font-bold px-3 py-1 bg-[var(--green)] text-[var(--black)] uppercase">
          {infoTitle || 'novedades'}
        </span>

        {/* Título */}
        <h2 className="text-3xl font-normal max-w-md">
          {infoDescription || '¡Conocé la versión beta del nuevo sistema de CR!'}
        </h2>
      </div>
    </div>
  );

  const FormSection = () => {
    // Detectar si estamos en la página de validar-dni, selfie o registro para aplicar estilos especiales en mobile
    const isValidarDniPage = pathname === '/validar-dni';
    const isSelfiePage = pathname === '/selfie';
    const isRegistroPage = pathname === '/registro';
    
    return (
      <div className={`w-full lg:w-1/2 flex flex-col h-screen lg:h-auto lg:min-h-0 lg:justify-center relative overflow-hidden bg-[var(--gray-500)]`}>
        {/* Botón volver en la parte superior izquierda - Solo mobile, sobre la foto */}
        {showBackButton && !isValidarDniPage && !isSelfiePage && !isRegistroPage && (
          <button
            onClick={handleBackClick}
            className="lg:hidden absolute top-6 left-6 z-20 flex items-center gap-2 text-white hover:text-[var(--green)] transition-colors cursor-pointer w-fit"
          >
            <HiArrowLeft />
            <span className="text-xs">{getBackLabel()}</span>
          </button>
        )}

        {/* Fondo con imagen solo en mobile - NO para registro, validar-dni o selfie */}
        {!isValidarDniPage && !isSelfiePage && !isRegistroPage && (
          <>
            <div 
              className="lg:hidden absolute inset-0 bg-cover bg-top z-0"
              style={{ backgroundImage: "url('/imagen_log.jpg')" }}
            ></div>
            {/* Overlay oscuro móvil */}
            <div className="lg:hidden absolute inset-0 bg-black/80 z-0"></div>
          </>
        )}
        
        {/* Fondo móvil - estructura flex para ocupar espacio sobrante - NO para registro, validar-dni o selfie */}
        {!isValidarDniPage && !isSelfiePage && !isRegistroPage && (
          <div className="lg:hidden flex flex-col flex-1 min-h-0 z-0">
            {/* Logo centrado perfectamente en eje X */}
            <div className="flex items-center justify-center pt-32 pb-6 flex-shrink-0 w-full">
              <div className="flex items-center justify-center w-full">
                <Image src="/logos/isologo.png" alt="CR Logo" width={55} height={55} />
              </div>
            </div>
            {/* Espacio flexible que se expande para ocupar el espacio sobrante */}
            <div className="flex-1"></div>
          </div>
        )}

        {/* Contenido del formulario - con bordes redondeados superiores en mobile, posicionado sobre el fondo */}
        <div className={`w-full lg:max-w-xl lg:mx-auto flex flex-col ${isValidarDniPage || isSelfiePage ? 'h-full flex-1' : isRegistroPage ? 'h-full flex-1 lg:flex-none' : 'flex-shrink-0 lg:flex-none'} bg-[var(--gray-500)] lg:bg-[var(--gray-500)] z-10 relative ${isRegistroPage ? 'justify-center lg:justify-center' : (isValidarDniPage || isSelfiePage) ? 'justify-start lg:justify-start lg:overflow-hidden' : 'justify-start'} ${isValidarDniPage || isSelfiePage || isRegistroPage ? 'rounded-none' : 'rounded-t-[30px] lg:rounded-none'} px-6 ${(isValidarDniPage || isSelfiePage) && showBackButton ? 'pt-20 lg:pt-12' : 'pt-4 lg:pt-8'} pb-4 lg:px-16 lg:pb-8 overflow-y-auto lg:overflow-hidden`}>
          {/* Botón volver (Desktop y Mobile para registro/validar-dni/selfie) */}
          {showBackButton && (isValidarDniPage || isSelfiePage || isRegistroPage) && (
            <button
              onClick={handleBackClick}
              className={`flex items-center gap-2 text-[var(--gray-200)] hover:text-[var(--green)] transition-colors cursor-pointer w-fit flex-shrink-0 absolute top-6 left-6 lg:relative lg:top-0 lg:left-0 ${isRegistroPage ? 'mb-0 lg:mb-4' : 'mb-4 lg:mb-0'}`}
            >
              <HiArrowLeft />
              <span className="text-xs">{getBackLabel()}</span>
            </button>
          )}
          {/* Botón volver Desktop para login */}
          {showBackButton && !isValidarDniPage && !isSelfiePage && !isRegistroPage && (
            <button
              onClick={handleBackClick}
              className="hidden lg:flex items-center gap-2 text-[var(--gray-200)] hover:text-[var(--green)] transition-colors cursor-pointer w-fit mb-1 lg:mb-0 flex-shrink-0"
            >
              <HiArrowLeft />
              <span className="text-xs">{getBackLabel()}</span>
            </button>
          )}

          {/* Contenedor centrado verticalmente en mobile para registro */}
          {isRegistroPage ? (
            <div className="flex-1 flex flex-col justify-center lg:justify-start">
              {/* Logo - Mobile para registro, Desktop siempre */}
              <div className="lg:hidden flex justify-center flex-shrink-0 mb-5">
                <Image src="/logos/isologo.png" alt="CR Logo" width={70} height={70} />
              </div>
              <div className="hidden lg:flex justify-center flex-shrink-0 mb-4">
                <Image src="/logos/isologo.png" alt="CR Logo" width={78} height={78} />
              </div>

              {/* Título */}
              {!hideTitle && (
                <div className="flex flex-col gap-1 lg:gap-2 flex-shrink-0 mb-4 lg:mb-5 items-start">
                  <h1 className="text-lg lg:text-xl font-medium">{title}</h1>
                  {subtitle && <p className="text-xs lg:text-sm text-[var(--gray-200)]">{subtitle}</p>}
                </div>
              )}

              {/* Contenido del formulario */}
              <div className="flex-shrink-0">
                {children}
              </div>
            </div>
          ) : (
            <>
              {/* Logo (Desktop) */}
              <div className="hidden lg:flex justify-center flex-shrink-0 mb-4">
                <Image src="/logos/isologo.png" alt="CR Logo" width={78} height={78} />
              </div>

              {/* Título */}
              {!hideTitle && (
                <div className="flex flex-col gap-1 lg:gap-2 flex-shrink-0 mb-4 lg:mb-5 items-start">
                  <h1 className="text-lg lg:text-xl font-medium">{title}</h1>
                  {subtitle && <p className="text-xs lg:text-sm text-[var(--gray-200)]">{subtitle}</p>}
                </div>
              )}

              {/* Contenido del formulario */}
              <div className="flex-shrink-0">
                {children}
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex w-full h-screen lg:h-screen lg:overflow-hidden">
      {infoPosition === 'left' ? (
        <>
          <InfoSection />
          <FormSection />
        </>
      ) : (
        <>
          <FormSection />
          <InfoSection />
        </>
      )}
    </div>
  );
};