'use client';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { HiArrowLeft } from 'react-icons/hi';
import { useTenant } from '@/app/contexts/TenantContext';

interface FormSectionProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  hideTitle?: boolean;
  backLabel: string;
  handleBackClick: () => void;
}

export const FormSection = ({
  children,
  title,
  subtitle,
  showBackButton = true,
  hideTitle = false,
  backLabel,
  handleBackClick,
}: FormSectionProps) => {
  const pathname = usePathname();
  const tenant = useTenant();

  // Detectar si estamos en la página de registro o login para aplicar estilos especiales en mobile
  const isRegistroPage = pathname === '/registro';
  const isLoginPage = pathname === '/login';

  // Determine overlapping exclusions (pages that should NOT show the mobile background image)
  const isFullPageMobile = isRegistroPage || isLoginPage;

  return (
    <div className="w-full lg:w-1/2 flex flex-col h-screen lg:h-auto lg:min-h-0 lg:justify-center relative overflow-hidden bg-[var(--gray-500)]">
      {/* Botón volver en la parte superior izquierda - Solo mobile, sobre la foto */}
      {showBackButton && !isFullPageMobile && (
        <button
          onClick={handleBackClick}
          className="lg:hidden absolute top-6 left-6 z-20 flex items-center gap-2 text-white hover:text-[var(--color-primary)] transition-colors cursor-pointer w-fit"
        >
          <HiArrowLeft />
          <span className="text-xs">{backLabel}</span>
        </button>
      )}

      {/* Fondo con imagen solo en mobile - NO para registro o LOGIN */}
      {!isFullPageMobile && (
        <>
          <div
            className="lg:hidden absolute inset-0 bg-cover bg-top z-0"
            style={{ backgroundImage: "url('/imagen_log.jpg')" }}
          ></div>
          {/* Overlay oscuro móvil */}
          <div className="lg:hidden absolute inset-0 bg-black/80 z-0"></div>
        </>
      )}

      {/* Fondo móvil con Logo Header - NO para registro o LOGIN */}
      {!isFullPageMobile && (
        <div className="lg:hidden flex flex-col flex-1 min-h-0 z-0">
          {/* Logo centrado perfectamente en eje X */}
          <div className="flex items-center justify-center pt-32 pb-6 flex-shrink-0 w-full">
            <div className="flex items-center justify-center w-full">
              <Image src={tenant.branding.logo_principal} alt={tenant.nombre_empresa} width={55} height={55} />
            </div>
          </div>
          {/* Espacio flexible que se expande para ocupar el espacio sobrante */}
          <div className="flex-1"></div>
        </div>
      )}

      {/* Contenido del formulario - 
          Modified logic: if isLoginPage or isRegistroPage, behave like full page (centered, no rounded top) 
      */}
      <div className={`
          w-full flex flex-col 
          ${isFullPageMobile ? 'h-full flex-1' : 'flex-shrink-0 lg:flex-none'} 
          bg-[var(--gray-500)] lg:bg-[var(--gray-500)] z-10 relative 
          ${isRegistroPage || isLoginPage ? 'justify-center lg:justify-center' : 'justify-start'} 
          ${isFullPageMobile ? 'rounded-none' : 'rounded-t-[30px] lg:rounded-none'} 
          ${isLoginPage ? 'px-8' : (isRegistroPage ? 'px-8 lg:px-20' : 'px-6 lg:px-16')}
          ${(isLoginPage || isRegistroPage) ? 'pt-6' : 'pt-4 lg:pt-8'} 
          ${(isLoginPage || isRegistroPage) ? 'pb-8 lg:pb-12' : 'pb-4 lg:pb-8'} overflow-y-auto lg:overflow-hidden
      `}>
        {/* Contenedor centrado verticalmente - Login y Register idénticos */}
        {(isLoginPage || isRegistroPage) ? (
          <div className={`flex-1 flex flex-col justify-center lg:justify-center ${isLoginPage ? 'lg:max-w-md' : 'lg:max-w-lg'} lg:mx-auto w-full`}>
            {/* Botón volver Mobile y Desktop para Login y Register */}
            {showBackButton && (
              <div className={`w-full lg:w-auto flex-shrink-0 ${isRegistroPage || isLoginPage ? 'mb-8 lg:mb-4' : 'mb-4'}`}>
                <button
                  onClick={handleBackClick}
                  className="flex items-center gap-2 text-[var(--gray-200)] hover:text-[var(--color-primary)] transition-colors cursor-pointer w-fit"
                >
                  <HiArrowLeft />
                  <span className="text-xs">{backLabel}</span>
                </button>
              </div>
            )}

            {/* Logo - Mobile centrado, Desktop alineado a izquierda */}
            <div className="flex justify-center lg:justify-start flex-shrink-0 mb-4 lg:mb-4">
              <Image src={tenant.branding.logo_principal} alt={tenant.nombre_empresa} width={78} height={78} />
            </div>

            {/* Título - Centrado en mobile, izquierda en desktop */}
            {!hideTitle && (
              <div className="flex flex-col gap-1 lg:gap-2 flex-shrink-0 mb-4 lg:mb-5 items-center lg:items-start">
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
          <div className="lg:max-w-xl lg:mx-auto w-full">
            {/* Botón volver Desktop para otras páginas (standard view) */}
            {showBackButton && !isFullPageMobile && (
              <button
                onClick={handleBackClick}
                className="hidden lg:flex items-center gap-2 text-[var(--gray-200)] hover:text-[var(--color-primary)] transition-colors cursor-pointer w-fit mb-1 lg:mb-0 flex-shrink-0"
              >
                <HiArrowLeft />
                <span className="text-xs">{backLabel}</span>
              </button>
            )}

            {/* Logo (Desktop usually, but also Mobile for Login now) */}
            <div className={`${isLoginPage ? 'flex' : 'hidden lg:flex'} justify-start flex-shrink-0 mb-4`}>
              <Image src={tenant.branding.logo_principal} alt={tenant.nombre_empresa} width={78} height={78} />
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
        )}
      </div>
    </div>
  );
};

