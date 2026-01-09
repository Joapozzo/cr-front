'use client';

import { useState } from 'react';
import Link from 'next/link';
import { User as UserIcon, LogOut } from 'lucide-react';
import { useAuth } from '@/app/hooks/auth/useAuth';
import { AvatarPerfil } from '../perfil/AvatarPerfil';
import { ImagenPublica } from '../common/ImagenPublica';

export const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { usuario } = useAuth();

  if (!usuario) return null;

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Avatar Trigger */}
      <button
        className="rounded-full overflow-hidden p-1 hover:ring-2 hover:ring-[var(--color-primary)] transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:ring-offset-[var(--gray-500)]"
        aria-label="Menú de usuario"
      >
        <ImagenPublica
          src={usuario.img}
          alt={`Foto de ${usuario.nombre} ${usuario.apellido}`}
          width={40}
          height={40}
          className="rounded-full"
        />
      </button>

      {/* Puente invisible para mantener el hover */}
      <div className="absolute right-0 top-full w-full h-3" />

      {/* Dropdown Menu */}
      <div
        className={`absolute right-0 top-full mt-3 w-64 bg-[var(--gray-500)] rounded-lg shadow-2xl border border-[var(--gray-400)] overflow-hidden transform transition-all duration-200 origin-top-right ${isOpen
            ? 'opacity-100 scale-100 pointer-events-auto'
            : 'opacity-0 scale-95 pointer-events-none'
          }`}
      >
        {/* Header - Perfil del usuario */}
        <div className="relative bg-gradient-to-br from-[var(--gray-400)] to-[var(--gray-500)] p-4 border-b border-[var(--gray-400)]">
          <div className="flex items-center gap-3">
            <AvatarPerfil
              imagenUrl={usuario.img}
              nombre={usuario.nombre}
              size="sm"
              editable={false}
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold text-sm truncate">
                {usuario.nombre} {usuario.apellido}
              </h3>
              <p className="text-[var(--gray-200)] text-xs truncate">
                {usuario.email}
              </p>
            </div>
          </div>
          {/* Decoración - Línea verde */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent" />
        </div>

        {/* Menu Items */}
        <div className="py-2">
          <Link
            href="/perfil"
            className="flex items-center gap-3 px-4 py-2.5 text-white hover:bg-[var(--gray-400)] transition-colors duration-200 group"
          >
            <UserIcon className="w-4 h-4 text-[var(--gray-200)] group-hover:text-[var(--color-primary)] transition-colors duration-200" />
            <span className="font-medium text-sm">Ver perfil</span>
          </Link>

          <div className="border-t border-[var(--gray-400)] my-2" />

          <Link
            href="/logout"
            className="flex items-center gap-3 px-4 py-2.5 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 group"
          >
            <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
            <span className="font-semibold text-sm">Cerrar Sesión</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

