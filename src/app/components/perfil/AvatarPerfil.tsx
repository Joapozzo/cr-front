'use client';

import { useState } from 'react';
import { Camera, User } from 'lucide-react';
import { CambiarFotoModal } from './CambiarFotoModal';
import { ImagenPublica } from '@/app/components/common/ImagenPublica';

interface AvatarPerfilProps {
  imagenUrl?: string | null;
  nombre?: string;
  editable?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'w-12 h-12',
  md: 'w-24 h-24',
  lg: 'w-32 h-32',
  xl: 'w-48 h-48',
};

const iconSizes = {
  sm: 16,
  md: 32,
  lg: 48,
  xl: 64,
};

const cameraButtonSizes = {
  sm: 'w-6 h-6',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-14 h-14',
};

const cameraIconSizes = {
  sm: 12,
  md: 18,
  lg: 20,
  xl: 24,
};

/**
 * Avatar de perfil con opción para cambiar foto
 */
export const AvatarPerfil = ({
  imagenUrl,
  nombre = 'Usuario',
  editable = false,
  size = 'lg',
}: AvatarPerfilProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="relative inline-block">
        {/* Avatar */}
        <div className={`${sizeClasses[size]} rounded-full overflow-hidden border-4 border-[var(--gray-300)] bg-[var(--gray-400)] relative`}>
          <ImagenPublica
            src={imagenUrl}
            alt={`Avatar de ${nombre}`}
            className="w-full h-full object-cover object-center"
            fallbackIcon={<User size={iconSizes[size]} />}
          />
        </div>

        {/* Botón para cambiar foto (solo si es editable) */}
        {editable && (
          <button
            onClick={() => setIsModalOpen(true)}
            className={`absolute bottom-0 right-0 ${cameraButtonSizes[size]} rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center hover:bg-[var(--color-primary)]/90 transition-colors shadow-lg border-2 border-[var(--gray-500)]`}
            title="Cambiar foto"
          >
            <Camera size={cameraIconSizes[size]} />
          </button>
        )}
      </div>

      {/* Modal para cambiar foto */}
      {editable && (
        <CambiarFotoModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          currentImage={imagenUrl || undefined}
        />
      )}
    </>
  );
};

