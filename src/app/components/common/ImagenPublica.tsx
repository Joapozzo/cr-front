'use client';

import { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { URI_IMG } from '@/app/components/ui/utils';
import Image from 'next/image';
import { obtenerToken } from '@/app/services/auth.services';

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
 * Para URLs firmadas (privadas), convierte a blob URL usando fetch con autenticación
 */
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
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  // Construir la URL completa si hay src
  const imgUrl = src ? (src.startsWith('http') ? src : `${URI_IMG}${src}`) : null;
  
  // Detectar si es una URL firmada (requiere autenticación)
  const isSecureUrl = imgUrl?.includes('/api/images/secure');

  // Para URLs firmadas, convertir a blob URL usando fetch con autenticación
  useEffect(() => {
    if (!isSecureUrl || !imgUrl) {
      setLoading(false);
      return;
    }

    let objectUrl: string | null = null;

    const loadSecureImage = async () => {
      try {
        const token = await obtenerToken();
        if (!token) {
          setError(true);
          setLoading(false);
          return;
        }

        const response = await fetch(imgUrl!, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          setError(true);
          setLoading(false);
          return;
        }

        const blob = await response.blob();
        objectUrl = URL.createObjectURL(blob);
        setBlobUrl(objectUrl);
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar imagen segura:', err);
        setError(true);
        setLoading(false);
      }
    };

    loadSecureImage();

    // Cleanup: revocar el objeto URL cuando el componente se desmonte o cambie la URL
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [isSecureUrl, imgUrl]);

  // Si no hay src o hubo error, mostrar fallback
  if (!imgUrl || error) {
    return (
      <div
        className={`flex items-center justify-center bg-[var(--gray-400)] text-[var(--gray-200)] ${className}`}
        style={{ width, height }}
      >
        {fallbackIcon || <User size={24} />}
      </div>
    );
  }

  // Si es una URL firmada, usar blob URL con <img> nativo
  if (isSecureUrl) {
    if (!blobUrl) {
      return (
        <div className={`relative ${width || height ? '' : 'w-full h-full'}`} style={{ width, height }}>
          <div
            className={`absolute inset-0 animate-pulse bg-[var(--gray-400)] ${className}`}
          />
        </div>
      );
    }

    return (
      <div className={`relative ${width || height ? '' : 'w-full h-full'}`} style={{ width, height }}>
        {/* Imagen desde blob URL */}
        <Image
          src={blobUrl}
          alt={alt}
          className={`${className} ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300 object-cover`}
          style={{ width: '100%', height: '100%' }}
          onLoad={() => setLoading(false)}
          onError={() => {
            setError(true);
            setLoading(false);
          }}
        />
      </div>
    );
  }

  // Para URLs públicas, usar Next.js Image (con optimización)
  return (
    <div className={`relative ${width || height ? '' : 'w-full h-full'}`} style={{ width, height }}>
      {/* Skeleton loader */}
      {loading && (
        <div
          className={`absolute inset-0 animate-pulse bg-[var(--gray-400)] ${className}`}
        />
      )}

      {/* Imagen */}
      <Image
        src={imgUrl}
        alt={alt}
        fill
        className={`${className} ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300 object-cover`}
        onLoad={() => setLoading(false)}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
        unoptimized={false}
      />
    </div>
  );
};

