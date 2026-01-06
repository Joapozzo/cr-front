'use client';

import { Shield } from 'lucide-react';
import Image from 'next/image';
import { useTenant } from '@/app/contexts/TenantContext';

interface EdicionHeaderProps {
  nombreEdicion?: string;
  logoEdicion?: string | null;
  nombreCategoria?: string;
  loading?: boolean;
}

/**
 * Header que muestra el logo y nombre de la edición actual
 * Se muestra arriba de las secciones de estadísticas
 */
export const EdicionHeader: React.FC<EdicionHeaderProps> = ({
  nombreEdicion,
  logoEdicion,
  nombreCategoria,
  loading = false
}) => {
  const tenant = useTenant();
  const finalNombreEdicion = nombreEdicion || tenant.nombre_empresa;
  
  if (loading) {
    return (
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-[var(--black-800)] rounded-full animate-pulse" />
        <div className="space-y-2">
          <div className="h-6 bg-[var(--black-800)] rounded w-48 animate-pulse" />
          <div className="h-4 bg-[var(--black-800)] rounded w-32 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 mb-6">
      {/* Logo de la edición */}
      <div className="w-16 h-16 bg-[var(--black-800)] rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden border border-[#262626]">
        {logoEdicion ? (
          <Image 
            src={logoEdicion} 
            alt={finalNombreEdicion}
            width={64}
            height={64}
            className="object-cover"
          />
        ) : (
          <Shield className="text-[var(--color-primary)]" size={32} />
        )}
      </div>

      {/* Nombre de la edición */}
      <div>
        <h1 className="text-white font-bold text-2xl">{finalNombreEdicion}</h1>
        {nombreCategoria && (
          <p className="text-[#737373] text-sm mt-1">{nombreCategoria}</p>
        )}
      </div>
    </div>
  );
};

