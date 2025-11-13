import React from 'react';
import Link from 'next/link';
import { User, Menu, Bell } from "lucide-react";

const NavbarPlanillero: React.FC = () => {
    const navItems = [
        { label: 'Inicio', href: '/planillero/home', isExternal: false },
        { label: 'Partidos', href: '/planillero/partidos', isExternal: false },
        { label: 'Perfil', href: '/planillero/perfil', isExternal: true },
    ];

    return (
        <header className="w-full h-[80px] md:h-[80px] bg-[var(--gray-500)] flex justify-center sticky top-0 select-none z-[101]">
            <div className="flex justify-between items-center w-full h-full relative max-w-[1300px] mx-auto px-6">

                {/* Mobile Layout */}
                <div className="flex md:hidden items-center justify-between w-full">
                    {/* Left - Menu Button */}
                    <button className="bg-[var(--gray-300)] rounded-full p-2 hover:bg-[var(--green)] transition-colors duration-300">
                        <Menu className="text-white w-5 h-5" />
                    </button>

                    {/* Center - Mobile Logo */}
                    <Link
                        href="/"
                        className="absolute left-1/2 transform -translate-x-1/2 h-[30%] flex items-center cursor-pointer"
                    >
                        <img
                            src="/Logos/isologo-reducido.png"
                            alt="Logo Copa Relampago Mobile"
                            className="h-full"
                        />
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
                        <img
                            src="/Logos/logotipo.png"
                            alt="Logo Copa Relampago"
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
                    </ul>
                </div>
            </div>
        </header>
    );
};

export default NavbarPlanillero;