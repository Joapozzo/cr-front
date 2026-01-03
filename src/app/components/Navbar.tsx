'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, Bell } from "lucide-react";
import { MobileMenu } from './navbar/MobileMenu';
import { UserDropdown } from './navbar/UserDropdown';
import { getMenuItemsByRole } from '../config/menuItems';
import { useAuth } from '../hooks/auth/useAuth';

import Image from 'next/image';

const Navbar: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { usuario } = useAuth();

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

    return (
        <header className="w-full h-[80px] md:h-[80px] bg-[var(--gray-500)] flex justify-center sticky top-0 select-none z-[101]">
            <div className="flex justify-between items-center w-full h-full relative max-w-[1300px] mx-auto px-6">

                {/* Mobile Layout */}
                <div className="flex md:hidden items-center justify-between w-full">
                    {/* Left - Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="bg-[var(--gray-300)] rounded-full p-2 hover:bg-[var(--green)] transition-colors duration-300"
                        aria-label="Abrir menú"
                    >
                        <Menu className="text-white w-5 h-5" />
                    </button>

                    {/* Center - Mobile Logo */}
                    <Link
                        href={getHomeRoute()}
                        className="absolute left-1/2 transform -translate-x-1/2 h-[30%] flex items-center cursor-pointer"
                    >
                        <div className="relative h-full w-[100px]">
                            <Image
                                src="/logos/isologo-reducido.png"
                                alt="Logo Copa Relampago Mobile"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </Link>

                    {/* Right - Notifications */}
                    {/* <button className="bg-[var(--gray-300)] rounded-full p-2 hover:bg-[var(--green)] transition-colors duration-300">
                        <Bell className="text-white w-5 h-5" />
                    </button> */}
                </div>

                {/* Desktop Layout */}
                <div className="hidden md:flex justify-between items-center w-full">
                    {/* Desktop Logo */}
                    <Link
                        href={getHomeRoute()}
                        className="flex items-center cursor-pointer"
                    >
                        <Image
                            src="/logos/logotipo.png"
                            alt="Logo Copa Relampago"
                            width={160}
                            height={20}
                            className="h-5 w-auto" // controla la altura del logo
                        />
                    </Link>


                    {/* Navigation List */}
                    <ul className="flex items-center gap-12 md:gap-10">
                        {navItems.map((item) => (
                            <li key={item.label}>
                                <Link
                                    href={item.href}
                                    className="text-white text-md font-medium hover:text-[var(--green)] transition-colors duration-300"
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                        <li>
                            <UserDropdown />
                        </li>
                    </ul>
                </div>
            </div>

            {/* Mobile Menu */}
            <MobileMenu
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                menuItems={mobileMenuItems}
            />
        </header>
    );
};

export default Navbar;