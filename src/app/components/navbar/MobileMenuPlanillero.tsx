'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { X, LogOut, ChevronRight, Home, Calendar, User } from 'lucide-react';
import { useAuth } from '@/app/hooks/auth/useAuth';
import { useLogout } from '@/app/hooks/auth/useLogout';
import { AvatarPerfil } from '../perfil/AvatarPerfil';

interface MobileMenuPlanilleroProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenuPlanillero = ({ isOpen, onClose }: MobileMenuPlanilleroProps) => {
  const { usuario } = useAuth();
  const { logout } = useLogout();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const menuItems = [
    { label: 'Inicio', href: '/planillero/home', icon: <Home className="w-5 h-5" /> },
    { label: 'Partidos', href: '/planillero/partidos', icon: <Calendar className="w-5 h-5" /> },
    { label: 'Perfil', href: '/planillero/perfil', icon: <User className="w-5 h-5" /> },
  ];

  // Prevenir scroll del body cuando el menú está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Cerrar con tecla Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    onClose();
    try {
      await logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      setIsLoggingOut(false);
    }
  };

  if (!usuario) return null;

  return (
    <>
      {/* Backdrop/Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[99999] transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer/Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-[85%] max-w-[320px] bg-[var(--gray-500)] z-[100000] shadow-2xl transform transition-transform duration-300 ease-out md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header - Perfil del usuario */}
          <div className="relative bg-gradient-to-br from-[var(--gray-400)] to-[var(--gray-500)] p-6 pb-6">
            {/* Botón cerrar */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-[var(--gray-300)]/50 hover:bg-[var(--gray-300)] transition-colors duration-200"
              aria-label="Cerrar menú"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Avatar y datos */}
            <div className="flex flex-row items-center gap-3 mt-2">
              <div className="flex-shrink-0">
                <AvatarPerfil
                  imagenUrl={usuario.img}
                  nombre={usuario.nombre}
                  size="md"
                  editable={false}
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-lg truncate">
                  {usuario.nombre} {usuario.apellido}
                </h3>
                <p className="text-[var(--gray-200)] text-sm mt-0.5 truncate">
                  {usuario.email}
                </p>
              </div>
            </div>

            {/* Decoración - Línea verde */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--green)] to-transparent" />
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            <ul className="space-y-1">
              {menuItems.map((item, index) => (
                <li
                  key={item.href}
                  className="animate-slide-in"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: 'both',
                  }}
                >
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-[var(--gray-400)] transition-all duration-200 group"
                  >
                    <div className="text-[var(--gray-200)] group-hover:text-[var(--green)] transition-colors duration-200">
                      {item.icon}
                    </div>
                    <span className="flex-1 font-medium">{item.label}</span>
                    <ChevronRight className="w-4 h-4 text-[var(--gray-300)] group-hover:text-[var(--green)] group-hover:translate-x-1 transition-all duration-200" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer - Logout */}
          <div className="border-t border-[var(--gray-400)] p-4">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center justify-center gap-3 w-full px-4 py-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-semibold">
                {isLoggingOut ? 'Cerrando sesión...' : 'Cerrar Sesión'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* CSS para la animación slide-in */}
      <style jsx>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

