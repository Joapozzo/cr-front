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

import Image from 'next/image';

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
  // Si se especifican width/height explícitamente, respetarlos (incluso si son menores a 32px)
  // Solo aplicar mínimo de 32px si no se especifica ningún tamaño
  const baseWidth = size || width;
  const baseHeight = size || height;
  const finalWidth = baseWidth !== undefined ? baseWidth : 32;
  const finalHeight = baseHeight !== undefined ? baseHeight : 32;

  // Construir la URL completa si hay src
  const imgUrl = src ? (src.startsWith('http') ? src : `${URI_IMG}${src}`) : null;

  // Calcular tamaño del icono Shield para el fallback
  const shieldSize = Math.min(finalWidth, finalHeight) * 0.5;

  // Determinar si debe ser redondeado (por defecto sí, a menos que se especifique rounded-none)
  const isRounded = !className.includes('rounded-none');
  const roundedClass = isRounded ? 'rounded-full' : '';

  // Si no hay src o hubo error, mostrar fallback
  if (!imgUrl || error) {
    return (
      <div
        className={`flex items-center justify-center bg-[var(--gray-300)] text-[var(--gray-100)] ${roundedClass} ${className}`}
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
      className={`relative flex items-center justify-center ${roundedClass}`}
      style={{ width: finalWidth, height: finalHeight }}
    >
      {/* Skeleton loader */}
      {loading && (
        <div
          className={`absolute inset-0 animate-pulse bg-[var(--gray-400)] ${roundedClass}`}
        />
      )}

      {/* Imagen - object-contain para mostrar el escudo completo sin recortar */}
      <Image
        src={imgUrl}
        alt={alt}
        fill
        className={`${className} ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300 object-contain`}
        onLoad={() => setLoading(false)}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
      />
    </div>
  );
};

