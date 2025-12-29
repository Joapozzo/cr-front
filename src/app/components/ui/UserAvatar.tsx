"use client";

import { User } from "lucide-react";
import { useState } from "react";

import Image from 'next/image';

interface UserAvatarProps {
    img?: string | null;
    alt?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    rounded?: 'sm' | 'md' | 'lg' | 'full';
}

const sizeClasses = {
    sm: { container: 'w-8 h-8', icon: 16 },
    md: { container: 'w-10 h-10', icon: 20 },
    lg: { container: 'w-12 h-12', icon: 24 },
    xl: { container: 'w-24 h-24', icon: 48 }
};

const roundedClasses = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full'
};

/**
 * Componente reutilizable para mostrar el avatar de un usuario.
 * Si la imagen no está disponible o falla al cargar, muestra un icono User como fallback.
 */
const UserAvatar: React.FC<UserAvatarProps> = ({
    img,
    alt = "Usuario",
    size = 'md',
    className = "",
    rounded = 'lg'
}) => {
    const [imgError, setImgError] = useState(false);
    const sizeConfig = sizeClasses[size];
    const roundedClass = roundedClasses[rounded];

    // Si hay imagen y no hay error, mostrar la imagen
    if (img && !imgError) {
        return (
            <div className={`${sizeConfig.container} ${roundedClass} overflow-hidden flex-shrink-0 relative ${className}`}>
                <Image
                    src={img}
                    alt={alt}
                    fill
                    className="object-cover"
                    onError={() => setImgError(true)}
                />
            </div>
        );
    }

    // Fallback: icono User
    return (
        <div className={`${sizeConfig.container} ${roundedClass} flex items-center justify-center flex-shrink-0 ${className}`}>
            <User className="text-[var(--gray-100)]" size={sizeConfig.icon} />
        </div>
    );
};

export default UserAvatar;

