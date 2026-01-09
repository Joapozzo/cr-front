'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MobileMenuPlanillero } from './navbar/MobileMenuPlanillero';
import { NavbarBase } from './navbar/NavbarBase';
import { useTenant } from '@/app/contexts/TenantContext';

const NavbarPlanillero: React.FC = () => {
    const tenant = useTenant();

    const navItems = [
        { label: 'Inicio', href: '/planillero/home', isExternal: false },
        { label: 'Partidos', href: '/planillero/partidos', isExternal: false },
        { label: 'Perfil', href: '/planillero/perfil', isExternal: true },
    ];

    const homeRoute = '/planillero/home';

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
            </ul>
        </>
    );

    return (
        <NavbarBase
            homeRoute={homeRoute}
            desktopContent={desktopContent}
            renderMobileMenu={(isOpen, onClose) => (
                <MobileMenuPlanillero
                    isOpen={isOpen}
                    onClose={onClose}
                />
            )}
            zIndex={102}
        />
    );
};

export default NavbarPlanillero;