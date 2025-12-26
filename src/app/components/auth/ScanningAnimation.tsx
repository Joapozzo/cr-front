'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface ScanningAnimationProps {
  message?: string;
}

export const ScanningAnimation = ({ message = 'Escaneando DNI...' }: ScanningAnimationProps) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 3) return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center gap-6 py-12">
      {/* Animación de tarjeta siendo escaneada */}
      <div className="relative w-64 h-40 bg-gradient-to-br from-[var(--gray-400)] to-[var(--gray-500)] rounded-xl shadow-2xl border-2 border-[var(--green)]/30 overflow-hidden">
        {/* Efecto de barra de escaneo */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--green)] to-transparent animate-scan-line" />
        </div>
        
        {/* Líneas de tarjeta (simulando DNI) */}
        <div className="absolute inset-0 p-4 flex flex-col gap-2">
          <div className="h-3 bg-[var(--gray-300)]/30 rounded w-3/4 animate-pulse" />
          <div className="h-2 bg-[var(--gray-300)]/20 rounded w-1/2" />
          <div className="h-2 bg-[var(--gray-300)]/20 rounded w-2/3 mt-2" />
          <div className="h-2 bg-[var(--gray-300)]/20 rounded w-1/3" />
        </div>

        {/* Efecto de brillo que se mueve */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shine" />
      </div>

      {/* Indicador de carga */}
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--green)]" />
        <p className="text-sm text-[var(--gray-200)] font-medium">
          {message}{dots}
        </p>
        <p className="text-xs text-[var(--gray-300)] text-center px-4">
          Por favor espera, esto puede tardar unos segundos
        </p>
      </div>
    </div>
  );
};

