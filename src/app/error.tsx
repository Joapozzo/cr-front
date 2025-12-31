'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Home, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from './components/ui/Button';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error:', error);
    }
  }, [error]);

  return (
    <div className="min-h-screen w-full bg-[#101011] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Error Icon */}
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-[#2AD174]/20 flex items-center justify-center">
              <AlertCircle className="w-12 h-12 md:w-14 md:h-14 text-[#2AD174]" />
            </div>
          </div>
          <div className="w-24 h-1 bg-[#2AD174] mx-auto rounded-full"></div>
        </div>

        {/* Message */}
        <div className="space-y-3">
          <h2 className="text-2xl md:text-3xl font-semibold text-white">
            Algo salió mal
          </h2>
          <p className="text-[#65656B] text-base md:text-lg">
            Ocurrió un error inesperado. Por favor, intenta nuevamente.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 w-full">
          <Button 
            variant="footer" 
            size="lg" 
            className="w-full sm:w-auto flex-1"
            onClick={reset}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Intentar de nuevo
          </Button>
          <Link href="/" className="w-full sm:w-auto flex-1">
            <Button variant="default" size="lg" className="w-full sm:w-auto flex-1">
              <Home className="w-4 h-4 mr-2" />
              Volver al inicio
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

