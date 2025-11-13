'use client';

import { Shield } from 'lucide-react';
import { ImagenPublica } from '../common/ImagenPublica';

interface EdicionLayoutProps {
  nombreEdicion: string;
  temporada?: string | number;
  nombreCategoria?: string;
  logoEdicion?: string;
  loading?: boolean;
  children: React.ReactNode;
}

/**
 * Layout compartido para páginas que muestran datos por edición
 * Incluye header con logo y nombre de edición/categoría
 */
export const EdicionLayout: React.FC<EdicionLayoutProps> = ({
  nombreEdicion,
  temporada,
  nombreCategoria,
  logoEdicion,
  loading = false,
  children
}) => {
  if (loading) {
    return (
      <div className="space-y-6 w-full">
        {/* Header skeleton */}
        <div className="flex items-center gap-3 p-4 bg-[var(--black-900)] rounded-xl border border-[#262626]">
          <div className="w-10 h-10 bg-[var(--black-800)] rounded-full animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-5 w-48 bg-[var(--black-800)] rounded animate-pulse" />
            <div className="h-4 w-32 bg-[var(--black-800)] rounded animate-pulse" />
          </div>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      {/* Header con edición y categoría */}
      <div className="flex items-center gap-3 p-4 bg-[var(--black-900)] rounded-xl border border-[#262626]">
        <div className="w-10 h-10 bg-[var(--green)] rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
          {logoEdicion ? (
            <ImagenPublica
              src={logoEdicion}
              alt={nombreEdicion}
              width={40}
              height={40}
              fallbackIcon="Shield"
            />
          ) : (
            <Shield size={20} className="text-white" />
          )}
        </div>
        <div>
          <p className="text-white font-semibold text-sm">
            {nombreEdicion} {temporada && `- ${temporada}`}
          </p>
          {nombreCategoria && (
            <p className="text-xs text-[#737373]">{nombreCategoria}</p>
          )}
        </div>
      </div>

      {/* Contenido */}
      {children}
    </div>
  );
};

