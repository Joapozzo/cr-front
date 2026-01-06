"use client";

import React from 'react';
import Link from 'next/link';
import { Home, Newspaper, ChartBar, Volleyball, Shield } from 'lucide-react';
import { usePathname } from 'next/navigation';

const BottomNavigation: React.FC = () => {
    const pathname = usePathname();

    const sideItems = [
        {
            label: 'Estadisticas',
            href: '/estadisticas',
            icon: ChartBar,
            position: 'left'
        },
        {
            label: 'Partidos',
            href: '/partidos',
            icon: Volleyball,
            position: 'left'
        },
        {
            label: 'Noticias',
            href: '/noticias',
            icon: Newspaper,
            position: 'right'
        },
        {
            label: 'Equipo',
            href: '/miequipo',
            icon: Shield,
            position: 'right'
        },
    ];

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href) && href !== '/';
    };

    const isHomeActive = isActive('/');

    return (
        <div className="fixed bottom-4 left-0 right-0 z-[20] md:hidden pointer-events-none">
            <div className="flex items-end justify-center px-6">
                <div className="relative flex items-center justify-center pointer-events-auto">

                    {/* Fondo redondeado */}
                    <div className="absolute inset-0 bg-[var(--black-800)]/95 backdrop-blur-lg rounded-full shadow-2xl border border-[var(--black-700)]/50 -mx-6 -my-2"></div>

                    {/* Contenido sobre el fondo */}
                    <div className="relative flex items-center justify-center">

                        {/* Items izquierda */}
                        <div className="flex items-center gap-3 mr-6">
                            {sideItems.filter(item => item.position === 'left').map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.href);

                                return (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        className="group"
                                    >
                                        <div className={`px-2 rounded-full transition-all duration-300 ${active
                                            ? 'text-[var(--color-primary)] shadow-lg transform scale-110'
                                            : 'text-[var(--black-400)] hover:text-[var(--color-primary)] hover:scale-105'
                                            }`}>
                                            <Icon size={20} />
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Botón Home central - Sobresale */}
                        <Link href="/home" className="relative z-20 pointer-events-auto">
                            <div className={`p-3 rounded-full transition-all duration-300 shadow-2xl transform -translate-y-5 ${isHomeActive
                                ? 'bg-[var(--color-primary)] text-white scale-110 shadow-[var(--color-primary)]/40'
                                : 'bg-[var(--color-primary)] text-white hover:scale-105 hover:shadow-[var(--color-primary)]/30'
                                }`}>
                                <Home size={30} />

                                {isHomeActive && (
                                    <div className="absolute inset-0 rounded-full bg-white/20 animate-ping"></div>
                                )}
                            </div>
                        </Link>

                        {/* Items derecha */}
                        <div className="flex items-center gap-3 ml-6">
                            {sideItems.filter(item => item.position === 'right').map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.href);

                                return (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        className="group"
                                    >
                                        <div className={`px-2 rounded-full transition-all duration-300 ${active
                                            ? 'text-[var(--color-primary)] shadow-lg transform scale-115'
                                            : 'text-[var(--black-400)] hover:text-[var(--color-primary)] hover:scale-105'
                                            }`}>
                                            <Icon size={20} />
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BottomNavigation;