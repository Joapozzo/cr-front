'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTenant } from '@/app/contexts/TenantContext';

interface InfoSectionProps {
  infoTitle?: string;
  infoDescription?: string;
}

export const InfoSection = ({
  infoTitle,
  infoDescription,
}: InfoSectionProps) => {
  const tenant = useTenant();
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';
  
  return (
    <div
      className={`hidden lg:flex relative ${isLoginPage ? 'w-[40%]' : 'w-1/2'} flex-col items-center justify-center bg-cover bg-center`}
      style={{ backgroundImage: `url('${tenant.imagenes.login}')` }}
    >
      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-black/80 z-0" />

      {/* Logo arriba */}
      <div className="absolute top-12 left-16 z-10">
        <Image
          src={tenant.branding.logo_principal}
          alt={tenant.nombre_empresa}
          width={180}
          height={40}
          className="h-auto"
        />
      </div>

      {/* Badge y título al medio, alineados a la izquierda */}
      <div className="z-10 flex flex-col gap-4 items-start justify-center w-full">
        <div className="w-full pl-16">
          {/* Badge */}
          <span className="text-xs font-bold px-3 py-1 bg-[var(--color-primary)] text-[var(--black)] uppercase">
            {infoTitle || 'novedades'}
          </span>

          {/* Título */}
          <h2 className="text-3xl font-normal max-w-md">
            {infoDescription || '¡Conocé la versión beta del nuevo sistema de CR!'}
          </h2>
        </div>
      </div>
    </div>
  );
};

