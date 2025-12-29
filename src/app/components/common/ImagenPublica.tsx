'use client';

import { useState } from 'react';
import { User } from 'lucide-react';

interface ImagenPublicaProps {
  src?: string | null;
  alt: string;
  className?: string;
  fallbackIcon?: React.ReactNode;
  width?: number;
  height?: number;
}

/**
 * Componente para renderizar imágenes públicas con fallback
 * Maneja errores de carga y muestra un placeholder si no hay imagen
 */
import Image from 'next/image';

export const ImagenPublica = ({
  src,
  alt,
  className = '',
  fallbackIcon,
  width,
  height,
}: ImagenPublicaProps) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Si no hay src o hubo error, mostrar fallback
  if (!src || error) {
    return (
      <div
        className={`flex items-center justify-center bg-[var(--gray-400)] text-[var(--gray-200)] ${className}`}
        style={{ width, height }}
      >
        {fallbackIcon || <User size={24} />}
      </div>
    );
  }

  return (
    <div className="relative" style={{ width, height }}>
      {/* Skeleton loader */}
      {loading && (
        <div
          className={`absolute inset-0 animate-pulse bg-[var(--gray-400)] ${className}`}
        />
      )}

      {/* Imagen */}
      <Image
        src={src}
        alt={alt}
        fill
        className={`${className} ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300 object-cover`}
        onLoad={() => setLoading(false)}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
      />
    </div>
  );
};

