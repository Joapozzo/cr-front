"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu } from 'lucide-react';
import { MobileMenuLanding } from './MobileMenuLanding';
import { useTenant } from '@/app/contexts/TenantContext';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const tenant = useTenant();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Inicio', href: '#hero' },
        { name: 'Características', href: '#features' },
        { name: 'Nosotros', href: '#about' },
        { name: 'Contacto', href: '#contact' },
    ];

    const homeRoute = '/';

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-[201] transition-all duration-300 ${isScrolled || isMobileMenuOpen ? 'bg-[var(--black)] md:backdrop-blur-md shadow-lg shadow-[var(--black)]/50 py-4' : 'bg-transparent py-5'}`}
        >
            <div className="flex justify-between items-center w-full h-full relative max-w-[1300px] mx-auto px-8 md:px-12">
                {/* Mobile Layout - Mismo skeleton que los otros navbars */}
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
                        onClick={(e) => {
                            e.preventDefault();
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
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
                </div>

                {/* Desktop Layout */}
                <div className="hidden md:flex justify-between items-center w-full">
                    <Link
                        href={homeRoute}
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={(e) => {
                            e.preventDefault();
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                    >
                        <Image
                            src={tenant.branding.logo_principal}
                            alt={tenant.nombre_empresa}
                            width={200}
                            height={40}
                            className="h-10 w-auto"
                            priority
                        />
                    </Link>

                    {/* Desktop Menu */}
                    <div className="flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-[var(--gray-100)] hover:text-[var(--color-primary)] transition-colors text-sm font-medium"
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link
                            href="/login"
                            className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-strong)] text-white px-5 py-2 rounded-full font-medium transition-all transform hover:scale-105"
                        >
                            Iniciar Sesión
                        </Link>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Modal */}
            <MobileMenuLanding
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                navLinks={navLinks}
            />
        </nav>
    );
};

export default Navbar;
