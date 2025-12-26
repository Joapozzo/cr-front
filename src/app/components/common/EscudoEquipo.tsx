'use client';

import { useState } from 'react';
import { Shield } from 'lucide-react';
import { URI_IMG } from '@/app/components/ui/utils';

interface EscudoEquipoProps {
  src?: string | null;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  size?: number; // Tamaño único para width y height
}

export const EscudoEquipo = ({
  src,
  alt,
  className = '',
  width,
  height,
  size,
}: EscudoEquipoProps) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Usar size si está definido, sino usar width y height, o valores por defecto
  // Aumentar tamaño mínimo para evitar pixelación (mínimo 32px)
  const baseWidth = size || width || 32;
  const baseHeight = size || height || 32;
  const finalWidth = Math.max(baseWidth, 32);
  const finalHeight = Math.max(baseHeight, 32);

  // Construir la URL completa si hay src
  const imgUrl = src ? (src.startsWith('http') ? src : `${URI_IMG}${src}`) : null;

  // Calcular tamaño del icono Shield para el fallback
  const shieldSize = Math.min(finalWidth, finalHeight) * 0.5;

  // Si no hay src o hubo error, mostrar fallback
  if (!imgUrl || error) {
    return (
      <div
        className={`flex items-center justify-center bg-[var(--gray-300)] text-[var(--gray-100)] rounded-full ${className}`}
        style={{ width: finalWidth, height: finalHeight }}
      >
        <Shield 
          size={shieldSize} 
          className="text-[var(--gray-200)]"
        />
      </div>
    );
  }

  return (
    <div 
      className="relative flex items-center justify-center" 
      style={{ width: finalWidth, height: finalHeight }}
    >
      {/* Skeleton loader */}
      {loading && (
        <div
          className={`absolute inset-0 animate-pulse bg-[var(--gray-400)] rounded-full ${className}`}
        />
      )}

      {/* Imagen - object-contain para mostrar el escudo completo sin recortar */}
      <img
        src={imgUrl}
        alt={alt}
        className={`${className} ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300 object-contain`}
        onLoad={() => setLoading(false)}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
        style={{ 
          width: '100%', 
          height: '100%',
          maxWidth: finalWidth,
          maxHeight: finalHeight
        }}
      />
    </div>
  );
};

