'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X } from 'lucide-react';
import { useTenant } from '@/app/contexts/TenantContext';

interface NavLink {
  name: string;
  href: string;
}

interface MobileMenuLandingProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: NavLink[];
}

export const MobileMenuLanding = ({ isOpen, onClose, navLinks }: MobileMenuLandingProps) => {
  const tenant = useTenant();
  
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

  return (
    <>
      {/* Backdrop/Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer/Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-[80%] max-w-sm bg-[var(--gray-500)] backdrop-blur-none z-[9999] shadow-2xl border-r border-white/10 transform transition-transform duration-300 ease-out md:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex flex-col h-full p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                onClose();
              }}
              className="focus:outline-none"
            >
              <Image
                src={tenant.branding.logo_principal}
                alt={tenant.nombre_empresa}
                width={40}
                height={40}
                className="h-10 w-auto"
              />
            </button>
            <button
              onClick={onClose}
              className="text-white hover:text-[var(--color-primary)] transition-colors p-2 rounded-full hover:bg-white/10"
              aria-label="Cerrar menú"
            >
              <X size={24} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto">
            <div className="flex flex-col gap-6">
              {navLinks.map((link, index) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-lg text-white hover:text-[var(--color-primary)] transition-colors font-medium border-b border-white/10 pb-2 animate-slide-in"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: 'both',
                  }}
                  onClick={onClose}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="/login"
                className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-strong)] text-white px-6 py-3 rounded-xl font-medium text-base w-full text-center mt-4 transition-all animate-slide-in"
                style={{
                  animationDelay: `${navLinks.length * 50}ms`,
                  animationFillMode: 'both',
                }}
                onClick={onClose}
              >
                Iniciar Sesión
              </Link>
            </div>
          </nav>
        </div>
      </div>

      {/* CSS para la animación slide-in */}
      <style jsx>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(20px);
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

