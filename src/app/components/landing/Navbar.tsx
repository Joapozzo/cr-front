"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu } from 'lucide-react';
import { MobileMenuLanding } from './MobileMenuLanding';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-[201] transition-all duration-300 bg-[var(--black)] md:backdrop-blur-md shadow-lg shadow-[var(--black)]/50 ${isScrolled ? 'py-2' : 'py-3'}`}
        >
            <div className="container mx-auto px-4 flex justify-between items-center max-w-6xl">
                <Link
                    href="/"
                    className="flex items-center gap-2"
                    onClick={(e) => {
                        e.preventDefault();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                >
                    <Image
                        src="/logos/isologo.png"
                        alt="Copa Relámpago"
                        width={50}
                        height={50}
                        className="h-12 w-auto"
                        priority
                    />
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-[var(--gray-100)] hover:text-[var(--green)] transition-colors text-sm font-medium"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link
                        href="/login"
                        className="bg-[var(--green)] hover:bg-[var(--green-win)] text-white px-5 py-2 rounded-full font-medium transition-all transform hover:scale-105"
                    >
                        Iniciar Sesión
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-white"
                    onClick={() => setIsMobileMenuOpen(true)}
                >
                    <Menu size={24} />
                </button>
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
