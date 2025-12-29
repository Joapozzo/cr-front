'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, Bell } from "lucide-react";
import { MobileMenuPlanillero } from './navbar/MobileMenuPlanillero';

const NavbarPlanillero: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems = [
        { label: 'Inicio', href: '/planillero/home', isExternal: false },
        { label: 'Partidos', href: '/planillero/partidos', isExternal: false },
        { label: 'Perfil', href: '/planillero/perfil', isExternal: true },
    ];

    return (
        <header className="w-full h-[80px] md:h-[80px] bg-[var(--gray-500)] flex justify-center sticky top-0 select-none z-[102]">
            <div className="flex justify-between items-center w-full h-full relative max-w-[1300px] mx-auto px-6">

                {/* Mobile Layout */}
                <div className="flex md:hidden items-center justify-between w-full">
                    {/* Left - Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(true)}
                        className="bg-[var(--gray-300)] rounded-full p-2 hover:bg-[var(--green)] transition-colors duration-300"
                        aria-label="Abrir menú"
                    >
                        <Menu className="text-white w-5 h-5" />
                    </button>

                    {/* Center - Mobile Logo */}
                    <Link
                        href="/"
                        className="absolute left-1/2 transform -translate-x-1/2 h-[30%] flex items-center cursor-pointer"
                    >
                        <div className="relative h-full w-[40px]">
                            <Image
                                src="/Logos/isologo-reducido.png"
                                alt="Logo Copa Relampago Mobile"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </Link>

                    {/* Right - Notifications */}
                    <button className="bg-[var(--gray-300)] rounded-full p-2 hover:bg-[var(--green)] transition-colors duration-300">
                        <Bell className="text-white w-5 h-5" />
                    </button>
                </div>

                {/* Desktop Layout */}
                <div className="hidden md:flex justify-between items-center w-full">
                    {/* Desktop Logo */}
                    <Link
                        href="/planillero/home"
                        className="flex items-center cursor-pointer"
                    >
                        <Image
                            src="/Logos/logotipo.png"
                            alt="Logo Copa Relampago"
                            width={120}
                            height={20}
                            className="h-5 w-auto"
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
                    </ul>
                </div>
            </div>

            {/* Mobile Menu */}
            <MobileMenuPlanillero
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
            />
        </header>
    );
};

export default NavbarPlanillero;