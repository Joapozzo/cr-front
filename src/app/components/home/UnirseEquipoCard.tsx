'use client';

import Link from 'next/link';
import { Users, ArrowRight } from 'lucide-react';

export const UnirseEquipoCard = () => {
  return (
    <div className="relative bg-gradient-to-br from-[var(--gray-500)] via-[var(--gray-400)] to-[var(--gray-500)] rounded-2xl overflow-hidden border border-[var(--gray-400)] p-6 md:p-8">
      {/* Decoración de fondo - Círculos */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--green)]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-[var(--green)]/5 rounded-full blur-3xl" />
      
      {/* Contenido */}
      <div className="relative z-10 flex flex-col items-center text-center gap-5">
        
        {/* Icono principal con animación */}
        <div className="relative">
          <div className="absolute inset-0 bg-[var(--green)]/20 rounded-full animate-ping" />
          <div className="relative bg-gradient-to-br from-[var(--green)] to-[var(--green)]/80 p-4 rounded-full shadow-lg">
            <Users className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Título y descripción */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <h3 className="text-xl md:text-2xl font-bold text-white">
              ¿No tenés equipo?
            </h3>
            {/* <Sparkles className="w-5 h-5 text-[var(--green)] animate-pulse" /> */}
          </div>
          
          <p className="text-[var(--gray-200)] text-sm md:text-base max-w-md">
            Unite ahora y sé parte de la experiencia Copa Relámpago
          </p>
        </div>

        {/* CTA Button */}
        <Link
          href="/perfil/solicitudes"
          className="group relative w-full max-w-xs"
        >
          <div className="absolute inset-0 bg-[var(--green)] rounded-lg blur-sm opacity-50 group-hover:opacity-75 transition-opacity" />
          
          <button className="relative w-full bg-[var(--green)] hover:bg-[var(--green)]/90 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg group-hover:scale-105 group-hover:shadow-xl">
            Unirme a un equipo
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </Link>

        {/* Info adicional */}
        <p className="text-xs text-[var(--gray-300)]">
          Buscá equipos o esperá invitaciones de capitanes
        </p>
      </div>

      {/* Línea decorativa inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--green)] to-transparent opacity-50" />
    </div>
  );
};

