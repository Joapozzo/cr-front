'use client';

import React from 'react';
import Link from 'next/link';
import { MobileMenu } from './navbar/MobileMenu';
import { UserDropdown } from './navbar/UserDropdown';
import { NavbarBase } from './navbar/NavbarBase';
import { getMenuItemsByRole } from '../config/menuItems';
import { useAuth } from '../hooks/auth/useAuth';
import { useTenant } from '../contexts/TenantContext';
import Image from 'next/image';

const Navbar: React.FC = () => {
    const { usuario } = useAuth();
    const tenant = useTenant();

    const navItems = [
        { label: 'Inicio', href: '/home', isExternal: false },
        { label: 'Categorias', href: '/categorias', isExternal: false },
        { label: 'Noticias', href: '/noticias', isExternal: false },
        { label: 'Contacto', href: '#footer', isExternal: true },
    ];

    // Obtener menú según rol del usuario
    const mobileMenuItems = usuario ? getMenuItemsByRole(usuario.rol) : [];

    // Determinar la ruta home según el rol del usuario
    const getHomeRoute = () => {
        if (usuario?.rol === 'PLANILLERO') {
            return '/planillero/home';
        }
        return '/home';
    };

    const homeRoute = getHomeRoute();

    // Contenido desktop
    const desktopContent = (
        <>
            {/* Desktop Logo */}
            <Link
                href={homeRoute}
                className="flex items-center cursor-pointer"
            >
                <Image
                    src={tenant.branding.logo_principal}
                    alt={`Logo ${tenant.nombre_empresa}`}
                    width={200}
                    height={40}
                    className="h-10 w-auto"
                />
            </Link>

            {/* Navigation List */}
            <ul className="flex items-center gap-12 md:gap-10">
                {navItems.map((item) => (
                    <li key={item.label}>
                        <Link
                            href={item.href}
                            className="text-white text-md font-medium hover:text-[var(--color-primary)] transition-colors duration-300"
                        >
                            {item.label}
                        </Link>
                    </li>
                ))}
                <li>
                    <UserDropdown />
                </li>
            </ul>
        </>
    );

    return (
        <NavbarBase
            homeRoute={homeRoute}
            desktopContent={desktopContent}
            renderMobileMenu={(isOpen, onClose) => (
                <MobileMenu
                    isOpen={isOpen}
                    onClose={onClose}
                    menuItems={mobileMenuItems}
                />
            )}
            zIndex={101}
        />
    );
};

export default Navbar;