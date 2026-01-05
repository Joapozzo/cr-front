'use client';

import Link from 'next/link';
import { Home, Search } from 'lucide-react';
import { Button } from './components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen w-full bg-[#101011] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Error Code */}
        <div className="space-y-4">
          <h1 className="text-8xl md:text-9xl font-bold text-[#2AD174] leading-none">
            404
          </h1>
          <div className="w-24 h-1 bg-[#2AD174] mx-auto rounded-full"></div>
        </div>

        {/* Message */}
        <div className="space-y-3">
          <h2 className="text-2xl md:text-3xl font-semibold text-white">
            Página no encontrada
          </h2>
          <p className="text-[#65656B] text-base md:text-lg">
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 w-full">
          <Link href="/" className="w-full flex items-center justify-center">
            <Button variant="footer" size="lg" className="w-full sm:w-auto">
              <Home className="w-4 h-4 mr-2" />
              Volver al inicio
            </Button>
          </Link>
          <div className="w-full flex items-center justify-center">
            <Button
              variant="default"
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => window.history.back()}
            >
              <Search className="w-4 h-4 mr-2" />
              Volver atrás
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

