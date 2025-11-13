// src/components/auth/AuthLayout.tsx
'use client';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { HiArrowLeft } from 'react-icons/hi';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  infoTitle?: string;
  infoDescription?: string;
  showBackButton?: boolean;
  infoPosition?: 'left' | 'right';
}

export const AuthLayout = ({
  children,
  title,
  subtitle,
  infoTitle,
  infoDescription,
  showBackButton = true,
  infoPosition = 'left',
}: AuthLayoutProps) => {
  const router = useRouter();
  const pathname = usePathname();

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
  const InfoSection = () => (
    <div
      className="hidden lg:flex relative w-1/2 flex-col items-start justify-center gap-4 px-24 bg-cover bg-center"
      style={{ backgroundImage: "url('/imagen_log.png')" }}
    >
      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-black/80 z-0" />

      {/* Logo */}
      <Image
        src="/logos/isologo.png"
        alt="Copa Relámpago"
        width={275}
        height={60}
        className="absolute top-12 left-12 z-10"
      />

      {/* Contenido */}
      <span className="z-10 text-xs font-bold px-3 py-1 bg-[var(--green)] text-[var(--black)] uppercase">
        {infoTitle || 'novedades'}
      </span>
      <h2 className="z-10 text-3xl font-normal max-w-md">
        {infoDescription || '¡Conocé la versión beta del nuevo sistema de CR!'}
      </h2>
    </div>
  );

  const FormSection = () => (
    <div className="w-full lg:w-1/2 flex flex-col items-center justify-start lg:justify-center px-6 py-8 lg:px-24 bg-[var(--gray-500)] relative min-h-screen lg:min-h-0">
      {/* Header móvil */}
      <div
        className="lg:hidden absolute top-0 left-0 w-full h-[30vh] bg-cover bg-center"
        style={{ backgroundImage: "url('/imagen_log.png')" }}
      >
        <div className="absolute inset-0 bg-black/80" />
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <Image src="/logos/isologo.png" alt="CR Logo" width={60} height={60} />
        </div>
      </div>

      {/* Contenido del formulario */}
      <div className="w-full max-w-md flex flex-col gap-6 mt-[32vh] lg:mt-0 bg-[var(--gray-500)] rounded-t-[30px] lg:rounded-none p-6 lg:p-0 z-10">
        {/* Botón volver (Mobile y Desktop) */}
        {showBackButton && (
          <button
            onClick={() => router.push(getBackRoute())}
            className="flex items-center gap-2 text-[var(--gray-200)] hover:text-[var(--green)] transition-colors cursor-pointer w-fit"
          >
            <HiArrowLeft />
            <span className="text-xs">{getBackLabel()}</span>
          </button>
        )}

        {/* Logo (Desktop) */}
        <div className="hidden lg:flex justify-center">
          <Image src="/logos/isologo.png" alt="CR Logo" width={78} height={78} />
        </div>

        {/* Título */}
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-medium">{title}</h1>
          {subtitle && <p className="text-sm text-[var(--gray-200)]">{subtitle}</p>}
        </div>

        {/* Contenido del formulario */}
        {children}
      </div>
    </div>
  );

  return (
    <div className="flex w-full min-h-screen">
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