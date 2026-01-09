'use client';

import React, { useState, ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu } from "lucide-react";
import { useTenant } from '@/app/contexts/TenantContext';

interface NavbarBaseProps {
    /** Ruta del home para el logo */
    homeRoute: string;
    /** Contenido del navbar desktop (logo + navegación) */
    desktopContent: ReactNode;
    /** Función que renderiza el menú mobile con isOpen y onClose */
    renderMobileMenu: (isOpen: boolean, onClose: () => void) => ReactNode;
    /** Clases adicionales para el header */
    headerClassName?: string;
    /** Z-index del navbar */
    zIndex?: number;
    /** Elemento adicional a la derecha en mobile (opcional) */
    mobileRightElement?: ReactNode;
}

export const NavbarBase: React.FC<NavbarBaseProps> = ({
    homeRoute,
    desktopContent,
    renderMobileMenu,
    headerClassName = '',
    zIndex = 101,
    mobileRightElement,
}) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const tenant = useTenant();

    const handleClose = () => setIsMobileMenuOpen(false);

    return (
        <>
            <header
                className={`w-full h-[80px] md:h-[80px] bg-[var(--gray-500)] flex justify-center sticky top-0 select-none ${headerClassName}`}
                style={{ zIndex }}
            >
                <div className="flex justify-between items-center w-full h-full relative max-w-[1300px] mx-auto px-6">
                    {/* Mobile Layout */}
                    <div className="flex md:hidden items-center justify-between w-full">
                        {/* Left - Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="bg-[var(--gray-300)] rounded-full p-2 hover:bg-[var(--color-primary)] transition-colors duration-300"
                            aria-label="Abrir menú"
                        >
                            <Menu className="text-white w-5 h-5" />
                        </button>

                        {/* Center - Mobile Logo */}
                        <Link
                            href={homeRoute}
                            className="absolute left-1/2 transform -translate-x-1/2 h-full flex items-center cursor-pointer"
                        >
                            <div className="relative h-[50px] w-[150px]">
                                <Image
                                    src={tenant.branding.logo_header}
                                    alt={`Logo ${tenant.nombre_empresa} Mobile`}
                                    className="object-contain"
                                    fill
                                />
                            </div>
                        </Link>

                        {/* Right - Optional element */}
                        {mobileRightElement && (
                            <div className="flex items-center">
                                {mobileRightElement}
                            </div>
                        )}
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden md:flex justify-between items-center w-full">
                        {desktopContent}
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            {renderMobileMenu(isMobileMenuOpen, handleClose)}
        </>
    );
};

